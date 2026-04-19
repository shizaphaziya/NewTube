<script setup lang="ts">
defineProps<{
  video: {
    id: string
    title: string
    user_id: string
    thumbnail_url?: string | null
    view_count: number | null
    created_at?: string | null
    profiles: {
      display_name: string | null
      avatar_url: string | null
    } | null
  }
}>()

const { t } = useI18n()

const formatViews = (count: number | null) => {
  if (!count) return '0'
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + 'M'
  if (count >= 1_000) return (count / 1_000).toFixed(1) + 'K'
  return count.toString()
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return t('common.today')
  if (diffDays === 1) return t('common.yesterday')
  if (diffDays < 7) return t('common.days_ago', { n: diffDays })
  if (diffDays < 30) return t('common.weeks_ago', { n: Math.floor(diffDays / 7) })
  if (diffDays < 365) return t('common.months_ago', { n: Math.floor(diffDays / 30) })
  return t('common.years_ago', { n: Math.floor(diffDays / 365) })
}
</script>

<template>
  <NuxtLink
    :to="`/watch/${video.id}`"
    class="flex flex-col gap-3 group focus-visible:outline-none
           focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl w-full"
    :style="{ viewTransitionName: `video-card-${video.id}` }"
  >
    <!-- Thumbnail -->
    <div
      class="relative aspect-video rounded-xl overflow-hidden
             bg-white/[0.04] border border-white/[0.06]
             transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
             group-hover:border-white/20 group-hover:-translate-y-1
             group-hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]"
    >
      <img
        crossorigin="anonymous"
        :src="video.thumbnail_url || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800'"
        :alt="video.title"
        class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
               group-hover:scale-[1.05]"
        :style="{ viewTransitionName: `video-thumb-${video.id}` }"
        loading="lazy"
      />

      <!-- Dark gradient bottom -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <!-- Play button overlay -->
      <div class="absolute inset-0 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-all duration-400">
        <div
          class="w-11 h-11 rounded-full bg-white flex items-center justify-center
                 scale-75 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          <div class="i-ph-play-fill text-black text-lg translate-x-px"></div>
        </div>
      </div>

      <!-- View count badge -->
      <div class="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg
                  bg-black/70 backdrop-blur-sm
                  text-[9px] font-black tracking-widest text-white uppercase
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {{ formatViews(video.view_count) }} {{ t('watch.views') }}
      </div>
    </div>

    <!-- Info -->
    <div class="flex gap-3 px-0.5 mt-0.5">
      <!-- Avatar -->
      <NuxtLink :to="`/profile/${video.user_id}`" @click.stop class="shrink-0 mt-1">
        <img
          crossorigin="anonymous"
          :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`"
          :alt="video.profiles?.display_name || undefined"
          class="w-8 h-8 rounded-lg border border-white/[0.08] object-cover
                 transition-all duration-300 hover:border-white/25 hover:scale-110 shadow-sm"
        />
      </NuxtLink>

      <!-- Text -->
      <div class="flex flex-col gap-0.5 min-w-0 flex-1">
        <h3
          class="text-[14px] font-sans font-semibold text-white/90 leading-tight
                 line-clamp-2 transition-colors duration-300 group-hover:text-white"
        >
          {{ video.title }}
        </h3>
        <p class="text-[10px] font-bold tracking-wider text-white/30 uppercase truncate mt-0.5">
          {{ video.profiles?.display_name }}
        </p>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="text-[10px] text-white/25 tabular-nums slashed-zero">{{ formatDate(video.created_at) }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
