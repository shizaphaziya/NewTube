<script setup lang="ts">
import type { Database } from '~/types/database.types'

type VideoWithProfile = Database['public']['Tables']['videos']['Row'] & {
  profiles: {
    id: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

type CommentWithProfile = Database['public']['Tables']['comments']['Row'] & {
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

const route = useRoute()
const videoId = (route.params as any).id as string
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { t } = useI18n()

const { data: video, error: videoError } = await useAsyncData(`video-${videoId}`, async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(id, display_name, avatar_url)')
    .eq('id', videoId)
    .maybeSingle()
  if (error) {
    console.error('[watch] Supabase error:', error)
    throw error
  }
  return data as VideoWithProfile | null
})

// Debug: log what came back
if (import.meta.dev) {
  console.log('[watch] video:', video.value, 'error:', videoError.value)
}

const { profile } = useProfile()
const isBlocked = computed(() => {
  if (!video.value) return false
  if (video.value.status === 'blocked') {
    // Admins and owners can still see it
    if (profile.value?.role === 'admin') return false
    if (user.value?.id === video.value.user_id) return false
    return true
  }
  return false
})

const { data: reactions, refresh: refreshReactions } = await useAsyncData(`reactions-${videoId}`, async () => {
  // Actually count them properly
  const { count: lCount } = await supabase.from('video_reactions').select('*', { count: 'exact', head: true }).eq('video_id', videoId).eq('is_like', true)
  const { count: dCount } = await supabase.from('video_reactions').select('*', { count: 'exact', head: true }).eq('video_id', videoId).eq('is_like', false)

  return { likes: lCount || 0, dislikes: dCount || 0 }
})

const userReaction = ref<boolean | null>(null) // true = like, false = dislike, null = none

const checkReaction = async () => {
  if (!user.value) return
  const { data } = await supabase
    .from('video_reactions')
    .select('is_like')
    .eq('video_id', videoId)
    .eq('user_id', user.value.id)
    .maybeSingle()
  userReaction.value = data ? data.is_like : null
}

const toggleReaction = async (isLike: boolean) => {
  if (!user.value) return navigateTo('/auth/login')
  
  if (userReaction.value === isLike) {
    // Remove reaction
    await supabase.from('video_reactions').delete().eq('video_id', videoId).eq('user_id', user.value.id)
    userReaction.value = null
  } else {
    // Upsert reaction
    await supabase.from('video_reactions').upsert({ 
      video_id: videoId, 
      user_id: user.value.id,
      is_like: isLike
    })
    userReaction.value = isLike
  }
  
  await refreshReactions()
}

const isSubscribed = ref(false)
const toggleSubscribe = () => {
  // Placeholder for subscription logic
  isSubscribed.value = !isSubscribed.value
}

onMounted(() => {
  checkReaction()
  // Increment view count
  supabase.rpc('increment_view_count', { video_id_param: videoId })
})

const { data: comments, refresh: refreshComments } = await useAsyncData(`comments-${videoId}`, async () => {
  const { data } = await supabase
    .from('comments')
    .select('*, profiles:profiles!comments_user_id_fkey(display_name, avatar_url)')
    .eq('video_id', videoId)
    .order('created_at', { ascending: false })
  return (data || []) as CommentWithProfile[]
})

const commentContent = ref('')
const isPosting = ref(false)
const replyTo = ref<string | null>(null) // ID of comment being replied to
const commentInput = ref<HTMLTextAreaElement | null>(null)

const postComment = async () => {
  if (!user.value) return navigateTo('/auth/login')
  if (!commentContent.value.trim()) return
  
  isPosting.value = true
  const { error } = await supabase
    .from('comments')
    .insert({
      video_id: videoId,
      user_id: user.value.id,
      content: commentContent.value,
      parent_id: replyTo.value
    })
  
  if (!error) {
    commentContent.value = ''
    replyTo.value = null
    await refreshComments()
  }
  isPosting.value = false
}

const structuredComments = computed(() => {
  if (!comments.value) return []
  const roots = comments.value.filter(c => !c.parent_id)
  const replies = comments.value.filter(c => c.parent_id)
  
  return roots.map(root => ({
    ...root,
    replies: replies.filter(r => r.parent_id === root.id).reverse()
  }))
})

const isCinemaMode = ref(false)

const guestHintTarget = ref<string | null>(null) // 'like', 'dislike', 'comment'
const showGuestHint = (target: string) => {
  if (user.value) return
  guestHintTarget.value = target
  setTimeout(() => {
    if (guestHintTarget.value === target) guestHintTarget.value = null
  }, 4000)
}
</script>

<template>
  <div class="watch-page-root">
    <!-- DB Error -->
    <div v-if="videoError" class="layout-container py-32">
      <div class="glass-card p-16 text-center max-w-xl mx-auto space-y-8 border-red-500/10">
        <div class="i-ph-warning-circle-bold text-6xl text-red-500 mx-auto opacity-40"></div>
        <h1 class="text-3xl font-brand font-black text-white tracking-tighter uppercase italic">{{ t('common.error') }}</h1>
        <p class="text-white/30 text-sm">{{ videoError.message }}</p>
        <NuxtLink to="/" class="btn-primary inline-flex">← {{ t('admin.return_surface') }}</NuxtLink>
      </div>
    </div>

    <!-- 404 Not Found -->
    <div v-else-if="!video" class="layout-container py-32">
      <div class="glass-card p-16 text-center max-w-xl mx-auto space-y-8">
        <div class="i-ph-film-slate-bold text-6xl text-white/10 mx-auto"></div>
        <h1 class="text-3xl font-brand font-black text-white/40 tracking-tighter uppercase italic">404</h1>
        <p class="text-white/20 text-sm">{{ t('watch.not_found') }}</p>
        <NuxtLink to="/" class="btn-primary inline-flex">← {{ t('admin.return_surface') }}</NuxtLink>
      </div>
    </div>

    <div v-else>
      <!-- Blocked State -->
      <div v-if="isBlocked" class="layout-container py-32">
        <div class="glass-card p-16 text-center max-w-xl mx-auto space-y-8 border-red-500/10">
          <div class="i-ph-shield-warning-bold text-6xl text-red-500 mx-auto opacity-40"></div>
          <div class="space-y-4">
            <h1 class="text-3xl font-brand font-black text-white tracking-tighter uppercase italic">{{ t('watch.content_suspended') }}</h1>
            <p class="text-white/30 text-sm leading-relaxed max-w-md mx-auto">
              {{ t('watch.intercepted_message') }}
            </p>
          </div>
          <NuxtLink to="/" class="btn-primary inline-flex">{{ t('admin.return_surface') }}</NuxtLink>
        </div>
      </div>

      <CinemaMode v-else v-model:active="isCinemaMode" />
      
      <div v-if="!isBlocked" class="layout-container pb-40 transition-all duration-1000" :class="{ 'relative z-50': isCinemaMode }">
        <!-- Layout Switcher Wrapper -->
        <div 
          class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16"
          :class="{ 'flex flex-col items-center': isCinemaMode }"
        >
          <!-- Left Column: Player & Info -->
          <div 
            class="space-y-12"
            :class="isCinemaMode ? 'w-full max-w-6xl' : 'lg:col-span-2'"
          >
            <!-- Player Container -->
            <div 
              v-motion
              :initial="{ opacity: 0, scale: 0.98 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 800, ease: [0.16, 1, 0.3, 1] } }"
              class="group relative aspect-video rounded-3xl overflow-hidden bg-void-card shadow-2xl border border-white/5 ring-1 ring-white/5 transition-all duration-1000"
              :class="{ 'ring-white/20 scale-[1.02] shadow-[0_0_100px_rgba(255,255,255,0.08)]': isCinemaMode }"
            >
              <!-- Processing state: video_url is null -->
              <div v-if="!video.video_url" class="w-full h-full flex flex-col items-center justify-center gap-4 bg-void-card">
                <div class="i-ph-gear-six-bold text-4xl text-white/20 animate-spin"></div>
                <p class="text-white/20 text-xs font-black uppercase tracking-widest">{{ t('studio.processing') }}</p>
              </div>
              <video
                v-else
                crossorigin="anonymous"
                :src="video.video_url"
                class="w-full h-full object-contain" controls
                :poster="video.thumbnail_url || undefined"
                :style="{ viewTransitionName: `video-thumb-${video.id}` }"
              ></video>
              
              <!-- Cinema Mode Toggle -->
              <button 
                @click="isCinemaMode = !isCinemaMode"
                class="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <div :class="isCinemaMode ? 'i-ph-arrows-in-bold' : 'i-ph-arrows-out-bold'"></div>
              </button>

            </div>

            <!-- Video Header -->
            <div class="space-y-10" :class="{ 'max-w-4xl mx-auto': isCinemaMode }">
              <h1 class="text-3xl md:text-5xl font-brand font-extrabold break-words tracking-tighter leading-tight text-gradient">
                {{ video.title }}
              </h1>
              
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
                <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                  <img crossorigin="anonymous" :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" class="w-12 h-12 rounded-full border border-white/10 p-0.5 bg-void focus:ring-2 ring-white/10" />
                  <div class="space-y-0.5">
                    <div class="font-bold text-[16px] text-white tracking-tight leading-none">{{ video.profiles?.display_name || t('admin.anonymous') }}</div>
                    <div class="text-[9px] text-white/25 uppercase tracking-[0.2em] font-black">{{ t('watch.verified_user') }}</div>
                  </div>
                  <button 
                    @click="toggleSubscribe"
                    class="ml-6 flex items-center gap-2 group"
                  >
                    <div 
                      class="px-6 md:px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-500"
                      :class="isSubscribed ? 'bg-white/5 text-white/20 border border-white/5' : 'bg-white text-black hover:bg-zinc-200'"
                    >
                      {{ isSubscribed ? t('watch.membership_active') : t('watch.join_collective') }}
                    </div>
                  </button>
                </div>

                <div class="flex items-center gap-2 relative">
                  <!-- Guest Hint Cloud -->
                  <transition name="pop">
                    <div 
                      v-if="guestHintTarget === 'like' || guestHintTarget === 'dislike'" 
                      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-52 p-5 rounded-2xl bg-white text-void shadow-[0_20px_50px_rgba(255,255,255,0.2)] z-[60] text-center pointer-events-auto"
                    >
                      <div class="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                      <div class="i-ph-lock-key-bold text-xl mb-2 mx-auto opacity-50"></div>
                      <p class="text-[9px] font-black uppercase tracking-[0.1em] leading-relaxed mb-3">{{ t('watch.transmission_locked') }}</p>
                      <NuxtLink to="/auth/login" class="block py-2.5 rounded-lg bg-void text-white text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                        {{ t('watch.guest_hint_like') }}
                      </NuxtLink>
                    </div>
                  </transition>

                  <div class="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
                    <button 
                      @click="user ? toggleReaction(true) : showGuestHint('like')"
                      class="flex items-center gap-3 px-6 py-2.5 rounded-full transition-all font-bold text-[10px] tracking-widest uppercase"
                      :class="userReaction === true ? 'bg-white text-black' : 'hover:bg-white/10 text-white/60'"
                    >
                      <div :class="userReaction === true ? 'i-ph-thumbs-up-fill' : 'i-ph-thumbs-up-bold'" class="text-sm"></div>
                      {{ reactions?.likes || 0 }}
                    </button>
                    <div class="w-px h-4 bg-white/10 mx-1"></div>
                    <button 
                      @click="user ? toggleReaction(false) : showGuestHint('dislike')"
                      class="flex items-center gap-3 px-6 py-2.5 rounded-full transition-all font-bold text-[10px] tracking-widest uppercase"
                      :class="userReaction === false ? 'bg-white text-black' : 'hover:bg-white/10 text-white/60'"
                    >
                      <div :class="userReaction === false ? 'i-ph-thumbs-down-fill' : 'i-ph-thumbs-down-bold'" class="text-sm"></div>
                      {{ reactions?.dislikes || 0 }}
                    </button>
                  </div>
                  <button class="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                    <div class="i-ph-share-network-bold text-lg"></div>
                  </button>
                </div>
              </div>

              <div class="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/5 leading-relaxed text-white/50 text-sm tracking-wide shadow-sm">
                <div class="flex items-center gap-4 mb-4 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                  <span>{{ video.view_count }} {{ t('watch.views') }}</span>
                  <span class="w-1 h-1 rounded-full bg-white/10"></span>
                  <span>{{ t('watch.logged') }}: {{ new Date(video.created_at || '').toLocaleDateString() }}</span>
                </div>
                {{ video.description || t('watch.no_metadata') }}
              </div>
            </div>

            <!-- Comments Section -->
            <div class="space-y-12 pt-12" :class="{ 'max-w-4xl mx-auto': isCinemaMode }">
              <div class="flex items-center gap-4">
                <div class="w-2 h-2 rounded-full bg-white"></div>
                <h2 class="text-xl font-brand font-bold tracking-tight uppercase italic">
                  {{ t('watch.comments_title') }} ({{ comments?.length || 0 }})
                </h2>
              </div>

              <!-- Add Comment Input -->
              <div class="flex gap-6">
                  <img 
                    crossorigin="anonymous"
                    :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`" 
                    class="w-12 h-12 rounded-full border border-white/10 p-1 bg-void-card shrink-0" 
                    v-if="user"
                  />
                <div class="flex-1 space-y-4">
                  <textarea 
                    ref="commentInput"
                    v-model="commentContent"
                    :placeholder="t('watch.add_comment')"
                    class="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[1.5rem] p-4 md:p-6 text-sm focus:outline-none focus:border-white/30 transition-all min-h-[120px] resize-none placeholder:text-white/20"
                  ></textarea>
                  <div class="flex justify-end items-center gap-6 relative">
                    <!-- Guest Hint Bubble for Comments -->
                    <transition name="pop">
                      <div 
                        v-if="guestHintTarget === 'comment'" 
                        class="absolute bottom-full right-0 mb-6 w-56 p-5 rounded-2xl bg-white text-void shadow-2xl z-[60] text-center"
                      >
                        <div class="absolute bottom-[-6px] right-6 w-3 h-3 bg-white rotate-45"></div>
                        <p class="text-[9px] font-black uppercase tracking-[0.1em] mb-3">{{ t('watch.auth_required') }}</p>
                        <NuxtLink to="/auth/login" class="block py-2.5 rounded-lg bg-void text-white text-[9px] font-black uppercase tracking-widest">
                          {{ t('watch.identify_yourself') }}
                        </NuxtLink>
                      </div>
                    </transition>

                    <button 
                      @click="commentContent = ''" 
                      class="text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest"
                      v-if="commentContent"
                    >
                      {{ t('watch.discard') }}
                    </button>
                    <button 
                      @click="user ? postComment() : showGuestHint('comment')"
                      :disabled="!!isPosting || !!(user && !commentContent.trim())"
                      class="btn-primary"
                    >
                      {{ isPosting ? t('watch.transmitting') : t('watch.post_message') }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Comments List -->
              <div class="space-y-12 pt-6">
                <div v-for="comment in structuredComments" :key="comment.id" class="space-y-8">
                  <div class="flex gap-6 group">
                    <img 
                      crossorigin="anonymous"
                      :src="comment.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`" 
                      class="w-11 h-11 rounded-full border border-white/5 p-0.5 bg-void shrink-0" 
                    />
                    <div class="space-y-2 flex-1">
                      <div class="flex items-center gap-3">
                        <span class="font-bold text-xs tracking-widest uppercase text-white/80">{{ comment.profiles?.display_name || t('admin.anonymous') }}</span>
                        <span class="text-[9px] text-white/20 font-bold uppercase tracking-widest">{{ useTimeAgo(comment.created_at || '').value }}</span>
                      </div>
                      <p class="text-white/50 text-sm leading-relaxed max-w-2xl">{{ comment.content }}</p>
                      <div class="flex items-center gap-6 pt-3">
                        <button 
                          @click="replyTo = comment.id; commentContent = ''; $nextTick(() => commentInput?.focus())"
                          class="text-[9px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest"
                        >
                          {{ t('watch.reply') }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Replies -->
                  <div v-if="comment.replies.length" class="ml-16 space-y-8 border-l border-white/5 pl-8">
                     <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-4 group">
                        <img 
                          :src="reply.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user_id}`" 
                          class="w-8 h-8 rounded-full border border-white/5 p-0.5 bg-void shrink-0" 
                        />
                        <div class="space-y-1.5 flex-1">
                          <div class="flex items-center gap-3">
                            <span class="font-bold text-[10px] tracking-widest uppercase text-white/60">{{ reply.profiles?.display_name || t('admin.anonymous') }}</span>
                            <span class="text-[8px] text-white/10 font-bold uppercase tracking-widest">{{ useTimeAgo(reply.created_at || '').value }}</span>
                          </div>
                          <p class="text-white/40 text-xs leading-relaxed max-w-xl">{{ reply.content }}</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Sidebar / Related -->
          <div class="space-y-10" :class="{ 'w-full max-w-4xl pt-20 border-t border-white/5': isCinemaMode }">
            <div class="flex items-center gap-3 ml-2">
              <div class="w-1 h-3 bg-white/20"></div>
              <h3 class="text-xs font-brand tracking-[0.4em] text-white/40 uppercase italic">{{ t('watch.up_next') }}</h3>
            </div>
            
            <div class="space-y-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div v-for="n in 6" :key="n" class="flex flex-col sm:flex-row gap-4 sm:gap-5 group cursor-pointer transition-all duration-500 hover:translate-x-1">
                <div class="w-full sm:w-44 aspect-video rounded-2xl bg-void-card shrink-0 overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-white/20 shadow-xl">
                   <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                     <div class="i-ph-video-camera-bold text-white/5 text-4xl transition-transform duration-700 group-hover:scale-110"></div>
                   </div>
                </div>
                <div class="flex flex-col gap-2 min-w-0 pt-1">
                   <div class="text-xs font-brand font-bold tracking-tight text-white/90 line-clamp-2 leading-snug group-hover:text-white transition-colors">{{ t('watch.related_title_placeholder') }}</div>
                   <div class="text-[9px] text-white/30 tracking-[0.2em] font-bold uppercase">{{ t('watch.related_creator_placeholder') }}</div>
                   <div class="text-[9px] text-white/10 font-bold uppercase tracking-widest">942K {{ t('watch.views') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active {
  animation: pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-leave-active {
  animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}

@keyframes pop-in {
  0% { opacity: 0; transform: translate(-50%, 10px) scale(0.9); }
  100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
}

/* Comment hint needs different anchor */
.right-0.pop-enter-active {
  animation: pop-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.right-0.pop-leave-active {
  animation: pop-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}

@keyframes pop-in-right {
  0% { opacity: 0; transform: translateY(10px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
