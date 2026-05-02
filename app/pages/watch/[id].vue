<script setup lang="ts">
import { useAppStore } from "~/store/app";
const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { profile, isAdmin } = useProfile();
const { t, locale } = useI18n();
const appStore = useAppStore();

const videoId = route.params.id as string;

const video = ref<any>(null);
const likesCount = ref(0);
const isSubscribed = ref(false);
const comments = ref<any[]>([]);
const newComment = ref("");
const isPosting = ref(false);
const relatedVideos = ref<any[]>([]);
const isCinemaMode = ref(false);
const isLiked = ref(false);
const commentsPage = ref(0);
const hasMoreComments = ref(true);
const commentsCount = ref(0);
const isLoadingComments = ref(false);

// Fetch video data
const fetchVideoData = async () => {
  const { data, error } = await supabase
    .from("videos")
    .select("*, profiles:profiles!videos_user_id_fkey(*)")
    .eq("id", videoId)
    .single();

  if (data) {
    video.value = data;
    likesCount.value = data.view_count || 0; // Proxy for now
  }
};

// Fetch related videos
const fetchRelated = async () => {
  const { data } = await supabase
    .from("videos")
    .select("*, profiles:profiles!videos_user_id_fkey(*)")
    .neq("id", videoId)
    .limit(10);

  if (data) relatedVideos.value = data;
};

// Fetch comments total count
const fetchCommentsCount = async () => {
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("video_id", videoId);

  if (count !== null) commentsCount.value = count;
};

