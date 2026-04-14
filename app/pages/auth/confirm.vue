<script setup>
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-void flex items-center justify-center font-sans overflow-hidden">
    <div class="text-center space-y-6 relative">
      <div class="relative mx-auto w-16 h-16">
        <div class="absolute inset-0 border-2 border-white/5 rounded-full"></div>
        <div class="absolute inset-0 border-t-2 border-silver rounded-full animate-spin"></div>
      </div>
      <p class="text-white/20 text-[10px] font-black tracking-[0.5em] uppercase animate-pulse">
        Confirming Access
      </p>
      
      <!-- Ambient light -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none"></div>
    </div>
  </div>
</template>
