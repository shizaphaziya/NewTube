<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { isAdmin } = useProfile()

const navItems = computed(() => [
  { icon: 'i-ph-house', activeIcon: 'i-ph-house-fill', label: t('nav.home'),          link: '/' },
  { icon: 'i-ph-tiktok-logo', activeIcon: 'i-ph-tiktok-logo-fill', label: t('nav.shorts'), link: '/shorts' },
  { icon: 'i-ph-fire', activeIcon: 'i-ph-fire-fill', label: t('home.trending'),     link: '/?feed=trending' },
  { icon: 'i-ph-users-three', activeIcon: 'i-ph-users-three-fill', label: t('home.subscriptions'), link: '/subscriptions' },
  { icon: 'i-ph-lightning', activeIcon: 'i-ph-lightning-fill', label: t('home.latest'),       link: '/?feed=latest' },
])

const studioItems = computed(() => [
  { icon: 'i-ph-video-camera', activeIcon: 'i-ph-video-camera-fill', label: t('nav.studio'),      link: '/studio' },
  { icon: 'i-ph-upload-simple', activeIcon: 'i-ph-upload-simple-fill', label: t('nav.upload'),      link: '/studio/upload' },
])

const isActive = (path: string, query?: string) => {
  if (query) {
    const parts = query.split('=')
    if (parts.length < 2) return route.path === path
    const [key, val] = parts
    return route.path === path && route.query[key as string] === val
  }
  return route.path === path
}
</script>

<template>
  <aside 
    class="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col py-6
           bg-void border-r border-white/5
           w-[80px] lg:w-[240px] transition-all duration-300
           overflow-hidden select-none"
  >
    <!-- Brand Logo -->
    <NuxtLink to="/" class="flex items-center px-6 mb-8 no-underline h-10 group/logo">
      <div class="flex items-center gap-4 w-full">
        <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
          <div class="i-ph-play-fill text-black text-sm translate-x-px"></div>
        </div>
        <div class="hidden lg:block overflow-hidden whitespace-nowrap">
          <span class="text-xl font-brand font-bold tracking-tight text-white">NewTube</span>
        </div>
      </div>
    </NuxtLink>

    <!-- Main Navigation -->
    <nav class="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-none">
      <template v-for="item in navItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="flex items-center gap-4 px-3 py-2.5 rounded-lg no-underline transition-colors"
          :class="isActive(item.link) ? 'bg-[#27272a] text-white' : 'text-white/60 hover:bg-[#18181b] hover:text-white'"
        >
          <div :class="[isActive(item.link) ? item.activeIcon : item.icon]" class="text-2xl shrink-0"></div>
          <span class="hidden lg:block text-sm font-medium whitespace-nowrap">
            {{ item.label }}
          </span>
        </NuxtLink>
      </template>

      <div class="h-px bg-white/10 my-4 mx-3"></div>
      
      <template v-for="item in studioItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="flex items-center gap-4 px-3 py-2.5 rounded-lg no-underline transition-colors"
          :class="isActive(item.link) ? 'bg-[#27272a] text-white' : 'text-white/60 hover:bg-[#18181b] hover:text-white'"
        >
          <div :class="[isActive(item.link) ? item.activeIcon : item.icon]" class="text-2xl shrink-0"></div>
          <span class="hidden lg:block text-sm font-medium whitespace-nowrap">
            {{ item.label }}
          </span>
        </NuxtLink>
      </template>

      <!-- Admin -->
      <template v-if="isAdmin">
        <div class="h-px bg-red-500/10 my-4 mx-3"></div>
        <NuxtLink to="/admin" class="flex items-center gap-4 px-3 py-2.5 rounded-lg no-underline transition-colors text-red-400/60 hover:bg-red-500/10 hover:text-red-400">
          <div class="i-ph-shield-checkered text-2xl shrink-0"></div>
          <span class="hidden lg:block text-sm font-medium whitespace-nowrap">
            {{ t('admin.high_command') || 'Admin' }}
          </span>
        </NuxtLink>
      </template>
    </nav>

    <!-- Bottom Actions -->
    <div class="px-3 mt-auto">
      <NuxtLink 
        to="/profile/settings"
        class="flex items-center gap-4 px-3 py-2.5 rounded-lg no-underline transition-colors"
        :class="isActive('/profile/settings') ? 'bg-[#27272a] text-white' : 'text-white/60 hover:bg-[#18181b] hover:text-white'"
      >
        <div class="i-ph-gear-six text-2xl shrink-0"></div>
        <span class="hidden lg:block text-sm font-medium whitespace-nowrap">
          {{ t('profile.settings') }}
        </span>
      </NuxtLink>
    </div>
  </aside>
</template>
