<script setup>
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
  title: () => t('seo.title') || 'NewTube - Clean Video Platform',
  description: () => t('seo.description') || 'Discover amazing videos on NewTube.'
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Main Content -->
    <main class="flex-1 layout-container py-8">

      <!-- Category Swiper -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 100 } }"
        class="flex items-center gap-3 mb-10 overflow-x-auto pb-4 scrollbar-none"
      >
        <button 
          v-for="cat in categories"
          :key="cat.key"
          class="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm font-medium text-white/80
                 transition-all hover:bg-white/10 active:scale-95 whitespace-nowrap"
          :class="{ 'bg-white !text-black border-white shadow-md': cat.key === 'all' }"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Global Infinite Feed -->
      <div class="pb-24">
        <div class="flex items-center gap-4 mb-8">
          <h2 class="text-xl font-semibold text-white/90">{{ t('home.latest') }}</h2>
        </div>
        <InfiniteVideoGrid />
      </div>
    </main>
  </div>
</template>
