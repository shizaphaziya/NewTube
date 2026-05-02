<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { t } = useI18n();

useSeoMeta({
  title: () => `${t("home.subscriptions")} - ${t("seo.title")}`,
  description: t("subscriptions.description"),
});

const { data: subscriptions } = await useAsyncData(
  "user-subscriptions-list",
  async () => {
    if (!user.value) return [];
    const { data } = await supabase
      .from("subscriptions")
      .select("creator_id, profiles:creator_id(*)")
      .eq("subscriber_id", user.value.id);
    return data || [];
  },
  { watch: [user] },
);

const { data: subscribedVideos, pending } = await useAsyncData(
  "subscriptions-videos",
  async () => {
    if (!user.value || !subscriptions.value?.length) return [];

    const creatorIds = subscriptions.value.map((s: any) => s.creator_id);

    const { data: videos } = await supabase
      .from("videos")
      .select(
        "*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)",
      )
      .in("user_id", creatorIds)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    return videos || [];
  },
  { watch: [subscriptions] },
);
</script>

<template>
  <div
    class="min-h-screen bg-void pb-24 relative selection:bg-primary-500/30 selection:text-white overflow-x-hidden"
  >
    <!-- Atmospheric Accents -->
    <div
      class="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none"
    ></div>
    <div
      class="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[180px] rounded-full pointer-events-none"
    ></div>

    <div
      class="max-w-[1800px] mx-auto px-4 md:px-10 lg:px-16 pt-12 relative z-10"
    >
      <!-- Header Section -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-1 w-10 bg-primary-500 rounded-full"></div>
            <span
              class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]"
              >{{ t("subscriptions.network") }}</span
            >
          </div>
          <h1
            class="text-5xl md:text-6xl font-900 text-white uppercase tracking-tighter italic leading-none"
          >
            {{ t("home.subscriptions") }}
          </h1>
          <p
            class="text-white/30 text-[11px] font-black uppercase tracking-[0.2em]"
          >
            {{ t("subscriptions.subtitle") }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <button
            class="px-8 py-3.5 rounded-xl glass-card border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center gap-3"
          >
            <Icon name="ph:arrows-clockwise-duotone" class="" />
            {{ t("subscriptions.resync") }}
          </button>
          <button
            class="px-8 py-3.5 rounded-xl btn-primary text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 transition-all flex items-center gap-3"
          >
            <Icon name="ph:gear-duotone" class="" />
            {{ t("subscriptions.manage") }}
          </button>
        </div>
      </div>

      <!-- Subscribed Channels Bar -->
      <div v-if="user && subscriptions?.length" class="mb-16">
        <div class="flex items-center gap-4 mb-8">
          <h3
            class="text-xs font-black text-white/20 uppercase tracking-[0.3em]"
          >
            {{ t("subscriptions.active_nodes") }}
          </h3>
          <div class="flex-1 h-px bg-white/5"></div>
        </div>
        <div
          class="flex items-center gap-8 overflow-x-auto pb-6 scrollbar-none"
        >
          <NuxtLink
            v-for="sub in subscriptions"
            :key="sub.creator_id"
            :to="`/profile/${sub.creator_id}`"
            class="flex flex-col items-center gap-4 group shrink-0 no-underline"
          >
            <div class="relative">
              <div
                class="absolute -inset-1.5 bg-gradient-to-tr from-primary-600 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"
              ></div>
              <img
                :src="
                  sub.profiles?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.creator_id}`
                "
                class="w-20 h-20 rounded-2xl border-2 border-white/10 object-cover bg-void-900 relative z-10 transition-colors"
              />
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-md border-2 border-void z-20"
              ></div>
            </div>
            <span
              class="text-[10px] font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-widest max-w-[80px] truncate"
              >{{ sub.profiles?.display_name }}</span
            >
          </NuxtLink>
        </div>
      </div>

      <!-- Auth Gate -->
      <div
        v-if="!user"
        class="flex flex-col items-center justify-center py-32 text-center glass-card border-white/5 rounded-[3rem] shadow-2xl"
      >
        <div
          class="w-24 h-24 rounded-3xl bg-void-900 border border-white/10 flex items-center justify-center mb-8 shadow-2xl"
        >
          <Icon name="ph:lock-duotone" class="text-5xl text-primary-500" />
        </div>
        <h2
          class="text-3xl font-900 text-white uppercase tracking-tighter italic mb-4"
        >
          {{ t("subscriptions.id_required") }}
        </h2>
        <p
          class="text-white/30 text-[11px] font-black uppercase tracking-widest leading-loose max-w-md mb-10"
        >
          {{ t("subscriptions.id_required_subtitle") }}
        </p>
        <NuxtLink
          to="/auth/login"
          class="btn-primary px-12 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-primary-500/20 transition-all"
        >
          {{ t("auth.authorize_identity") }}
        </NuxtLink>
      </div>

      <!-- Pending State -->
      <div
        v-else-if="pending"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-16"
      >
        <VideoSkeleton v-for="n in 10" :key="n" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="subscribedVideos?.length === 0"
        class="flex flex-col items-center justify-center py-32 text-center glass-card border-white/5 rounded-[3rem] shadow-2xl"
      >
        <div
          class="w-24 h-24 rounded-3xl bg-void-900 border border-white/10 flex items-center justify-center mb-8 shadow-2xl"
        >
          <Icon name="ph:users-three-duotone" class="text-5xl text-white/10" />
        </div>
        <h2
          class="text-3xl font-900 text-white uppercase tracking-tighter italic mb-4"
        >
          {{ t("subscriptions.no_active") }}
        </h2>
        <p
          class="text-white/30 text-[11px] font-black uppercase tracking-widest leading-loose max-w-md mb-10"
        >
          {{ t("subscriptions.no_active_subtitle") }}
        </p>
        <NuxtLink
          to="/"
          class="btn-primary px-12 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-primary-500/20 transition-all"
        >
          {{ t("subscriptions.explore") }}
        </NuxtLink>
      </div>

      <!-- Video Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-16"
      >
        <VideoCard
          v-for="(video, idx) in subscribedVideos"
          :key="video.id"
          :video="video"
          :index="idx"
          :initial="{ opacity: 0, y: 30 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { delay: idx * 100, duration: 800 },
          }"
        />
      </div>
    </div>
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
