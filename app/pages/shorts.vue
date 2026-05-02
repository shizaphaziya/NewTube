<script setup lang="ts">
import { useAppStore } from "~/store/app";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { t } = useI18n();
const appStore = useAppStore();

const videos = ref<any[]>([]);
const activeIndex = ref(0);
const loading = ref(true);
const isPlaying = ref(true);

const videoRefs = ref<HTMLVideoElement[]>([]);

const fetchShorts = async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from("videos")
    .select("*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)")
    .eq("status", "published")
    .eq("is_short", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!error && data) {
    videos.value = data;
  }
  loading.value = false;
};

const togglePlay = () => {
  const currentVideo = videoRefs.value[activeIndex.value];
  if (!currentVideo) return;
  
  if (currentVideo.paused) {
    currentVideo.play();
    isPlaying.value = true;
  } else {
    currentVideo.pause();
    isPlaying.value = false;
  }
};

const scrollToVideo = (index: number) => {
  if (index < 0 || index >= videos.value.length) return;
  const container = document.getElementById("shorts-container");
  if (container) {
    container.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth"
    });
    activeIndex.value = index;
  }
};

const onScroll = (e: any) => {
  const container = e.target;
  const index = Math.round(container.scrollTop / window.innerHeight);
  if (activeIndex.value !== index) {
    activeIndex.value = index;
    isPlaying.value = true;
    // Play the current video, pause others
    videoRefs.value.forEach((v, i) => {
      if (i === index) v.play();
      else v.pause();
    });
  }
};

// Keyboard navigation
onMounted(() => {
  fetchShorts();
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      scrollToVideo(activeIndex.value + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      scrollToVideo(activeIndex.value - 1);
    } else if (e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) > 50) {
      e.preventDefault();
      if (e.deltaY > 0) scrollToVideo(activeIndex.value + 1);
      else scrollToVideo(activeIndex.value - 1);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("wheel", handleWheel, { passive: false });
  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("wheel", handleWheel);
  });
});

// Interaction states
const isLiked = ref(false);
const isSubscribed = ref(false);

const toggleLike = () => {
  if (!user.value) return appStore.openAuthModal();
  isLiked.value = !isLiked.value;
};

const toggleSubscribe = () => {
  if (!user.value) return appStore.openAuthModal();
  isSubscribed.value = !isSubscribed.value;
};

useSeoMeta({
  title: () => `${t("shorts.title")} - ${t("seo.title")}`,
  description: () => t("shorts.subtitle"),
});
</script>

<template>
  <div class="h-screen w-full bg-void relative flex justify-center overflow-hidden selection:bg-primary-500/30 selection:text-white">
    <!-- Centered Feed -->
    <div
      id="shorts-container"
      class="w-full max-w-[500px] h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none relative z-10"
      @scroll="onScroll"
    >
      <!-- Loading State -->
      <div v-if="loading && videos.length === 0" class="h-full flex items-center justify-center">
        <Icon name="ph:circle-notch" class="text-4xl text-primary-500 animate-spin" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && videos.length === 0" class="h-full flex flex-col items-center justify-center px-10 text-center">
        <h2 class="text-2xl font-900 text-white uppercase tracking-tighter italic mb-4">{{ t("shorts.no_shorts") }}</h2>
      </div>

      <!-- Shorts -->
      <div
        v-for="(video, index) in videos"
        :key="video.id"
        class="h-screen w-full snap-start snap-always relative flex items-center justify-center"
      >
        <div 
          class="relative w-full h-full max-w-[450px] aspect-[9/16] bg-black shadow-2xl border-none overflow-hidden group cursor-pointer"
          @click="togglePlay"
        >
          <!-- Video Element -->
          <video
            ref="videoRefs"
            :src="video.video_url"
            class="w-full h-full object-cover"
            loop
            :autoplay="index === 0"
            :muted="false"
            playsinline
          ></video>

          <!-- Play/Pause Indicator Overlay -->
          <div 
            class="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
            :class="!isPlaying ? 'opacity-100' : 'opacity-0'"
          >
            <div class="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center scale-110">
              <Icon name="ph:play-fill" class="text-white text-4xl" />
            </div>
          </div>

          <!-- Bottom Metadata Overlay -->
          <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
            <div class="flex items-center gap-3 mb-4 pointer-events-auto">
              <img :src="video.profiles?.avatar_url" class="w-10 h-10 rounded-full border border-white/20" />
              <div class="flex flex-col">
                <span class="text-sm font-bold text-white">{{ video.profiles?.display_name }}</span>
                <span class="text-[10px] text-white/60">@{{ video.profiles?.display_name?.toLowerCase().replace(' ', '') }}</span>
              </div>
              <button 
                @click.stop="toggleSubscribe"
                class="ml-auto px-4 py-1.5 rounded-full text-[11px] font-bold transition-all"
                :class="isSubscribed ? 'bg-white/10 text-white border border-white/20' : 'bg-primary-500 text-white'"
              >
                {{ isSubscribed ? 'Subscribed' : 'Subscribe' }}
              </button>
            </div>
            <p class="text-[13px] text-white line-clamp-2 leading-snug">{{ video.title }}</p>
          </div>

          <!-- Sidebar Actions -->
          <div class="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-40">
            <button @click.stop="toggleLike" class="flex flex-col items-center gap-1 group/btn">
              <div class="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/btn:bg-white/10 transition-all">
                <Icon :name="isLiked ? 'ph:heart-fill' : 'ph:heart'" class="text-2xl" :class="isLiked ? 'text-primary-500' : 'text-white'" />
              </div>
              <span class="text-[10px] font-bold text-white">{{ t("shorts.like") }}</span>
            </button>
            <button @click.stop class="flex flex-col items-center gap-1 group/btn">
              <div class="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/btn:bg-white/10 transition-all">
                <Icon name="ph:chat-circle" class="text-2xl text-white" />
              </div>
              <span class="text-[10px] font-bold text-white">{{ t("shorts.comment") }}</span>
            </button>
            <button @click.stop class="flex flex-col items-center gap-1 group/btn">
              <div class="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/btn:bg-white/10 transition-all">
                <Icon name="ph:share-fat" class="text-2xl text-white" />
              </div>
              <span class="text-[10px] font-bold text-white">{{ t("shorts.share") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
:global(body) { overflow: hidden; }
</style>
