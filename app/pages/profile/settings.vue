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
  <div class="layout-container py-8 max-w-3xl mx-auto">
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-white mb-1">
          {{ t("profile.settings") }}
        </h1>
        <p class="text-white/60 text-sm">
          {{ t("profile.settings_subtitle") }}
        </p>
      </div>

      <div
        class="bg-[#18181b] border border-white/5 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm"
      >
        <!-- Avatar Section -->
        <div
          class="flex flex-col md:flex-row gap-8 items-start md:items-center"
        >
          <div class="relative group">
            <img
              :src="
                form.avatar_url ||
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
              "
              class="w-24 h-24 rounded-full border border-white/10 object-cover bg-[#27272a]"
            />
          </div>
          <div class="flex-1 space-y-4 w-full">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-white/90"
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
                <button
                  @click="triggerFileInput"
                  type="button"
                  class="btn-primary py-2 px-4 text-sm"
                  :disabled="loading"
                >
                  <Icon name="ph:spinner" class="animate-spin" v-if="loading" />
                  <span v-else>{{
                    t("profile.upload_new") || "Upload New"
                  }}</span>
                </button>
                <input
                  v-model="form.avatar_url"
                  type="url"
                  class="glass-input flex-1"
                  :placeholder="t('profile.avatar_url_placeholder')"
                />
              </div>
            </div>
            <p class="text-xs text-white/40">{{ t("profile.avatar_note") }}</p>
          </div>
        </div>

        <div class="h-px bg-white/5"></div>

        <!-- Details Section -->
        <div class="space-y-6">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-white/90">{{
              t("profile.display_name")
            }}</label>
            <input
              v-model="form.display_name"
              type="text"
              class="glass-input w-full"
              :placeholder="t('profile.display_name_placeholder')"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-white/90">{{
              t("profile.email_address")
            }}</label>
            <input
              :value="user?.email"
              type="email"
              disabled
              class="glass-input w-full opacity-50 cursor-not-allowed"
            />
            <p class="text-xs text-white/40 mt-1">
              {{ t("profile.email_locked") }}
            </p>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button @click="saveProfile" :disabled="isSaving" class="btn-primary">
            <Icon name="ph:spinner" class="animate-spin" v-if="isSaving" />
            {{ isSaving ? t("profile.saving") : t("profile.save_changes") }}
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div
        class="border border-red-500/20 rounded-2xl p-6 md:p-8 space-y-4 bg-red-500/5"
      >
        <div>
          <h3 class="text-red-400 font-medium">
            {{ t("profile.danger_zone") }}
          </h3>
          <p class="text-red-400/60 text-sm mt-1">
            {{ t("profile.delete_warning") }}
          </p>
        </div>
        <button
          @click="deleteAccount"
          class="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
        >
          {{ t("profile.delete_account") }}
        </button>
      </div>
    </div>
  </div>
</template>
