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
           bg-transparent border-r border-transparent
           w-[80px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
           hover:bg-black/90 hover:backdrop-blur-xl hover:border-white/10 hover:w-[240px] hover:shadow-[20px_0_40px_rgba(0,0,0,0.5)]
           group/sidebar overflow-hidden select-none"
  >
    <!-- Brand Logo -->
    <NuxtLink to="/" class="flex items-center px-6 mb-8 no-underline h-10 shrink-0">
      <div class="flex items-center gap-4 w-full">
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover/sidebar:rotate-[360deg]">
          <div class="i-ph-play-fill text-black text-sm translate-x-px"></div>
        </div>
        <div class="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100 overflow-hidden whitespace-nowrap">
          <span class="text-xl font-brand font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">NewTube</span>
        </div>
      </div>
    </NuxtLink>

    <!-- Main Navigation -->
    <nav class="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-none pb-4">
      <template v-for="item in navItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="flex items-center gap-4 px-2 py-2.5 rounded-xl no-underline transition-all duration-300 relative overflow-hidden group/item"
          :class="isActive(item.link) ? 'text-white bg-neutral-900/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'"
        >
          <!-- Active state background glow -->
          <div v-if="isActive(item.link)" class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity"></div>

          <div :class="[isActive(item.link) ? item.activeIcon : item.icon]" class="text-2xl shrink-0 transition-transform duration-300 group-hover/item:scale-110 relative z-10"></div>

          <span class="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 text-sm font-medium whitespace-nowrap relative z-10">
            {{ item.label }}
          </span>
        </NuxtLink>
      </template>

      <div class="h-px bg-gradient-to-r from-neutral-800 to-transparent my-4 mx-2"></div>
      
      <template v-for="item in studioItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="flex items-center gap-4 px-2 py-2.5 rounded-xl no-underline transition-all duration-300 group/item"
          :class="isActive(item.link) ? 'text-white bg-neutral-900/80' : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'"
        >
          <div :class="[isActive(item.link) ? item.activeIcon : item.icon]" class="text-2xl shrink-0 transition-transform duration-300 group-hover/item:scale-110"></div>
          <span class="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 text-sm font-medium whitespace-nowrap">
            {{ item.label }}
          </span>
        </NuxtLink>
      </template>

      <!-- Admin -->
      <template v-if="isAdmin">
        <div class="h-px bg-gradient-to-r from-red-900/30 to-transparent my-4 mx-2"></div>
        <NuxtLink to="/admin" class="flex items-center gap-4 px-2 py-2.5 rounded-xl no-underline transition-all duration-300 text-red-400/80 hover:bg-red-950/40 hover:text-red-400 group/item">
          <div class="i-ph-shield-checkered text-2xl shrink-0 transition-transform duration-300 group-hover/item:scale-110"></div>
          <span class="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 text-sm font-medium whitespace-nowrap">
            {{ t('admin.high_command') || 'Admin' }}
          </span>
        </NuxtLink>
      </template>
    </nav>

    <!-- Bottom Actions -->
    <div class="px-4 mt-auto">
      <NuxtLink 
        to="/profile/settings"
        class="flex items-center gap-4 px-2 py-2.5 rounded-xl no-underline transition-all duration-300 group/item"
        :class="isActive('/profile/settings') ? 'text-white bg-neutral-900/80' : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'"
      >
        <div class="i-ph-gear-six text-2xl shrink-0 transition-transform duration-300 group-hover/item:rotate-90"></div>
        <span class="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 text-sm font-medium whitespace-nowrap">
          {{ t('profile.settings') }}
        </span>
      </NuxtLink>
    </div>
  </aside>
</template>
