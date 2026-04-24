<script setup lang="ts">
const supabase = useSupabaseClient()

const videos = ref([])
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

const onScroll = (e) => {
  const container = e.target
  const index = Math.round(container.scrollTop / window.innerHeight)
  activeIndex.value = index
}

useSeoMeta({
  title: 'Shorts - NewTube',
  description: 'Watch short vertical videos on NewTube.'
})
</script>

<template>
  <div class="h-[calc(100vh-72px)] md:h-screen w-full bg-black relative flex justify-center overflow-hidden">
    <!-- Centered Feed -->
    <div
      class="w-full max-w-[500px] h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none pb-16 md:pb-0"
      @scroll="onScroll"
    >
      <!-- Loading State -->
      <div v-if="loading && videos.length === 0" class="h-full flex items-center justify-center text-white/40">
        <div class="i-ph-spinner-gap animate-spin text-4xl"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && videos.length === 0" class="h-full flex flex-col items-center justify-center text-white/40">
        <div class="i-ph-video-camera-slash text-6xl mb-4"></div>
        <p>No shorts available yet.</p>
      </div>

      <!-- Shorts -->
      <div
        v-for="(video, index) in videos"
        :key="video.id"
        class="h-[calc(100vh-72px)] md:h-screen w-full snap-start snap-always relative flex items-center justify-center bg-black"
      >
        <div class="relative w-full h-full md:h-[90%] md:rounded-xl overflow-hidden group">
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

          <!-- Overlay UI -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

          <div class="absolute bottom-4 left-4 right-16 z-10 space-y-2 pointer-events-auto">
            <NuxtLink :to="`/profile/${video.user_id}`" class="flex items-center gap-2 no-underline text-white">
              <img :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" class="w-10 h-10 rounded-full border border-white/20 object-cover" />
              <span class="font-semibold drop-shadow-md">@{{ video.profiles?.display_name }}</span>
            </NuxtLink>
            <p class="text-white/90 text-sm line-clamp-2 drop-shadow-md">{{ video.title }}</p>
          </div>

          <!-- Right Actions Bar -->
          <div class="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-6 pointer-events-auto">
            <NuxtLink :to="`/watch/${video.id}`" class="flex flex-col items-center gap-1 group/btn">
              <div class="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white group-hover/btn:bg-white/20 transition">
                <div class="i-ph-play-circle text-2xl"></div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the body doesn't scroll when in the shorts view */
:global(body) {
  overflow: hidden;
}
</style>
