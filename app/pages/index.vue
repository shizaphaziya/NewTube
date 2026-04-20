<script setup>
const { t } = useI18n()

const feeds = [
  { key: 'trending',      label: t('home.trending'),      icon: 'i-ph-fire-bold' },
  { key: 'latest',        label: t('home.latest'),         icon: 'i-ph-lightning-bold' },
  { key: 'subscriptions', label: t('home.subscriptions'),  icon: 'i-ph-users-four-bold' },
]

const activeFeed = ref('trending')

useSeoMeta({
  title: 'NewTube',
  description: 'Discover the best videos on NewTube, the next-generation video platform.'
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Page header bar -->
    <div class="px-4 md:px-8 pt-4 md:pt-8 pb-4 md:pb-6 flex flex-col md:flex-row md:items-center items-start gap-4 md:gap-6 border-b border-white/[0.04]">
      <!-- Feed tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full">
        <button
          v-for="feed in feeds"
          :key="feed.key"
          @click="activeFeed = feed.key"
          class="flex items-center gap-2 px-4 py-2 rounded-xl font-brand font-bold text-[10px]
                 uppercase tracking-[0.18em] transition-all duration-250 whitespace-nowrap"
          :class="activeFeed === feed.key
            ? 'bg-white text-black'
            : 'text-white/35 hover:text-white/70 hover:bg-white/[0.05]'"
        >
          <div :class="feed.icon" class="text-sm shrink-0"></div>
          <span>{{ feed.label }}</span>
        </button>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Count badge — will be populated when videos load -->
      <div class="hidden md:block text-[9px] font-black tracking-[0.4em] uppercase text-white/10">
        NewTube
      </div>
    </div>

    <!-- Video Grid -->
    <div class="px-2 sm:px-4 md:px-8 py-4 md:py-8">
      <InfiniteVideoGrid />
    </div>
  </div>
</template>
