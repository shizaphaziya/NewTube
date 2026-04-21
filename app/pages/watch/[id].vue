<script setup lang="ts">
import { useAppStore } from '~/store/app'
import { useSwipe } from '@vueuse/core'
import { z } from 'zod'
import { useToast } from '~/composables/useToast'
const route = useRoute()
const supabase = useSupabaseClient()
const appStore = useAppStore()
const { error: showError } = useToast()
const user = useSupabaseUser()
const { t } = useI18n()
const { profile } = useProfile()

const videoId = computed(() => (Array.isArray(route.params.id) ? route.params.id[0] : route.params.id) as string)
const isCinemaMode = useState('cinema-mode', () => false)

const videoContainer = ref<HTMLElement | null>(null)
const router = useRouter()

// useSwipe automatically tracks touch gestures on the video container
const { direction, isSwiping } = useSwipe(videoContainer)

// When the user completes a swipe-down gesture, save video to PiP and navigate away
watch(isSwiping, (swiping) => {
  if (!swiping && direction.value === 'down' && video.value) {
    appStore.setPipVideo({
      id: video.value.id,
      title: video.value.title,
      url: video.value.video_url || '',
      user_id: video.value.user_id
    })
    router.back()
  }
})

watch(video, (newVal) => {
  if (newVal) {
    appStore.addToHistory(newVal.id)
  }
}, { immediate: true })


interface VideoWithProfile {
  id: string
  title: string
  description?: string | null
  video_url: string | null
  thumbnail_url?: string | null
  user_id: string
  view_count: number
  created_at: string
  profiles: {
    id: string
    display_name: string
    avatar_url: string
  }
}

const { data: video } = await useAsyncData(`video-${videoId.value}`, async () => {
  const { data } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(id, display_name, avatar_url)')
    .eq('id', videoId.value)
    .single()
  return data as VideoWithProfile | null
})

const { data: relatedVideos } = await useAsyncData(`related-${videoId.value}`, async () => {
  const { data } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name)')
    .neq('id', videoId.value)
    .eq('status', 'published')
    .limit(12)
    .order('created_at', { ascending: false })
  return (data || []) as any[]
})

// SEO
useSeoMeta({
  title: () => video.value ? `${video.value.title} - NewTube` : t('seo.title'),
})

const { data: likesCount, refresh: refreshLikes } = await useAsyncData(`likes-${videoId.value}`, async () => {
  const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('video_id', videoId.value).eq('is_dislike', false)
  return count || 0
})

const hasLiked = ref(false)
const checkReaction = async () => {
  if (!user.value) return
  const { data } = await (supabase.from('likes') as any).select('*').eq('video_id', videoId.value).eq('user_id', user.value.id).maybeSingle()
  hasLiked.value = data ? !data.is_dislike : false
}

const toggleLike = async () => {
  if (!user.value) return appStore.openAuthModal()
  if (hasLiked.value) {
    await (supabase.from('likes') as any).delete().eq('video_id', videoId.value).eq('user_id', user.value.id)
  } else {
    await (supabase.from('likes') as any).upsert({ video_id: videoId.value, user_id: user.value.id, is_dislike: false })
  }
  await checkReaction()
  await refreshLikes()
}

onMounted(async () => {
  await checkReaction()
  // Increment view
  await (supabase as any).rpc('increment_view_count', { video_id_param: videoId.value })
})

const { data: comments, refresh: refreshComments } = await useAsyncData(`comments-${videoId.value}`, async () => {
  const { data } = await supabase
    .from('comments')
    .select('*, profiles:profiles!comments_user_id_fkey(display_name, avatar_url)')
    .eq('video_id', videoId.value)
    .order('created_at', { ascending: false })
  return (data || []) as any[]
})

