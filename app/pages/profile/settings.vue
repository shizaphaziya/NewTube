<script setup lang="ts">
import type { Database } from '~/types/database.types'

const { profile, updateProfile } = useProfile()
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { t } = useI18n()

const displayName = ref('')
const avatarUrl = ref('')
const loading = ref(false)
const success = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)

// Sync form with profile data, but don't overwrite if user is typing
watch(profile, (p) => {
  if (p) {
    displayName.value = p.display_name || ''
    avatarUrl.value = p.avatar_url || ''
  }
}, { immediate: true })

const onAvatarSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  loading.value = true
  try {
    // Stage 1: Get/Verify user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) throw new Error('Authentication lost. Please log in again.')

    const fileExt = file.name.split('.').pop()
    const filePath = `${authUser.id}/avatar.${fileExt}`

    // Upload to avatars bucket (as defined in RLS)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    // Add cache buster for immediate visual feedback
    avatarUrl.value = `${data.publicUrl}?t=${Date.now()}`
  } catch (e: any) {
    alert(e.message || 'Avatar upload failed')
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (loading.value) return
  
  loading.value = true
  success.value = false
  
  try {
    const { error, data } = await updateProfile({
      display_name: displayName.value,
      avatar_url: avatarUrl.value
    })

    if (!error) {
      success.value = true
      // Force sync local refs
      if (data) {
        displayName.value = data.display_name || ''
        avatarUrl.value = data.avatar_url || ''
      }
      setTimeout(() => {
        success.value = false
      }, 3000)
    } else {
      throw error
    }
  } catch (e: any) {
    alert((t('profile.update_failed') || 'Failed to update profile') + ': ' + (e.message || e))
  } finally {
    loading.value = false
  }
}

const isDeleteConfirmOpen = ref(false)
const deleteLoading = ref(false)

const handleDeleteAccount = async () => {
  if (deleteLoading.value) return
  deleteLoading.value = true
  
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) throw new Error('Auth session lost')

    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', authUser.id)
    
    if (!error) {
      await supabase.auth.signOut()
      navigateTo('/')
    } else {
      throw error
    }
  } catch (e: any) {
    alert(e.message || 'Deletion failed')
  } finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <div class="layout-container py-12 px-4 max-w-2xl mx-auto">
    <div v-motion-pop-in class="glass-card p-8 md:p-12 relative overflow-hidden rounded-xl border-white/5">
      <!-- Background Glow -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-white/[0.02] blur-[60px] rounded-full pointer-events-none"></div>

      <div class="flex items-center gap-6 mb-12">
        <div class="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40">
          <div class="i-ph-user-gear-bold text-2xl"></div>
        </div>
        <div>
          <h1 class="text-2xl font-black font-brand tracking-tighter text-white uppercase">{{ t('profile.settings') || 'Settings' }}</h1>
          <p class="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mt-1">{{ t('profile.identity_management') || 'Identity Management' }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSave" class="space-y-10">
        <!-- Avatar Section -->
        <div class="flex flex-col items-center sm:flex-row gap-8 pb-10 border-b border-white/5">
          <div class="relative group">
            <img 
              :src="avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`" 
              class="w-32 h-32 rounded-full border-2 border-white/10 p-1.5 bg-void-card shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
            <button 
              type="button"
              @click="avatarInput?.click()"
              class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full border border-white/10 backdrop-blur-sm"
            >
              <div class="i-ph-camera-bold text-white text-2xl"></div>
            </button>
            <input ref="avatarInput" type="file" hidden accept="image/*" @change="onAvatarSelect" />
          </div>
          <div class="space-y-2 text-center sm:text-left">
            <h3 class="text-xs font-black text-white/60 uppercase tracking-widest">{{ t('profile.profile_picture') || 'Profile Picture' }}</h3>
            <p class="text-[10px] text-white/20 font-bold leading-relaxed max-w-[200px] uppercase tracking-widest">{{ t('profile.avatar_note') || 'A custom identity across the network.' }}</p>
          </div>
        </div>

        <!-- Inputs -->
        <div class="space-y-8">
          <div class="space-y-3 group">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-silver transition-colors">{{ t('profile.display_name') || 'Display Name' }}</label>
            <input 
              v-model="displayName"
              type="text"
              class="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-xl font-brand font-black tracking-tight focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/[0.06] text-white" 
              placeholder="Your Alias" 
            />
          </div>

          <div class="space-y-3">
             <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">{{ t('auth.email') || 'Account Email' }}</label>
             <div class="w-full bg-white/[0.02] border border-white/5 rounded-xl p-5 text-sm text-white/20 font-bold tracking-widest">
               {{ user?.email }}
             </div>
             <p class="text-[8px] text-white/10 font-bold uppercase tracking-widest ml-1">{{ t('profile.email_locked') || 'Contact support to change verified email.' }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-6">
          <button 
            type="submit"
            :disabled="loading"
            class="btn-primary w-full py-6 text-xs font-black tracking-[0.4em] uppercase group flex items-center justify-center gap-4"
          >
            <span v-if="!loading">{{ t('profile.save_changes') || 'Update Profile' }}</span>
            <div v-if="!loading" class="i-ph-arrow-right-bold group-hover:translate-x-1 transition-transform"></div>
            <div v-else class="i-ph-circle-notch-bold animate-spin text-xl"></div>
          </button>
          
          <div v-if="success" v-motion-pop-in class="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">
            {{ t('profile.update_success') || 'Database update complete.' }}
          </div>
        </div>

        <div class="mt-20 pt-10 border-t border-red-500/10">
          <h3 class="text-[10px] font-black text-red-500/40 uppercase tracking-[0.3em] mb-6 italic">{{ t('profile.danger_zone') }}</h3>
          
          <div v-if="!isDeleteConfirmOpen">
            <button 
              type="button"
              @click="isDeleteConfirmOpen = true"
              class="w-full py-4 rounded-xl border border-red-500/10 text-red-500/30 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-500 transition-all text-center"
            >
              {{ t('profile.delete_account') || 'Initiate Account Termination' }}
            </button>
          </div>
          
          <div v-else v-motion-pop-in class="bg-red-500/5 border border-red-500/20 rounded-xl p-8 text-center space-y-6">
            <div class="i-ph-warning-octagon-bold text-red-500 text-3xl mx-auto"></div>
            <div>
              <p class="text-xs font-black text-white uppercase tracking-tight">{{ t('profile.confirm_deletion') || 'Irreversible Action' }}</p>
              <p class="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-2">{{ t('profile.delete_warning') || 'Your profile and content will be hidden from the network.' }}</p>
            </div>
            <div class="flex gap-4">
              <button 
                type="button"
                @click="isDeleteConfirmOpen = false"
                class="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all"
              >
                {{ t('common.cancel') || 'Abort' }}
              </button>
              <button 
                type="button"
                @click="handleDeleteAccount"
                :disabled="deleteLoading"
                class="flex-1 py-4 rounded-xl bg-red-500 text-void text-[9px] font-black uppercase tracking-widest hover:bg-red-400 transition-all disabled:opacity-50"
              >
                <span v-if="!deleteLoading">{{ t('profile.confirm_delete') || 'Terminate' }}</span>
                <div v-else class="i-ph-circle-notch-bold animate-spin mx-auto"></div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
