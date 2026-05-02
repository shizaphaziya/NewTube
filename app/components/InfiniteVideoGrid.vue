<script setup>
const supabase = useSupabaseClient();
const videos = ref([]);
const page = ref(0);
const pageSize = 12;
const loading = ref(false);
const hasMore = ref(true);

const loadMoreTrigger = ref(null);

const fetchVideos = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  const from = page.value * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from("videos")
    .select(
      "*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)",
    )
    .eq("status", "published")
    .eq("is_short", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
  } else {
    if (data.length < pageSize) hasMore.value = false;
    videos.value.push(...data);
    page.value++;
  }
  loading.value = false;
};

// Infinite scroll trigger
useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    fetchVideos();
  }
});

// Fresh load
onMounted(() => {
  fetchVideos();
});
</script>

<template>
  <div>
    <TransitionGroup
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12"
      enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0 translate-y-10 scale-[0.97]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-300 ease-in absolute"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-[0.95]"
      move-class="transition-all duration-500"
    >
      <div
        v-for="(video, idx) in videos"
        :key="video.id"
        :style="{ transitionDelay: `${(idx % pageSize) * 55}ms` }"
      >
        <VideoCard :video="video" :index="idx" />
      </div>
    </TransitionGroup>

    <!-- Skeletons while loading first page -->
    <div
      v-if="loading && videos.length === 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12"
    >
      <VideoSkeleton v-for="n in pageSize" :key="n" />
    </div>

    <!-- Scroll Sentinel -->
    <div
      ref="loadMoreTrigger"
      class="h-40 flex flex-col items-center justify-center mt-12 gap-4"
    >
      <div
        v-if="loading && videos.length > 0"
        class="flex flex-col items-center gap-4"
      >
        <div
          class="w-8 h-8 rounded-full border-2 border-theme-border border-t-primary-500 animate-spin"
        ></div>
        <p
          class="text-[11px] font-700 text-theme-text-faint uppercase tracking-widest"
        >
          {{ $t("home.syncing") }}
        </p>
      </div>
      <div
        v-if="!hasMore && videos.length > 0"
        class="flex flex-col items-center gap-6 opacity-40"
      >
        <div
          class="w-16 h-px bg-gradient-to-r from-transparent via-theme-border-strong to-transparent"
        ></div>
        <p
          class="text-theme-text-faint text-[10px] font-800 uppercase tracking-widest"
        >
          {{ $t("home.no_videos") }}
        </p>
      </div>
    </div>

    <div
      v-if="!loading && videos.length === 0"
      class="flex flex-col items-center justify-center py-40 text-center"
    >
      <div class="relative mb-8">
        <Icon
          name="ph:video-camera-slash"
          class="text-7xl text-theme-border-strong"
        />
        <div
          class="absolute -top-4 -right-4 w-12 h-12 bg-primary-500/5 rounded-full blur-xl"
        ></div>
      </div>
      <h2 class="text-3xl font-brand tracking-tighter text-theme-text mb-2">
        {{ $t("home.no_videos") }}
      </h2>
      <p class="text-theme-text-muted text-sm max-w-xs mx-auto">
        {{ $t("home.no_videos_subtitle") }}
      </p>
    </div>
  </div>
</template>
