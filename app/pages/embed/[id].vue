<script setup>
const route = useRoute();
const videoId = route.params.id;

const supabase = useSupabaseClient();
const video = ref(null);

definePageMeta({
  layout: false,
});

onMounted(async () => {
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .single();

  if (data) {
    video.value = data;
    supabase.rpc("increment_view_count", { video_id: videoId });
  }
});
</script>

<template>
  <div class="w-full h-screen bg-black flex items-center justify-center overflow-hidden m-0 p-0">
    <div
      class="absolute inset-0 flex items-center justify-center"
      v-if="!video?.video_url"
    >
      <div class="space-y-4 text-center">
        <Icon name="ph:broadcast" class="text-5xl text-primary" />
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
          Loading...
        </p>
      </div>
    </div>

    <video
      v-if="video?.video_url"
      :src="video.video_url"
      controls
      autoplay
      class="w-full h-full object-contain"
      playsinline
    ></video>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
}
</style>
