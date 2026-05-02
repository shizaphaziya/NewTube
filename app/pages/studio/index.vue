<script setup>
const supabase = useSupabaseClient();
const { confirm: showConfirm } = useConfirm();
const user = useSupabaseUser();
const { t, locale } = useI18n();
const { error: showError } = useToast();

const { profile } = useProfile();

useSeoMeta({
  title: () => `${t("studio.command_center")} - ${t("studio.page_title")}`,
  description: () => t("studio.broadcasting"),
});

const {
  data: videos,
  refresh,
  error: asyncError,
} = await useAsyncData(
  "user-videos",
  async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    const userId = user.value?.id || authUser?.id;
    if (!userId) return [];

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Studio] Fetch error:", error);
      throw error;
    }
    return data || [];
  },
  { watch: [user], server: false },
);

if (asyncError.value) {
  console.error("[Studio] useAsyncData error:", asyncError.value);
}

const stats = computed(() => {
  if (!videos.value) return { views: 0, videos: 0, engagement: 0 };
  let views = 0;
  let engagement = 0;
  for (const v of videos.value) {
    views += v.view_count || 0;
    engagement += (v.likes?.[0]?.count || 0) + (v.comments?.[0]?.count || 0);
  }
  return {
    views,
    videos: videos.value.length,
    engagement,
  };
});

const editingVideo = ref(null);
const editForm = ref({
  title: "",
  description: "",
  is_18_plus: false,
  thumbnailFile: null,
});
const isSaving = ref(false);
const thumbnailInput = ref(null);

const openEditModal = (video) => {
  editingVideo.value = video;
  editForm.value = {
    title: video.title,
    description: video.description || "",
    is_18_plus: video.is_18_plus || false,
    thumbnailFile: null,
  };
};

const closeEditModal = () => {
  editingVideo.value = null;
};

const handleThumbnailSelect = (e) => {
  editForm.value.thumbnailFile = e.target.files[0];
};

const saveVideo = async () => {
  if (!editingVideo.value) return;
  isSaving.value = true;

  try {
    let thumbnailUrl = editingVideo.value.thumbnail_url;

    if (editForm.value.thumbnailFile) {
      const thumbExt = editForm.value.thumbnailFile.name.split(".").pop();
      const thumbFileName = `${Math.random()}.${thumbExt}`;
      const thumbPath = `${user.value.id}/${thumbFileName}`;

      await supabase.storage
        .from("thumbnails")
        .upload(thumbPath, editForm.value.thumbnailFile, {
          contentType: editForm.value.thumbnailFile.type,
        });

      const {
        data: { publicUrl: tUrl },
      } = supabase.storage.from("thumbnails").getPublicUrl(thumbPath);

      thumbnailUrl = tUrl;
    }

    const { error } = await supabase
      .from("videos")
      .update({
        title: editForm.value.title,
        description: editForm.value.description,
        is_18_plus: editForm.value.is_18_plus,
        thumbnail_url: thumbnailUrl,
      })
      .eq("id", editingVideo.value.id);

    if (error) throw error;

    refresh();
    closeEditModal();
  } catch (error) {
    console.error("Failed to update video", error);
    showError({
      title: t("studio.failed_update"),
      description: error.message,
    });
  } finally {
    isSaving.value = false;
  }
};

const deleteVideo = async (id) => {
  if (!(await showConfirm(t("studio.terminate_confirm")))) return;
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (!error) refresh();
};
</script>

