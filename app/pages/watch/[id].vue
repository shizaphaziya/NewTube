<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n()

const { data: video } = await useAsyncData(`video-${route.params.id}`, async () => {
  const { data } = await supabase
    .from('videos')
    .select('*, profiles(id, display_name, avatar_url)')
    .eq('id', route.params.id)
    .single()
  return data
})

const { data: likesCount, refresh: refreshLikes } = await useAsyncData(`likes-${route.params.id}`, async () => {
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('video_id', route.params.id)
  return count || 0
})

const hasLiked = ref(false)
const checkLike = async () => {
  if (!user.value) return
  const { data } = await supabase
    .from('likes')
    .select('*')
    .eq('video_id', route.params.id)
    .eq('user_id', user.value.id)
    .maybeSingle()
  hasLiked.value = !!data
}

const toggleLike = async () => {
  if (!user.value) return navigateTo('/auth/login')
  
  if (hasLiked.value) {
    await supabase.from('likes').delete().eq('video_id', route.params.id).eq('user_id', user.value.id)
  } else {
    await supabase.from('likes').insert({ video_id: route.params.id, user_id: user.value.id })
  }
  
  hasLiked.value = !hasLiked.value
  await refreshLikes()
}

const isSubscribed = ref(false)
const toggleSubscribe = () => {
  // Placeholder for subscription logic
  isSubscribed.value = !isSubscribed.value
}

onMounted(() => {
  checkLike()
  // Increment view count
  supabase.rpc('increment_view_count', { video_id_param: route.params.id })
})

const { data: comments, refresh: refreshComments } = await useAsyncData(`comments-${route.params.id}`, async () => {
  const { data } = await supabase
    .from('comments')
    .select('*, profiles(display_name, avatar_url)')
    .eq('video_id', route.params.id)
    .order('created_at', { ascending: false })
  return data || []
})

const commentContent = ref('')
const isPosting = ref(false)

const postComment = async () => {
  if (!user.value) return navigateTo('/auth/login')
  if (!commentContent.value.trim()) return
  
  isPosting.value = true
  const { error } = await supabase
    .from('comments')
    .insert({
      video_id: route.params.id,
      user_id: user.value.id,
      content: commentContent.value
    })
  
  if (!error) {
    commentContent.value = ''
    await refreshComments()
  }
  isPosting.value = false
}

// Player Controls
const videoPlayer = ref(null)
const isPlaying = ref(false)
const togglePlay = () => {
  if (isPlaying.value) videoPlayer.value.pause()
  else videoPlayer.value.play()
  isPlaying.value = !isPlaying.value
}
</script>

