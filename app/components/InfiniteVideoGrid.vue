<script setup>
const supabase = useSupabaseClient()
const videos = ref([])
const page = ref(0)
const pageSize = 12
const loading = ref(false)
const hasMore = ref(true)

const loadMoreTrigger = ref(null)

const fetchVideos = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  const from = page.value * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)')
    .eq('status', 'published')
    .eq('is_short', false)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error(error)
  } else {
    if (data.length < pageSize) hasMore.value = false
    videos.value.push(...data)
    page.value++
  }
  loading.value = false
}

// Infinite scroll trigger
useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    fetchVideos()
  }
})

// Fresh load
onMounted(() => {
  fetchVideos()
})
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12">
      <VideoCard
        v-for="(video, idx) in videos"
        :key="video.id"
        :video="video"
        :index="idx"
      />

      <!-- Skeletons -->
      <template v-if="loading">
        <VideoSkeleton v-for="n in 5" :key="n" />
      </template>
    </div>

    <!-- Scroll Sentinel -->
    <div ref="loadMoreTrigger" class="h-40 flex flex-col items-center justify-center mt-12 gap-4">
      <div v-if="loading && videos.length > 0" class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin"></div>
        <p class="text-[10px] font-bold text-void-500 uppercase tracking-widest animate-pulse">{{ $t('home.syncing') }}</p>
      </div>
      <div v-if="!hasMore && videos.length > 0" class="flex flex-col items-center gap-6 opacity-60">
        <div class="w-12 h-px bg-gradient-to-r from-transparent via-void-700 to-transparent"></div>
        <p class="text-void-500 text-xs font-semibold uppercase tracking-widest">
          {{ $t('home.no_videos') }}
        </p>
      </div>
    </div>

    <div v-if="!loading && videos.length === 0" class="flex flex-col items-center justify-center py-40 text-center animate-fade-in">
      <div class="relative mb-8">
        <div class="i-ph-video-camera-slash text-7xl text-void-800"></div>
        <div class="absolute -top-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
      </div>
      <h2 class="text-3xl font-brand tracking-tighter text-white mb-2">{{ $t('home.no_videos') }}</h2>
      <p class="text-void-500 text-sm max-w-xs mx-auto">{{ $t('home.no_videos_subtitle') }}</p>
    </div>
  </div>
</template>
