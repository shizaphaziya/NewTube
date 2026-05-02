<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { t } = useI18n();

const { profile, refresh } = useProfile();
const isSaving = ref(false);

const loading = ref(false);
const fileInput = ref(null);

const handleAvatarUpload = async (event) => {
  try {
    loading.value = true;
    const file = event.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.value.id}-${Math.random()}.${fileExt}`;

    // Upload to avatars bucket (as defined in RLS)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Stage 3: Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    form.value.avatar_url = publicUrl;
    await saveProfile(); // auto-save
  } catch (e) {
    console.error("Avatar update failed:", e.message);
    alert("Failed to update avatar: " + e.message);
  } finally {
    loading.value = false;
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const form = ref({
  display_name: "",
  avatar_url: "",
});

watchEffect(() => {
  if (profile.value) {
    form.value.display_name = profile.value.display_name || "";
    form.value.avatar_url = profile.value.avatar_url || "";
  }
});

const saveProfile = async () => {
  isSaving.value = true;
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: form.value.display_name,
      avatar_url: form.value.avatar_url,
      updated_at: new Date(),
    })
    .eq("id", user.value.id);

  if (!error) {
    await refresh();
    useToast().add({
      title: t("profile.update_success"),
      type: "success",
    });
  } else {
    useToast().add({
      title: t("profile.update_failed"),
      description: error.message,
      type: "error",
    });
  }
  isSaving.value = false;
};

const { confirm } = useConfirm();

const deleteAccount = async () => {
  if (await confirm(t("profile.confirm_deletion"))) {
    // Delete account logic here
  }
};

useSeoMeta({
  title: () => `${t("profile.settings")} - ${t("seo.title")}`,
});
</script>

<template>
  <div class="layout-container py-12 px-4 max-w-3xl mx-auto">
    <div class="space-y-12 relative z-10">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-foreground uppercase tracking-tighter italic">
          {{ t("profile.settings") }}
        </h1>
        <p class="text-muted-foreground text-sm font-medium">
          {{ t("profile.settings_subtitle") }}
        </p>
      </div>

      <Card
        class="glass-card border-border/5 rounded-[2.5rem] p-8 md:p-10 space-y-10 shadow-2xl bg-muted/20 backdrop-blur-xl"
      >
        <!-- Avatar Section -->
        <div
          class="flex flex-col md:flex-row gap-10 items-start md:items-center"
        >
          <div class="relative group">
            <div class="absolute -inset-2 bg-gradient-to-tr from-primary to-indigo-500 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity"></div>
            <Avatar class="w-32 h-32 border-2 border-border/10 shadow-2xl bg-muted relative z-10">
              <AvatarImage :src="form.avatar_url || profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              @click="triggerFileInput"
              class="absolute bottom-0 right-0 w-10 h-10 rounded-xl shadow-xl z-20 hover:scale-110 transition-transform"
            >
              <Icon name="ph:camera-duotone" class="text-xl" />
            </Button>
          </div>
          <div class="flex-1 space-y-5 w-full">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2"
                >{{ t("profile.profile_picture") }} URL</label
              >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
              <div class="flex items-center gap-4">
                <Input
                  v-model="form.avatar_url"
                  type="url"
                  class="flex-1 rounded-2xl py-6 px-6 text-sm font-medium bg-background/50 border-border/40 focus-visible:ring-primary/20 h-auto"
                  :placeholder="t('profile.avatar_url_placeholder')"
                />
              </div>
            </div>
            <p class="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest ml-2">{{ t("profile.avatar_note") }}</p>
          </div>
        </div>

        <Separator class="bg-border/5" />

        <!-- Details Section -->
        <div class="space-y-8">
          <div class="space-y-3">
            <label class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">{{
              t("profile.display_name")
            }}</label>
            <Input
              v-model="form.display_name"
              type="text"
              class="w-full rounded-2xl py-6 px-6 text-sm font-medium bg-background/50 border-border/40 focus-visible:ring-primary/20 h-auto"
              :placeholder="t('profile.display_name_placeholder')"
            />
          </div>

          <div class="space-y-3">
            <label class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">{{
              t("profile.email_address")
            }}</label>
            <Input
              :value="user?.email"
              type="email"
              disabled
              class="w-full rounded-2xl py-6 px-6 text-sm font-medium bg-muted/50 border-border/10 opacity-50 cursor-not-allowed h-auto"
            />
            <p class="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest ml-2">
              {{ t("profile.email_locked") }}
            </p>
          </div>
        </div>

        <div class="pt-6 flex justify-end">
          <Button
            @click="saveProfile"
            :disabled="isSaving"
            size="lg"
            class="rounded-xl px-12 py-7 font-black uppercase tracking-widest text-xs h-auto shadow-2xl shadow-primary/20"
          >
            <Icon name="ph:spinner" class="animate-spin mr-2" v-if="isSaving" />
            {{ isSaving ? t("profile.saving") : t("profile.save_changes") }}
          </Button>
        </div>
      </Card>

      <!-- Danger Zone -->
      <Card
        class="border-destructive/20 rounded-[2rem] p-8 md:p-10 space-y-6 bg-destructive/5 backdrop-blur-xl"
      >
        <div class="space-y-2">
          <h3 class="text-destructive font-black uppercase tracking-widest text-sm italic">
            {{ t("profile.danger_zone") }}
          </h3>
          <p class="text-destructive/60 text-xs font-medium uppercase tracking-tight">
            {{ t("profile.delete_warning") }}
          </p>
        </div>
        <Button
          @click="deleteAccount"
          variant="destructive"
          class="rounded-xl px-8 py-6 font-black uppercase tracking-widest text-xs h-auto bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20 transition-all"
        >
          {{ t("profile.delete_account") }}
        </Button>
      </Card>
    </div>

    <!-- Cinematic Aura -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-ambient"
      ></div>
      <div
        class="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full animate-ambient"
        style="animation-delay: -5s"
      ></div>
    </div>
  </div>
</template>
