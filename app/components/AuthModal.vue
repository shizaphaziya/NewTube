<script setup lang="ts">
import { useAppStore } from "~/store/app";
import { z } from "zod";

const appStore = useAppStore();
const client = useSupabaseClient();
const { t } = useI18n();
const { success, error: showError } = useToast();

const email = ref("");
const password = ref("");
const isRegister = ref(false);
const loading = ref(false);
const validationError = ref("");

// Zod Schema
const authSchema = z.object({
  email: z.string().email(t("auth.invalid_email")),
  password: z.string().min(6, t("auth.password_min")),
});

// Handles form submission for both Sign In and Sign Up using Supabase Auth
const handleAuth = async () => {
  loading.value = true;
  validationError.value = "";

  try {
    // Validate
    const result = authSchema.safeParse({
      email: email.value,
      password: password.value,
    });
    if (!result.success) {
      validationError.value = result.error.errors[0].message;
      return;
    }

    if (isRegister.value) {
      const { error } = await client.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            display_name: email.value.split("@")[0],
          },
        },
      });
      if (error) throw error;
      success(t("auth.check_email"));
      appStore.closeAuthModal();
    } else {
      const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      success(t("auth.login_success"));
      appStore.closeAuthModal();
      // Refresh current page context if needed, but session state handles most
    }
  } catch (e: any) {
    showError(e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="appStore.isAuthModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-950/80 backdrop-blur-2xl"
        @click.self="appStore.closeAuthModal"
      >
        <Transition name="modal-card" appear>
          <div
            v-if="appStore.isAuthModalOpen"
            class="glass-card w-full max-w-[400px] p-8 relative overflow-hidden"
          >
            <button
              @click="appStore.closeAuthModal"
              class="absolute top-4 right-4 btn-icon !w-8 !h-8"
            >
              <Icon name="ph:x" class="text-sm" />
            </button>

            <div class="text-center mb-8">
              <div
                class="w-12 h-12 rounded-sm bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl"
              >
                <Icon
                  name="ph:play-fill"
                  class="text-black text-xl translate-x-px"
                />
              </div>
              <h2
                class="text-2xl font-sans font-bold tracking-tight text-white mb-2"
              >
                {{ isRegister ? t("auth.join") : t("auth.welcome") }}
              </h2>
              <p
                class="text-[10px] font-mono font-medium text-void-500 uppercase tracking-widest"
              >
                {{ t("auth.required_action") }}
              </p>
            </div>

            <form @submit.prevent="handleAuth" class="space-y-4">
              <div
                v-if="validationError"
                class="p-2 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center"
              >
                {{ validationError }}
              </div>

              <div class="space-y-3">
                <div class="relative group">
                  <Icon
                    name="ph:envelope-simple"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-void-500 group-focus-within:text-white transition-colors"
                  />
                  <input
                    v-model="email"
                    type="email"
                    required
                    :placeholder="t('auth.email')"
                    class="glass-input w-full pl-11 h-11"
                  />
                </div>
                <div class="relative group">
                  <Icon
                    name="ph:lock-key"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-void-500 group-focus-within:text-white transition-colors"
                  />
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
                <span v-if="!loading">{{
                  isRegister ? t("auth.create_account") : t("auth.sign_in")
                }}</span>
                <Icon
                  name="ph:circle-notch"
                  class="animate-spin text-lg"
                  v-else
                />
              </button>
            </form>

            <div class="mt-6 text-center">
              <button
                @click="isRegister = !isRegister"
                class="text-[11px] font-medium text-void-500 hover:text-white transition-colors"
              >
                {{
                  isRegister
                    ? t("auth.already_have_account")
                    : t("auth.no_account")
                }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
/* noinspection CssUnusedSymbol */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition:
    opacity 0.35s ease,
    backdrop-filter 0.35s ease;
}
/* noinspection CssUnusedSymbol */
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* Card — clip-path iris open from center */
/* noinspection CssUnusedSymbol */
.modal-card-enter-active {
  animation: modal-iris-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
/* noinspection CssUnusedSymbol */
.modal-card-leave-active {
  animation: modal-iris-out 0.3s cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes modal-iris-in {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
}

@keyframes modal-iris-out {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: scale(0.94) translateY(8px);
    filter: blur(4px);
  }
}
</style>
