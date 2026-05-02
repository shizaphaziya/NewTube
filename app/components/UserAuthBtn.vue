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

const loginBtnRef = ref(null);
useMagnetic(loginBtnRef, 40);
</script>

<template>
  <div
    v-if="user"
    class="flex items-center gap-4 animate-fade-in relative group/user"
  >
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          class="flex items-center gap-3 cursor-pointer h-auto p-1.5 rounded-xl pr-4 transition-all duration-300 group relative press-effect hover:bg-theme-border"
        >
          <div class="relative z-10">
            <div
              class="absolute -inset-1 bg-gradient-to-tr from-primary to-amber-500 rounded-lg opacity-0 group-hover:opacity-30 blur-sm transition-opacity"
            ></div>
            <Avatar class="w-9 h-9 rounded-lg border border-border group-hover:border-primary/50 transition-all duration-300 relative z-10 shadow-lg">
              <AvatarImage :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`" alt="Avatar" />
              <AvatarFallback>{{ (profile?.display_name || user.email || 'U')[0].toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div
              class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full z-20 shadow-lg"
            ></div>
          </div>
          <div class="flex flex-col items-start relative z-10">
            <span
              class="text-[14px] font-700 text-foreground hidden sm:block group-hover:text-primary dark:group-hover:text-white transition-colors leading-none"
            >
              {{ profile?.display_name || user.email?.split("@")[0] }}
            </span>
            <span
              class="text-[11px] font-600 text-muted-foreground hidden sm:block mt-1 group-hover:text-primary transition-colors"
            >
              {{ isAdmin ? $t("nav.status_pro") : $t("nav.status_user") }}
            </span>
          </div>
          <Icon
            name="ph:caret-down"
            class="text-muted-foreground text-xs transition-transform group-data-[state=open]:rotate-180 hidden sm:block"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-72 p-2 rounded-[24px] shadow-2xl border-border/40 backdrop-blur-3xl bg-background/80">
        <!-- Profile Header -->
        <div
          class="px-5 py-6 mb-2 rounded-[20px] bg-muted/40 border border-border/20 relative overflow-hidden group/header shadow-inner"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"
          ></div>
          <div class="relative z-10 flex items-center gap-4">
            <div class="relative group/avatar">
              <div
                class="absolute -inset-1 bg-primary/20 rounded-xl blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity"
              ></div>
              <Avatar class="w-12 h-12 rounded-xl border-2 border-primary/20 shadow-2xl transition-transform group-hover/avatar:scale-105 relative z-10">
                <AvatarImage :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`" />
                <AvatarFallback>{{ (profile?.display_name || user.email || 'U')[0].toUpperCase() }}</AvatarFallback>
              </Avatar>
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full shadow-lg z-20"
              ></div>
            </div>
            <div class="flex flex-col min-w-0">
              <span
                class="text-[15px] font-900 text-foreground truncate leading-tight tracking-tight"
              >
                {{ profile?.display_name || user.email?.split("@")[0] }}
              </span>
              <div class="flex items-center gap-2 mt-0.5">
                <span
                  class="text-[10px] font-800 text-muted-foreground uppercase tracking-[0.1em]"
                >
                  {{ isAdmin ? $t("nav.status_pro") : $t("nav.status_user") }}
                </span>
                <div
                  v-if="isAdmin"
                  class="w-1 h-1 bg-primary rounded-full animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuItem as-child>
          <NuxtLink
            to="/profile/settings"
            class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-primary/5 group/item transition-colors"
          >
            <Icon
              name="ph:user-circle-duotone"
              class="text-2xl text-muted-foreground group-hover:text-primary transition-all duration-300"
            />
            <div class="flex flex-col">
              <span class="text-[13px] font-800 text-foreground tracking-tight group-hover:text-primary transition-colors">
                {{ $t("nav.profile") || "Profile" }}
              </span>
              <span class="text-[10px] font-600 text-muted-foreground -mt-0.5 opacity-80">Manage your channel</span>
            </div>
            <Icon name="ph:caret-right" class="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuItem as-child>
          <NuxtLink
            to="/studio"
            class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-primary/5 group/item transition-colors"
          >
            <Icon
              name="ph:video-camera-duotone"
              class="text-2xl text-muted-foreground group-hover:text-primary transition-all duration-300"
            />
            <div class="flex flex-col">
              <span class="text-[13px] font-800 text-foreground tracking-tight group-hover:text-primary transition-colors">
                {{ $t("nav.studio") || "Studio" }}
              </span>
              <span class="text-[10px] font-600 text-muted-foreground -mt-0.5 opacity-80">Upload and edit videos</span>
            </div>
            <Icon name="ph:caret-right" class="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="my-2 bg-border/40" />

        <DropdownMenuItem @click="logout" class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 group/logout transition-colors">
          <Icon
            name="ph:sign-out-duotone"
            class="text-2xl transition-transform group-hover:-translate-x-1"
          />
          <span class="text-[13px] font-800 tracking-tight">{{ $t("nav.logout") || "Logout" }}</span>
          <Icon
            name="ph:arrow-right"
            class="ml-auto text-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <Button
    v-else
    ref="loginBtnRef"
    @click="appStore.openAuthModal()"
    class="relative group h-10 px-6 rounded-full bg-primary text-primary-foreground font-bold text-[14px] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden press-effect"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
    <Icon
      name="ph:user-circle-plus-duotone"
      class="text-2xl transition-transform group-hover:scale-110"
    />
    <span class="tracking-tight">{{ $t("nav.login") }}</span>
  </Button>
</template>
