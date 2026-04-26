<script setup lang="ts">
const route = useRoute()
const { isAdmin } = useProfile()

const navItems = [
  { icon: 'i-ph-house',          activeIcon: 'i-ph-house-fill',          labelKey: 'nav.home',             link: '/' },
  { icon: 'i-ph-tiktok-logo',    activeIcon: 'i-ph-tiktok-logo-fill',    labelKey: 'nav.shorts',           link: '/shorts' },
  { icon: 'i-ph-fire',           activeIcon: 'i-ph-fire-fill',           labelKey: 'home.trending',        link: '/?feed=trending' },
  { icon: 'i-ph-users-three',    activeIcon: 'i-ph-users-three-fill',    labelKey: 'home.subscriptions',   link: '/subscriptions' },
  { icon: 'i-ph-lightning',      activeIcon: 'i-ph-lightning-fill',      labelKey: 'home.latest',          link: '/?feed=latest' },
]

const studioItems = [
  { icon: 'i-ph-video-camera',   activeIcon: 'i-ph-video-camera-fill',   labelKey: 'nav.studio',           link: '/studio' },
  { icon: 'i-ph-upload-simple',  activeIcon: 'i-ph-upload-simple-fill',  labelKey: 'nav.upload',           link: '/studio/upload' },
]

const isActive = (path: string) => {
  if (path.includes('?')) {
    const [p, q] = path.split('?')
    const [key, val] = q.split('=')
    return route.path === p && route.query[key] === val
  }
  return route.path === path
}
</script>

<template>
  <aside
    class="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col py-8
           bg-void-950/80 backdrop-blur-2xl border-r border-white/5
           w-[88px] hover:w-[260px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group/sidebar overflow-hidden select-none shadow-2xl"
  >
    <!-- Brand Logo -->
    <NuxtLink to="/" class="flex items-center gap-4 px-7 mb-12 no-underline shrink-0 group/logo">
      <div class="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover/logo:scale-110 transition-transform duration-300">
        <div class="i-ph-play-fill text-white text-xl translate-x-px"></div>
      </div>
      <span class="text-xl font-900 tracking-tighter text-white opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        NEW<span class="text-primary-500">TUBE</span>
      </span>
    </NuxtLink>

    <!-- Main Navigation -->
    <nav class="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-none pb-4">
      <template v-for="item in navItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="nav-link group/item"
          :class="{ 'nav-link-active': isActive(item.link) }"
        >
          <div :class="[isActive(item.link) ? item.activeIcon : item.icon]" class="text-2xl shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:text-primary-400"></div>
          <span class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[15px]">
            {{ $t(item.labelKey) }}
          </span>
        </NuxtLink>
      </template>

      <div class="h-px bg-white/5 my-6 mx-3"></div>

      <template v-for="item in studioItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="nav-link group/item"
          :class="{ 'nav-link-active': isActive(item.link) }"
        >
          <div :class="[isActive(item.link) ? item.activeIcon : item.icon]" class="text-2xl shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:text-primary-400"></div>
          <span class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[15px]">
            {{ $t(item.labelKey) }}
          </span>
        </NuxtLink>
      </template>

      <!-- Admin -->
      <template v-if="isAdmin">
        <div class="h-px bg-white/5 my-6 mx-3"></div>
        <NuxtLink to="/admin" class="nav-link group/item" :class="{ 'nav-link-active': isActive('/admin') }">
          <div class="i-ph-shield-checkered text-2xl shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:text-primary-400"></div>
          <span class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[15px]">
            {{ $t('admin.panel') }}
          </span>
        </NuxtLink>
      </template>
    </nav>

    <!-- Bottom Actions -->
    <div class="px-4 mt-auto">
      <NuxtLink
        to="/profile/settings"
        class="nav-link group/item"
        :class="{ 'nav-link-active': isActive('/profile/settings') }"
      >
        <div class="i-ph-gear-six text-2xl shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:text-primary-400"></div>
        <span class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[15px]">
          {{ $t('nav.settings') }}
        </span>
      </NuxtLink>
    </div>

  </aside>
</template>
