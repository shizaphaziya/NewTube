<script setup lang="ts">
const { isAdmin } = useProfile()
</script>

<template>
  <div class="min-h-screen bg-void text-white font-sans flex relative overflow-hidden">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div class="flex-1 flex flex-col min-w-0 md:pl-[72px] lg:pl-[240px] transition-all duration-300 pb-16 md:pb-0 relative z-10">
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 h-16 flex items-center gap-4 px-4 md:px-8
                     bg-void/80 backdrop-blur-xl border-b border-neutral-900">
        <!-- Mobile Logo -->
        <NuxtLink to="/" class="md:hidden flex items-center shrink-0 pr-3 mr-1 border-r border-neutral-800">
          <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <div class="i-ph-play-fill text-black text-sm translate-x-px"></div>
          </div>
        </NuxtLink>

        <!-- Search -->
        <div class="flex-1 max-w-xl mx-auto md:ml-4">
          <label class="relative flex items-center group w-full">
            <div class="absolute left-3 i-ph-magnifying-glass text-neutral-500 text-lg pointer-events-none
                        transition-colors duration-200 group-focus-within:text-neutral-300"></div>
            <input
              type="search"
              :placeholder="$t('nav.search') || 'Search...'"
              class="w-full bg-transparent border border-neutral-800
                     rounded-md pl-10 pr-4 py-2
                     text-white text-sm font-sans placeholder:text-neutral-600
                     focus:outline-none focus:border-neutral-500 focus:bg-neutral-900/50
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
                   hover:bg-neutral-900 text-neutral-400 hover:text-white
                   transition-all duration-200 no-underline"
          >
            <div class="i-ph-shield-checkered text-xl"></div>
          </NuxtLink>

          <div class="hidden md:block w-px h-5 bg-neutral-800 mx-1"></div>
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
      <nav class="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-void/90 backdrop-blur-xl border-t border-neutral-900 z-50 items-center justify-around px-2">
        <NuxtLink to="/" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-house text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.home') || 'Home' }}</span>
        </NuxtLink>
        <NuxtLink to="/shorts" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-tiktok-logo text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.shorts') || 'Shorts' }}</span>
        </NuxtLink>
        <NuxtLink to="/?feed=trending" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all hidden sm:flex">
          <div class="i-ph-fire text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('home.trending') || 'Trending' }}</span>
        </NuxtLink>
        <NuxtLink to="/studio" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-video-camera text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.studio') || 'Studio' }}</span>
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-shield-checkered text-2xl"></div>
          <span class="text-[10px] font-medium">{{ $t('nav.admin') || 'Admin' }}</span>
        </NuxtLink>
      </nav>

    </div>
  </div>
</template>
