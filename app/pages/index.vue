<script setup>
const { t } = useI18n()

const feeds = computed(() => [
  { key: 'trending',      label: t('home.trending'),      icon: 'i-ph-fire-bold' },
  { key: 'latest',        label: t('home.latest'),         icon: 'i-ph-lightning-bold' },
  { key: 'subscriptions', label: t('home.subscriptions'),  icon: 'i-ph-users-four-bold' },
])


const categories = computed(() => [
  { key: 'all', label: t('categories.all') },
  { key: 'music', label: t('categories.music') },
  { key: 'cinema', label: t('categories.cinema') },
  { key: 'gaming', label: t('categories.gaming') },
  { key: 'tech', label: t('categories.tech') },
  { key: 'art', label: t('categories.art') },
  { key: 'nature', label: t('categories.nature') }
])

const activeFeed = ref('trending')

useSeoMeta({
  title: () => t('seo.title') || 'NewTube - Premium Video Signal',
  description: () => t('seo.description') || 'Curated signals. High fidelity. Zero noise.'
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Main Content -->
    <main class="flex-1 layout-container py-12">
      <!-- Premium Feed Tabs / Category Swiper -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
        class="flex items-center gap-3 mb-16 overflow-x-auto pb-4 scrollbar-none"
      >
        <button 
          v-for="cat in categories"
          :key="cat.key"
          class="px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-bold uppercase tracking-wider
                 transition-all hover:bg-white/10 active:scale-95 whitespace-nowrap"
          :class="{ 'bg-white !text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.15)]': cat.key === 'all' }"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Hero / Feature Header (Optional, but adds WOW) -->
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 1000, ease: 'easeOut' } }"
        class="mb-20 h-[300px] rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-16 flex flex-col justify-center relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>
        <div class="max-w-2xl relative z-10">
          <h1 class="text-5xl font-brand font-black italic tracking-tighter mb-6 text-gradient">DISCOVER THE VOID</h1>
          <p class="text-white/30 text-sm font-bold tracking-widest uppercase leading-loose">Curated signals. High fidelity. Zero noise.</p>
        </div>
      </div>

      <!-- Content will be managed by InfiniteVideoGrid below -->

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Count badge — will be populated when videos load -->
      <div class="hidden md:block text-[9px] font-black tracking-[0.4em] uppercase text-white/10">
        NEWTUBE
      </div>
    </main>

    <!-- Global Infinite Feed -->
    <div class="layout-container pb-24">
      <div class="flex items-center gap-4 mb-12">
        <div class="w-12 h-px bg-white/10"></div>
        <h2 class="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic">{{ t('home.latest') }}</h2>
        <div class="flex-1 h-px bg-white/5"></div>
      </div>
      <InfiniteVideoGrid />
    </div>
  </div>
</template>
