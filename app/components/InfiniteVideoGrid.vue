<script setup>
import { gsap } from "gsap";

const supabase = useSupabaseClient();
const videos = ref([]);
const page = ref(0);
const pageSize = 12;
const loading = ref(false);
const hasMore = ref(true);

const loadMoreTrigger = ref(null);
const gridContainer = ref(null);

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
    
    const newVideos = data;
    const startIndex = videos.value.length;
    videos.value.push(...newVideos);
    page.value++;

    // Animate new items
    nextTick(() => {
      const items = gridContainer.value?.querySelectorAll(".video-item");
      if (items) {
        const itemsToAnimate = Array.from(items).slice(startIndex);
        gsap.fromTo(
          itemsToAnimate,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "expo.out",
            onComplete: (self) => {
              // Remove the opacity-0 class to prevent disappearing after clearProps
              gsap.set(itemsToAnimate, { clearProps: "all" });
              itemsToAnimate.forEach(el => el.classList.remove('opacity-0'));
            }
          }
        );
      }
    });
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
    <div
      ref="gridContainer"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12"
    >
      <div
        v-for="(video, idx) in videos"
        :key="video.id"
        class="video-item opacity-0"
      >
        <VideoCard :video="video" :index="idx" />
      </div>
    </div>

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
          name="ph:video-camera-slash-duotone"
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
