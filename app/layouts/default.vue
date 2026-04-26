<script setup lang="ts">
const { isAdmin } = useProfile()
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans flex relative overflow-hidden">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div class="flex-1 flex flex-col min-w-0 md:pl-[80px] transition-all duration-500 pb-16 md:pb-0 relative z-10">

      <!-- Floating Top Bar -->
      <div class="sticky top-0 z-40 px-4 py-3 md:px-8 pointer-events-none">
        <header class="h-14 flex items-center gap-4 px-4 md:px-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-500 hover:bg-black/60 hover:border-white/20 relative overflow-hidden">

          <!-- Subtle top highlight -->
          <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

          <!-- Mobile Logo -->
          <NuxtLink to="/" class="md:hidden flex items-center shrink-0 pr-3 mr-1 border-r border-neutral-800">
            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <div class="i-ph-play-fill text-black text-sm translate-x-px"></div>
            </div>
          </NuxtLink>

          <!-- Search -->
          <div class="flex-1 max-w-xl mx-auto md:ml-2">
            <label class="relative flex items-center group w-full">
              <div class="absolute left-3.5 i-ph-magnifying-glass text-neutral-500 text-lg pointer-events-none transition-colors duration-300 group-focus-within:text-white group-hover:text-neutral-300"></div>
              <input
                type="search"
                :placeholder="$t('nav.search') || 'Search...'"
                class="w-full bg-neutral-900/40 border border-transparent rounded-full pl-11 pr-4 py-2 text-white text-sm font-medium placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 focus:bg-neutral-900/80 hover:bg-neutral-900/60 transition-all duration-300 shadow-inner"
              />
            </label>
          </div>

          <!-- Right controls -->
          <div class="flex items-center gap-3 ml-auto shrink-0">
            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all duration-300 no-underline shadow-sm hover:shadow-md"
            >
              <div class="i-ph-shield-checkered text-xl"></div>
            </NuxtLink>

            <div class="hidden md:block w-px h-5 bg-neutral-800 mx-1"></div>
            <UserAuthBtn />
          </div>
        </header>
      </div>

      <!-- Page -->
      <main class="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8">
        <slot />
      </main>

      <MiniPlayer />
      <ConfirmModal />


      <!-- Mobile Navigation -->
      <nav class="flex md:hidden fixed bottom-4 left-4 right-4 h-16 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 items-center justify-around px-2">
        <NuxtLink to="/" class="flex flex-col items-center justify-center w-14 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-house text-2xl mb-0.5"></div>
        </NuxtLink>
        <NuxtLink to="/shorts" class="flex flex-col items-center justify-center w-14 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-tiktok-logo text-2xl mb-0.5"></div>
        </NuxtLink>
        <NuxtLink to="/?feed=trending" class="flex flex-col items-center justify-center w-14 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all hidden sm:flex">
          <div class="i-ph-fire text-2xl mb-0.5"></div>
        </NuxtLink>
        <NuxtLink to="/studio" class="flex flex-col items-center justify-center w-14 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-video-camera text-2xl mb-0.5"></div>
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin" class="flex flex-col items-center justify-center w-14 h-full gap-1 text-neutral-500 hover:text-white active:scale-95 transition-all">
          <div class="i-ph-shield-checkered text-2xl mb-0.5"></div>
        </NuxtLink>
      </nav>

    </div>
  </div>
</template>
