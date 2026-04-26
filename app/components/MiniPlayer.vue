<script setup lang="ts">
import { useAppStore } from '~/store/app'

const appStore = useAppStore()

const close = () => {
  appStore.clearPipVideo()
}
</script>

<template>
  <div
    v-if="appStore.activePipVideo"
    class="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-[100] w-72 bg-black rounded-md border border-white/10 shadow-md overflow-hidden flex flex-col pointer-events-auto"
    v-motion
    :initial="{ opacity: 0, y: 50, scale: 0.9 }"
    :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 300, ease: 'easeOut' } }"
  >
    <div class="relative aspect-video bg-stone-900 group">
      <video
        :src="appStore.activePipVideo.url"
        class="w-full h-full object-cover"
        autoplay
        muted
        controls
      ></video>
      <button
        @click="close"
        class="absolute top-2 right-2 w-8 h-8 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div class="i-ph-x-bold text-xs"></div>
      </button>
      <NuxtLink
        :to="`/watch/${appStore.activePipVideo.id}`"
        class="absolute top-2 left-2 w-8 h-8 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div class="i-ph-arrows-out-bold text-xs"></div>
      </NuxtLink>
    </div>
    <div class="p-3 bg-white/[0.02]">
      <h4 class="text-xs font-bold text-white truncate">{{ appStore.activePipVideo.title }}</h4>
    </div>
  </div>
</template>
