<script setup lang="ts">
import type { Database } from "~/types/database.types";
import { useAppStore } from "~/store/app";

const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
const { profile, isAdmin } = useProfile();
const appStore = useAppStore();
const router = useRouter();

const logout = async () => {
  await client.auth.signOut();
  router.push("/");
};
</script>

<template>
  <div
    v-if="user"
    class="flex items-center gap-4 animate-fade-in relative group/user"
  >
    <!-- Trigger -->
    <div
      class="flex items-center gap-3 cursor-pointer no-underline hover:bg-theme-border p-1.5 rounded-xl pr-4 transition-all duration-300 group relative"
    >
      <div class="relative z-10">
        <div
          class="absolute -inset-1 bg-gradient-to-tr from-primary-600 to-amber-500 rounded-lg opacity-0 group-hover:opacity-30 blur-sm transition-opacity"
        ></div>
        <img
          :src="
            profile?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
          "
          class="w-9 h-9 rounded-lg border border-theme-border object-cover group-hover:border-primary-500/50 transition-all duration-300 relative z-10 shadow-lg"
        />
        <div
          class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-3 border-theme-surface rounded-full z-20 shadow-lg"
        ></div>
      </div>
      <div class="flex flex-col relative z-10">
        <span
          class="text-[14px] font-700 text-theme-text hidden sm:block group-hover:text-primary-600 dark:group-hover:text-white transition-colors leading-none"
        >
          {{ profile?.display_name || user.email?.split("@")[0] }}
        </span>
        <span
          class="text-[11px] font-600 text-theme-text-muted hidden sm:block mt-1 group-hover:text-primary-400 transition-colors"
        >
          {{ isAdmin ? $t("nav.status_pro") : $t("nav.status_user") }}
        </span>
      </div>
      <Icon
        name="ph:caret-down"
        class="text-theme-text-faint text-xs transition-transform group-hover/user:rotate-180 hidden sm:block"
      />
    </div>

    <!-- User Dropdown Menu -->
    <div
      class="absolute top-[calc(100%+0.5rem)] right-0 w-72 glass-panel rounded-[24px] p-2 opacity-0 invisible pointer-events-none -translate-y-2 scale-95 group-hover/user:opacity-100 user:visible user:pointer-events-auto user:translate-y-0 user:scale-100 transition-all duration-300 z-[100] shadow-2xl"
    >
      <!-- Profile Header in Dropdown -->
      <div
        class="px-5 py-6 mb-2 rounded-[20px] bg-theme-surface-raised/40 border border-theme-border/20 relative overflow-hidden group/header shadow-inner"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent opacity-40"
        ></div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="relative group/avatar">
            <div
              class="absolute -inset-1 bg-primary-500/20 rounded-xl blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity"
            ></div>
            <img
              :src="
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
              "
              class="w-12 h-12 rounded-xl border-2 border-primary-500/20 object-cover shadow-2xl transition-transform group-hover/avatar:scale-105 relative z-10"
            />
            <div
              class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-theme-surface rounded-full shadow-lg z-20"
            ></div>
          </div>
          <div class="flex flex-col min-w-0">
            <span
              class="text-[15px] font-900 text-theme-text truncate leading-tight tracking-tight"
            >
              {{ profile?.display_name || user.email?.split("@")[0] }}
            </span>
            <div class="flex items-center gap-2 mt-0.5">
              <span
                class="text-[10px] font-800 text-theme-text-faint uppercase tracking-[0.1em]"
              >
                {{ isAdmin ? $t("nav.status_pro") : $t("nav.status_user") }}
              </span>
              <div
                v-if="isAdmin"
                class="w-1 h-1 bg-primary-500 rounded-full animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-1.5 p-1">
        <NuxtLink
          to="/profile/settings"
          class="dropdown-item group/item relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity"
          ></div>
          <Icon
            name="ph:user-circle-duotone"
            class="text-2xl text-theme-text-muted group-hover/item:text-primary-500 item:scale-110 transition-all duration-300"
          />
          <div class="flex flex-col relative z-10">
            <span
              class="text-[13px] font-800 text-theme-text tracking-tight group-hover/item:text-primary-600 transition-colors"
              >{{ $t("nav.profile") || "Profile" }}</span
            >
            <span
              class="text-[10px] font-600 text-theme-text-faint -mt-0.5 opacity-80"
              >Manage your channel</span
            >
          </div>
          <Icon
            name="ph:caret-right"
            class="ml-auto text-xs text-theme-text-faint opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0"
          />
        </NuxtLink>

        <NuxtLink
          to="/studio"
          class="dropdown-item group/item relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity"
          ></div>
          <Icon
            name="ph:video-camera-duotone"
            class="text-2xl text-theme-text-muted group-hover/item:text-primary-500 item:scale-110 transition-all duration-300"
          />
          <div class="flex flex-col relative z-10">
            <span
              class="text-[13px] font-800 text-theme-text tracking-tight group-hover/item:text-primary-600 transition-colors"
              >{{ $t("nav.studio") || "Studio" }}</span
            >
            <span
              class="text-[10px] font-600 text-theme-text-faint -mt-0.5 opacity-80"
              >Upload and edit videos</span
            >
          </div>
          <Icon
            name="ph:caret-right"
            class="ml-auto text-xs text-theme-text-faint opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0"
          />
        </NuxtLink>

        <div class="h-px bg-theme-border/40 my-3 mx-4 opacity-50"></div>

        <button
          @click="logout"
          class="dropdown-item w-full group/logout text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all duration-300"
        >
          <Icon
            name="ph:sign-out-duotone"
            class="text-2xl transition-transform group-hover/logout:-translate-x-1"
          />
          <span class="text-[13px] font-800 tracking-tight">{{
            $t("nav.logout") || "Logout"
          }}</span>
          <Icon
            name="ph:arrow-right"
            class="ml-auto text-lg opacity-0 -translate-x-2 group-hover/logout:opacity-100 logout:translate-x-0 transition-all"
          />
        </button>
      </div>
    </div>
  </div>

  <button v-else @click="appStore.openAuthModal()" class="btn-primary group">
    <Icon
      name="ph:user-plus-fill"
      class="text-xl group-hover:rotate-12 transition-transform duration-300"
    />
    <span class="font-800 tracking-tight">{{ $t("nav.login") }}</span>
  </button>
</template>
