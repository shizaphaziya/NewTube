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
  <div v-if="user" class="flex items-center gap-2 animate-fade-in">
    <NuxtLink to="/profile/settings" class="flex items-center gap-2 cursor-pointer no-underline hover:bg-white/5 p-1 rounded-full pr-3 transition-colors">
      <img
        :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`"
        class="w-8 h-8 rounded-full border border-white/10 object-cover"
      />
      <span class="text-sm font-medium text-white/90 hidden sm:block">
        {{ profile?.display_name || user.email?.split('@')[0] }}
      </span>
    </NuxtLink>
    <button @click="logout" class="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
      <div class="i-ph-sign-out text-lg"></div>
    </button>
  </div>
  <button v-else @click="appStore.openAuthModal()" class="btn-primary flex items-center gap-2">
    <div class="i-ph-user"></div>
    <span>{{ $t('nav.login') }}</span>
  </button>
</template>
