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
    <div class="px-6 md:px-12 pt-6 md:pt-10 pb-5 md:pb-8 flex flex-col md:flex-row md:items-center items-start gap-6 md:gap-10 border-b border-white/[0.04] bg-gradient-to-b from-white/[0.01] to-transparent">
      <!-- Feed tabs -->
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto">
        <button
          v-for="feed in feeds"
          :key="feed.key"
          @click="activeFeed = feed.key"
          class="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-brand font-bold text-[10px]
                 uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap
                 border border-transparent active:scale-95"
          :class="activeFeed === feed.key
            ? 'bg-white text-black shadow-[0_8px_24px_rgba(255,255,255,0.15)] border-white'
            : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04] hover:border-white/5'"
        >
          <div :class="[feed.icon, 'text-[13px] shrink-0 transition-transform duration-300', activeFeed === feed.key ? 'scale-110' : 'group-hover:scale-110']"></div>
          <span>{{ feed.label }}</span>
        </button>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Branding / Status -->
      <div class="hidden md:flex items-center gap-3 text-[9px] font-black tracking-[0.4em] uppercase text-white/10 group cursor-default">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-colors"></div>
        <span>NEWTUBE</span>
      </div>
    </div>

    <!-- Video Grid -->
    <div class="layout-container py-8 md:py-12">
      <InfiniteVideoGrid />
    </div>
  </div>
</template>
