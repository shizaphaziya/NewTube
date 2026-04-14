<script setup>
const user = useSupabaseUser()
const client = useSupabaseClient()
const { profile } = useProfile()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <div v-if="user" class="flex items-center gap-4 animate-fade-in-up">
    <div class="flex items-center gap-3 group cursor-pointer">
      <div class="text-right">
        <div class="text-xs font-bold text-white group-hover:text-silver-white transition-all tracking-widest uppercase">
          {{ profile?.display_name || user.email?.split('@')[0] }}
        </div>
        <div class="text-[10px] text-white/30 tracking-widest uppercase font-brand">{{ profile?.role || 'User' }}</div>
      </div>
      <div class="relative">
        <img 
          :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`" 
          class="w-10 h-10 rounded-full border border-white/5 group-hover:border-white/20 transition-all p-0.5 bg-void-card ring-1 ring-white/5"
        />
      </div>
    </div>
    <button @click="logout" class="w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all">
      <div class="i-ph-sign-out-bold text-lg"></div>
    </button>
  </div>
  <NuxtLink v-else to="/auth/login" class="btn-primary flex items-center gap-2 group">
    <div class="i-ph-user-bold transition-transform group-hover:rotate-12"></div>
    <span class="text-xs uppercase tracking-widest font-bold">{{ $t('nav.login') }}</span>
  </NuxtLink>
</template>
