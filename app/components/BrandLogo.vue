<script setup>
defineProps({
  minimal: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="flex items-center gap-3 transition-all duration-700 group">
    <!-- Geometric icon mark -->
    <div class="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
      <div class="absolute inset-0 bg-white rounded-xl transition-all duration-700 group-hover:rounded-2xl group-hover:scale-105 group-active:scale-95"></div>
      <div class="i-ph-play-fill text-black text-xl relative z-10 transition-transform duration-700 group-hover:scale-110"></div>
      <!-- Subtle Glow -->
      <div class="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    </div>

    <!-- Wordmark — hidden when `minimal` -->
    <div v-if="!minimal" class="flex flex-col">
      <span class="text-xl font-brand font-black tracking-[0.2em] text-white leading-none italic">
        NEWTUBE
      </span>
      <span class="text-[7px] font-bold tracking-[0.6em] text-white/20 uppercase mt-1 transition-all duration-700 group-hover:text-white/40 group-hover:tracking-[0.8em]">
        Elite Architecture
      </span>
    </div>
  </div>
</template>
