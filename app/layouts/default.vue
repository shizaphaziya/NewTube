<script setup lang="ts">
import { useAppStore } from "~/store/app";
const appStore = useAppStore();
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

// Scroll Detection
const y = ref(0);
if (import.meta.client) {
  window.addEventListener("scroll", () => {
    y.value = window.scrollY;
  }, { passive: true });
}

const isScrolled = computed(() => y.value > 20);

// Scroll Progress
const scrollProgress = ref(0);
if (import.meta.client) {
  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.value = (winScroll / height) * 100;
  }, { passive: true });
}

// Magnetic Effects
const logoRef = ref(null);
const uploadRef = ref(null);
useMagnetic(logoRef, 30);
useMagnetic(uploadRef, 30);
</script>

<template>
  <div
    class="min-h-screen bg-theme-bg text-theme-text font-sans flex relative overflow-hidden selection:bg-primary-500/10 selection:text-primary-500"
  >
    <!-- Background Depth -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-500/[0.03] dark:bg-primary-500/[0.05] blur-[120px] animate-ambient"
        style="animation-duration: 25s"
      ></div>
      <div
        class="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] blur-[100px] animate-ambient"
        style="animation-delay: -5s; animation-duration: 30s"
      ></div>
    </div>

    <!-- Scroll Progress Indicator -->
    <div 
      class="fixed top-0 left-0 h-[2px] bg-primary-500 z-[100] transition-all duration-150 ease-out"
      :style="{ width: `${scrollProgress}%` }"
    ></div>

    <!-- Sidebar -->
    <Sidebar />

    <!-- Right side: topbar + main content -->
    <div
      class="flex-1 flex flex-col min-w-0 transition-all duration-700 pb-20 md:pb-0 relative z-10"
      :class="appStore.isSidebarOpen ? 'md:pl-[240px]' : 'md:pl-[88px]'"
    >
      <!-- Top Bar -->
      <div 
        class="sticky top-0 z-40 transition-all duration-500 px-4 md:px-8"
        :class="isScrolled ? 'py-2' : 'py-4 md:py-6'"
      >
        <header
          class="h-16 flex items-center gap-6 px-4 md:px-6 rounded-2xl transition-all duration-500 relative group press-effect"
          :class="[
            isScrolled 
              ? 'glass-surface shadow-xl border border-theme-border/30 backdrop-blur-3xl' 
              : 'bg-transparent border-none'
          ]"
        >
          <!-- Logo & Brand (Acting as Sidebar Toggle) -->
          <Button
            ref="logoRef"
            variant="ghost"
            @click="appStore.toggleSidebar()"
            class="flex items-center gap-3 shrink-0 no-underline group/logo outline-none focus:outline-none hover:bg-transparent px-0"
          >
            <div
              class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-[10deg]"
              :class="appStore.isSidebarOpen ? 'rotate-[360deg]' : ''"
            >
              <Icon
                name="ph:play-fill"
                class="text-primary-foreground text-lg translate-x-px"
              />
            </div>
            <span
              class="hidden lg:block text-xl font-display font-900 tracking-tight text-foreground"
            >
              New<span class="text-primary">Tube</span>
            </span>
          </Button>

          <Separator orientation="vertical" class="hidden xl:block h-6 bg-border/50 mx-2" />

          <!-- Search -->
          <div class="flex-1 max-w-xl mx-auto">
            <form
              @submit.prevent="handleSearch"
              class="relative flex items-center group w-full"
            >
              <Icon
                name="ph:magnifying-glass"
                class="absolute left-4 text-muted-foreground text-lg pointer-events-none transition-all group-focus-within:text-primary group-focus-within:scale-110 z-10"
              />
              <Input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('nav.search')"
                class="w-full h-11 pl-11 pr-11 rounded-xl text-sm font-500 border-border/40 bg-theme-surface-raised/30 backdrop-blur-md transition-all duration-500 focus-visible:ring-primary/20 placeholder:text-muted-foreground/60"
              />
              <div
                class="absolute right-4 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background/50 text-[9px] font-700 text-muted-foreground group-focus-within:opacity-0 transition-opacity"
              >
                <span>⌘</span><span>K</span>
              </div>
            </form>
          </div>

          <!-- Right controls -->
          <div class="flex items-center gap-3 ml-auto">
            <!-- Theme Switcher -->
            <Button
              variant="outline"
              size="icon"
              @click="toggleDark()"
              class="w-10 h-10 rounded-xl bg-theme-surface-raised/50 border-border/50 hover:border-primary/30 hover:text-primary transition-all duration-300 press-effect"
            >
              <Icon
                :name="isDark ? 'ph:moon-stars-duotone' : 'ph:sun-dim-duotone'"
                class="text-xl"
              />
            </Button>

            <Button
              v-if="isAdmin"
              variant="outline"
              size="icon"
              as-child
              class="w-10 h-10 rounded-xl bg-theme-surface-raised/50 border-border/50 hover:border-primary/30 hover:text-primary transition-all duration-300 press-effect"
            >
              <NuxtLink to="/admin">
                <Icon name="ph:shield-checkered-duotone" class="text-xl" />
              </NuxtLink>
            </Button>

            <!-- Upload Button (Desktop) -->
            <Button
              ref="uploadRef"
              as-child
              class="hidden md:flex h-10 px-4 rounded-xl items-center gap-2 bg-primary text-primary-foreground font-700 text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all press-effect"
            >
              <NuxtLink to="/studio">
                <Icon name="ph:plus-bold" class="text-lg" />
                <span>{{ $t("nav.upload") }}</span>
              </NuxtLink>
            </Button>

            <Separator orientation="vertical" class="h-6 bg-border/50 mx-1" />
            <UserAuthBtn />
          </div>
        </header>
      </div>

      <!-- Page -->
      <main class="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8 py-4">
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
        <Button
          variant="ghost"
          as-child
          class="group flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl hover:bg-theme-border/50 transition-all press-effect"
        >
          <NuxtLink to="/">
            <Icon
              name="ph:house-duotone"
              class="text-2xl text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all"
            />
            <span
              class="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
              >{{ $t("nav.home") }}</span
            >
          </NuxtLink>
        </Button>
        <Button
          variant="ghost"
          as-child
          class="group flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl hover:bg-theme-border/50 transition-all press-effect"
        >
          <NuxtLink to="/?feed=trending">
            <Icon
              name="ph:fire-duotone"
              class="text-2xl text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all"
            />
            <span
              class="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
              >{{ $t("home.trending") }}</span
            >
          </NuxtLink>
        </Button>
        <Button
          variant="ghost"
          as-child
          class="flex flex-col items-center justify-center w-14 h-14 relative group press-effect p-0 rounded-full"
        >
          <NuxtLink to="/studio">
            <div
              class="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <Icon
              name="ph:plus-circle-fill"
              class="text-4xl text-primary drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform relative z-10"
            />
          </NuxtLink>
        </Button>
        <Button
          variant="ghost"
          as-child
          class="group flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl hover:bg-theme-border/50 transition-all press-effect"
        >
          <NuxtLink to="/subscriptions">
            <Icon
              name="ph:stack-duotone"
              class="text-2xl text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all"
            />
            <span
              class="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
              >{{ $t("nav.subscriptions") }}</span
            >
          </NuxtLink>
        </Button>
        <Button
          variant="ghost"
          as-child
          class="group flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl hover:bg-theme-border/50 transition-all press-effect"
        >
          <NuxtLink to="/profile/settings">
            <Icon
              name="ph:user-circle-duotone"
              class="text-2xl text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all"
            />
            <span
              class="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
              >{{ $t("nav.you") }}</span
            >
          </NuxtLink>
        </Button>
      </nav>v>
    </div>
  </div>
</template>
