<script setup lang="ts">
// Video Skeleton VOID Edition
</script>

<template>
  <div class="flex flex-col gap-6 animate-pulse group">
    <!-- Thumbnail Skeleton -->
    <div
      class="relative aspect-video rounded-[1.5rem] bg-black/5 dark:bg-void-900 overflow-hidden border border-black/5 dark:border-white/5 shadow-sm dark:shadow-2xl"
    >
      <!-- Shimmer effect -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] cubic-bezier(0.4, 0, 0.2, 1)"
      ></div>
      <!-- Duration Badge Placeholder -->
      <div
        class="absolute bottom-4 right-4 w-12 h-5 bg-black/5 dark:bg-void-800 rounded-lg border border-black/5 dark:border-white/5"
      ></div>
    </div>

    <!-- Meta Skeleton -->
    <div class="flex gap-4 px-1">
      <!-- Avatar -->
      <div
        class="w-12 h-12 rounded-xl bg-black/5 dark:bg-void-900 shrink-0 border border-black/5 dark:border-white/5 relative overflow-hidden shadow-sm dark:shadow-xl"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2.5s_infinite_0.1s]"
        ></div>
      </div>

      <!-- Lines -->
      <div class="flex flex-col gap-3 w-full mt-1.5">
        <div
          class="h-5 w-5/6 bg-black/5 dark:bg-void-900 rounded-lg relative overflow-hidden border border-black/5 dark:border-white/5"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2.5s_infinite_0.2s]"
          ></div>
        </div>
        <div
          class="h-3 w-1/3 bg-black/5 dark:bg-void-900 rounded-md relative overflow-hidden border border-black/5 dark:border-white/5"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2.5s_infinite_0.3s]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
