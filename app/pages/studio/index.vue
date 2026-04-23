<script setup>
const supabase = useSupabaseClient()
const { confirm: showConfirm } = useConfirm()
const user = useSupabaseUser()
const { t } = useI18n()

const { profile } = useProfile()

useSeoMeta({
  title: () => `${t('studio.command_center')} - NewTube Studio`,
  description: () => t('studio.broadcasting')
})

const { data: videos, refresh, error: asyncError } = await useAsyncData('user-videos', async () => {

  const { data: { user: authUser } } = await supabase.auth.getUser()
  const userId = user.value?.id || authUser?.id
  if (!userId) return []
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('[Studio] Fetch error:', error)
    throw error
  }
  return (data || [])
}, { watch: [user], server: false })

if (asyncError.value) {
  console.error('[Studio] useAsyncData error:', asyncError.value)
}


const stats = computed(() => {
  if (!videos.value) return { views: 0, videos: 0, engagement: 0 }
  return {
    views: videos.value.reduce((acc, v) => acc + (v.view_count || 0), 0),
    videos: videos.value.length,
    engagement: videos.value.reduce((acc, v) => acc + (v.likes?.[0]?.count || 0) + (v.comments?.[0]?.count || 0), 0)
  }
})

const deleteVideo = async (id) => {
  if (!await showConfirm(t('studio.terminate_confirm'))) return
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (!error) refresh()
}
</script>

<template>
  <div class="px-4 md:px-8 lg:px-12 py-8 relative max-w-screen-xl mx-auto">
    <!-- Guest Overlay -->
    <Transition name="fade">
      <div v-if="!user"
           class="absolute inset-0 z-50 flex items-center justify-center p-4">
        <div class="bg-[#18181b] border border-white/10 rounded-2xl p-8 md:p-12 max-w-md w-full space-y-6 text-center shadow-2xl relative z-10"
             v-motion-pop-in>
          <div class="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <div class="i-ph-lock-key text-xl text-white/60"></div>
          </div>
          <div class="space-y-2">
            <h2 class="text-xl font-semibold text-white">
              {{ t('auth.authentication_locked') }}
            </h2>
            <p class="text-white/60 text-sm">
              {{ t('auth.login_required') }}
            </p>
          </div>
          <NuxtLink :to="'/auth/login?redirect=' + $route.fullPath" class="btn-primary w-full inline-flex">
            {{ t('auth.authorize_identity') }}
          </NuxtLink>
        </div>
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-void/80 backdrop-blur-sm"></div>
      </div>
    </Transition>

    <div class="space-y-12" :class="{ 'opacity-20 blur-sm pointer-events-none select-none': !user }">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-white">
            Channel dashboard
          </h1>
          <p class="text-white/60 text-sm">
            {{ profile?.display_name || 'Creator' }}
          </p>
        </div>

        <NuxtLink to="/studio/upload" class="btn-primary self-start md:self-auto flex items-center gap-2">
          <div class="i-ph-upload-simple"></div>
          {{ t('studio.upload') }}
        </NuxtLink>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-[#18181b] border border-white/5 rounded-xl p-6 space-y-2">
          <div class="text-sm font-medium text-white/60">{{ t('studio.total_impressions') }}</div>
          <div class="text-3xl font-bold text-white">{{ stats.views.toLocaleString() }}</div>
        </div>
        <div class="bg-[#18181b] border border-white/5 rounded-xl p-6 space-y-2">
          <div class="text-sm font-medium text-white/60">{{ t('studio.videos') }}</div>
          <div class="text-3xl font-bold text-white">{{ stats.videos }}</div>
        </div>
        <div class="bg-[#18181b] border border-white/5 rounded-xl p-6 space-y-2">
          <div class="text-sm font-medium text-white/60">{{ t('studio.engagement') }}</div>
          <div class="text-3xl font-bold text-white">{{ stats.engagement }}</div>
        </div>
      </div>

      <!-- Video Records -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold text-white">
          Channel content
        </h2>

        <!-- Empty State -->
        <div v-if="!videos?.length"
             class="bg-[#18181b] border border-white/5 rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
          <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
             <div class="i-ph-video-camera-slash text-2xl text-white/40"></div>
          </div>
          <p class="text-white/60 text-sm">
            {{ t('studio.no_records') }}
          </p>
          <NuxtLink to="/studio/upload" class="btn-primary mt-2">
            Upload video
          </NuxtLink>
        </div>

        <!-- Records List -->
        <div v-else class="bg-[#18181b] border border-white/5 rounded-xl overflow-hidden">
          <!-- Table Header -->
          <div class="hidden sm:grid grid-cols-[1fr_100px_120px_100px] gap-4 px-6 py-4 border-b border-white/5 text-sm font-medium text-white/60">
            <div>Video</div>
            <div class="text-right">Visibility</div>
            <div class="text-right">Date</div>
            <div class="text-right">Views</div>
          </div>

          <div class="divide-y divide-white/5">
            <div
              v-for="video in videos"
              :key="video.id"
              class="flex flex-col sm:grid sm:grid-cols-[1fr_100px_120px_100px] gap-4 p-4 sm:px-6 sm:py-4 items-start sm:items-center hover:bg-white/[0.02] transition-colors group relative"
            >
              <!-- Video Info -->
              <div class="flex gap-4 min-w-0 w-full">
                <div class="w-32 aspect-video rounded-lg overflow-hidden bg-[#27272a] shrink-0">
                   <img
                    v-if="video.thumbnail_url"
                    :src="video.thumbnail_url"
                    class="w-full h-full object-cover"
                  />
                   <div v-else class="w-full h-full flex items-center justify-center">
                     <div class="i-ph-film-strip text-white/20"></div>
                   </div>
                </div>
                <div class="flex-1 min-w-0 space-y-1 py-1">
                  <h3 class="font-medium text-sm text-white truncate">{{ video.title }}</h3>
                  <p class="text-xs text-white/40 line-clamp-2">{{ video.description || 'Add description' }}</p>

                  <!-- Mobile only meta -->
                  <div class="flex sm:hidden items-center gap-3 text-xs text-white/40 mt-2">
                    <span>{{ video.created_at ? new Date(video.created_at).toLocaleDateString() : '—' }}</span>
                    <span>•</span>
                    <span>{{ (video.view_count || 0).toLocaleString() }} views</span>
                  </div>
                </div>
              </div>

              <!-- Desktop Meta Columns -->
              <div class="hidden sm:flex items-center justify-end">
                <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                  <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  Public
                </span>
              </div>
              <div class="hidden sm:block text-sm text-white/60 text-right">
                {{ video.created_at ? new Date(video.created_at).toLocaleDateString() : '—' }}
              </div>
              <div class="hidden sm:block text-sm text-white/60 text-right tabular-nums">
                {{ (video.view_count || 0).toLocaleString() }}
              </div>

              <!-- Hover Actions (Desktop) / Normal Actions (Mobile) -->
              <div class="flex sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-[#18181b] sm:bg-[#18181b]/90 sm:backdrop-blur-sm sm:pl-4 rounded-l-lg py-1 mt-2 sm:mt-0">
                 <NuxtLink
                  :to="`/watch/${video.id}`"
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Watch on NewTube"
                >
                  <div class="i-ph-play text-lg"></div>
                </NuxtLink>
                <button
                  @click="deleteVideo(video.id)"
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Delete video"
                >
                  <div class="i-ph-trash text-lg"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
