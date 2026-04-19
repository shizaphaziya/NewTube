<script setup lang="ts">
import type { Database } from '~/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

definePageMeta({
  middleware: ['admin']
})

const supabase = useSupabaseClient<Database>()
const { t } = useI18n()

const { data: users, refresh } = await useAsyncData('admin-users', async () => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return data as Profile[] | null
})

const toggleStatus = async (user: Profile) => {
  const newStatus = user.status === 'blocked' ? 'active' : 'blocked'
  const { error } = await supabase
    .from('profiles')
    .update({ status: newStatus as any })
    .eq('id', user.id)
  
  if (!error) {
    refresh()
  } else {
    alert(error.message)
  }
}

const changeRole = async (userId: string, role: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role: role as any })
    .eq('id', userId)
  
  if (!error) {
    refresh()
  } else {
    alert(error.message)
  }
}

const handleRoleChange = (userId: string, event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target) {
    changeRole(userId, target.value)
  }
}

const getStatusColor = (status: string | null) => {
  return status === 'blocked' 
    ? 'text-red-400 bg-red-400/5 border-red-400/10' 
    : 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10'
}
</script>

<template>
  <div class="layout-container pb-20">
    <div class="flex items-center gap-6 mb-12">
      <div class="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 shadow-2xl">
        <div class="i-ph-users-four-bold text-3xl"></div>
      </div>
      <div>
        <h1 class="text-3xl font-black font-brand tracking-tighter text-white uppercase italic">{{ t('admin.users_title') }}</h1>
        <p class="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mt-1 italic">{{ t('admin.users_subtitle') }}</p>
      </div>
    </div>

    <div class="glass-card overflow-hidden border-white/5 shadow-2xl animate-fade-in">
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
              <th class="px-8 py-6">{{ t('admin.identity') }}</th>
              <th class="px-8 py-6">{{ t('admin.clearance') }}</th>
              <th class="px-8 py-6">{{ t('admin.status') }}</th>
              <th class="px-8 py-6 text-right">{{ t('admin.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-sm">
            <tr v-for="profile in users" :key="profile.id" class="hover:bg-white/[0.02] transition-all duration-300 group">
              <td class="px-8 py-8">
                <div class="flex items-center gap-5">
                  <div class="relative">
                    <img crossorigin="anonymous" :src="profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`" class="w-10 h-10 rounded-full bg-void border border-white/10 object-cover shadow-xl group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-void flex items-center justify-center" :class="profile.status === 'blocked' ? 'bg-red-500' : 'bg-emerald-500'">
                      <div :class="profile.status === 'blocked' ? 'i-ph-x-bold' : 'i-ph-check-bold'" class="text-[7px] text-white font-black"></div>
                    </div>
                  </div>
                  <div>
                    <div class="text-[13px] font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{{ profile.display_name || t('admin.anonymous') }}</div>
                    <div class="text-[9px] text-white/30 font-medium tracking-wide mt-0.5">{{ t('admin.registered') }}: {{ profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-8">
                <div class="flex items-center gap-2">
                  <select 
                    @change="handleRoleChange(profile.id, $event)"
                    class="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                  >
                    <option value="user" :selected="profile.role === 'user'">{{ t('admin.role_user') }}</option>
                    <option value="admin" :selected="profile.role === 'admin'">{{ t('admin.role_admin') }}</option>
                  </select>
                </div>
              </td>
              <td class="px-8 py-8">
                <span 
                  class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border"
                  :class="getStatusColor(profile.status)"
                >
                  {{ t('studio.status_' + (profile.status || 'active')) }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    @click="toggleStatus(profile)"
                    class="p-2.5 rounded-lg border transition-all"
                    :class="profile.status === 'blocked' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/10' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/10'"
                    :title="profile.status === 'blocked' ? t('admin.unblock_account') : t('admin.suspend_account')"
                  >
                    <div :class="profile.status === 'blocked' ? 'i-ph-shield-check-bold' : 'i-ph-shield-slash-bold'" class="text-lg"></div>
                  </button>
                  <NuxtLink 
                    :to="`/profile/${profile.id}`"
                    class="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:bg-white hover:text-void transition-all"
                  >
                    <div class="i-ph-eye-bold text-lg"></div>
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
