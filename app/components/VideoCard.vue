<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
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
    class="group block no-underline focus:outline-none relative"
  >
    <!-- Thumbnail Container -->
    <div
      class="relative aspect-video rounded-[1.5rem] bg-void-900 overflow-hidden border border-white/5
             transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
             group-hover:(border-primary-500/40 shadow-[0_32px_64px_-16px_rgba(239,68,68,0.22)])"
      :style="`view-transition-name: video-thumb-${video.id}`"
    >
      
      <!-- Video Thumbnail -->
      <img 
        v-if="video.thumbnail_url"
        :src="video.thumbnail_url" 
        class="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.33,1,0.68,1)]"
        loading="lazy"
      />
      
      <!-- Fallback Frame -->
      <video
        v-else-if="video.video_url"
        :src="video.video_url + '#t=0.5'"
        class="w-full h-full object-cover transition-transform duration-[1.2s] ease-out"
        muted
        preload="metadata"
      ></video>

      <!-- Ultimate Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center bg-void-900">
        <div class="i-ph-broadcast text-void-800 text-5xl"></div>
      </div>

      <!-- Premium Overlay Gradient — subtle, reveals on hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-600"></div>

      <!-- Play Button Overlay — scales in cleanly -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <div class="w-14 h-14 rounded-2xl bg-primary-600/90 backdrop-blur-md flex items-center justify-center
                    transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    shadow-[0_8px_32px_rgba(239,68,68,0.45)]">
          <div class="i-ph-play-fill text-white text-2xl translate-x-px"></div>
        </div>
      </div>

      <!-- Views Badge — static, no micro-wiggle -->
      <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xl border border-white/10
                  text-[9px] font-black text-white tracking-[0.08em] uppercase flex items-center gap-1.5 shadow-xl">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-80"></div>
        {{ (video.view_count || 0).toLocaleString() }} {{ t('watch.views') }}
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-4 flex gap-3 px-1 relative">
      <!-- Creator Avatar — subtle glow on hover, no scale -->
      <div class="shrink-0 relative">
        <div class="absolute -inset-1 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500"></div>
        <img
          :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`"
          class="w-11 h-11 rounded-xl object-cover bg-void-900 border-2 border-white/5 relative z-10 transition-colors duration-500 group-hover:border-white/15"
        />
      </div>

      <div class="space-y-1.5 flex-1 min-w-0">
        <h3
          class="text-[16px] font-900 text-white leading-tight uppercase tracking-tighter italic line-clamp-2
                 transition-colors duration-300 group-hover:text-primary-400"
          :style="`view-transition-name: video-title-${video.id}`"
        >
          {{ video.title }}
        </h3>
        
        <div class="flex flex-col text-[10px] font-black uppercase tracking-widest text-white/40">
          <div class="flex items-center gap-1.5 group-hover:text-white/70 transition-colors duration-400">
            {{ video.profiles?.display_name }}
            <div class="i-ph-seal-check-fill text-primary-500 text-[13px]"></div>
          </div>
          <div class="flex items-center gap-3 mt-0.5 opacity-60">
            <ClientOnly>
              <span>{{ useTimeAgo(video.created_at || '').value }}</span>
              <template #fallback><span>...</span></template>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
