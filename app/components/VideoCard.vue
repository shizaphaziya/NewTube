<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  video: {
    id: string;
    title: string;
    user_id: string;
    thumbnail_url?: string | null;
    video_url?: string | null;
    view_count: number | null;
    created_at?: string | null;
    profiles: {
      display_name: string;
      avatar_url: string;
    };
  };
  index: number;
}>();
</script>

<template>
  <NuxtLink
    :to="`/watch/${video.id}`"
    class="group block no-underline focus:outline-none press-effect"
  >
    <Card class="border-none bg-transparent shadow-none overflow-visible">
      <CardContent class="p-0">
        <!-- Thumbnail Container -->
        <div
          class="relative aspect-video rounded-3xl bg-muted overflow-hidden border border-border/20 transition-all duration-700 ease-nt-out group-hover:border-primary/20 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] group-hover:-translate-y-2 lift-effect"
          :style="`view-transition-name: video-thumb-${video.id}`"
        >
          <!-- Video Thumbnail -->
          <img
            v-if="video.thumbnail_url"
            :src="video.thumbnail_url"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />

          <!-- Fallback Frame -->
          <video
            v-else-if="video.video_url"
            :src="video.video_url + '#t=0.5'"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            muted
            preload="metadata"
          ></video>

          <!-- Ultimate Placeholder -->
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-muted"
          >
            <Icon name="ph:broadcast-duotone" class="text-muted-foreground text-5xl" />
          </div>

          <!-- Play Button Overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            <div
              class="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 ease-nt-elastic"
            >
              <Icon
                name="ph:play-fill"
                class="text-white text-2xl translate-x-0.5"
              />
            </div>
          </div>

          <!-- Views Badge -->
          <Badge
            variant="secondary"
            class="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-700 text-white flex items-center gap-1.5 hover:bg-black/60"
          >
            <div class="w-1 h-1 rounded-full bg-primary"></div>
            {{ (video.view_count || 0).toLocaleString() }}
          </Badge>
        </div>

        <!-- Info Section -->
        <div class="mt-4 flex gap-3.5 px-0.5">
          <!-- Creator Avatar -->
          <Avatar class="w-10 h-10 rounded-xl bg-background border border-border transition-transform duration-500 group-hover:scale-110">
            <AvatarImage :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" />
            <AvatarFallback>{{ video.profiles?.display_name?.[0].toUpperCase() }}</AvatarFallback>
          </Avatar>

          <div class="flex-1 min-w-0">
            <h3
              class="text-[15px] font-700 text-foreground leading-snug line-clamp-2 tracking-tight group-hover:text-primary transition-colors duration-300"
              :style="`view-transition-name: video-title-${video.id}`"
            >
              {{ video.title }}
            </h3>

            <div
              class="flex flex-col mt-1.5 text-[12px] font-500 text-muted-foreground"
            >
              <div
                class="flex items-center gap-1 hover:text-foreground transition-colors duration-300"
              >
                <span class="truncate">{{ video.profiles?.display_name }}</span>
                <Icon
                  name="ph:seal-check-fill"
                  class="text-primary text-[13px]"
                />
              </div>
              <div class="flex items-center gap-1.5 mt-0.5 opacity-80">
                <ClientOnly>
                  <span>{{ useTimeAgo(video.created_at || "").value }}</span>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </NuxtLink>
</template>
