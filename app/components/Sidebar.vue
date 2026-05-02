<script setup lang="ts">
const route = useRoute();
const { isAdmin } = useProfile();

const navItems = [
  {
    icon: "i-ph-house",
    activeIcon: "i-ph-house-fill",
    labelKey: "nav.home",
    link: "/",
  },
  {
    icon: "i-ph-tiktok-logo",
    activeIcon: "i-ph-tiktok-logo-fill",
    labelKey: "nav.shorts",
    link: "/shorts",
  },
  {
    icon: "i-ph-fire",
    activeIcon: "i-ph-fire-fill",
    labelKey: "home.trending",
    link: "/?feed=trending",
  },
  {
    icon: "i-ph-users-three",
    activeIcon: "i-ph-users-three-fill",
    labelKey: "home.subscriptions",
    link: "/subscriptions",
  },
  {
    icon: "i-ph-clock-counter-clockwise",
    activeIcon: "i-ph-clock-counter-clockwise-fill",
    labelKey: "nav.history",
    link: "/history",
  },
];

const studioItems = [
  {
    icon: "i-ph-video-camera",
    activeIcon: "i-ph-video-camera-fill",
    labelKey: "nav.studio",
    link: "/studio",
  },
  {
    icon: "i-ph-upload-simple",
    activeIcon: "i-ph-upload-simple-fill",
    labelKey: "nav.upload",
    link: "/studio/upload",
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
    class="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col py-6 glass-surface border-r border-theme-glass-border w-[88px] hover:w-[260px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group/sidebar overflow-hidden select-none"
  >
    <!-- Background Glow for Active State (will be shown via nav-link-active) -->
    <div
      class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover/sidebar:opacity-100 transition-opacity pointer-events-none"
    ></div>
    <!-- Main Navigation -->
    <nav class="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-none pb-4 pt-4">
      <template v-for="item in navItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="nav-link group/item"
          :class="{ 'nav-link-active': isActive(item.link) }"
        >
          <div
            :class="[isActive(item.link) ? item.activeIcon : item.icon]"
            class="text-2xl shrink-0 transition-colors duration-300 group-hover/item:text-primary-500"
          ></div>
          <span
            class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[14px]"
          >
            {{ $t(item.labelKey) }}
          </span>
        </NuxtLink>
      </template>

      <div class="h-px bg-theme-border my-6 mx-3"></div>

      <template v-for="item in studioItems" :key="item.link">
        <NuxtLink
          :to="item.link"
          class="nav-link group/item"
          :class="{ 'nav-link-active': isActive(item.link) }"
        >
          <div
            :class="[isActive(item.link) ? item.activeIcon : item.icon]"
            class="text-2xl shrink-0 transition-colors duration-300 group-hover/item:text-primary-500"
          ></div>
          <span
            class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[14px]"
          >
            {{ $t(item.labelKey) }}
          </span>
        </NuxtLink>
      </template>

      <!-- Admin -->
      <template v-if="isAdmin">
        <div class="h-px bg-theme-border my-6 mx-3"></div>
        <NuxtLink
          to="/admin"
          class="nav-link group/item"
          :class="{ 'nav-link-active': isActive('/admin') }"
        >
          <Icon
            name="ph:shield-checkered"
            class="text-2xl shrink-0 transition-colors duration-300 group-hover/item:text-primary-400"
          />
          <span
            class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[14px]"
          >
            {{ $t("admin.panel") }}
          </span>
        </NuxtLink>
      </template>
    </nav>

    <!-- Bottom Actions & Footer -->
    <div class="px-4 mt-auto space-y-4">
      <NuxtLink
        to="/profile/settings"
        class="nav-link group/item"
        :class="{ 'nav-link-active': isActive('/profile/settings') }"
      >
        <Icon
          name="ph:gear-six"
          class="text-2xl shrink-0 transition-colors duration-300 group-hover/item:text-primary-500"
        />
        <span
          class="opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap font-600 text-[14px]"
        >
          {{ $t("nav.settings") }}
        </span>
      </NuxtLink>
    </div>
  </aside>
</template>
