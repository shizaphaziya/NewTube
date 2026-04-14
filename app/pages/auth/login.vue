<script setup>
definePageMeta({
  layout: false
})

const client = useSupabaseClient()
const { t } = useI18n()
const email = ref('')
const password = ref('')
const isRegister = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
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
      alert(t('auth.check_email'))
    } else {
      const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      navigateTo('/')
    }
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-void text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
    <!-- Subtle Gradient Background -->
    <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_100%)]"></div>
    
    <div v-motion-pop-in class="glass-card w-full max-w-sm p-12 relative z-10 border-white/5 backdrop-blur-3xl shadow-2xl">
      <div class="text-center mb-12">
        <NuxtLink to="/" class="inline-block mb-8 group">
          <div class="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-500">
             <div class="w-2 h-8 bg-silver animate-pulse"></div>
             <span class="text-4xl font-black font-heading tracking-tight text-white leading-none">NEWTUBE</span>
          </div>
        </NuxtLink>
        <h1 class="text-lg font-heading font-black tracking-tight text-silver/90 uppercase">
          {{ isRegister ? t('auth.join_community') : t('auth.welcome_back') }}
        </h1>
        <p class="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">{{ t('auth.subtitle') }}</p>
      </div>

      <form @submit.prevent="handleAuth" class="space-y-8">
        <div v-if="errorMsg" class="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] font-bold uppercase tracking-wider text-center">
          {{ errorMsg }}
        </div>

        <div class="space-y-6">
          <div class="space-y-2 group">
            <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 group-focus-within:text-silver transition-colors">{{ t('auth.email') }}</label>
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="IDENTITY@ELITE.CO"
              class="w-full bg-white/5 border-b border-white/10 p-4 text-sm focus:outline-none focus:border-silver focus:bg-white/[0.08] transition-all placeholder:text-white/10"
            />
          </div>
          <div class="space-y-2 group">
            <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 group-focus-within:text-silver transition-colors">{{ t('auth.password') }}</label>
            <input 
              v-model="password" 
              type="password" 
              required
              placeholder="••••••••"
              class="w-full bg-white/5 border-b border-white/10 p-4 text-sm focus:outline-none focus:border-silver focus:bg-white/[0.08] transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="btn-primary w-full py-5 text-xs font-black tracking-[0.3em] uppercase group overflow-hidden"
        >
          <span v-if="!loading" class="flex items-center justify-center gap-3">
            {{ isRegister ? t('auth.create_account') : t('auth.sign_in') }}
            <div class="i-ph-arrow-right-bold group-hover:translate-x-1 transition-transform"></div>
          </span>
          <div v-else class="i-ph-circle-notch-bold animate-spin text-xl mx-auto"></div>
        </button>
      </form>

      <div class="mt-12 text-center text-[10px] font-black tracking-widest uppercase">
        <button 
          @click="isRegister = !isRegister" 
          class="text-white/30 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
        >
          {{ isRegister ? t('auth.already_have_account') : t('auth.no_account') }}
        </button>
      </div>
    </div>

    <!-- Background Elements -->
    <div class="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute top-[-10%] left-[-10%] w-1/3 h-1/3 bg-white/[0.01] blur-[100px] rounded-full pointer-events-none"></div>
  </div>
</template>
