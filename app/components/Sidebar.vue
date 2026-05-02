<script setup lang="ts">
import { useAppStore } from "~/store/app";
const appStore = useAppStore();
const route = useRoute();

const navItems = [
  {
    icon: "ph:house-duotone",
    activeIcon: "ph:house-fill",
    labelKey: "nav.home",
    link: "/",
  },
  {
    icon: "ph:lightning-duotone",
    activeIcon: "ph:lightning-fill",
    labelKey: "nav.shorts",
    link: "/shorts",
  },
  {
    icon: "ph:fire-duotone",
    activeIcon: "ph:fire-fill",
    labelKey: "home.trending",
    link: "/?feed=trending",
  },
  {
    icon: "ph:stack-duotone",
    activeIcon: "ph:stack-fill",
    labelKey: "nav.subscriptions",
    link: "/subscriptions",
  },
  {
    icon: "ph:clock-counter-clockwise-duotone",
    activeIcon: "ph:clock-counter-clockwise-fill",
    labelKey: "nav.history",
    link: "/?feed=history",
  },
];

const isActive = (path: string) => {
  if (path.includes("?")) {
    const [p, q] = path.split("?");
    const [key, val] = q.split("=");
    return route.path === p && route.query[key] === val;
  }
  return route.path === path;
};
</script>

<template>
  <aside
    class="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col py-8 glass-surface border-r border-border/50 transition-all duration-700 ease-nt-out group/sidebar overflow-hidden select-none"
    :class="appStore.isSidebarOpen ? 'w-[240px]' : 'w-[88px] hover:w-[240px]'"
  >
    <!-- Nav Items -->
    <ScrollArea class="flex-1">
      <nav class="flex flex-col gap-2 px-4">
        <Button
          v-for="(item, idx) in navItems"
          :key="item.link"
          variant="ghost"
          as-child
          class="flex items-center justify-start gap-4 px-4 py-6 rounded-2xl transition-all duration-500 relative group/item no-underline overflow-hidden press-effect h-auto"
          :class="
            isActive(item.link)
              ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary shadow-sm shadow-primary/5'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          "
        >
          <NuxtLink :to="item.link">
            <!-- Active Indicator Line -->
            <div
              v-if="isActive(item.link)"
              class="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            ></div>

            <Icon
              :name="isActive(item.link) ? item.activeIcon : item.icon"
              class="text-2xl shrink-0 transition-transform duration-500 group-hover/item:scale-110 relative z-10"
              :class="isActive(item.link) ? 'text-primary' : 'text-primary/80'"
            />

            <span
              class="transition-all duration-500 whitespace-nowrap font-800 text-[13px] tracking-tight relative z-10"
              :class="[
                appStore.isSidebarOpen 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0'
              ]"
              :style="{ transitionDelay: `${idx * 30}ms` }"
            >
              {{ $t(item.labelKey) }}
            </span>
          </NuxtLink>
        </Button>
      </nav>
    </ScrollArea>

    <div class="mt-auto px-4 flex flex-col gap-2">
      <!-- Settings Link -->
      <Button
        variant="ghost"
        as-child
        class="flex items-center justify-start gap-4 px-4 py-6 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-500 no-underline overflow-hidden press-effect h-auto"
      >
        <NuxtLink to="/profile/settings">
          <Icon
            name="ph:gear-duotone"
            class="text-2xl shrink-0 text-primary/60"
          />
          <span
            class="transition-all duration-500 whitespace-nowrap font-800 text-[13px] tracking-tight"
            :class="[
              appStore.isSidebarOpen 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-4 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0'
            ]"
          >
            {{ $t("nav.settings") }}
          </span>
        </NuxtLink>
      </Button>
    </div>
  </aside>
</template>
