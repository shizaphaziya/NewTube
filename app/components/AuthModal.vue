<script setup lang="ts">
import { useAppStore } from '~/store/app'
import { z } from 'zod'

const appStore = useAppStore()
const client = useSupabaseClient()
const { t } = useI18n()
const { success, error: showError } = useToast()

const email = ref('')
const password = ref('')
const isRegister = ref(false)
const loading = ref(false)
const validationError = ref('')

// Zod Schema
const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// Handles form submission for both Sign In and Sign Up using Supabase Auth
const handleAuth = async () => {
  loading.value = true
  validationError.value = ''

  try {
    // Validate
    const result = authSchema.safeParse({ email: email.value, password: password.value })
    if (!result.success) {
      validationError.value = result.error.errors[0].message
      return
    }

    if (isRegister.value) {
      const { error } = await client.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            display_name: email.value.split('@')[0],
          }
        }
      })
      if (error) throw error
      success(t('auth.check_email') || 'Check your email for confirmation')
      appStore.closeAuthModal()
    } else {
      const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      success('Successfully logged in')
      appStore.closeAuthModal()
      // Refresh current page context if needed, but session state handles most
    }
  } catch (e: any) {
    showError(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="appStore.isAuthModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
        @click.self="appStore.closeAuthModal"
      >
        <div
          class="bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-sm p-10 relative shadow-xl overflow-hidden"
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 10 }"
          :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 400, ease: 'easeOut' } }"
        >
          <!-- Background glow -->
          <div class="absolute -top-40 -left-40 w-80 h-80 bg-white/[0.03] rounded-full blur-[60px] pointer-events-none"></div>

          <button
            @click="appStore.closeAuthModal"
            class="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-10"
          >
            <div class="i-ph-x-bold text-sm"></div>
          </button>

          <div class="text-center mb-8 relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <div class="i-ph-play-fill text-black text-2xl translate-x-0.5"></div>
            </div>
            <h2 class="text-xl font-bold tracking-tight text-white mb-1">
              {{ isRegister ? (t('auth.join') || 'Join NewTube') : (t('auth.welcome') || 'Welcome Back') }}
            </h2>
            <p class="text-[11px] font-medium text-white/40 uppercase tracking-widest">
              {{ t('auth.required_action') || 'Authentication Required' }}
            </p>
          </div>

          <form @submit.prevent="handleAuth" class="space-y-5 relative z-10">
            <div v-if="validationError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {{ validationError }}
            </div>

            <div class="space-y-4">
              <div class="relative group">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 i-ph-envelope-simple-bold text-white/20 group-focus-within:text-white/60 transition-colors"></div>
                <input
                  v-model="email"
                  type="email"
                  required
                  :placeholder="t('auth.email') || 'Email address'"
                  class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                />
              </div>
              <div class="relative group">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 i-ph-lock-key-bold text-white/20 group-focus-within:text-white/60 transition-colors"></div>
                <input
                  v-model="password"
                  type="password"
                  required
                  :placeholder="t('auth.password') || 'Password'"
                  class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <span v-if="!loading">{{ isRegister ? (t('auth.create_account') || 'Create Account') : (t('auth.sign_in') || 'Sign In') }}</span>
              <div v-else class="i-ph-circle-notch-bold animate-spin text-lg"></div>
            </button>
          </form>

          <div class="mt-6 text-center relative z-10">
            <button
              @click="isRegister = !isRegister"
              class="text-[11px] font-medium text-white/40 hover:text-white transition-colors"
            >
              {{ isRegister ? (t('auth.already_have_account') || 'Already have an account? Sign In') : (t('auth.no_account') || 'No account? Create one') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

