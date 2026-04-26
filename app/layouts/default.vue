<script setup lang="ts">
const { isAdmin } = useProfile()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/results?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-void-950 text-void-100 font-sans flex relative overflow-hidden selection:(bg-primary-500/30 text-white)">
    
    <!-- Background Depth -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-900/10 blur-[120px] animate-glow"></div>
      <div class="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-900/10 blur-[100px] animate-glow" style="animation-delay: -1s"></div>
      <div class="absolute -bottom-[10%] left-[20%] w-[25%] h-[25%] rounded-full bg-primary-800/10 blur-[80px] animate-glow" style="animation-delay: -2s"></div>
    </div>

    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div class="flex-1 flex flex-col min-w-0 md:pl-[88px] transition-all duration-500 pb-20 md:pb-0 relative z-10">

      <!-- Top Bar -->
      <div class="sticky top-0 z-40 px-4 py-4 md:px-10">
        <header class="h-16 flex items-center gap-6 px-6 md:px-8 rounded-2xl bg-void-900/40 backdrop-blur-2xl border border-white/10 pointer-events-auto transition-all duration-500 hover:(bg-void-900/60 border-white/20) relative overflow-hidden group shadow-2xl">
          
          <!-- Animated Accent -->
          <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

          <!-- Mobile Logo -->
          <NuxtLink to="/" class="md:hidden flex items-center shrink-0 pr-4 mr-2 border-r border-white/10 group/logo">
            <div class="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg group-hover/logo:scale-110 transition-transform">
              <div class="i-ph-play-fill text-white text-base translate-x-px"></div>
            </div>
          </NuxtLink>

          <!-- Search -->
          <div class="flex-1 max-w-2xl mx-auto md:ml-0">
            <form @submit.prevent="handleSearch" class="relative flex items-center group w-full">
              <div class="absolute left-4 i-ph-magnifying-glass text-void-500 text-xl pointer-events-none transition-all group-focus-within:(text-primary-500 scale-110) group-hover:text-void-300"></div>
              <input
                v-model="searchQuery"
                type="search"
                :placeholder="$t('nav.search') || 'Search the future of video...'"
                class="glass-input w-full pl-12 pr-4 h-11 transition-all"
              />
              <div class="absolute right-4 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-void-500 group-focus-within:opacity-0 transition-opacity">
                <span>⌘</span><span>K</span>
              </div>
            </form>
          </div>

          <!-- Right controls -->
          <div class="flex items-center gap-4 ml-auto shrink-0">
            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="w-10 h-10 rounded-xl flex items-center justify-center bg-void-800/40 border border-white/10 hover:(bg-primary-500/10 border-primary-500/50 text-primary-400) text-void-400 transition-all duration-300 no-underline shadow-lg"
              title="Admin"
            >
              <div class="i-ph-shield-checkered text-2xl"></div>
            </NuxtLink>

            <div class="hidden md:block w-[1px] h-6 bg-white/10 mx-1"></div>
            <UserAuthBtn />
          </div>
        </header>
      </div>

      <!-- Page -->
      <main class="flex-1 w-full max-w-[1920px] mx-auto px-4 md:px-10 py-6">
        <slot />
      </main>

      <MiniPlayer />
      <ConfirmModal />

      <!-- Mobile Navigation -->
      <nav class="flex md:hidden fixed bottom-6 left-6 right-6 h-16 rounded-2xl bg-void-900/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 items-center justify-around px-4">
        <NuxtLink to="/" class="flex flex-col items-center justify-center w-14 h-full text-void-400 hover:text-primary-500 active:scale-90 transition-all" active-class="text-primary-500">
          <div class="i-ph-house text-2xl"></div>
          <span class="text-[9px] font-bold mt-1 uppercase tracking-tighter">{{ $t('nav.home') }}</span>
        </NuxtLink>
        <NuxtLink to="/shorts" class="flex flex-col items-center justify-center w-14 h-full text-void-400 hover:text-primary-500 active:scale-90 transition-all" active-class="text-primary-500">
          <div class="i-ph-tiktok-logo text-2xl"></div>
          <span class="text-[9px] font-bold mt-1 uppercase tracking-tighter">Shorts</span>
        </NuxtLink>
        <NuxtLink to="/studio" class="flex flex-col items-center justify-center w-14 h-full text-void-400 hover:text-primary-500 active:scale-90 transition-all" active-class="text-primary-500">
          <div class="i-ph-plus-circle-fill text-3xl text-primary-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
        </NuxtLink>
        <NuxtLink to="/subscriptions" class="flex flex-col items-center justify-center w-14 h-full text-void-400 hover:text-primary-500 active:scale-90 transition-all" active-class="text-primary-500">
          <div class="i-ph-users-three text-2xl"></div>
          <span class="text-[9px] font-bold mt-1 uppercase tracking-tighter">Subs</span>
        </NuxtLink>
        <NuxtLink to="/profile/settings" class="flex flex-col items-center justify-center w-14 h-full text-void-400 hover:text-primary-500 active:scale-90 transition-all" active-class="text-primary-500">
          <div class="i-ph-user-circle text-2xl"></div>
          <span class="text-[9px] font-bold mt-1 uppercase tracking-tighter">You</span>
        </NuxtLink>
      </nav>

    </div>
  </div>
</template>
