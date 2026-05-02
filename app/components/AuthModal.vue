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

// Sync Pinia state with Dialog open state
const isOpen = computed({
  get: () => appStore.isAuthModalOpen,
  set: (val) => {
    if (!val) appStore.closeAuthModal();
  }
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
    }
  } catch (e: any) {
    showError(e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[420px] p-0 overflow-hidden border-none bg-transparent shadow-none">
      <div class="glass-card w-full p-10 relative overflow-hidden">
        <!-- Background Decoration -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>

        <div class="text-center mb-10 relative z-10">
          <div
            class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0 duration-500"
          >
            <Icon
              name="ph:play-fill"
              class="text-primary-foreground text-2xl translate-x-0.5"
            />
          </div>
          <h2
            class="text-3xl font-display font-900 tracking-tight text-foreground mb-2"
          >
            {{ isRegister ? t("auth.join") : t("auth.welcome") }}
          </h2>
          <p
            class="text-[11px] font-700 text-muted-foreground uppercase tracking-[0.2em]"
          >
            {{ t("auth.required_action") }}
          </p>
        </div>

        <form @submit.prevent="handleAuth" class="space-y-5 relative z-10">
          <div
            v-if="validationError"
            class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px] font-600 text-center animate-shake"
          >
            {{ validationError }}
          </div>

          <div class="space-y-4">
            <div class="relative group">
              <Icon
                name="ph:envelope-simple-duotone"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-xl z-10"
              />
              <Input
                v-model="email"
                type="email"
                required
                :placeholder="t('auth.email')"
                class="w-full pl-12 h-12 text-[14px] bg-background/50 border-border/40 focus-visible:ring-primary/20"
              />
            </div>
            <div class="relative group">
              <Icon
                name="ph:lock-key-duotone"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-xl z-10"
              />
              <Input
                v-model="password"
                type="password"
                required
                :placeholder="t('auth.password')"
                class="w-full pl-12 h-12 text-[14px] bg-background/50 border-border/40 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            :disabled="loading"
            class="w-full h-12 mt-4 text-[15px] shadow-lg shadow-primary/20 press-effect bg-primary hover:bg-primary/90"
          >
            <span v-if="!loading">{{ isRegister ? t("auth.create_account") : t("auth.sign_in") }}</span>
            <Icon name="ph:circle-notch" class="animate-spin text-xl" v-else />
          </Button>
        </form>

        <div class="mt-8 text-center relative z-10">
          <Button
            variant="link"
            @click="isRegister = !isRegister"
            class="text-[13px] font-600 text-muted-foreground hover:text-primary transition-all p-0 h-auto"
          >
            {{ isRegister ? t("auth.already_have_account") : t("auth.no_account") }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.glass-card {
  background: var(--nt-glass-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: none;
  border-radius: 1.5rem;
  box-shadow: var(--nt-shadow-xl);
}
</style>
