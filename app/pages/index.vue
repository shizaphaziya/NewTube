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
    <main class="flex-1 py-8 relative">

      <!-- Subtle background glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <!-- Category Swiper -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 50, ease: [0.16, 1, 0.3, 1] } }"
        class="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-none px-2 mask-linear-x"
      >
        <button 
          v-for="cat in categories"
          :key="cat.key"
          class="relative overflow-hidden px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 whitespace-nowrap active:scale-95"
          :class="[
            cat.key === 'all'
              ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              : 'bg-neutral-900/40 backdrop-blur-sm border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Global Infinite Feed -->
      <div class="pb-24">
        <div
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 600, delay: 100, ease: [0.16, 1, 0.3, 1] } }"
          class="flex items-center gap-4 mb-8 px-2"
        >
          <h2 class="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
            {{ t('home.latest') }}
            <div class="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"></div>
          </h2>
        </div>
        <InfiniteVideoGrid />
      </div>
    </main>
  </div>
</template>

<style scoped>
.mask-linear-x {
  mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
}
</style>
