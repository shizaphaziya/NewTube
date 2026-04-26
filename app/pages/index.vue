<script setup lang="ts">
const { t } = useI18n()

const categories = computed(() => [
  { key: 'all', label: t('categories.all') },
  { key: 'music', label: t('categories.music') },
  { key: 'cinema', label: t('categories.cinema') },
  { key: 'gaming', label: t('categories.gaming') },
  { key: 'tech', label: t('categories.tech') },
  { key: 'art', label: t('categories.art') },
  { key: 'nature', label: t('categories.nature') }
])

useSeoMeta({
  title: () => t('seo.title') || 'NewTube - Premium Video Experience',
  description: () => t('seo.description') || 'Discover amazing videos on NewTube.'
})
</script>

<template>
  <div class="min-h-screen relative selection:(bg-primary-500/30 text-white)">
    <!-- Category Filter -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -8 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-none px-4 sticky top-24 z-30 py-4 bg-void-950/80 backdrop-blur-3xl border-b border-white/5"
    >
      <button 
        v-for="cat in categories"
        :key="cat.key"
        class="px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-400 whitespace-nowrap border"
        :class="cat.key === 'all' 
          ? 'bg-primary-500 text-white border-primary-400 shadow-lg shadow-primary-500/20' 
          : 'bg-white/5 text-white/40 border-white/5 hover:(border-white/20 text-white bg-white/10)'"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Video Feed -->
    <section class="pb-32 px-4">
      <div
        v-motion
        :initial="{ opacity: 0, x: -16 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 700, delay: 400 } }"
        class="flex items-center justify-between mb-12 px-2"
      >
        <div class="flex items-center gap-6">
          <div class="h-1.5 w-12 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
          <h2 class="text-4xl font-900 text-white uppercase tracking-tighter italic">
            {{ $t('home.latest') }}
          </h2>
        </div>
        
        <div class="flex items-center gap-3 text-[11px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-primary-500 transition-colors cursor-pointer group">
          <span>{{ $t('home.view_all') }}</span>
          <!-- arrow shift is a directional affordance, not micro-jitter — kept but toned to 1 (4px) -->
          <div class="i-ph-arrow-right text-xl group-hover:translate-x-1 transition-transform duration-300"></div>
        </div>
      </div>
      
      <InfiniteVideoGrid />
    </section>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
