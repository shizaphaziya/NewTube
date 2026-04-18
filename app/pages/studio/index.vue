<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n()
const { profile } = useProfile()

const { data: videos, refresh } = await useAsyncData('user-videos', async () => {
  if (!user.value) return []
  const { data } = await supabase
    .from('videos')
    .select('*, likes(count), comments(count)')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
  return data || []
})

const stats = computed(() => {
  if (!videos.value) return { views: 0, videos: 0, engagement: 0 }
  return {
    views: videos.value.reduce((acc, v) => acc + (v.view_count || 0), 0),
    videos: videos.value.length,
    engagement: videos.value.reduce((acc, v) => acc + (v.likes?.[0]?.count || 0) + (v.comments?.[0]?.count || 0), 0)
  }
})

const deleteVideo = async (id) => {
  if (!confirm(t('studio.terminate_confirm'))) return
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (!error) refresh()
}
</script>

<template>
  <div class="px-4 md:px-10 py-6 md:py-10 relative">
    <!-- Guest Overlay -->
    <Transition name="overlay">
      <div v-if="!user"
           class="absolute inset-0 z-50 flex items-center justify-center p-6 text-center">
        <div class="glass-card p-16 max-w-md space-y-8 ring-1 ring-white/10 relative z-10"
             style="animation: fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) both">
          <div class="w-14 h-14 mx-auto rounded-3xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
            <div class="i-ph-lock-key-bold text-2xl text-white/40"></div>
          </div>
          <div class="space-y-3">
            <h2 class="text-2xl font-brand font-black tracking-tighter text-white">
              {{ t('auth.authentication_locked') }}
            </h2>
            <p class="text-white/30 text-sm leading-relaxed">
              {{ t('auth.auth_required_desc') }}
            </p>
          </div>
          <NuxtLink to="/auth/login" class="btn-primary inline-flex">
            {{ t('auth.authorize_identity') }}
          </NuxtLink>
        </div>
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-void/70 backdrop-blur-2xl"></div>
      </div>
    </Transition>

    <div class="space-y-16" :class="{ 'opacity-10 blur-sm pointer-events-none select-none': !user }">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div class="space-y-2">
          <h1 class="text-5xl font-brand font-black tracking-tighter text-white">
            {{ t('studio.command_center') }}
          </h1>
          <p class="text-[#666] text-[10px] font-bold uppercase tracking-[0.4em]">
            {{ profile?.display_name || '—' }} • {{ t('studio.elite_operator') }}
          </p>
        </div>

        <NuxtLink to="/studio/upload" class="btn-primary self-start md:self-auto group flex items-center gap-3">
          <div class="i-ph-plus-bold transition-transform group-hover:rotate-90 duration-300"></div>
          {{ t('studio.publish_record') }}
        </NuxtLink>
      </div>

      <!-- Stats Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card p-8 space-y-3 group hover:border-white/15 transition-all duration-500">
          <div class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{{ t('studio.total_impressions') }}</div>
          <div class="text-5xl font-brand font-black text-white tabular-nums">{{ stats.views.toLocaleString() }}</div>
          <div class="h-px bg-white/[0.04] mt-4"></div>
          <div class="text-[9px] text-white/5 font-black tracking-widest">Total Views</div>
        </div>
        <div class="glass-card p-8 space-y-3 group hover:border-white/15 transition-all duration-500">
          <div class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{{ t('studio.signal_fragments') }}</div>
          <div class="text-5xl font-brand font-black text-white tabular-nums">{{ stats.videos }}</div>
          <div class="h-px bg-white/[0.04] mt-4"></div>
          <div class="text-[9px] text-white/5 font-black tracking-widest">Total Videos</div>
        </div>
        <div class="glass-card p-8 space-y-3 group hover:border-white/15 transition-all duration-500">
          <div class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{{ t('studio.synapse_response') }}</div>
          <div class="text-5xl font-brand font-black text-white tabular-nums">{{ stats.engagement }}</div>
          <div class="h-px bg-white/[0.04] mt-4"></div>
          <div class="text-[9px] text-white/5 font-black tracking-widest">Total Engagement</div>
        </div>
      </div>

      <!-- Video Records -->
      <div class="space-y-8">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-1.5 rounded-full bg-white/30"></div>
          <h2 class="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
            {{ t('studio.active_records') }}
          </h2>
        </div>

        <!-- Empty State -->
        <div v-if="!videos?.length"
             class="glass-card p-20 flex flex-col items-center gap-6 text-center border-dashed border-white/[0.04]">
          <div class="i-ph-folder-simple-dashed-bold text-5xl text-white/10"></div>
          <p class="text-white/20 text-xs font-bold uppercase tracking-widest">
            {{ t('studio.no_records') }}
          </p>
          <NuxtLink to="/studio/upload" class="btn-primary">
            {{ t('studio.publish_record') }}
          </NuxtLink>
        </div>

        <!-- Records List -->
        <div v-else class="space-y-4">
          <div
            v-for="video in videos"
            :key="video.id"
            class="glass-card p-5 flex items-center gap-6 group hover:border-white/10 transition-all duration-500"
          >
            <!-- Thumbnail -->
            <div class="w-40 aspect-video rounded-2xl overflow-hidden bg-void/50 flex-shrink-0">
              <img
                v-if="video.thumbnail_url"
                :src="video.thumbnail_url"
                class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <div class="i-ph-video-camera-bold text-white/10 text-3xl"></div>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0 space-y-1.5">
              <h3 class="font-brand font-black tracking-tight text-white truncate">{{ video.title }}</h3>
              <div class="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                <span>{{ (video.view_count || 0).toLocaleString() }} {{ t('studio.impressions') }}</span>
                <span class="w-px h-3 bg-white/10"></span>
                <span>{{ new Date(video.created_at).toLocaleDateString() }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 shrink-0">
              <NuxtLink
                :to="`/watch/${video.id}`"
                class="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              >
                <div class="i-ph-eye-bold text-lg"></div>
              </NuxtLink>
              <button
                @click="deleteVideo(video.id)"
                class="w-10 h-10 rounded-xl flex items-center justify-center text-red-500/30 hover:text-red-500 hover:bg-red-500/[0.08] transition-all duration-200"
              >
                <div class="i-ph-trash-bold text-lg"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-enter-active, .overlay-leave-active {
  transition: opacity 0.4s ease;
}
.overlay-enter-from, .overlay-leave-to {
  opacity: 0;
}
</style>