<template>
  <div v-if="video">
    <CinemaMode v-model:active="isCinemaMode" />
    
    <div class="layout-container pb-40 transition-all duration-1000" :class="{ 'relative z-50': isCinemaMode }">
      <!-- Layout Switcher Wrapper -->
      <div 
        class="grid grid-cols-1 lg:grid-cols-3 gap-16"
        :class="{ 'flex flex-col items-center': isCinemaMode }"
      >
        <!-- Left Column: Player & Info -->
        <div 
          class="space-y-12"
          :class="isCinemaMode ? 'w-full max-w-6xl' : 'lg:col-span-2'"
        >
          <!-- Premium Player Container -->
          <div 
            v-motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 1000, ease: [0.16, 1, 0.3, 1] } }"
            class="group relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-white/5 ring-1 ring-white/5 transition-all duration-1000"
            :class="{ 'ring-white/20 scale-[1.02] shadow-[0_0_100px_rgba(255,255,255,0.05)]': isCinemaMode }"
          >
            <video 
              ref="videoPlayer"
              :src="video.video_url"
              class="w-full h-full object-contain"
              :poster="video.thumbnail_url"
              @click="togglePlay"
              :style="{ viewTransitionName: `video-thumb-${video.id}` }"
            ></video>
            
            <!-- Cinema Mode Toggle -->
            <button 
              @click="isCinemaMode = !isCinemaMode"
              class="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <div :class="isCinemaMode ? 'i-ph-arrows-in-bold' : 'i-ph-arrows-out-bold'"></div>
            </button>

            <!-- Custom Controls Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 pointer-events-none">
              <div class="w-24 h-24 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/10 scale-90 group-hover:scale-100 transition-all duration-500">
                <div :class="isPlaying ? 'i-ph-pause-fill' : 'i-ph-play-fill'" class="text-white text-4xl"></div>
              </div>
            </div>
          </div>

          <!-- Video Header -->
          <div class="space-y-10" :class="{ 'max-w-4xl mx-auto': isCinemaMode }">
            <h1 class="text-4xl md:text-5xl font-brand font-extrabold tracking-tighter leading-tight text-gradient">
              {{ video.title }}
            </h1>
            
            <div class="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-white/5">
              <div class="flex items-center gap-5">
                <img :src="video.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" class="w-14 h-14 rounded-full border border-white/10 p-1 bg-void-card ring-1 ring-white/5" />
                <div class="space-y-1">
                  <div class="font-brand text-lg text-white tracking-tight">{{ video.profiles.display_name }}</div>
                  <div class="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">{{ t('watch.verified_architect') }}</div>
                </div>
                <button 
                  @click="toggleSubscribe"
                  class="ml-6 flex items-center gap-2 group"
                >
                  <div 
                    class="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-500"
                    :class="isSubscribed ? 'bg-white/5 text-white/20 border border-white/5' : 'bg-white text-black hover:bg-zinc-200'"
                  >
                    {{ isSubscribed ? t('watch.membership_active') : t('watch.join_collective') }}
                  </div>
                </button>
              </div>

              <div class="flex items-center gap-4">
                <button 
                  @click="toggleLike"
                  class="flex items-center gap-3 px-8 py-3 rounded-full border border-white/5 transition-all font-bold text-xs tracking-widest uppercase"
                  :class="hasLiked ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white/60'"
                >
                  <div :class="hasLiked ? 'i-ph-heart-fill' : 'i-ph-heart-bold'" class="text-lg"></div>
                  {{ likesCount }}
                </button>
                <button class="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                  <div class="i-ph-share-network-bold text-lg"></div>
                </button>
              </div>
            </div>

            <div class="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 leading-relaxed text-white/50 text-sm tracking-wide">
              <div class="flex items-center gap-4 mb-6 text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                <span>{{ video.view_count }} {{ t('watch.impression_units') }}</span>
                <span class="w-1 h-1 rounded-full bg-white/10"></span>
                <span>{{ t('watch.logged') }}: {{ new Date(video.created_at).toLocaleDateString() }}</span>
              </div>
              {{ video.description || t('watch.no_metadata') }}
            </div>
          </div>

          <!-- Comments Section -->
          <div class="space-y-12 pt-12" :class="{ 'max-w-4xl mx-auto': isCinemaMode }">
            <div class="flex items-center gap-4">
              <div class="w-2 h-2 rounded-full bg-white"></div>
              <h2 class="text-xl font-brand font-bold tracking-tight uppercase italic">
                {{ t('watch.protocol_feed') }} ({{ comments?.length || 0 }})
              </h2>
            </div>

            <!-- Add Comment Input -->
            <div class="flex gap-6">
              <img 
                :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`" 
                class="w-12 h-12 rounded-full border border-white/10 p-1 bg-void-card shrink-0" 
                v-if="user"
              />
              <div class="flex-1 space-y-4">
                <textarea 
                  v-model="commentContent"
                  :placeholder="t('watch.add_comment')"
                  class="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-6 text-sm focus:outline-none focus:border-white/30 transition-all min-h-[120px] resize-none placeholder:text-white/20"
                ></textarea>
                <div class="flex justify-end items-center gap-6">
                  <button 
                    @click="commentContent = ''" 
                    class="text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest"
                    v-if="commentContent"
                  >
                    {{ t('watch.discard') }}
                  </button>
                  <button 
                    @click="postComment"
                    :disabled="isPosting || !commentContent.trim()"
                    class="btn-primary"
                  >
                    {{ isPosting ? t('watch.transmitting') : t('watch.post_message') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-10 pt-6">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-6 group">
                <img 
                  :src="comment.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`" 
                  class="w-11 h-11 rounded-full border border-white/5 p-0.5 bg-void shrink-0" 
                />
                <div class="space-y-2 flex-1">
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-xs tracking-widest uppercase text-white/80">{{ comment.profiles.display_name }}</span>
                    <span class="text-[9px] text-white/20 font-bold uppercase tracking-widest">{{ useTimeAgo(comment.created_at).value }}</span>
                  </div>
                  <p class="text-white/40 text-sm leading-relaxed max-w-2xl">{{ comment.content }}</p>
                  <div class="flex items-center gap-6 pt-3">
                    <button class="flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-white transition-colors">
                      <div class="i-ph-thumbs-up-bold"></div>
                      0
                    </button>
                    <button class="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">
                      {{ t('watch.reply') }}
                    </button>
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
          
          <div class="space-y-10" :class="{ 'grid grid-cols-1 md:grid-cols-2 gap-10 space-y-0': isCinemaMode }">
            <div v-for="n in 6" :key="n" class="flex gap-5 group cursor-pointer transition-all duration-500 hover:translate-x-1">
              <div class="w-44 aspect-video rounded-2xl bg-void-card shrink-0 overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-white/20 shadow-xl">
                 <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                   <div class="i-ph-video-camera-bold text-white/5 text-4xl transition-transform duration-700 group-hover:scale-110"></div>
                 </div>
              </div>
              <div class="flex flex-col gap-2 min-w-0 pt-1">
                 <div class="text-xs font-brand font-bold tracking-tight text-white/90 line-clamp-2 leading-snug group-hover:text-white transition-colors">Elevating Video Platforms via Minimalist 2026 Architectures</div>
                 <div class="text-[9px] text-white/30 tracking-[0.2em] font-bold uppercase">System Operator</div>
                 <div class="text-[9px] text-white/10 font-bold uppercase tracking-widest">Analytics: 942K Units</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
