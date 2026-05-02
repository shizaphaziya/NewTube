<script setup lang="ts">
// Video Skeleton VOID Edition
</script>

<template>
  <div class="flex flex-col gap-4 group">
    <!-- Thumbnail Skeleton -->
    <Skeleton
      class="relative aspect-video rounded-3xl border border-border/20"
    >
      <!-- Duration Badge Placeholder -->
      <div
        class="absolute bottom-3 right-3 w-12 h-5 bg-muted/50 rounded-lg border border-border/20"
      ></div>
    </Skeleton>

    <!-- Info Section Skeleton -->
    <div class="flex gap-3.5 px-0.5 mt-1">
      <!-- Creator Avatar -->
      <Skeleton class="shrink-0 w-10 h-10 rounded-xl border border-border/20" />

      <div class="flex-1 min-w-0 flex flex-col gap-2.5 pt-1">
        <!-- Title Lines -->
        <Skeleton class="h-4 w-[90%] rounded-lg" />
        <Skeleton class="h-4 w-[60%] rounded-lg" />

        <!-- Metadata Lines -->
        <div class="flex flex-col gap-1.5 mt-1.5">
          <Skeleton class="h-3 w-[40%] rounded-md" />
          <Skeleton class="h-3 w-[30%] rounded-md" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles kept minimal as we use global .skeleton class */
</style>

