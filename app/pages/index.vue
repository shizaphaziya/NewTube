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

const sortOptions = computed(() => [
  { key: 'newest', label: t('home.sort_newest'), icon: 'i-ph-clock' },
  { key: 'popular', label: t('home.sort_popular'), icon: 'i-ph-trend-up' },
  { key: 'alphabetical', label: t('home.sort_alphabetical'), icon: 'i-ph-sort-ascending' }
])

const selectedSort = ref('newest')

useSeoMeta({
  title: () => t('seo.title') || 'NewTube - Premium Video Experience',
  description: () => t('seo.description') || 'Discover amazing videos on NewTube.'
})
</script>

<template>
  <div class="min-h-screen relative selection:(bg-primary-500/30 text-white)">
    <!-- Category & Sort Bar -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      class="flex items-center gap-5 mb-10 overflow-x-auto pb-4 scrollbar-none px-2 sticky top-24 z-30 py-4 glass-surface"
    >
      <!-- Sort Dropdown -->
      <div class="flex items-center shrink-0 relative group/dropdown">
        <div class="flex items-center gap-3 bg-theme-surface border border-theme-border/80 rounded-xl px-5 py-2.5 text-[12px] font-700 text-theme-text-muted transition-all cursor-pointer hover:(border-primary-500/40 text-theme-text shadow-lg shadow-primary-500/5) group-hover/dropdown:(border-primary-500/40 text-theme-text)">
          <div :class="sortOptions.find(o => o.key === selectedSort)?.icon" class="text-xl text-primary-500 transition-transform group-hover/dropdown:scale-110"></div>
          <span class="translate-y-px tracking-tight">{{ sortOptions.find(o => o.key === selectedSort)?.label }}</span>
          <div class="i-ph-caret-down text-sm transition-transform duration-500 group-hover/dropdown:rotate-180 opacity-50"></div>
        </div>

        <!-- Dropdown Menu -->
        <div class="absolute top-full left-0 mt-3 w-64 glass-panel rounded-2xl p-2 opacity-0 invisible -translate-y-2 scale-95 group-hover/dropdown:(opacity-100 visible translate-y-0 scale-100) transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 overflow-hidden shadow-2xl">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent pointer-events-none"></div>
          
          <button 
            v-for="opt in sortOptions" 
            :key="opt.key"
            @click="selectedSort = opt.key"
            class="relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-[12px] font-700 transition-all duration-300 group/item overflow-hidden mb-1 last:mb-0"
            :class="selectedSort === opt.key 
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
              : 'text-theme-text-muted hover:(bg-theme-border/40 text-theme-text)'"
          >
            <div class="flex items-center gap-3">
              <div :class="[opt.icon, selectedSort === opt.key ? 'text-white' : 'text-primary-500']" class="text-xl transition-transform group-hover/item:scale-110"></div>
              <span class="translate-y-px tracking-tight">{{ opt.label }}</span>
            </div>
            
            <div v-if="selectedSort === opt.key" class="i-ph-check-circle-fill text-lg text-white"></div>
            <div v-else class="i-ph-arrow-right text-lg opacity-0 -translate-x-2 group-hover/item:(opacity-100 translate-x-0) transition-all text-primary-500"></div>
          </button>
        </div>
      </div>

      <div class="w-[1px] h-6 bg-theme-border/60 shrink-0 mx-1"></div>

      <!-- Categories -->
      <div class="flex items-center gap-2.5">
        <button 
          v-for="cat in categories"
          :key="cat.key"
          class="px-5 py-2.5 rounded-xl text-[11px] font-800 uppercase tracking-wider transition-all duration-400 whitespace-nowrap border"
          :class="cat.key === 'all' 
            ? 'bg-primary-500 text-white border-primary-400 shadow-lg shadow-primary-500/20' 
            : 'bg-theme-surface border-theme-border/80 text-theme-text-muted hover:(border-primary-500/30 text-theme-text bg-theme-surface-raised)'"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Video Feed -->
    <section class="pb-32 px-4">
      <div
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
        class="flex items-center justify-between mb-10 px-2"
      >
        <div class="flex items-center gap-5">
          <div class="h-8 w-1.5 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
          <h2 class="text-2xl md:text-3xl font-800 text-theme-text tracking-tight uppercase">
            {{ $t('home.latest') }}
          </h2>
        </div>
        
        <div class="flex items-center gap-2.5 text-[11px] font-700 text-theme-text-muted hover:text-primary-500 transition-all cursor-pointer group uppercase tracking-widest">
          <span>{{ $t('home.view_all') }}</span>
          <div class="i-ph-caret-right-bold text-lg group-hover:translate-x-1 transition-transform duration-300 text-primary-500"></div>
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
