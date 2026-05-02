<script setup>
const { t } = useI18n();
const actions = computed(() => [
  {
    icon: "i-ph-rocket-launch-bold",
    label: t("nav.studio"),
    link: "/studio/upload",
  },
  { icon: "i-ph-fire-bold", label: t("home.trending"), link: "/" },
  {
    icon: "i-ph-users-four-bold",
    label: t("home.subscriptions"),
    link: "/subscriptions",
  },
  { icon: "i-ph-books-bold", label: t("home.library"), link: "/" },
]);
</script>

<template>
  <div class="flex items-center justify-center py-12">
    <div
      class="glass-card flex items-center gap-2 p-2 rounded-2xl overflow-hidden group/dock transition-all duration-700 hover:gap-3 bg-muted/30 border border-border/20 backdrop-blur-xl"
    >
      <Button
        v-for="action in actions"
        :key="action.label"
        variant="ghost"
        as-child
        class="flex items-center gap-0 overflow-hidden px-4 py-3 h-auto rounded-xl transition-all duration-500 hover:bg-primary/10 hover:gap-3 group/link"
      >
        <NuxtLink :to="action.link">
          <Icon
            :name="action.icon.replace('i-ph-', 'ph:').replace('-bold', '-fill')"
            class="text-xl text-muted-foreground group-hover/link:text-primary transition-colors"
          />
          <span
            class="max-w-0 opacity-0 group-hover/link:max-w-[120px] group-hover/link:opacity-100 transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap text-foreground"
          >
            {{ action.label }}
          </span>
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
