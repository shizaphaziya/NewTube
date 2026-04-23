<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { isAdmin } = useProfile()

const navItems = computed(() => [
  { icon: 'i-ph-house-line-bold', label: t('nav.home'),          link: '/' },
  { icon: 'i-ph-fire-bold',       label: t('home.trending'),     link: '/?feed=trending' },
  { icon: 'i-ph-lightning-bold',  label: t('home.latest'),       link: '/?feed=latest' },
])

const studioItems = computed(() => [
  { icon: 'i-ph-circles-four-bold', label: t('nav.studio'),      link: '/studio' },
  { icon: 'i-ph-upload-simple-bold',label: t('nav.upload'),      link: '/studio/upload' },
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
    class="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col py-10
           bg-[#050505]/40 backdrop-blur-3xl border-r border-white/[0.05]
           w-[100px] hover:w-[280px] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
           group/aside overflow-hidden select-none"
  >
    <!-- Brand Logo -->
    <NuxtLink to="/" class="flex flex-col items-center px-6 mb-12 no-underline group/logo h-12">
      <div class="flex items-center gap-4 transition-all duration-500">
        <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover/logo:scale-95 transition-transform">
          <div class="i-ph-play-fill text-black text-xl translate-x-px"></div>
        </div>
        <div class="opacity-0 group-hover/aside:opacity-100 transition-all duration-700 overflow-hidden whitespace-nowrap">
          <span class="text-lg font-brand font-black tracking-[0.2em] italic text-gradient">NEWTUBE</span>
        </div>
      </div>
    </NuxtLink>

    <!-- Main Navigation -->
    <nav class="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-none">
      <template v-for="item in navItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="nav-link group"
          :class="{ 'nav-link-active bg-white/[0.05] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]': isActive(item.link) }"
        >
          <!-- Active Indicator (Glow Bar) -->
          <div 
            v-if="isActive(item.link)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          ></div>
          
          <div class="flex items-center gap-6 w-full ml-4">
            <div :class="[item.icon, isActive(item.link) ? 'text-white' : 'text-white/30']" class="text-2xl transition-transform duration-500 group-hover:scale-110 shrink-0"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover/aside:opacity-100 transition-all duration-700 delay-75"
                  :class="isActive(item.link) ? 'text-white' : 'text-white/20'">
              {{ item.label }}
            </span>
          </div>
        </NuxtLink>
      </template>

      <div class="h-px bg-white/5 my-8 mx-5"></div>

      <!-- Studio Section -->
      <div class="px-5 mb-2 opacity-0 group-hover/aside:opacity-100 transition-opacity duration-500">
        <span class="text-[9px] font-black tracking-[0.4em] uppercase text-white/10 italic">{{ t('sidebar.creator') }}</span>
      </div>
      
      <template v-for="item in studioItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="nav-link group"
          :class="{ 'nav-link-active bg-white/[0.05]': isActive(item.link) }"
        >
          <div v-if="isActive(item.link)"
               class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
          
          <div class="flex items-center gap-6 w-full ml-4">
            <div :class="[item.icon, isActive(item.link) ? 'text-white' : 'text-white/30']" class="text-2xl transition-transform duration-500 group-hover:scale-110 shrink-0"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover/aside:opacity-100 transition-all duration-700 delay-75"
                  :class="isActive(item.link) ? 'text-white' : 'text-white/20'">
              {{ item.label }}
            </span>
          </div>
        </NuxtLink>
      </template>

      <!-- Admin -->
      <template v-if="isAdmin">
        <div class="h-px bg-red-500/10 my-8 mx-5"></div>
        <NuxtLink to="/admin" class="nav-link group/admin">
          <div class="flex items-center gap-6 w-full ml-4">
            <div class="i-ph-shield-checkered-bold text-2xl text-red-500/20 group-hover/admin:text-red-500 transition-colors shrink-0"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover/aside:opacity-100 text-red-500/30 group-hover/admin:text-red-500 transition-all duration-700">
              {{ t('admin.high_command') }}
            </span>
          </div>
        </NuxtLink>
      </template>
    </nav>

    <!-- Bottom Actions -->
    <div class="px-4 mt-auto">
      <NuxtLink 
        to="/profile/settings"
        class="nav-link mb-2 group/settings"
        :class="{ 'bg-white/5': isActive('/profile/settings') }"
      >
          <div class="flex items-center gap-6 w-full ml-4">
            <div class="i-ph-gear-six-bold text-2xl text-white/20 group-hover/settings:rotate-90 group-hover/settings:text-white transition-all duration-700 shrink-0"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover/aside:opacity-100 text-white/20 group-hover/settings:text-white transition-all duration-700">
              {{ t('profile.settings') }}
            </span>
          </div>
      </NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
.nav-link {
  display: flex !important;
  align-items: center !important;
  height: 4rem !important;
  border-radius: 1.5rem !important;
  margin-left: 1.25rem !important;
  margin-right: 1.25rem !important;
  transition-property: all !important;
  transition-duration: 500ms !important;
  position: relative !important;
  overflow: hidden !important;
  cursor: pointer !important;
  text-decoration: none !important;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.03) !important;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);
}

.nav-link-active {
  @apply bg-white/[0.05] border border-white/[0.05];
}
</style>