const commentContent = ref('')
const isPosting = ref(false)
const postComment = async () => {
  if (!user.value) {
    appStore.openAuthModal()
    return
  }

  const schema = z.object({
    content: z.string().trim().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long (max 1000 characters)')
  })

  const result = schema.safeParse({ content: commentContent.value })
  if (!result.success) {
    showError(result.error.errors[0].message)
    return
  }

  isPosting.value = true
  try {
    const { error } = await (supabase.from('comments') as any).insert({ video_id: videoId.value, user_id: user.value.id, content: commentContent.value })
    if (error) throw error
    commentContent.value = ''
    await refreshComments()
  } catch (e: any) {
    showError('Failed to post comment: ' + e.message)
  } finally {
    isPosting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen pb-40">
    <!-- Ambient Light Background (Dynamic Glow) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div 
        class="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[140%] aspect-video 
               bg-gradient-conic from-white/[0.03] via-transparent to-white/[0.01] 
               blur-[160px] opacity-40 animate-slow-spin"
      ></div>
    </div>

    <!-- Main Player Section (Full Width if Cinema) -->
    <div :class="isCinemaMode ? 'w-full px-0' : 'layout-container pt-12 md:pt-20'" class="relative z-10 transition-all duration-1000">
      <div 
        class="group/player relative aspect-video bg-black overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-all duration-1000"
        :class="isCinemaMode ? 'w-full h-screen max-h-[85vh]' : 'rounded-[3rem] border border-white/[0.05] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]'"
      >
        <!-- Actual Video Player -->
        <video 
          v-if="video?.video_url"
          :src="video.video_url"
          class="w-full h-full object-contain"
          controls
          autoplay
          :poster="video.thumbnail_url || ''"
        ></video>
        
        <!-- Processing State -->
        <div v-else class="w-full h-full flex flex-col items-center justify-center gap-6 bg-stone-900">
          <div class="w-16 h-16 rounded-full border-2 border-white/10 border-t-white animate-spin"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Decoding Signal...</span>
        </div>

        <!-- Cinema Controls Overlay -->
        <div class="absolute top-8 right-8 flex gap-4 opacity-0 group-hover/player:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/player:translate-y-0">
          <button 
            @click="isCinemaMode = !isCinemaMode"
            class="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all"
          >
            <div :class="isCinemaMode ? 'i-ph-arrows-in-bold' : 'i-ph-arrows-out-bold'" class="text-xl"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Info & Interactions -->
    <div class="layout-container mt-16 mt-16 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-12">
          <!-- Title & Actions -->
          <div class="space-y-10">
            <h1 class="text-3xl md:text-5xl font-brand font-black italic tracking-tighter leading-[1.1] text-gradient">
              {{ video?.title }}
            </h1>

            <div class="flex flex-wrap items-center justify-between gap-8 pb-10 border-b border-white/[0.05]">
              <!-- Creator Info -->
              <div class="flex items-center gap-5">
                <NuxtLink :to="`/profile/${video?.user_id}`" class="relative group/avatar">
                  <div class="absolute -inset-1 bg-gradient-to-tr from-white/20 to-transparent rounded-[20px] blur opacity-0 group-hover/avatar:opacity-100 transition-all"></div>
                  <img 
                    :src="video?.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video?.user_id}`" 
                    class="relative w-14 h-14 rounded-[18px] border border-white/10 p-1 bg-stone-900 object-cover"
                  />
                </NuxtLink>
                <div>
                  <div class="font-brand font-black text-lg text-white/90 tracking-tight">{{ video?.profiles?.display_name }}</div>
                  <div class="text-[9px] font-black uppercase tracking-[0.3em] text-white/15">Authorized Personnel</div>
                </div>
                <button class="ml-6 btn-premium !px-6 !py-3">Subscribe</button>
              </div>

              <!-- Action Bar -->
              <div class="flex items-center gap-3">
                <PillReaction
                  :initialLikes="likesCount"
                  :initialDislikes="0"
                  :initialState="hasLiked ? 'like' : 'none'"
                  @change="handleReactionChange"
                />
                <button class="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all">
                  <div class="i-ph-share-network-bold text-xl"></div>
                </button>
                <button class="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all">
                  <div class="i-ph-dots-three-outline-fill text-xl"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Description Box -->
          <div class="glass-card p-10 space-y-6">
            <div class="flex items-center gap-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/20">
              <span class="text-white/40">{{ video?.view_count || 0 }} Views</span>
              <span class="w-1.5 h-1.5 rounded-full bg-white/5"></span>
              <span>Logged: {{ useTimeAgo(video?.created_at || '').value }}</span>
            </div>
            <p class="text-white/40 text-sm leading-[1.8] tracking-wide whitespace-pre-wrap font-medium">
              {{ video?.description || 'No additional metadata retrieved for this signal.' }}
            </p>
          </div>

          <!-- Comments Feed -->
          <div class="space-y-12">
            <div class="flex items-center gap-4 mb-2">
              <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              <h2 class="text-xl font-brand font-black uppercase tracking-tighter italic">Incoming Signals</h2>
              <span class="text-xs font-bold text-white/10 ml-2">({{ comments?.length || 0 }})</span>
            </div>

            <!-- Comment Input -->
            <div class="flex gap-8 group/input">
              <img 
                :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`" 
                class="w-12 h-12 rounded-[18px] border border-white/10 p-0.5 bg-stone-900 shrink-0" 
              />
              <div class="flex-1 space-y-4">
                <textarea 
                  v-model="commentContent"
                  placeholder="Record your reaction..."
                  class="w-full bg-white/[0.02] border border-white/[0.07] rounded-[24px] p-6 text-sm focus:(outline-none ring-1 ring-white/20 bg-white/[0.04]) transition-all min-h-[120px] placeholder:text-white/10"
                ></textarea>
                <div class="flex justify-end">
                  <button @click="postComment" :disabled="isPosting || !commentContent.trim()" class="btn-primary !px-10">
                    {{ isPosting ? 'TRANSMITTING...' : 'POST SIGNAL' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-10 pt-4">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-8 group/comment">
                <img 
                  :src="comment.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`" 
                  class="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 p-0.5" 
                />
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-black uppercase tracking-widest text-white/80">{{ comment.profiles?.display_name }}</span>
                    <span class="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em]">{{ useTimeAgo(comment.created_at).value }}</span>
                  </div>
                  <p class="text-white/40 text-sm leading-relaxed max-w-2xl group-hover/comment:text-white/60 transition-colors">
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-12">
          <div class="flex items-center gap-4">
            <div class="w-8 h-[1px] bg-white/20"></div>
            <h3 class="text-[10px] font-black tracking-[0.5em] uppercase text-white/20 italic">Related Streams</h3>
          </div>

          <div class="space-y-10">
            <NuxtLink 
              v-for="related in relatedVideos" 
              :key="related.id"
              :to="`/watch/${related.id}`"
              class="flex gap-5 group/related no-underline"
            >
              <div class="relative w-40 aspect-video rounded-2xl overflow-hidden border border-white/5 bg-void-card shrink-0 transition-all duration-500 group-hover/related:(border-white/20 -translate-y-1 shadow-2xl)">
                <img :src="related.thumbnail_url || ''" class="w-full h-full object-cover transition-transform duration-700 group-hover/related:scale-110" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/related:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="i-ph-play-fill text-white text-lg"></div>
                </div>
              </div>
              <div class="flex-1 min-w-0 py-1 space-y-1.5">
                <h4 class="text-[13px] font-brand font-black tracking-tight text-white/80 line-clamp-2 leading-tight group-hover/related:text-white transition-colors">
                  {{ related.title }}
                </h4>
                <div class="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{{ related.profiles?.display_name }}</div>
                <div class="text-[9px] font-bold text-white/10 uppercase tracking-widest">{{ related.view_count || 0 }} Views</div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slow-spin {
  from { transform: translate(-50%, -10%) rotate(0deg); }
  to { transform: translate(-50%, -10%) rotate(360deg); }
}

.animate-slow-spin {
  animation: slow-spin 60s linear infinite;
}
</style>
