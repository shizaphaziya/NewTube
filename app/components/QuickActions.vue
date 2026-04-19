<script setup>
const { t } = useI18n()
const actions = [
  { icon: 'i-ph-rocket-launch-bold', label: t('nav.studio'), link: '/studio/upload' },
  { icon: 'i-ph-fire-bold', label: t('home.trending'), link: '/' },
  { icon: 'i-ph-users-four-bold', label: t('home.subscriptions'), link: '/' },
  { icon: 'i-ph-books-bold', label: t('home.library'), link: '/' },
]
</script>

<template>
  <div class="flex items-center justify-center py-6">
    <div class="glass-surface flex items-center gap-1 p-1.5 rounded-xl transition-all duration-700 bg-void-800/20 border border-white/5">
      <NuxtLink 
        v-for="action in actions" 
        :key="action.label"
        :to="action.link"
        class="flex items-center gap-0 overflow-hidden px-4 py-2.5 rounded-lg transition-all duration-500 hover:bg-white/[0.05] hover:gap-3 group/link"
      >
        <div :class="action.icon" class="text-xl text-white/40 group-hover/link:text-white transition-colors"></div>
        <span class="max-w-0 opacity-0 group-hover/link:max-w-[120px] group-hover/link:opacity-100 transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap text-white">
          {{ action.label }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
