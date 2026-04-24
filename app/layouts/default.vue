<script setup lang="ts">
const { isAdmin } = useProfile()
</script>

<template>
  <div class="min-h-screen bg-void text-white font-sans flex relative overflow-hidden">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div class="flex-1 flex flex-col min-w-0 md:pl-[80px] lg:pl-[240px] transition-all duration-300 pb-16 md:pb-0 relative z-10">
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 h-[72px] flex items-center gap-4 px-4 md:px-8
                     bg-void/80 backdrop-blur-md border-b border-white/5">
        <!-- Mobile Logo -->
        <NuxtLink to="/" class="md:hidden flex items-center shrink-0 pr-3 mr-1 border-r border-white/5">
          <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <div class="i-ph-play-fill text-black text-sm translate-x-px"></div>
          </div>
        </NuxtLink>

        <!-- Search -->
        <div class="flex-1 max-w-xl mx-auto md:ml-4">
          <label class="relative flex items-center group w-full">
            <div class="absolute left-3.5 i-ph-magnifying-glass text-white/40 text-lg pointer-events-none
                        transition-colors duration-200 group-focus-within:text-white/80"></div>
            <input
              type="search"
              :placeholder="$t('nav.search') || 'Search...'"
              class="w-full bg-[#18181b] border border-white/5
                     rounded-full pl-10 pr-4 py-2
                     text-white text-sm font-sans placeholder:text-white/40
                     focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-[#27272a]
                     transition-all duration-200"
            />
          </label>
        </div>

        <!-- Right controls -->
        <div class="flex items-center gap-3 ml-auto shrink-0">
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="w-9 h-9 rounded-full flex items-center justify-center
                   hover:bg-white/10
                   text-white/60 hover:text-white
                   transition-all duration-200 no-underline"
          >
            <div class="i-ph-shield-checkered text-xl"></div>
          </NuxtLink>

          <div class="hidden md:block w-px h-5 bg-white/10 mx-1"></div>
          <UserAuthBtn />
        </div>
      </header>

      <!-- Page -->
      <main class="flex-1">
        <slot />
      </main>

      <MiniPlayer />
      <ConfirmModal />


      <!-- Mobile Navigation -->
      <nav class="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-void/95 backdrop-blur-md border-t border-white/5 z-50 items-center justify-around px-2">
        <NuxtLink to="/" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/50 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-house text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.home') || 'Home' }}</span>
        </NuxtLink>
        <NuxtLink to="/shorts" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/50 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-tiktok-logo text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.shorts') || 'Shorts' }}</span>
        </NuxtLink>
        <NuxtLink to="/?feed=trending" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/50 hover:text-white active:scale-95 transition-all hidden sm:flex">
          <div class="i-ph-fire text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('home.trending') || 'Trending' }}</span>
        </NuxtLink>
        <NuxtLink to="/studio" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/50 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-video-camera text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.studio') || 'Studio' }}</span>
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/50 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-shield-checkered text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.admin') || 'Admin' }}</span>
        </NuxtLink>
      </nav>

    </div>
  </div>
</template>
