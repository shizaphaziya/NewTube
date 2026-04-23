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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6">
      <VideoCard
        v-for="(video, idx) in videos"
        :key="video.id"
        :video="video"
        :index="idx"
      />

      <!-- Skeletons -->
      <template v-if="loading">
        <VideoSkeleton v-for="n in 6" :key="n" />
      </template>
    </div>

    <!-- Scroll Sentinel -->
    <div ref="loadMoreTrigger" class="h-20 flex items-center justify-center mt-10">
      <div v-if="loading && videos.length > 0" class="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
      <p v-if="!hasMore && videos.length > 0" class="text-white/40 text-sm font-medium">
        {{ $t('home.no_videos') }}
      </p>
    </div>

    <div v-if="!loading && videos.length === 0" class="flex flex-col items-center justify-center py-40 text-center">
      <div class="i-ph-video-camera-slash text-6xl text-white/10 mb-6"></div>
      <h2 class="text-2xl font-medium text-white/40">{{ $t('home.no_videos') }}</h2>
    </div>
  </div>
</template>
