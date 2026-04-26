<script setup>
defineProps({
  minimal: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="flex items-center gap-3 transition-all duration-300 group select-none">
    <!-- Sharp icon mark -->
    <div class="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
      <div class="absolute inset-0 bg-white rounded-sm transition-all duration-300"></div>
      <div class="i-ph-play-fill text-black text-sm relative z-10 translate-x-px"></div>
    </div>

    <!-- Wordmark — hidden when `minimal` -->
    <div v-if="!minimal" class="flex items-baseline gap-1">
      <span class="text-xl font-sans font-bold tracking-tighter text-white">
        NewTube
      </span>
      <span class="text-[9px] font-mono font-medium text-void-500 uppercase">
        v2.0
      </span>
    </div>
  </div>
</template>
