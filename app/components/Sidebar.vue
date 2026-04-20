<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { isAdmin } = useProfile()

// Correctly mapped i18n keys
const navItems = [
  { icon: 'i-ph-house-line-bold', label: t('nav.home'),          link: '/' },
  { icon: 'i-ph-fire-bold',       label: t('home.trending'),     link: '/?feed=trending' },
  { icon: 'i-ph-users-bold',      label: t('home.subscriptions'),link: '/?feed=subs' },
  { icon: 'i-ph-clock-bold',      label: t('home.library'),      link: '/?feed=history' },
]

const creatorItems = [
  { icon: 'i-ph-circles-four-bold', label: t('nav.studio'), link: '/studio' },
  { icon: 'i-ph-upload-simple-bold',label: t('nav.upload'), link: '/studio/upload' },
]

const adminItems = [
  { icon: 'i-ph-shield-check-bold', label: t('nav.admin'), link: '/admin/videos' },
  { icon: 'i-ph-users-four-bold', label: t('nav.users') || 'Users', link: '/admin/users' },
]



const isActive = (link: string) => {
  const [path, query] = link.split('?')
  // If the link has a query param, check both path + query value
  if (query) {
    const [paramKey, paramVal] = query.split('=')
    return route.path === path && route.query[paramKey] === paramVal
  }
  // Exact root match
  if (path === '/') return route.path === '/'
  // Sub-path match /studio → /studio, /studio/upload
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside
    class="hidden md:flex fixed left-0 top-0 h-screen z-40 flex flex-col overflow-hidden
           bg-[#050505] border-r border-white/[0.05] select-none
           w-[72px] hover:w-60 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
  >
    <!-- Logo -->
    <NuxtLink to="/"
      class="h-[72px] flex items-center gap-0 hover:gap-4 px-[18px]
             border-b border-white/[0.05] shrink-0
             transition-[gap] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
             overflow-hidden no-underline group"
    >
      <!-- Icon mark -->
      <div class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-white transition-transform duration-300 group-hover:scale-95">
        <div class="i-ph-play-fill text-black text-base translate-x-0.5"></div>
      </div>
      <!-- Wordmark -->
      <div class="ml-3 overflow-hidden whitespace-nowrap opacity-0 w-0
                  transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                  [aside:hover_&]:opacity-100 [aside:hover_&]:w-28">
        <div class="text-[13px] font-brand font-black tracking-[0.25em] text-white italic">NEWTUBE</div>

      </div>
    </NuxtLink>

    <!-- Nav -->
    <nav class="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
      <!-- Primary -->
      <template v-for="item in navItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="relative flex items-center h-11 rounded-xl overflow-hidden no-underline
                 transition-colors duration-200 group"
          :class="isActive(item.link)
            ? 'bg-white/[0.12] text-white'
            : 'text-white/45 hover:text-white hover:bg-white/[0.06]'"
        >
          <!-- Active pill -->
          <div v-if="isActive(item.link)"
               class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full"></div>

          <!-- Icon -->
          <div class="w-[72px] flex items-center justify-center shrink-0 [aside:hover_&]:w-11">
            <div :class="item.icon" class="text-[18px]"></div>
          </div>

          <!-- Label -->
          <span class="whitespace-nowrap text-[11px] font-brand font-bold tracking-[0.15em] uppercase
                       opacity-0 w-0 overflow-hidden
                       transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75
                       [aside:hover_&]:opacity-100 [aside:hover_&]:w-auto">
            {{ item.label }}
          </span>
        </NuxtLink>
      </template>

      <!-- Divider + Creator section -->
      <div class="my-3 mx-3 h-px bg-white/[0.05]"></div>

      <!-- Section label -->
      <div class="px-3 mb-1 overflow-hidden whitespace-nowrap
                  h-0 opacity-0
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  [aside:hover_&]:h-6 [aside:hover_&]:opacity-100">
        <span class="text-[9px] font-black tracking-[0.5em] uppercase text-white/15">Creator</span>
      </div>

      <template v-for="item in creatorItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="relative flex items-center h-11 rounded-xl overflow-hidden no-underline
                 transition-colors duration-200 group"
          :class="isActive(item.link)
            ? 'bg-white/10 text-white'
            : 'text-white/30 hover:text-white hover:bg-white/[0.05]'"
        >
          <div v-if="isActive(item.link)"
               class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full"></div>
          <div class="w-[72px] flex items-center justify-center shrink-0 [aside:hover_&]:w-11">
            <div :class="item.icon" class="text-[18px]"></div>
          </div>
          <span class="whitespace-nowrap text-[11px] font-brand font-bold tracking-[0.15em] uppercase
                       opacity-0 w-0 overflow-hidden
                       transition-all duration-500 delay-75
                       [aside:hover_&]:opacity-100 [aside:hover_&]:w-auto">
            {{ item.label }}
          </span>
        </NuxtLink>
      </template>

      <!-- Admin Section -->
      <template v-if="isAdmin">
        <div class="my-3 mx-3 h-px bg-white/[0.05]"></div>
        <div class="px-3 mb-1 overflow-hidden whitespace-nowrap
                    h-0 opacity-0
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    [aside:hover_&]:h-6 [aside:hover_&]:opacity-100">
          <span class="text-[9px] font-black tracking-[0.5em] uppercase text-red-500/30">{{ t('sidebar.system') }}</span>
        </div>
        <template v-for="item in adminItems" :key="item.link">
          <NuxtLink
            :to="item.link"
            class="relative flex items-center h-11 rounded-xl overflow-hidden no-underline
                   transition-colors duration-200 group"
            :class="isActive(item.link)
              ? 'bg-red-500/10 text-red-500'
              : 'text-red-500/20 hover:text-red-400 hover:bg-red-500/[0.05]'"
          >
            <div v-if="isActive(item.link)"
                 class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-r-full"></div>
            <div class="w-[72px] flex items-center justify-center shrink-0 [aside:hover_&]:w-11">
              <div :class="item.icon" class="text-[18px]"></div>
            </div>
            <span class="whitespace-nowrap text-[11px] font-brand font-bold tracking-[0.15em] uppercase
                         opacity-0 w-0 overflow-hidden
                         transition-all duration-500 delay-75
                         [aside:hover_&]:opacity-100 [aside:hover_&]:w-auto">
              {{ item.label }}
            </span>
          </NuxtLink>
        </template>
      </template>
    </nav>

    <!-- Status dot -->
    <div class="shrink-0 h-14 border-t border-white/[0.05] flex items-center px-[22px] gap-0 overflow-hidden">
      <div class="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse shrink-0"></div>
      <div class="ml-4 whitespace-nowrap opacity-0 w-0
                  transition-all duration-500
                  [aside:hover_&]:opacity-100 [aside:hover_&]:w-auto overflow-hidden">
        <div class="text-[8px] font-black tracking-[0.4em] uppercase text-white/15">ONLINE</div>
      </div>
    </div>
  </aside>
</template>
