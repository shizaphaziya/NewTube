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

const isHovered = ref(false)
</script>

<template>
  <NuxtLink 
    :to="`/watch/${video.id}`"
    class="group block no-underline focus:outline-none relative"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Thumbnail Container -->
    <div class="relative aspect-video rounded-[1.5rem] bg-void-900 overflow-hidden transition-all duration-700 border border-white/5 group-hover:(border-primary-500/50 shadow-[0_30px_60px_-15px_rgba(239,68,68,0.25)] scale-[1.02])">
      
      <!-- Video Thumbnail -->
      <img 
        v-if="video.thumbnail_url"
        :src="video.thumbnail_url" 
        class="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.33, 1, 0.68, 1) group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Fallback Frame -->
      <video
        v-else-if="video.video_url"
        :src="video.video_url + '#t=0.5'"
        class="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        muted
        preload="metadata"
      ></video>

      <!-- Ultimate Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center bg-void-900">
        <div class="i-ph-broadcast text-void-800 text-5xl animate-pulse"></div>
      </div>

      <!-- Premium Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

      <!-- Play Button Overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-primary-950/10 backdrop-blur-[1px]">
        <div class="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center transform scale-75 rotate-[-10deg] group-hover:(scale-100 rotate-0) transition-all duration-700 shadow-2xl">
          <div class="i-ph-play-fill text-white text-3xl translate-x-0.5"></div>
        </div>
      </div>

      <!-- Progress Bar Simulation -->
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
        <div 
          class="h-full bg-primary-500 transition-all duration-[3000ms] ease-linear"
          :class="isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'"
        ></div>
      </div>

      <!-- Views Badge -->
      <div class="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10 text-[9px] font-black text-white tracking-[0.1em] uppercase flex items-center gap-2 transform group-hover:translate-y-[-2px] transition-transform duration-500 shadow-2xl">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
        {{ (video.view_count || 0).toLocaleString() }} {{ t('watch.views') }}
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-5 flex gap-4 px-1 relative">
      <!-- Creator Avatar -->
      <div class="shrink-0 relative group/avatar">
        <div class="absolute -inset-1 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-60 blur-md transition-all duration-500"></div>
        <img
          :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`"
          class="w-12 h-12 rounded-xl object-cover bg-void-900 border-2 border-white/5 relative z-10 transition-all duration-500 group-hover:(border-white/20 scale-105)"
        />
      </div>

      <div class="space-y-2 flex-1 min-w-0">
        <h3 class="text-[17px] font-900 text-white leading-tight uppercase tracking-tighter italic line-clamp-2 transition-all duration-300 group-hover:text-primary-500">
          {{ video.title }}
        </h3>
        
        <div class="flex flex-col text-[11px] font-black uppercase tracking-widest text-white/40">
          <div class="flex items-center gap-2 group-hover:text-white transition-colors duration-300">
            {{ video.profiles?.display_name }}
            <div class="i-ph-seal-check-fill text-primary-500 text-[14px]"></div>
          </div>
          <div class="flex items-center gap-3 mt-1 opacity-60">
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
