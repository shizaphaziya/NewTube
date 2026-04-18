<script setup lang="ts">
const { isAdmin, fetchProfile } = useProfile()
onMounted(() => fetchProfile())
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div class="flex-1 flex flex-col min-w-0 pl-0 md:pl-[72px] transition-[padding-left] duration-500">
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 h-[72px] flex items-center gap-6 px-8
                     bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <label class="relative flex items-center group">
            <div class="absolute left-4 i-ph-magnifying-glass-bold text-white/20 text-sm pointer-events-none
                        transition-colors duration-200 group-focus-within:text-white/40"></div>
            <input
              type="search"
              :placeholder="$t('nav.search') || 'Search...'"
              class="w-full bg-white/[0.04] border border-white/[0.07]
                     rounded-xl pl-10 pr-4 py-2.5
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

      <!-- Footer -->
      <footer class="h-16 border-t border-white/[0.04] flex items-center justify-between px-8">
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
