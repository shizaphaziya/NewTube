<script setup lang="ts">
import type { Database } from '~/types/database.types'

const user = useSupabaseUser()
const client = useSupabaseClient<Database>()
const { profile, isAdmin } = useProfile()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <div v-if="user" class="flex items-center gap-4 animate-fade-in-up">
    <NuxtLink to="/profile/settings" class="flex items-center gap-3 group cursor-pointer no-underline bg-white/[0.03] hover:bg-white/[0.06] p-1.5 pr-4 rounded-xl border border-white/5 transition-all">
      <div class="relative shrink-0">
        <img 
          :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`" 
          class="w-8 h-8 rounded-lg border border-white/5 group-hover:border-white/20 transition-all p-0.5 bg-void-card ring-1 ring-white/5 shadow-lg"
        />
      </div>
      <div class="text-left">
        <div class="text-xs font-bold text-white/90 group-hover:text-white transition-all tracking-widest uppercase">
          {{ profile?.display_name || user.email?.split('@')[0] }}
        </div>
        <div class="text-[9px] text-white/30 tracking-[0.2em] uppercase font-brand mt-0.5">
          {{ isAdmin ? $t('admin.role_admin') : $t('admin.role_user') }}
        </div>
      </div>
    </NuxtLink>
    <button @click="logout" class="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
      <div class="i-ph-sign-out-bold text-lg group-hover:translate-x-0.5 transition-transform"></div>
    </button>
  </div>
  <NuxtLink v-else to="/auth/login" class="btn-primary flex items-center gap-2 group">
    <div class="i-ph-user-bold transition-transform group-hover:rotate-12"></div>
    <span class="text-xs uppercase tracking-widest font-bold">{{ $t('nav.login') }}</span>
  </NuxtLink>
</template>
