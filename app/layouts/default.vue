<script setup lang="ts">
const { isAdmin } = useProfile()
</script>

<template>
  <div class="min-h-screen bg-void text-white font-sans flex transition-colors duration-500">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div class="flex-1 flex flex-col min-w-0 pl-0 md:pl-[72px] transition-[padding-left] duration-500 pb-24 md:pb-0">
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 h-[72px] flex items-center gap-4 md:gap-6 px-4 md:px-8
                     bg-void/80 backdrop-blur-2xl border-b border-white/[0.05]">
        <!-- Mobile Logo -->
        <NuxtLink to="/" class="md:hidden flex items-center shrink-0 pr-4 mr-1 border-r border-white/5"><div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center"><div class="i-ph-play-fill text-black text-base translate-x-px"></div></div></NuxtLink>

        <!-- Search -->
        <div class="flex-1 max-w-xl group/search">
          <label class="relative flex items-center">
            <div class="absolute left-4 i-ph-magnifying-glass-bold text-white/10 text-base pointer-events-none
                        transition-all duration-300 group-focus-within/search:text-white/40 group-focus-within/search:scale-110"></div>
            <input
              type="search"
              :placeholder="$t('nav.search') || 'Search...'"
              class="w-full bg-white/[0.03] border border-white/[0.06]
                     rounded-xl pl-12 pr-4 py-2.5
                     text-[13px] font-sans text-white/90 placeholder:text-white/10
                     shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                     focus:outline-none focus:ring-1 focus:ring-white/15 focus:bg-white/[0.05]
                     transition-all duration-300"
            />
          </label>
        </div>

        <!-- Right controls -->
        <div class="flex items-center gap-4 ml-auto">
          <NuxtLink
            v-if="isAdmin"
            to="/admin/videos"
            class="w-10 h-10 rounded-xl flex items-center justify-center
                   bg-white/[0.03] border border-white/[0.06]
                   text-white/20 hover:text-white hover:border-white/20
                   transition-all duration-300 hover:scale-110 active:scale-95"
            title="Admin Dashboard"
          >
            <div class="i-ph-shield-checkered-bold text-lg"></div>
          </NuxtLink>

          <div class="w-px h-6 bg-white/[0.08]"></div>
          <UserAuthBtn />
        </div>
      </header>

      <!-- Page -->
      <main class="flex-1">
        <slot />
      </main>


      <!-- Mobile Navigation -->
      <MobileNavbar />
      <div class="h-16 md:hidden"></div> <!-- Spacer for mobile nav -->

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
