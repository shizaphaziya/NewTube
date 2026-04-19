<script setup lang="ts">
import type { Database } from '~/types/database.types'

type VideoWithProfile = Database['public']['Tables']['videos']['Row'] & {
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

const supabase = useSupabaseClient<Database>()
const videos = ref<VideoWithProfile[]>([])
const page = ref(0)
const pageSize = 12
const loading = ref(false)
const hasMore = ref(true)

const loadMoreTrigger = ref<HTMLElement | null>(null)

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
  } else if (data) {
    if (data.length < pageSize) hasMore.value = false
    // @ts-ignore - Supabase join types can be tricky with generated types
    videos.value.push(...(data as VideoWithProfile[]))
    page.value++
  }
  loading.value = false
}

// Infinite scroll trigger
useIntersectionObserver(loadMoreTrigger, (entries) => {
  const entry = entries[0]
  if (entry?.isIntersecting) {
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
      <VideoCard 
        v-for="(video, idx) in videos" 
        :key="video.id" 
        :video="video"
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 1000, ease: [0.16, 1, 0.3, 1], delay: (idx % pageSize) * 100 } }"
      />
      
      <!-- Skeletons -->
      <template v-if="loading">
        <VideoSkeleton v-for="n in 6" :key="n" />
      </template>
    </div>

    <!-- Scroll Sentinel -->
    <div ref="loadMoreTrigger" class="h-40 flex items-center justify-center mt-20">
      <div v-if="loading && videos.length > 0" class="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin"></div>
      <p v-if="!hasMore && videos.length > 0" class="text-white/10 text-[9px] font-black tracking-[0.5em] uppercase">
        ∎ {{ $t('home.no_videos') }}
      </p>
    </div>

    </div>
  </div>
</template>
