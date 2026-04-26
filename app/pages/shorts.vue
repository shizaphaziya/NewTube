<script setup lang="ts">
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

// Interaction states for current video
const isLiked = ref(false)
const toggleLike = () => { isLiked.value = !isLiked.value }

useSeoMeta({
  title: 'Shorts - NewTube VOID',
  description: 'Vertical cinematic transmissions.'
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
          <p class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] animate-pulse">Scanning Signals</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && videos.length === 0" class="h-full flex flex-col items-center justify-center px-10 text-center">
        <div class="w-24 h-24 rounded-3xl bg-void-900 border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
          <div class="i-ph-video-camera-slash text-5xl text-white/10"></div>
        </div>
        <h2 class="text-2xl font-900 text-white uppercase tracking-tighter italic mb-4">No Transmissions</h2>
        <p class="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose">The frequency is currently silent. Check back later for incoming vertical data.</p>
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

          <!-- Top Progress Indicator -->
          <div class="absolute top-6 left-6 right-6 flex gap-2 z-20">
            <div v-for="n in videos.length" :key="n" 
                 class="h-1 flex-1 rounded-full bg-white/10 overflow-hidden transition-all duration-300"
                 :class="{ 'bg-white/30': index === activeIndex }">
              <div v-if="index === activeIndex" class="h-full bg-primary-500 w-full animate-progress"></div>
            </div>
          </div>

          <!-- Bottom Info -->
          <div class="absolute bottom-10 left-8 right-20 z-10 space-y-6 pointer-events-auto">
            <div v-motion-slide-visible-bottom class="space-y-4">
              <NuxtLink :to="`/profile/${video.user_id}`" class="flex items-center gap-4 no-underline group/creator">
                <div class="relative">
                  <div class="absolute -inset-1 bg-primary-500 rounded-full opacity-0 group-hover/creator:opacity-40 blur-md transition-opacity"></div>
                  <img :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" 
                       class="w-12 h-12 rounded-xl border-2 border-white/20 object-cover relative z-10" />
                </div>
                <div class="space-y-0.5">
                  <h3 class="font-black text-white uppercase tracking-tighter italic text-lg shadow-black/50 drop-shadow-lg">
                    {{ video.profiles?.display_name }}
                  </h3>
                  <p class="text-[9px] font-black text-primary-500 uppercase tracking-widest">Live Broadcast</p>
                </div>
                <button class="ml-2 px-4 py-1.5 rounded-lg bg-primary-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
                  Join
                </button>
              </NuxtLink>
              
              <h4 class="text-white font-medium text-base leading-snug line-clamp-2 drop-shadow-xl pr-4">
                {{ video.title }}
              </h4>

              <div class="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest">
                <div class="flex items-center gap-1.5">
                  <div class="i-ph-broadcast"></div>
                  {{ (video.view_count || 0).toLocaleString() }} Imp.
                </div>
                <span>•</span>
                <div class="flex items-center gap-1.5">
                  <div class="i-ph-music-note-duotone text-primary-500"></div>
                  Original Transmission
                </div>
              </div>
            </div>
          </div>

          <!-- Right Actions Bar -->
          <div class="absolute bottom-10 right-6 z-20 flex flex-col items-center gap-8 pointer-events-auto">
            <div class="flex flex-col items-center gap-1.5 group/action">
              <button @click="toggleLike" 
                      class="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/80 hover:(bg-primary-500 text-white border-primary-400 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.3)]) transition-all duration-500"
                      :class="{ 'bg-primary-500 text-white border-primary-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]': isLiked }">
                <div :class="[isLiked ? 'i-ph-heart-fill' : 'i-ph-heart-duotone', 'text-2xl transition-transform group-hover/action:scale-125']"></div>
              </button>
              <span class="text-[10px] font-black text-white/60 uppercase tracking-widest">Signal</span>
            </div>

            <div class="flex flex-col items-center gap-1.5 group/action">
              <button class="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/80 hover:(bg-white/20 text-white border-white/30 scale-110) transition-all duration-500">
                <div class="i-ph-chat-circle-dots-duotone text-2xl group-hover/action:scale-125 transition-transform"></div>
              </button>
              <span class="text-[10px] font-black text-white/60 uppercase tracking-widest">Echo</span>
            </div>

            <div class="flex flex-col items-center gap-1.5 group/action">
              <button class="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/80 hover:(bg-white/20 text-white border-white/30 scale-110) transition-all duration-500">
                <div class="i-ph-share-network-duotone text-2xl group-hover/action:scale-125 transition-transform"></div>
              </button>
              <span class="text-[10px] font-black text-white/60 uppercase tracking-widest">Beam</span>
            </div>

            <div class="flex flex-col items-center gap-1.5 group/action">
              <button class="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/80 hover:(bg-white/20 text-white border-white/30 scale-110) transition-all duration-500">
                <div class="i-ph-dots-three-bold text-2xl group-hover/action:scale-125 transition-transform"></div>
              </button>
            </div>
            
            <!-- Music Vinyl Effect -->
            <div class="relative mt-4 group/music cursor-pointer">
              <div class="absolute -inset-2 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover/music:opacity-100 transition-opacity"></div>
              <div class="w-12 h-12 rounded-full bg-void-900 border-2 border-white/10 flex items-center justify-center animate-spin-slow relative z-10 shadow-2xl overflow-hidden">
                <img :src="video.thumbnail_url" class="w-full h-full object-cover opacity-50" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-3 h-3 bg-black rounded-full border border-white/20 shadow-inner"></div>
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
