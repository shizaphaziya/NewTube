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
    :initial="{ opacity: 0, y: 10 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: index * 30 } }"
    class="group block no-underline focus:outline-none"
  >
    <!-- Cinematic Thumbnail Container -->
    <div class="relative aspect-video rounded-xl bg-[#18181b] overflow-hidden border border-white/5 transition-all duration-300
                group-hover:border-white/10 group-hover:shadow-lg">
      
      <!-- Video Thumbnail -->
      <img 
        v-if="video.thumbnail_url"
        :src="video.thumbnail_url" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"

      />
      
      <!-- Fallback Frame -->
      <video
        v-else-if="video.video_url"
        :src="video.video_url + '#t=0.5'"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        muted
        preload="metadata"
      ></video>

      <!-- Ultimate Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center bg-[#27272a]">
        <div class="i-ph-video-camera text-white/20 text-4xl"></div>
      </div>

      <!-- Badge Overlay -->
      <div class="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 backdrop-blur-sm text-xs font-medium text-white shadow-sm">
        {{ video.view_count || 0 }} {{ t('watch.views') }}
      </div>
    </div>

    <!-- Elevated Typography Section -->
    <div class="mt-3 flex gap-3">
      <!-- Creator Avatar -->
      <div class="shrink-0 mt-0.5">
        <img
          :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`"
          class="w-9 h-9 rounded-full object-cover border border-white/5 bg-[#18181b]"
        />
      </div>

      <div class="space-y-1 flex-1 min-w-0">
        <h3 class="text-base font-semibold text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {{ video.title }}
        </h3>
        
        <div class="flex flex-col text-sm text-white/60">
          <div class="group-hover:text-white/80 transition-colors">
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
