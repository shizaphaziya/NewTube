<script setup lang="ts">
import { useAppStore } from '~/store/app'
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const videos = ref<any[]>([])
const activeIndex = ref(0)
const loading = ref(true)

const fetchShorts = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)')
    .eq('status', 'published')
    .eq('is_short', true)
    .order('created_at', { ascending: false })
    .limit(20)

  if (!error && data) {
    videos.value = data
  }
  loading.value = false
}

onMounted(() => {
  fetchShorts()
})

const onScroll = (e: any) => {
  const container = e.target
  const index = Math.round(container.scrollTop / window.innerHeight)
  if (activeIndex.value !== index) {
    activeIndex.value = index
  }
}

const appStore = useAppStore()

// Interaction states for current video
const isLiked = ref(false)
const isSubscribed = ref(false)

const toggleLike = () => { 
  if (!user.value) return appStore.openAuthModal()
  isLiked.value = !isLiked.value 
}

const toggleSubscribe = () => {
  if (!user.value) return appStore.openAuthModal()
  isSubscribed.value = !isSubscribed.value
}

const handleComment = () => {
  if (!user.value) return appStore.openAuthModal()
  // Just open modal for now if they click the comment button in shorts
  // (In a full app, this would open a comment drawer)
}

const { t } = useI18n()

useSeoMeta({
  title: () => `${t('shorts.title')} - ${t('seo.title')}`,
  description: () => t('shorts.subtitle')
})
</script>

<template>
  <div class="h-screen w-full bg-void relative flex justify-center overflow-hidden selection:(bg-primary-500/30 text-white)">
    <!-- Cinematic Atmosphere -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-500/5 blur-[150px] rounded-full animate-pulse-slow"></div>
    </div>

    <!-- Centered Feed -->
    <div
      class="w-full max-w-[500px] h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none relative z-10"
      @scroll="onScroll"
    >
      <!-- Loading State -->
      <div v-if="loading && videos.length === 0" class="h-full flex items-center justify-center">
        <div class="space-y-6 text-center">
          <div class="w-16 h-16 mx-auto relative">
            <div class="absolute inset-0 bg-primary-500/20 blur-xl animate-pulse"></div>
            <div class="relative w-full h-full rounded-2xl border border-primary-500/30 flex items-center justify-center animate-glow">
              <div class="i-ph-broadcast text-3xl text-primary-500 animate-spin-slow"></div>
            </div>
          </div>
          <p class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] animate-pulse">{{ t('shorts.loading') }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && videos.length === 0" class="h-full flex flex-col items-center justify-center px-10 text-center">
        <div class="w-24 h-24 rounded-3xl bg-void-900 border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
          <div class="i-ph-video-camera-slash text-5xl text-white/10"></div>
        </div>
        <h2 class="text-2xl font-900 text-white uppercase tracking-tighter italic mb-4">{{ t('shorts.no_shorts') }}</h2>
        <p class="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose">{{ t('shorts.no_shorts_subtitle') }}</p>
      </div>

      <!-- Shorts -->
      <div
        v-for="(video, index) in videos"
        :key="video.id"
        class="h-screen w-full snap-start snap-always relative flex items-center justify-center p-0 md:p-6 lg:p-10"
      >
        <div class="relative w-full h-full max-w-[450px] aspect-[9/16] bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 rounded-none md:rounded-[2.5rem] overflow-hidden group">
          
          <!-- Video Element -->
          <video
            :src="video.video_url"
            class="w-full h-full object-cover"
            loop
            :autoplay="index === activeIndex"
            :muted="index !== activeIndex"
            :poster="video.thumbnail_url"
            playsinline
          ></video>

          <!-- Glass Overlays -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none"></div>

          <!-- Bottom Metadata -->
          <div class="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-auto">
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <NuxtLink :to="`/profile/${video.user_id}`" class="group no-underline flex items-center gap-4">
                  <div class="relative">
                    <div class="absolute -inset-1 bg-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" 
                         class="w-12 h-12 rounded-xl border-2 border-white/20 relative z-10" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-900 text-white uppercase tracking-tighter italic">{{ video.profiles?.display_name }}</span>
                    <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">{{ t('watch.verified_user') }}</span>
                  </div>
                </NuxtLink>
                <button 
                  @click="toggleSubscribe()"
                  class="ml-4 px-6 py-2.5 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all active:scale-95"
                >
                  {{ isSubscribed ? t('watch.membership_active') : t('watch.join_collective') }}
                </button>
              </div>

              <!-- Action Buttons -->
              <div class="absolute bottom-8 right-4 flex flex-col items-center gap-6 z-40">
                <div class="flex flex-col items-center gap-2 group/action cursor-pointer" @click="toggleLike">
                  <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/action:bg-primary-500/20 group-hover/action:border-primary-500/50 transition-all active:scale-90">
                    <div :class="[isLiked ? 'i-ph-heart-fill text-primary-500' : 'i-ph-heart text-white']" class="text-2xl"></div>
                  </div>
                  <span class="text-[9px] font-black text-white uppercase tracking-tighter">{{ t('shorts.like') }}</span>
                </div>

                <div class="flex flex-col items-center gap-2 group/action cursor-pointer" @click="handleComment">
                  <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/action:bg-white/20 transition-all active:scale-90">
                    <div class="i-ph-chat-circle text-white text-2xl"></div>
                  </div>
                  <span class="text-[9px] font-black text-white uppercase tracking-tighter">{{ t('shorts.comment') }}</span>
                </div>

                <div class="flex flex-col items-center gap-2 group/action cursor-pointer">
                  <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/action:bg-white/20 transition-all active:scale-90">
                    <div class="i-ph-share-fat text-white text-2xl"></div>
                  </div>
                  <span class="text-[9px] font-black text-white uppercase tracking-tighter">{{ t('shorts.share') }}</span>
                </div>
              </div>

              <!-- Title & Sound -->
              <div class="max-w-[70%]">
                <p class="text-sm font-medium text-white line-clamp-2 leading-relaxed mb-4">{{ video.title }}</p>
                <div class="flex items-center gap-2 text-white/60">
                  <div class="i-ph-music-notes text-xs"></div>
                  <div class="text-[10px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap relative">
                    <span class="inline-block animate-marquee">{{ t('shorts.original_sound') }} - {{ video.profiles?.display_name }}</span>
                  </div>
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
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

.animate-progress {
  animation: progress var(--v-duration, 15s) linear forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1) translate(-50%, -50%); }
  50% { opacity: 0.3; transform: scale(1.1) translate(-50%, -45%); }
}

.animate-spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 5px rgba(239, 68, 68, 0.1); }
  to { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
}

/* Vertical feed styles */
:global(body) {
  overflow: hidden;
}
</style>
