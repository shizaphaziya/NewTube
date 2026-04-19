<script setup>
const { t } = useI18n()
const route = useRoute()

const navItems = [
  { icon: 'i-ph-house-line-bold', label: t('nav.home'), link: '/' },
  { icon: 'i-ph-fire-bold', label: t('home.trending'), link: '/?feed=trending' },
  { icon: 'i-ph-upload-simple-bold', label: t('nav.upload'), link: '/studio/upload' },
  { icon: 'i-ph-circles-four-bold', label: t('nav.studio'), link: '/studio' },
]

const isActive = (link) => {
  const [path, query] = link.split('?')
  if (query) {
    const [paramKey, paramVal] = query.split('=')
    return route.path === path && route.query[paramKey] === paramVal
  }
  return route.path === path
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/80 backdrop-blur-2xl border-t border-white/5 z-50 flex items-center justify-around px-2">
    <NuxtLink 
      v-for="item in navItems" 
      :key="item.link"
      :to="item.link"
      class="flex flex-col items-center gap-1 transition-all duration-300"
      :class="isActive(item.link) ? 'text-white scale-110' : 'text-white/30'"
    >
      <div :class="item.icon" class="text-xl"></div>
      <span class="text-[8px] font-black uppercase tracking-widest">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>
