<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { useAppStore } from '~/store/app'

const user = useSupabaseUser()
const client = useSupabaseClient<Database>()
const { profile, isAdmin } = useProfile()
const appStore = useAppStore()
const router = useRouter()

const logout = async () => {
  await client.auth.signOut()
  router.push('/')
}
</script>

<template>
  <div v-if="user" class="flex items-center gap-4 animate-fade-in">
    <NuxtLink to="/profile/settings" class="flex items-center gap-3 cursor-pointer no-underline hover:bg-white/5 p-1.5 rounded-xl pr-4 transition-all duration-300 group relative overflow-hidden">
      <div class="relative z-10">
        <div class="absolute -inset-1 bg-gradient-to-tr from-primary-600 to-amber-500 rounded-lg opacity-0 group-hover:opacity-30 blur-sm transition-opacity"></div>
        <img
          :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`"
          class="w-9 h-9 rounded-lg border border-white/10 object-cover group-hover:border-primary-500/50 transition-all duration-300 relative z-10 shadow-lg"
        />
        <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-3 border-void-900 rounded-full z-20 shadow-lg"></div>
      </div>
      <div class="flex flex-col relative z-10">
        <span class="text-[13px] font-bold text-void-100 hidden sm:block group-hover:text-white transition-colors leading-none">
          {{ profile?.display_name || user.email?.split('@')[0] }}
        </span>
        <span class="text-[10px] font-600 text-void-500 hidden sm:block uppercase tracking-wider mt-1 group-hover:text-primary-400 transition-colors">
          {{ isAdmin ? $t('nav.status_pro') : $t('nav.status_user') }}
        </span>
      </div>
    </NuxtLink>

    <div class="w-[1px] h-6 bg-white/10 mx-1"></div>

    <button @click="logout" class="btn-icon group/logout" :title="$t('nav.logout')">
      <div class="i-ph-sign-out text-xl group-hover/logout:(text-primary-500 -translate-x-1) transition-all duration-300"></div>
    </button>
  </div>
  <button v-else @click="appStore.openAuthModal()" class="btn-primary group">
    <div class="i-ph-user-plus-fill text-xl group-hover:rotate-12 transition-transform duration-300"></div>
    <span class="font-800 tracking-tight">{{ $t('nav.login') }}</span>
  </button>
</template>

