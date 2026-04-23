<script setup lang="ts">
const { isAdmin } = useProfile()
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans flex relative overflow-hidden">
    <!-- Immersive Background Layers -->
    <div class="fixed inset-0 pointer-events-none">

      <!-- Subtle grain noise -->
      <div class="absolute inset-0 opacity-[0.03] contrast-150 brightness-150 pointer-events-none mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>

    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div class="flex-1 flex flex-col min-w-0 md:pl-[100px] transition-[padding-left] duration-1000 pb-20 md:pb-0 relative z-10">
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 h-[88px] flex items-center gap-4 md:gap-12 px-6 md:px-12
                     bg-[#050505]/40 backdrop-blur-2xl border-b border-white/[0.05]">
        <!-- Mobile Logo -->
        <NuxtLink to="/" class="md:hidden flex items-center shrink-0 pr-4 mr-1 border-r border-white/5"><div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center"><div class="i-ph-play-fill text-black text-base translate-x-px"></div></div></NuxtLink>

        <!-- Search -->
        <div class="flex-1 max-w-md">
          <label class="relative flex items-center group">
            <div class="absolute left-4 i-ph-magnifying-glass-bold text-white/20 text-sm pointer-events-none
                        transition-colors duration-200 group-focus-within:text-white/40"></div>
            <input
              type="search"
              :placeholder="$t('nav.search') || 'Search...'"
              class="w-full bg-white/[0.04] border border-white/[0.07]
                     rounded-xl pl-10 pr-2 md:pr-4 py-2 md:py-2.5
                     text-white text-sm font-sans placeholder:text-white/20
                     focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.06]
                     transition-all duration-200"
            />
          </label>
        </div>

        <!-- Right controls -->
        <div class="flex items-center gap-3 ml-auto">
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="w-10 h-10 rounded-xl flex items-center justify-center
                   bg-white/[0.04] border border-white/[0.07]
                   text-white/25 hover:text-white hover:border-white/20
                   transition-all duration-200 no-underline"
          >
            <div class="i-ph-shield-checkered-bold"></div>
          </NuxtLink>

          <div class="w-px h-5 bg-white/[0.08]"></div>
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
      <nav class="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/95 backdrop-blur-xl border-t border-white/[0.05] z-50 items-center justify-around px-2">
        <NuxtLink to="/" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/40 hover:text-white transition-colors">
          <div class="i-ph-house-line-bold text-xl"></div>
          <span class="text-[9px] font-bold uppercase tracking-widest">{{ $t('nav.home') || 'Home' }}</span>
        </NuxtLink>
        <NuxtLink to="/?feed=trending" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/40 hover:text-white transition-colors">
          <div class="i-ph-fire-bold text-xl"></div>
          <span class="text-[9px] font-bold uppercase tracking-widest">{{ $t('home.trending') || 'Trending' }}</span>
        </NuxtLink>
        <NuxtLink to="/studio" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/40 hover:text-white transition-colors">
          <div class="i-ph-circles-four-bold text-xl"></div>
          <span class="text-[9px] font-bold uppercase tracking-widest">{{ $t('nav.studio') || 'Studio' }}</span>
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin" class="flex flex-col items-center justify-center w-16 h-full gap-1 text-white/40 hover:text-white transition-colors">
          <div class="i-ph-shield-checkered-bold text-xl"></div>
          <span class="text-[9px] font-bold uppercase tracking-widest">{{ $t('nav.admin') || 'Admin' }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <footer class="hidden md:flex h-16 border-t border-white/[0.04] items-center justify-between px-8">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
            <div class="i-ph-play-fill text-black text-xs translate-x-px"></div>
          </div>
          <span class="text-[10px] font-brand font-black tracking-[0.3em] uppercase text-white/40">NEWTUBE</span>
        </div>
        <div class="text-[9px] font-black tracking-[0.5em] uppercase text-white/10">
          &copy; {{ new Date().getFullYear() }} • NewTube
        </div>
      </footer>
    </div>
  </div>
</template>
