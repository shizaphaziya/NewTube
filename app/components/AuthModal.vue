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
  email: z.string().email(t('auth.invalid_email')),
  password: z.string().min(6, t('auth.password_min'))
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
      success(t('auth.check_email'))
      appStore.closeAuthModal()
    } else {
      const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      success(t('auth.login_success'))
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
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-950/80 backdrop-blur-2xl"
        @click.self="appStore.closeAuthModal"
      >
        <div
          class="glass-card w-full max-w-[400px] p-8 relative overflow-hidden"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 300, ease: 'easeOut' } }"
        >
          <button
            @click="appStore.closeAuthModal"
            class="absolute top-4 right-4 btn-icon !w-8 !h-8"
          >
            <div class="i-ph-x text-sm"></div>
          </button>

          <div class="text-center mb-8">
            <div class="w-12 h-12 rounded-sm bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <div class="i-ph-play-fill text-black text-xl translate-x-px"></div>
            </div>
            <h2 class="text-2xl font-sans font-bold tracking-tight text-white mb-2">
              {{ isRegister ? t('auth.join') : t('auth.welcome') }}
            </h2>
            <p class="text-[10px] font-mono font-medium text-void-500 uppercase tracking-widest">
              {{ t('auth.required_action') }}
            </p>
          </div>

          <form @submit.prevent="handleAuth" class="space-y-4">
            <div v-if="validationError" class="p-2 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center">
              {{ validationError }}
            </div>

            <div class="space-y-3">
              <div class="relative group">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 i-ph-envelope-simple text-void-500 group-focus-within:text-white transition-colors"></div>
                <input
                  v-model="email"
                  type="email"
                  required
                  :placeholder="t('auth.email')"
                  class="glass-input w-full pl-11 h-11"
                />
              </div>
              <div class="relative group">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 i-ph-lock-key text-void-500 group-focus-within:text-white transition-colors"></div>
                <input
                  v-model="password"
                  type="password"
                  required
                  :placeholder="t('auth.password')"
                  class="glass-input w-full pl-11 h-11"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full h-11 mt-2"
            >
              <span v-if="!loading">{{ isRegister ? t('auth.create_account') : t('auth.sign_in') }}</span>
              <div v-else class="i-ph-circle-notch animate-spin text-lg"></div>
            </button>
          </form>

          <div class="mt-6 text-center">
            <button
              @click="isRegister = !isRegister"
              class="text-[11px] font-medium text-void-500 hover:text-white transition-colors"
            >
              {{ isRegister ? t('auth.already_have_account') : t('auth.no_account') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

