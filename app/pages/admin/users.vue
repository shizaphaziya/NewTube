<script setup>
definePageMeta({
  middleware: ["admin"],
});

const supabase = useSupabaseClient();
const { error: showError } = useToast();
const { confirm: showConfirm } = useConfirm();
const { t } = useI18n();

const { isAdmin } = useProfile();

useSeoMeta({
  title: () => `${t("admin.users_management")} - NewTube`,
  description: () => t("admin.title"),
});

const { data: users, refresh } = await useAsyncData(
  "admin-users",
  async () => {
    if (!isAdmin.value) return [];
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
  { watch: [isAdmin] },
);

const updateUserRole = async (userId, newRole) => {
  if (!(await showConfirm(`${t("common.confirm_action")}?`))) return;

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (!error) {
    refresh();
  } else {
    showError(error.message);
  }
};
</script>

<template>
  <div class="px-4 md:px-10 py-10 relative min-h-screen">
    <div class="space-y-16">
      <!-- Header -->
      <div class="space-y-2">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[8px] font-black text-white/40 tracking-[0.3em] uppercase"
          >
            {{ $t("admin.title") }}
          </div>
        </div>
        <h1
          class="text-5xl font-brand font-black tracking-tighter text-white uppercase italic"
        >
          {{ $t("admin.users_management") }}
        </h1>
      </div>

      <!-- Users List -->
      <div class="glass-card overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/[0.02] border-b border-white/[0.05]">
              <th
                class="px-8 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]"
              >
                {{ $t("admin.video_author") }}
              </th>
              <th
                class="px-8 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]"
              >
                {{ $t("admin.role") }}
              </th>
              <th
                class="px-8 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]"
              >
                {{ $t("admin.status") }}
              </th>
              <th
                class="px-8 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] text-right"
              >
                {{ $t("admin.actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/[0.04]">
            <tr
              v-for="profile in users"
              :key="profile.id"
              class="group hover:bg-white/[0.01] transition-colors"
            >
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-void/50 border border-white/10 overflow-hidden shrink-0"
                  >
                    <img
                      v-if="profile.avatar_url"
                      :src="profile.avatar_url"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-white/10"
                    >
                      <Icon name="ph:user-bold" class="text-xl" />
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p
                      class="text-sm font-black text-white tracking-tight truncate"
                    >
                      {{
                        profile.display_name ||
                        profile.full_name ||
                        $t("admin.anonymous")
                      }}
                    </p>
                    <p
                      class="text-[10px] text-white/20 font-bold uppercase tracking-widest truncate"
                    >
                      {{ profile.id }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div
                    class="w-1.5 h-1.5 rounded-full"
                    :class="
                      profile.role === 'admin' ? 'bg-white' : 'bg-white/20'
                    "
                  ></div>
                  <span
                    class="text-[10px] font-black uppercase tracking-widest"
                    :class="
                      profile.role === 'admin' ? 'text-white' : 'text-white/30'
                    "
                  >
                    {{
                      profile.role
                        ? $t("nav.status_" + profile.role)
                        : $t("nav.status_user")
                    }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span
                  class="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[8px] font-black text-white/40 uppercase tracking-widest"
                >
                  {{ profile.status || $t("admin.active") }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <button
                  v-if="profile.role !== 'admin'"
                  @click="updateUserRole(profile.id, 'admin')"
                  class="text-[9px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-colors"
                >
                  {{ $t("admin.promote") }}
                </button>
                <button
                  v-else
                  @click="updateUserRole(profile.id, 'user')"
                  class="text-[9px] font-black text-red-500/30 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  {{ $t("admin.demote") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* noinspection CssUnusedSymbol -- Vue <Transition name="fade"> transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
/* noinspection CssUnusedSymbol */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