<template>
  <div
    class="px-4 md:px-8 lg:px-12 py-12 relative max-w-screen-xl mx-auto min-h-screen"
  >
    <!-- Cinematic Aura -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        class="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-ambient"
        style="animation-delay: 0s"
      ></div>
      <div
        class="absolute bottom-[20%] -right-[5%] w-[30%] h-[30%] bg-primary/3 blur-[100px] rounded-full animate-ambient"
        style="animation-delay: -5s; animation-direction: alternate-reverse"
      ></div>
    </div>

    <!-- Guest Overlay -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="!user"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <Card
          class="glass-card border-primary/20 p-10 md:p-12 max-w-md w-full space-y-8 text-center shadow-[0_0_50px_-12px_rgba(239,68,68,0.2)] relative z-10 bg-background/80 backdrop-blur-3xl"
        >
          <div
            class="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
          >
            <Icon
              name="ph:lock-key-duotone"
              class="text-3xl text-primary"
            />
          </div>
          <div class="space-y-3">
            <h2
              class="text-2xl font-black text-foreground uppercase tracking-tight italic"
            >
              {{ $t("auth.authentication_locked") }}
            </h2>
            <p class="text-muted-foreground text-sm font-medium leading-relaxed">
              {{ $t("auth.login_required") }}
            </p>
          </div>
          <Button
            as-child
            size="lg"
            class="w-full rounded-xl py-7 font-black uppercase tracking-widest text-xs h-auto"
          >
            <NuxtLink to="/auth/login">
              {{ $t("auth.authorize_identity") }}
            </NuxtLink>
          </Button>
        </Card>
        <div class="absolute inset-0 bg-background/90 backdrop-blur-md"></div>
      </div>
    </Transition>

    <div
      class="relative z-10 space-y-12"
      :class="{ 'opacity-10 blur-xl pointer-events-none select-none': !user }"
    >
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/5 pb-8"
      >
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="h-1 w-8 bg-primary"></div>
            <span
              class="text-[10px] font-black text-primary uppercase tracking-[0.3em]"
              >{{ $t("studio.command_center") }}</span
            >
          </div>
          <h1
            class="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter italic"
          >
            {{ $t("studio.command_center") }}
          </h1>
          <p class="text-muted-foreground text-sm font-medium">
            {{ $t("studio.welcome") }},
            <span class="text-foreground">{{
              profile?.display_name || $t("studio.creator")
            }}</span>
          </p>
        </div>

        <Button
          as-child
          size="lg"
          class="flex items-center gap-3 rounded-xl px-8 py-7 font-black uppercase tracking-widest text-xs shadow-xl transition-all h-auto"
        >
          <NuxtLink to="/studio/upload">
            <Icon name="ph:plus-circle-duotone" class="text-lg" />
            {{ $t("studio.upload") }}
          </NuxtLink>
        </Button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          v-for="(val, key, i) in {
            views: stats.views,
            videos: stats.videos,
            engagement: stats.engagement,
          }"
          :key="key"
          class="glass-card p-8 group hover:border-primary/20 transition-all duration-500 bg-muted/30"
        >
          <div
            class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 group-hover:text-primary transition-colors"
          >
            {{ $t(`studio.total_${key}`) }}
          </div>
          <div class="flex items-end justify-between">
            <div
              class="text-4xl font-black text-foreground tracking-tighter tabular-nums"
            >
              {{ val.toLocaleString() }}
            </div>
            <div
              class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all"
            >
              <Icon
                :name="
                  key === 'views'
                    ? 'ph:chart-line-up-duotone'
                    : key === 'videos'
                      ? 'ph:video-camera-duotone'
                      : 'ph:heart-duotone'
                "
                class="text-2xl"
              />
            </div>
          </div>
        </Card>
      </div>

      <!-- Content Table -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2
            class="text-xl font-black text-foreground uppercase tracking-tight italic"
          >
            {{ $t("studio.channel_content") }}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            @click="refresh"
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ph:arrows-clockwise" class="text-xl" />
          </Button>
        </div>

        <!-- Empty State -->
        <Card
          v-if="!videos?.length"
          class="glass-card p-24 flex flex-col items-center justify-center text-center gap-6 border-dashed border-2 border-border/10 bg-transparent"
        >
          <div
            class="w-24 h-24 rounded-[2rem] bg-muted/50 border border-border/5 flex items-center justify-center mb-2"
          >
            <Icon
              name="ph:video-camera-slash-duotone"
              class="text-4xl text-muted-foreground/30"
            />
          </div>
          <div class="space-y-2">
            <p
              class="text-muted-foreground text-base font-bold uppercase tracking-tight"
            >
              {{ $t("studio.no_records") }}
            </p>
            <p class="text-muted-foreground/40 text-xs uppercase tracking-widest italic">
              {{ $t("studio.no_records_hint") }}
            </p>
          </div>
          <Button
            as-child
            size="lg"
            class="mt-4 rounded-xl px-10 py-7 font-black uppercase tracking-widest text-xs h-auto"
          >
            <NuxtLink to="/studio/upload">
              {{ $t("studio.upload") }}
            </NuxtLink>
          </Button>
        </Card>

        <!-- Records List -->
        <Card
          v-else
          class="glass-card overflow-hidden border-border/5 shadow-2xl bg-muted/20"
        >
          <Table>
            <TableHeader class="hidden sm:table-header-group">
              <TableRow class="hover:bg-transparent border-border/5">
                <TableHead class="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{{ $t("studio.video_header") }}</TableHead>
                <TableHead class="text-right px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{{ $t("studio.security_header") }}</TableHead>
                <TableHead class="text-right px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{{ $t("studio.date_header") }}</TableHead>
                <TableHead class="text-right px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{{ $t("studio.views_header") }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="video in videos"
                :key="video.id"
                class="group relative hover:bg-muted/30 border-border/5 transition-all duration-300"
              >
                <TableCell class="p-6 sm:px-8 sm:py-6">
                  <div class="flex gap-6 min-w-0 w-full">
                    <div
                      class="w-40 aspect-video rounded-2xl overflow-hidden bg-muted border border-border/10 shrink-0 relative shadow-xl group-hover:border-primary/30 transition-colors"
                    >
                      <img
                        v-if="video.thumbnail_url"
                        :src="video.thumbnail_url"
                        class="w-full h-full object-cover transition-colors duration-700"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <Icon
                          name="ph:film-strip-duotone"
                          class="text-3xl text-muted-foreground/30"
                        />
                      </div>
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0 space-y-2 py-1">
                      <h3
                        class="font-bold text-base text-foreground truncate group-hover:text-primary transition-colors tracking-tight"
                      >
                        {{ video.title }}
                      </h3>
                      <p
                        class="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium"
                      >
                        {{ video.description || $t("studio.no_description") }}
                      </p>

                      <!-- Mobile only meta -->
                      <div
                        class="flex sm:hidden items-center gap-3 text-[10px] font-black text-muted-foreground/40 mt-3 uppercase tracking-widest"
                      >
                        <span>{{
                          video.created_at
                            ? new Date(video.created_at).toLocaleDateString(locale)
                            : "—"
                        }}</span>
                        <span>•</span>
                        <span
                          >{{ (video.view_count || 0).toLocaleString() }}
                          {{ $t("common.views") }}</span
                        >
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="hidden sm:table-cell text-right px-8">
                  <Badge
                    variant="secondary"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20"
                  >
                    <div
                      class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    ></div>
                    {{ $t("studio.visibility_public") }}
                  </Badge>
                </TableCell>
                <TableCell class="hidden sm:table-cell text-right px-8 text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">
                  {{
                    video.created_at
                      ? new Date(video.created_at).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"
                  }}
                </TableCell>
                <TableCell class="hidden sm:table-cell text-right px-8 text-base font-black text-foreground tabular-nums tracking-tighter">
                  {{ (video.view_count || 0).toLocaleString() }}
                </TableCell>

                <!-- Hover Actions Overlay -->
                <div
                  class="flex sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 items-center gap-3 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 sm:translate-x-4 group-hover:translate-x-0 bg-background/90 sm:backdrop-blur-xl sm:pl-6 py-2 rounded-2xl mt-4 sm:mt-0 z-20 mx-6 sm:mx-0 mb-6 sm:mb-0"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="openEditModal(video)"
                    class="w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border/10 transition-all"
                  >
                    <Icon name="ph:pencil-simple-duotone" class="text-xl" />
                  </Button>
                  <Button
                    as-child
                    variant="ghost"
                    size="icon"
                    class="w-10 h-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                  >
                    <NuxtLink :to="`/watch/${video.id}`">
                      <Icon name="ph:eye-duotone" class="text-xl" />
                    </NuxtLink>
                  </Button>
                  <Separator orientation="vertical" class="h-6 mx-1 hidden sm:block bg-border/20" />
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="deleteVideo(video.id)"
                    class="w-10 h-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
                  >
                    <Icon name="ph:trash-duotone" class="text-xl" />
                  </Button>
                </div>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>

    <!-- Edit Video Dialog -->
    <Dialog :open="!!editingVideo" @update:open="val => !val && closeEditModal()">
      <DialogContent class="sm:max-w-xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        <Card class="glass-card border-border/10 w-full shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] relative z-10 flex flex-col max-h-[90vh] overflow-hidden bg-background/80 backdrop-blur-3xl">
          <div
            class="flex items-center justify-between p-8 border-b border-border/5 bg-muted/5"
          >
            <div class="space-y-1">
              <span
                class="text-[10px] font-black text-primary uppercase tracking-[0.3em]"
                >{{ $t("studio.video_update") }}</span
              >
              <h2
                class="text-xl font-black text-foreground uppercase tracking-tight italic"
              >
                {{ $t("studio.edit_metadata") }}
              </h2>
            </div>
            <DialogClose as-child>
              <Button
                variant="ghost"
                size="icon"
                class="w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Icon name="ph:x" class="text-2xl" />
              </Button>
            </DialogClose>
          </div>

          <div class="p-8 space-y-8 overflow-y-auto custom-scrollbar">
            <!-- Thumbnail -->
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2"
                >{{ $t("studio.thumbnail") }}</label
              >
              <div
                class="flex items-end gap-6 p-4 rounded-3xl bg-muted/30 border border-border/5 group"
              >
                <div
                  class="w-48 aspect-video rounded-2xl overflow-hidden bg-muted border border-border/10 shrink-0 shadow-2xl relative"
                >
                  <img
                    v-if="editingVideo?.thumbnail_url && !editForm.thumbnailFile"
                    :src="editingVideo.thumbnail_url"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else-if="editForm.thumbnailFile"
                    class="w-full h-full flex items-center justify-center text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 italic"
                  >
                    {{ $t("studio.updated") }}
                  </div>
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <Icon
                      name="ph:image-duotone"
                      class="text-3xl text-muted-foreground/30"
                    />
                  </div>
                </div>
                <div class="flex-1 space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    ref="thumbnailInput"
                    @change="handleThumbnailSelect"
                  />
                  <Button
                    variant="outline"
                    @click="thumbnailInput?.click()"
                    class="w-full px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground shadow-xl border-border/20 bg-background/50 hover:bg-background"
                  >
                    {{ $t("studio.change_image") }}
                  </Button>
                  <p
                    class="text-[9px] text-muted-foreground/40 font-bold uppercase text-center"
                    v-if="editForm.thumbnailFile"
                  >
                    {{ editForm.thumbnailFile.name }}
                  </p>
                  <p
                    class="text-[9px] text-muted-foreground/40 font-bold uppercase text-center italic"
                    v-else
                  >
                    {{ $t("studio.file_limit_hint") }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2"
                >{{ $t("studio.video_title") }}</label
              >
              <Input
                v-model="editForm.title"
                type="text"
                class="w-full rounded-2xl py-6 px-6 text-sm font-medium bg-background/50 border-border/40 focus-visible:ring-primary/20 h-auto"
                :placeholder="$t('studio.video_title_placeholder')"
              />
            </div>

            <!-- Description -->
            <div class="space-y-3">
              <label
                class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2"
                >{{ $t("studio.video_description") }}</label
              >
              <Textarea
                v-model="editForm.description"
                class="w-full min-h-[150px] resize-none rounded-3xl py-5 px-6 text-sm font-medium bg-background/50 border-border/40 focus-visible:ring-primary/20"
                :placeholder="$t('studio.video_description_placeholder')"
              />
            </div>

            <!-- 18+ Toggle -->
            <div
              class="flex items-center justify-between p-6 rounded-3xl border border-border/5 bg-muted/20 hover:border-primary/20 transition-all duration-500"
            >
              <div class="space-y-1">
                <div
                  class="text-sm font-bold text-foreground uppercase tracking-tight italic"
                >
                  {{ $t("studio.age_restriction") }}
                </div>
                <div class="text-[11px] text-muted-foreground font-medium">
                  {{ $t("studio.age_restriction_hint") }}
                </div>
              </div>
              <Switch
                :checked="editForm.is_18_plus"
                @update:checked="val => editForm.is_18_plus = val"
              />
            </div>
          </div>

          <div
            class="p-8 border-t border-border/5 flex justify-end gap-4 bg-muted/5"
          >
            <Button
              variant="ghost"
              @click="closeEditModal"
              class="px-8 py-7 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-auto"
            >
              {{ $t("studio.cancel") }}
            </Button>
            <Button
              @click="saveVideo"
              :disabled="isSaving || !editForm.title"
              class="rounded-xl px-10 py-7 text-[10px] font-black uppercase tracking-widest shadow-2xl disabled:opacity-50 transition-all h-auto"
            >
              <div class="flex items-center gap-2">
                <Icon
                  name="ph:circle-notch"
                  class="animate-spin"
                  v-if="isSaving"
                />
                <span>{{
                  isSaving ? $t("studio.saving") : $t("studio.apply_changes")
                }}</span>
              </div>
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* noinspection CssUnusedSymbol -- Vue <Transition name="fade"> transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
/* noinspection CssUnusedSymbol */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.glass-button {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
