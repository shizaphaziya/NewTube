<script setup lang="ts">
// Video Skeleton
</script>

<template>
  <div class="flex flex-col gap-4 animate-pulse">
    <!-- Thumbnail Skeleton -->
    <div class="relative aspect-video rounded-3xl bg-white/[0.03] overflow-hidden border border-white/5">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-animation"></div>
    </div>
    
    <!-- Meta Skeleton -->
    <div class="flex gap-4 px-1">
      <!-- Avatar -->
      <div class="w-10 h-10 rounded-2xl bg-white/[0.03] shrink-0 overflow-hidden relative border border-white/5">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-animation"></div>
      </div>
      
      <!-- Lines -->
      <div class="flex flex-col gap-2 w-full">
        <div class="h-4 w-3/4 bg-white/[0.05] rounded-lg relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent shimmer-animation"></div>
        </div>
        <div class="h-3 w-1/2 bg-white/[0.02] rounded-lg relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-animation"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shimmer-animation {
  animation: shimmer 2s infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
