<script setup lang="ts">
const { t } = useI18n();
const { isAdmin } = useProfile();
const route = useRoute();
const searchQuery = ref("");

const isDark = useDark();
const toggleDark = useToggle(isDark);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/results?q=${encodeURIComponent(searchQuery.value.trim())}`);
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-theme-bg text-theme-text font-sans flex relative overflow-hidden selection:bg-primary-500/30 selection:text-white"
  >
    <!-- Background Depth -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/[0.04] dark:bg-primary-900/[0.08] blur-[120px] animate-ambient"
        style="animation-delay: 0s"
      ></div>
      <div
        class="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-500/[0.04] dark:bg-indigo-900/[0.08] blur-[100px] animate-ambient"
        style="animation-delay: -7s; animation-direction: alternate-reverse"
      ></div>
      <div
        class="absolute -bottom-[10%] left-[20%] w-[25%] h-[25%] rounded-full bg-primary-400/[0.04] dark:bg-primary-800/[0.08] blur-[80px] animate-ambient"
        style="animation-delay: -13s"
      ></div>
    </div>

    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div
      class="flex-1 flex flex-col min-w-0 md:pl-[88px] transition-all duration-500 pb-20 md:pb-0 relative z-10"
    >
      <!-- Top Bar -->
      <div class="sticky top-0 z-40 px-4 py-4 md:px-10">
        <header
          class="h-16 flex items-center gap-6 px-6 md:px-8 rounded-2xl glass-surface pointer-events-auto transition-all duration-500 hover:border-theme-border-strong hover:shadow-2xl relative group"
        >
          <!-- Animated Accent Line (Top) -->
          <div
            class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          ></div>

          <!-- Subtle Glow Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          ></div>

          <!-- Logo & Brand (Desktop/Mobile) -->
          <NuxtLink
            to="/"
            class="flex items-center gap-3 shrink-0 pr-4 mr-2 border-r border-theme-border group/logo no-underline"
          >
            <div
              class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg transition-transform group-hover/logo:rotate-12 group-hover/logo:scale-110"
            >
              <Icon
                name="ph:play-fill"
                class="text-white text-base translate-x-px"
              />
            </div>
            <span
              class="hidden md:block text-xl font-display font-800 tracking-[-0.03em] text-theme-text"
            >
              New<span class="text-primary-500">Tube</span>
            </span>
          </NuxtLink>

          <div
            class="hidden lg:flex items-center gap-3 shrink-0 mr-4 border-l border-theme-border/50 pl-4 h-6"
          >
            <h1
              class="text-lg font-700 text-theme-text-muted capitalize tracking-tight"
            >
              {{
                route.name === "index"
                  ? $t("nav.home")
                  : String(route.name).replace(/-/g, " ")
              }}
            </h1>
          </div>

          <!-- Search -->
          <div class="flex-1 max-w-2xl mx-auto md:ml-0">
            <form
              @submit.prevent="handleSearch"
              class="relative flex items-center group w-full"
            >
              <!-- Animated Border Effect -->
              <div
                class="absolute -inset-[1px] bg-gradient-to-r from-primary-500/0 via-primary-500/30 to-primary-500/0 rounded-[1.25rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"
              ></div>

              <Icon
                name="ph:magnifying-glass"
                class="absolute left-5 text-theme-text-faint text-lg pointer-events-none transition-all group-focus-within:text-primary-500 group-focus-within:scale-110 group-hover:text-theme-text-muted"
              />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('nav.search')"
                class="w-full h-12 py-3 px-14 rounded-[1.25rem] text-[14px] font-500 border border-theme-border/60 bg-theme-surface-raised/40 backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-primary-500/40 focus:bg-theme-surface focus:shadow-[0_0_40px_rgba(239,68,68,0.06]) placeholder:text-theme-text-faint"
                @keyup.enter="handleSearch"
              />
              <div
                class="absolute right-5 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-theme-border bg-theme-surface text-[9px] font-700 tracking-wider text-theme-text-faint/80 group-focus-within:opacity-0 transition-opacity"
              >
                <span>CMD</span><span>K</span>
              </div>
            </form>
          </div>

          <!-- Right controls -->
          <div class="flex items-center gap-4 ml-auto shrink-0">
            <!-- Theme Switcher -->
            <button
              @click="toggleDark()"
              class="w-10 h-10 rounded-xl flex items-center justify-center bg-theme-surface-raised border border-theme-border hover:bg-primary-500/10 hover:border-primary-500/50 hover:text-primary-500 text-theme-text-muted transition-all duration-300 shadow-sm dark:shadow-lg"
              :title="isDark ? $t('nav.theme_light') : $t('nav.theme_dark')"
            >
              <Icon
                :name="isDark ? 'ph:moon-stars-duotone' : 'ph:sun-dim-duotone'"
                class="text-2xl"
              />
            </button>

            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="w-10 h-10 rounded-xl flex items-center justify-center bg-theme-surface-raised border border-theme-border hover:bg-primary-500/10 hover:border-primary-500/50 hover:text-primary-400 text-theme-text-faint transition-all duration-300 no-underline shadow-lg"
              :title="$t('admin.title')"
            >
              <Icon name="ph:shield-checkered" class="text-2xl" />
            </NuxtLink>

            <div class="hidden md:block w-[1px] h-6 bg-theme-border mx-1"></div>
            <UserAuthBtn />
          </div>
        </header>
      </div>

      <!-- Page -->
      <main class="flex-1 w-full max-w-[1920px] mx-auto px-4 md:px-10 py-6">
        <slot />
      </main>

      <!-- Global Footer -->
      <footer
        class="mt-auto py-8 px-4 md:px-10 border-t border-theme-border/50 bg-theme-surface/30"
      >
        <div
          class="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div
            class="flex items-center gap-6 text-[12px] font-600 text-theme-text-faint"
          >
            <NuxtLink
              to="/about"
              class="hover:text-primary-500 transition-colors"
              >{{ $t("footer.about") }}</NuxtLink
            >
            <NuxtLink
              to="/terms"
              class="hover:text-primary-500 transition-colors"
              >{{ $t("footer.terms") }}</NuxtLink
            >
            <NuxtLink
              to="/privacy"
              class="hover:text-primary-500 transition-colors"
              >{{ $t("footer.privacy") }}</NuxtLink
            >
          </div>
          <p
            class="text-[11px] font-800 text-theme-text-muted uppercase tracking-[0.1em]"
          >
            {{ $t("footer.copyright") }}
          </p>
        </div>
      </footer>

      <MiniPlayer />
      <ConfirmModal />

      <!-- Mobile Navigation -->
      <nav
        class="flex md:hidden fixed bottom-6 left-6 right-6 h-16 rounded-2xl glass-panel z-50 items-center justify-around px-4"
      >
        <NuxtLink
          to="/"
          class="group flex flex-col items-center gap-1 py-3 px-4 rounded-xl hover:bg-theme-border/50 transition-all"
        >
          <Icon
            name="ph:house-duotone"
            class="text-2xl text-theme-text-muted group-hover:text-primary-500 group-hover:scale-110 transition-all"
          />
          <span
            class="text-[8px] font-black uppercase tracking-widest text-theme-text-faint group-hover:text-primary-500 transition-colors"
            >{{ $t("nav.home") }}</span
          >
        </NuxtLink>
        <NuxtLink
          to="/?feed=trending"
          class="group flex flex-col items-center gap-1 py-3 px-4 rounded-xl hover:bg-theme-border/50 transition-all"
        >
          <Icon
            name="ph:fire-duotone"
            class="text-2xl text-theme-text-muted group-hover:text-primary-500 group-hover:scale-110 transition-all"
          />
          <span
            class="text-[8px] font-black uppercase tracking-widest text-theme-text-faint group-hover:text-primary-500 transition-colors"
            >{{ $t("home.trending") }}</span
          >
        </NuxtLink>
        <NuxtLink
          to="/studio"
          class="flex flex-col items-center justify-center w-14 h-full relative group"
        >
          <div
            class="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
          <Icon
            name="ph:plus-circle-fill"
            class="text-4xl text-primary-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform"
          />
        </NuxtLink>
        <NuxtLink
          to="/subscriptions"
          class="group flex flex-col items-center gap-1 py-3 px-4 rounded-xl hover:bg-theme-border/50 transition-all"
        >
          <Icon
            name="ph:stack-duotone"
            class="text-2xl text-theme-text-muted group-hover:text-primary-500 group-hover:scale-110 transition-all"
          />
          <span
            class="text-[8px] font-black uppercase tracking-widest text-theme-text-faint group-hover:text-primary-500 transition-colors"
            >{{ $t("nav.subscriptions") }}</span
          >
        </NuxtLink>
        <NuxtLink
          to="/profile/settings"
          class="group flex flex-col items-center gap-1 py-3 px-4 rounded-xl hover:bg-theme-border/50 transition-all"
        >
          <Icon
            name="ph:user-circle-duotone"
            class="text-2xl text-theme-text-muted group-hover:text-primary-500 group-hover:scale-110 transition-all"
          />
          <span
            class="text-[8px] font-black uppercase tracking-widest text-theme-text-faint group-hover:text-primary-500 transition-colors"
            >{{ $t("nav.you") }}</span
          >
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
