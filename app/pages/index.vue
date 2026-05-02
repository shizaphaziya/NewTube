<script setup lang="ts">
const { t } = useI18n();

const categories = computed(() => [
  { key: "all", label: t("categories.all") },
  { key: "music", label: t("categories.music") },
  { key: "cinema", label: t("categories.cinema") },
  { key: "gaming", label: t("categories.gaming") },
  { key: "tech", label: t("categories.tech") },
  { key: "art", label: t("categories.art") },
  { key: "nature", label: t("categories.nature") },
]);

const sortOptions = computed(() => [
  { key: "newest", label: t("home.sort_newest"), icon: "i-ph-clock" },
  { key: "popular", label: t("home.sort_popular"), icon: "i-ph-trend-up" },
  {
    key: "alphabetical",
    label: t("home.sort_alphabetical"),
    icon: "i-ph-sort-ascending",
  },
]);

const selectedSort = ref("newest");

useSeoMeta({
  title: () => t("seo.title") || "NewTube - Premium Video Experience",
  description: () =>
    t("seo.description") || "Discover amazing videos on NewTube.",
});
</script>

<template>
  <div
    class="min-h-screen relative selection:bg-primary-500/10 selection:text-primary-500"
  >
    <!-- Category & Sort Bar -->
    <div
      class="flex items-center gap-4 mb-8 overflow-x-auto pb-4 scrollbar-none sticky top-20 z-30 py-4 bg-background/80 backdrop-blur-md"
    >
      <!-- Sort Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            class="flex items-center gap-3 bg-muted/50 border border-transparent rounded-2xl px-5 h-11 text-[13px] font-800 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground hover:shadow-xl hover:shadow-primary/5 data-[state=open]:border-primary/10"
          >
            <Icon
              :name="sortOptions.find((o) => o.key === selectedSort)?.icon.replace('i-ph-', 'ph:').replace('-bold', '-fill')"
              class="text-xl text-primary transition-transform"
            />
            <span class="tracking-tight">{{
              sortOptions.find((o) => o.key === selectedSort)?.label
            }}</span>
            <Icon
              name="ph:caret-down"
              class="text-sm transition-transform duration-500 opacity-50"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" class="w-64 p-2 rounded-2xl shadow-2xl border-border/20 backdrop-blur-xl bg-background/80">
          <DropdownMenuItem
            v-for="opt in sortOptions"
            :key="opt.key"
            @click="selectedSort = opt.key"
            class="relative flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-600 transition-all duration-300 group/item mb-1 last:mb-0 cursor-pointer"
            :class="
              selectedSort === opt.key
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            "
          >
            <div class="flex items-center gap-3">
              <Icon
                :name="opt.icon.replace('i-ph-', 'ph:').replace('-bold', '-fill')"
                class="text-xl transition-transform group-hover/item:scale-110"
                :class="selectedSort === opt.key ? 'text-primary-foreground' : 'text-primary'"
              />
              <span class="tracking-tight">{{ opt.label }}</span>
            </div>

            <Icon
              name="ph:check-circle-fill"
              class="text-lg text-primary-foreground"
              v-if="selectedSort === opt.key"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" class="h-6 mx-1 bg-border/50" />

      <!-- Categories -->
      <div class="flex items-center gap-2">
        <Button
          v-for="cat in categories"
          :key="cat.key"
          variant="ghost"
          class="px-5 h-11 rounded-2xl text-[12px] font-700 tracking-tight transition-all duration-300 whitespace-nowrap border h-auto py-2.5"
          :class="
            cat.key === 'all'
              ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground'
              : 'bg-muted/50 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border/30'
          "
        >
          {{ cat.label }}
        </Button>
      </div>
    </div>

    <!-- Video Feed -->
    <section class="pb-32">
      <div
        class="flex items-center justify-between mb-8"
      >
        <div class="flex items-center gap-4">
          <div
            class="h-7 w-1.5 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          ></div>
          <h2
            class="text-2xl md:text-3xl font-display font-900 text-theme-text tracking-tight uppercase"
          >
            {{ $t("home.latest") }}
          </h2>
        </div>

        <div
          class="flex items-center gap-2 text-[12px] font-700 text-theme-text-faint hover:text-primary-500 transition-all cursor-pointer group uppercase tracking-widest"
        >
          <span>{{ $t("home.view_all") }}</span>
          <Icon
            name="ph:arrow-right-bold"
            class="text-base group-hover:translate-x-1 transition-transform duration-300"
          />
        </div>
      </div>

      <InfiniteVideoGrid />
    </section>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
