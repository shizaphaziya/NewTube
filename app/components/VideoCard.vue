<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  video: {
    id: string
    title: string
    user_id: string
    thumbnail_url?: string | null
    video_url?: string | null
    view_count: number | null
    created_at?: string | null
    profiles: {
      display_name: string
      avatar_url: string
    }
  },
  index: number
}>()
</script>

<template>
  <NuxtLink 
    :to="`/watch/${video.id}`"
    v-motion
    :initial="{ opacity: 0, y: 20, scale: 0.95 }"
    :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 600, ease: [0.16, 1, 0.3, 1], delay: index * 50 } }"
    class="group block no-underline focus:outline-none"
  >
    <!-- Cinematic Thumbnail Container -->
    <div class="relative aspect-video rounded-2xl bg-neutral-900/50 overflow-hidden transition-all duration-500 border border-neutral-800/50 group-hover:border-white/20 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      
      <!-- Video Thumbnail -->
      <img 
        v-if="video.thumbnail_url"
        :src="video.thumbnail_url" 
        :style="`view-transition-name: video-thumb-${video.id}`"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      
      <!-- Fallback Frame -->
      <video
        v-else-if="video.video_url"
        :src="video.video_url + '#t=0.5'"
        :style="`view-transition-name: video-thumb-${video.id}`"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        muted
        preload="metadata"
      ></video>

      <!-- Ultimate Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900" :style="`view-transition-name: video-thumb-${video.id}`">
        <div class="i-ph-video-camera text-neutral-800 text-4xl transition-transform duration-700 group-hover:scale-110"></div>
      </div>

      <!-- Play Button Overlay (visible on hover) -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
        <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div class="i-ph-play-fill text-white text-xl translate-x-0.5"></div>
        </div>
      </div>

      <!-- Badge Overlay -->
      <div class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-sm transition-transform duration-300 group-hover:translate-y-1 opacity-100 group-hover:opacity-0">
        {{ video.view_count || 0 }} {{ t('watch.views') }}
      </div>
    </div>

    <!-- Elevated Typography Section -->
    <div class="mt-4 flex gap-3 px-1">
      <!-- Creator Avatar -->
      <div class="shrink-0 mt-0.5 relative">
        <img
          :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`"
          class="w-10 h-10 rounded-full object-cover bg-neutral-900 border border-neutral-800 transition-colors duration-300 group-hover:border-neutral-600 relative z-10"
        />
        <div class="absolute inset-0 bg-white rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>

      <div class="space-y-1 flex-1 min-w-0">
        <h3 class="text-base font-semibold text-white/90 leading-tight line-clamp-2 group-hover:text-white transition-colors duration-300" :style="`view-transition-name: video-title-${video.id}`">
          {{ video.title }}
        </h3>
        
        <div class="flex flex-col text-[13px] text-neutral-400">
          <div class="group-hover:text-neutral-300 transition-colors duration-300 font-medium">
            {{ video.profiles?.display_name }}
          </div>
          <div class="flex items-center gap-1.5 text-xs">
            <ClientOnly><span>{{ useTimeAgo(video.created_at || '').value }}</span><template #fallback><span>...</span></template></ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
