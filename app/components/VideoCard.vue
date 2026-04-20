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
    :initial="{ opacity: 0, y: 30 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 800, ease: [0.16, 1, 0.3, 1], delay: index * 40 } }"
    class="group block no-underline focus:outline-none"
  >
    <!-- Cinematic Thumbnail Container -->
    <div class="relative aspect-video rounded-[2rem] bg-stone-900 overflow-hidden border border-white/5 transition-all duration-700 
                group-hover:(border-white/20 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7),0_0_50px_rgba(255,255,255,0.02)] -translate-y-2 scale-[1.01])">
      
      <!-- Video Thumbnail -->
      <img 
        v-if="video.thumbnail_url"
        :src="video.thumbnail_url" 
        class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        loading="lazy"
        :style="{ viewTransitionName: `video-thumb-${video.id}` }"
      />
      
      <!-- Fallback Frame -->
      <video
        v-else-if="video.video_url"
        :src="video.video_url + '#t=0.5'"
        class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        muted
        preload="metadata"
      ></video>

      <!-- Ultimate Placeholder -->
      <div v-else class="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.01] flex items-center justify-center">
        <div class="i-ph-video-camera-bold text-white/5 text-4xl group-hover:scale-110 transition-transform duration-700"></div>
      </div>

      <!-- Cinema Overlay -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
        <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
          <div class="i-ph-play-fill text-black text-xl translate-x-px"></div>
        </div>
      </div>

      <!-- Badge Overlay -->
      <div class="absolute bottom-5 right-5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black tracking-widest text-white/80 uppercase shadow-2xl">
        {{ video.view_count || 0 }} {{ t('watch.views') }}
      </div>
    </div>

    <!-- Elevated Typography Section -->
    <div class="mt-6 px-1 flex gap-5">
      <!-- Creator Avatar -->
      <div class="shrink-0 mt-1">
        <div class="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 p-0.5 overflow-hidden group-hover:border-white/20 transition-colors">
           <img 
            :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" 
            class="w-full h-full rounded-xl object-cover" 
           />
        </div>
      </div>

      <div class="space-y-2 flex-1 min-w-0">
        <h3 class="text-[17px] font-brand font-black tracking-tight text-white/90 leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-white group-hover:text-gradient">
          {{ video.title }}
        </h3>
        
        <div class="flex flex-col gap-1">
          <div class="text-[10px] font-black tracking-[0.2em] uppercase text-white/20 group-hover:text-white/40 transition-colors">
            {{ video.profiles?.display_name }}
          </div>
          <div class="flex items-center gap-2 text-[9px] font-bold text-white/10 uppercase tracking-[0.3em]">
            <span>{{ useTimeAgo(video.created_at || '').value }}</span>
            <span class="w-1 h-1 rounded-full bg-white/5"></span>
            <span class="text-emerald-500/40">Verified HQ</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* Smooth transitions for all elements */
* {
  transition-property: all;
  transition-duration: 500ms;
}
</style>