// Fetch comments
const fetchComments = async (loadMore = false) => {
  if (isLoadingComments.value || (!hasMoreComments.value && loadMore)) return;
  isLoadingComments.value = true;

  const limit = 20;
  const from = loadMore ? commentsPage.value * limit : 0;
  const to = from + limit - 1;

  const { data } = await supabase
    .from("comments")
    .select("*, profiles:profiles!comments_user_id_fkey(*)")
    .eq("video_id", videoId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (data) {
    if (loadMore) {
      comments.value = [...comments.value, ...data];
    } else {
      comments.value = data;
      fetchCommentsCount();
    }

    if (data.length < limit) {
      hasMoreComments.value = false;
    } else {
      hasMoreComments.value = true;
      if (loadMore) commentsPage.value++;
      else commentsPage.value = 1;
    }
  }
  isLoadingComments.value = false;
};

const submitComment = async () => {
  if (!user.value) return appStore.openAuthModal();
  if (!newComment.value.trim()) return;

  isPosting.value = true;
  const { error } = await supabase.from("comments").insert({
    video_id: videoId,
    user_id: user.value.id,
    content: newComment.value,
  });

  if (!error) {
    newComment.value = "";
    commentsPage.value = 0;
    fetchComments();
  }
  isPosting.value = false;
};

const toggleLike = () => {
  if (!user.value) return appStore.openAuthModal();
  isLiked.value = !isLiked.value;
  likesCount.value += isLiked.value ? 1 : -1;
};

const toggleSubscribe = () => {
  if (!user.value) return appStore.openAuthModal();
  isSubscribed.value = !isSubscribed.value;
};

onMounted(() => {
  fetchVideoData();
  fetchRelated();
  fetchComments();

  // Increment views
  supabase.rpc("increment_view_count", { video_id: videoId });
});

useSeoMeta({
  title: () =>
    video.value
      ? `${video.value.title} - ${t("seo.title")}`
      : t("common.loading"),
  description: () => video.value?.description || "",
  ogImage: () => video.value?.thumbnail_url,
});
</script>

<template>
  <div
    class="min-h-screen pb-24 relative selection:bg-primary-500/30 selection:text-white bg-void overflow-x-hidden"
  >
    <!-- Cinematic Dynamic Aura -->
    <div
      class="fixed top-0 inset-x-0 h-[1000px] pointer-events-none overflow-hidden z-0 mask-linear-b opacity-30"
    >
      <div
        class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-600/10 blur-[180px] animate-ambient"
      ></div>
      <div
        class="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[180px] animate-ambient"
        style="animation-delay: -3s"
      ></div>
      <img
        v-if="video?.thumbnail_url"
        :src="video.thumbnail_url"
        class="w-full h-full object-cover blur-[150px] scale-150 opacity-20 mix-blend-screen"
      />
    </div>

    <!-- Video Player Area -->
    <div
      class="w-full relative z-10 transition-all duration-1000 opacity-100"
      :class="isCinemaMode ? 'pt-0' : 'pt-4 md:pt-8 pb-8'"
    >
      <div
        :class="
          isCinemaMode
            ? 'w-full h-screen'
            : 'max-w-[1600px] mx-auto px-4 md:px-10'
        "
      >
        <div
          class="relative group mx-auto overflow-hidden shadow-[0_60px_150px_-30px_rgba(0,0,0,0.9)] border border-border/5 ring-1 ring-border/10 transition-all duration-700"
          :class="
            isCinemaMode
              ? 'w-full h-full rounded-none'
              : 'aspect-video rounded-[2.5rem]'
          "
        >
          <div
            class="absolute inset-0 bg-background flex items-center justify-center"
            v-if="!video?.video_url"
          >
            <div class="space-y-4 text-center">
              <Icon name="ph:broadcast" class="text-5xl text-primary" />
              <p
                class="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground"
              >
                {{ t("common.loading") }}
              </p>
            </div>
          </div>

          <video
            v-if="video?.video_url"
            :src="video.video_url"
            controls
            autoplay
            class="w-full h-full object-contain"
          ></video>

          <!-- Cinema Mode Toggle -->
          <Button
            size="icon"
            variant="secondary"
            @click="isCinemaMode = !isCinemaMode"
            class="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-primary hover:border-primary hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-500 opacity-0 group-hover:opacity-100 z-20"
          >
            <Icon
              :name="isCinemaMode ? 'ph:corners-in' : 'ph:corners-out'"
              class="text-2xl"
            />
          </Button>
        </div>
      </div>
    </div>

    <!-- Info & Interactions -->
    <div class="max-w-[1600px] mx-auto px-4 md:px-10 mt-6 relative z-10">
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 xl:gap-20">
        <!-- Main Column -->
        <div class="space-y-12">
          <!-- Title & Engagement -->
          <div class="space-y-8">
            <h1
              class="text-4xl md:text-5xl font-900 text-foreground leading-tight uppercase tracking-tighter italic"
            >
              {{ video?.title || t("watch.loading_video") }}
            </h1>

            <div
              class="flex flex-col lg:flex-row lg:items-center justify-between gap-10 p-8 glass-card border-border/5 rounded-[2.5rem] relative overflow-hidden group"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>

              <!-- Creator Bar -->
              <div class="flex items-center gap-6 relative z-10">
                <NuxtLink
                  :to="`/profile/${video?.user_id}`"
                  class="relative group/avatar"
                >
                  <div
                    class="absolute -inset-1.5 bg-gradient-to-tr from-primary to-amber-500 rounded-2xl opacity-0 group-hover/avatar:opacity-40 blur-lg transition-opacity"
                  ></div>
                  <Avatar class="w-16 h-16 rounded-2xl border-2 border-border/10 object-cover bg-muted relative z-10 transition-all group-hover/avatar:border-border/30">
                    <AvatarImage :src="video?.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video?.user_id}`" />
                    <AvatarFallback>{{ video?.profiles?.display_name?.[0].toUpperCase() }}</AvatarFallback>
                  </Avatar>
                </NuxtLink>
                <div class="space-y-1">
                  <NuxtLink
                    :to="`/profile/${video?.user_id}`"
                    class="text-xl font-900 text-foreground hover:text-primary no-underline flex items-center gap-2 italic uppercase tracking-tight"
                  >
                    {{ video?.profiles?.display_name }}
                    <Icon
                      name="ph:seal-check-fill"
                      class="text-primary text-lg"
                    />
                  </NuxtLink>
                  <p
                    class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]"
                  >
                    {{ t("watch.quality") }}
                  </p>
                </div>
                <Button
                  @click="toggleSubscribe"
                  size="lg"
                  class="ml-6 px-10 py-7 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden group/sub shadow-2xl h-auto"
                  :variant="isSubscribed ? 'secondary' : 'default'"
                >
                  <span class="relative z-10">{{
                    isSubscribed ? t("watch.subscribed") : t("watch.subscribe")
                  }}</span>
                  <div
                    v-if="!isSubscribed"
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-1000"
                  ></div>
                </Button>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-4 relative z-10">
                <div
                  class="flex items-center bg-muted/40 backdrop-blur-xl border border-border/10 rounded-2xl h-14 overflow-hidden p-1 shadow-xl"
                >
                  <Button
                    variant="ghost"
                    @click="toggleLike"
                    class="flex items-center gap-3 px-8 h-full rounded-xl transition-all duration-500 group/like"
                    :class="
                      isLiked
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    "
                  >
                    <Icon
                      :name="isLiked ? 'ph:heart-fill' : 'ph:heart-duotone'"
                      class="text-2xl"
                    />
                    <span
                      class="text-xs font-black uppercase tracking-widest"
                      >{{ likesCount.toLocaleString() }}</span
                    >
                  </Button>
                  <Separator orientation="vertical" class="h-8 mx-1 bg-border/20" />
                  <Button
                    variant="ghost"
                    @click="() => (!user ? appStore.openAuthModal() : null)"
                    class="px-6 h-full rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Icon name="ph:thumbs-down-duotone" class="text-2xl" />
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  class="h-14 px-8 rounded-2xl border-border/10 hover:border-border/30 hover:bg-accent transition-all text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-3"
                >
                  <Icon
                    name="ph:share-network-duotone"
                    class="text-2xl text-primary"
                  />
                  {{ t("watch.share") }}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  class="w-14 h-14 rounded-2xl border-border/10 flex items-center justify-center hover:bg-accent transition-all text-muted-foreground hover:text-foreground"
                >
                  <Icon name="ph:dots-three-bold" class="text-3xl" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Description Box -->
          <Card
            class="p-10 bg-muted/30 border-border/5 rounded-[3rem] shadow-2xl relative group overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div class="flex items-center gap-4 mb-8">
              <div class="h-1 w-10 bg-primary rounded-full"></div>
              <div
                class="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground"
              >
                <span class="text-foreground"
                  >{{ (video?.view_count || 0).toLocaleString() }}
                  {{ t("watch.views") }}</span
                >
                <span
                  >{{ t("watch.published_on") }}
                  {{
                    new Date(video?.created_at).toLocaleDateString(locale)
                  }}</span
                >
              </div>
            </div>
            <p
              class="text-muted-foreground text-lg font-medium leading-[2] whitespace-pre-wrap relative z-10 max-w-4xl"
            >
              {{ video?.description || t("watch.no_description") }}
            </p>
            <div
              v-if="video?.tags?.length"
              class="flex flex-wrap gap-3 mt-10 relative z-10"
            >
              <Badge
                v-for="tag in video.tags"
                :key="tag"
                variant="outline"
                class="px-4 py-1.5 rounded-lg bg-muted/50 border border-border/5 text-[10px] font-black text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer uppercase tracking-widest"
              >
                #{{ tag }}
              </Badge>
            </div>
          </Card>

          <!-- Comments Section -->
          <div class="space-y-12">
            <div
              class="flex items-center justify-between border-b border-border/5 pb-8"
            >
              <h3
                class="text-3xl font-900 text-foreground uppercase tracking-tighter italic"
              >
                {{ commentsCount }} {{ t("watch.comments") }}
              </h3>
              <div
                class="flex items-center gap-3 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]"
              >
                <Icon name="ph:sort-ascending-duotone" class="text-xl" />
                {{ t("watch.sort_by") }}
              </div>
            </div>

            <!-- Comment Input -->
            <div class="flex gap-8 group">
              <div class="relative shrink-0">
                <Avatar class="w-16 h-16 rounded-2xl border-2 border-border/10 shadow-2xl group-focus-within:border-primary/50 transition-all">
                  <AvatarImage :src="user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer'" />
                  <AvatarFallback>V</AvatarFallback>
                </Avatar>
                <div
                  class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-lg border-2 border-background"
                ></div>
              </div>
              <div class="flex-1 space-y-4">
                <div class="relative">
                  <Textarea
                    v-model="newComment"
                    :placeholder="t('watch.add_comment_placeholder')"
                    class="w-full min-h-[120px] rounded-[2rem] py-6 px-8 text-base font-medium focus-visible:ring-primary/20 transition-all resize-none shadow-xl bg-background/50 border-border/40"
                  />
                  <div
                    class="absolute bottom-6 right-8 flex items-center gap-4"
                  >
                    <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="ph:smiley-duotone" class="text-2xl" />
                    </Button>
                    <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="ph:paperclip-duotone" class="text-2xl" />
                    </Button>
                  </div>
                </div>
                <div class="flex justify-end gap-6">
                  <Button
                    variant="ghost"
                    @click="newComment = ''"
                    class="text-[11px] font-black text-muted-foreground hover:text-foreground uppercase tracking-[0.3em] transition-all"
                  >
                    {{ t("watch.cancel") }}
                  </Button>
                  <Button
                    @click="submitComment"
                    :disabled="!newComment.trim() || isPosting"
                    class="rounded-xl px-12 py-6 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(239,68,68,0.25)] disabled:opacity-30 transition-all h-auto"
                  >
                    {{ isPosting ? t("watch.posting_btn") : t("watch.post") }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-10">
              <TransitionGroup
                enter-active-class="transition duration-700 ease-out"
                enter-from-class="opacity-0 translate-y-8"
                enter-to-class="opacity-100 translate-y-0"
              >
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="flex gap-8 group/comment"
                >
                  <Avatar class="w-14 h-14 rounded-2xl border border-border/5 shadow-xl group-hover/comment:border-primary/30 transition-all">
                    <AvatarImage :src="comment.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comment.id" />
                    <AvatarFallback>{{ comment.profiles?.display_name?.[0].toUpperCase() }}</AvatarFallback>
                  </Avatar>
                  <div class="flex-1 space-y-3">
                    <div class="flex items-center gap-4">
                      <span
                        class="text-base font-900 text-foreground uppercase tracking-tight italic"
                        >{{ comment.profiles?.display_name }}</span
                      >
                      <span
                        class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >{{
                          new Date(comment.created_at).toLocaleDateString()
                        }}</span
                      >
                    </div>
                    <p
                      class="text-muted-foreground text-base leading-relaxed font-medium"
                    >
                      {{ comment.content }}
                    </p>
                    <div class="flex items-center gap-8 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="toggleLike"
                        class="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] h-auto p-1"
                      >
                        <Icon name="ph:thumbs-up-duotone" class="text-xl" />
                        {{ t("watch.like") }}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em] h-auto p-1"
                      >
                        <Icon
                          name="ph:chat-circle-dots-duotone"
                          class="text-xl"
                        />
                        {{ t("watch.reply") }}
                      </Button>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>

            <div
              v-if="hasMoreComments && comments.length > 0"
              class="flex justify-center pt-8"
            >
              <Button
                @click="fetchComments(true)"
                :disabled="isLoadingComments"
                size="lg"
                class="rounded-xl px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-30 transition-all h-auto"
              >
                {{
                  isLoadingComments
                    ? t("common.loading")
                    : t("watch.load_more_comments") || "Load More"
                }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-10">
          <div class="flex items-center gap-4 border-b border-border/5 pb-6">
            <div class="h-1 w-8 bg-primary"></div>
            <h3
              class="text-xl font-900 text-foreground uppercase tracking-tighter italic"
            >
              {{ t("watch.up_next") }}
            </h3>
          </div>

          <div class="space-y-8">
            <NuxtLink
              v-for="v in relatedVideos"
              :key="v.id"
              :to="`/watch/${v.id}`"
              class="flex gap-5 group cursor-pointer no-underline"
            >
              <div
                class="w-48 aspect-video rounded-2xl overflow-hidden bg-muted border border-border/10 shrink-0 relative shadow-xl transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-primary/10"
              >
                <img
                  :src="v.thumbnail_url"
                  class="w-full h-full object-cover transition-transform duration-1000"
                />
                <div
                  class="absolute inset-0 bg-background/30 group-hover:bg-transparent transition-all"
                ></div>
              </div>
              <div class="flex-1 min-w-0 py-1 space-y-2">
                <h4
                  class="text-sm font-900 text-foreground uppercase tracking-tighter leading-tight line-clamp-2 group-hover:text-primary transition-colors italic"
                >
                  {{ v.title }}
                </h4>
                <div class="space-y-1">
                  <p
                    class="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate"
                  >
                    {{ v.profiles?.display_name }}
                  </p>
                  <div
                    class="flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    <span
                      >{{ (v.view_count || 0).toLocaleString() }}
                      {{ t("watch.views") }}</span
                    >
                    <span>•</span>
                    <span>{{
                      new Date(v.created_at).toLocaleDateString()
                    }}</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Sidebar Promo/Ad Aesthetic -->
          <div
            class="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-700 text-primary-foreground space-y-6 shadow-2xl relative overflow-hidden group"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-1000"
            ></div>
            <h4
              class="text-2xl font-black uppercase tracking-tighter italic leading-none"
            >
              {{ t("watch.upgrade_premium") }}
            </h4>
            <p
              class="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest leading-relaxed"
            >
              {{ t("watch.upgrade_hint") }}
            </p>
            <Button
              variant="secondary"
              class="w-full py-7 rounded-xl bg-background text-foreground font-black text-[11px] uppercase tracking-[0.3em] transition-opacity hover:opacity-90 shadow-xl h-auto"
            >
              {{ t("watch.upgrade_now") }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask-linear-b {
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
}

/* noinspection CssInvalidPseudoSelector -- vendor-specific WebKit media control selectors */
video::-webkit-media-controls-panel {
  background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.9)) !important;
}

/* noinspection CssInvalidPseudoSelector -- vendor-specific WebKit media control selectors */
video::-webkit-media-controls-play-button {
  filter: hue-rotate(320deg) saturate(150%);
}
</style>
