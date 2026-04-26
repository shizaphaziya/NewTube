<script setup lang="ts">
import { useConfirm } from '~/composables/useConfirm'

const { isOpen, message, handleConfirm } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-void-950/80 backdrop-blur-2xl">
        <div class="glass-card w-full max-w-sm p-8 shadow-2xl text-center relative overflow-hidden !rounded-md border border-white/10">
          <!-- Monochrome structural glow -->
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-[60px] pointer-events-none"></div>

          <div class="i-ph-warning-circle-bold text-5xl text-white/40 mx-auto mb-6"></div>
          <p class="text-void-100 text-[15px] font-medium leading-relaxed mb-8 px-2">{{ message }}</p>
          <div class="flex gap-4">
            <button @click="handleConfirm(false)" class="flex-1 btn-secondary !py-3 !rounded-md">
              {{ $t('common.cancel') || 'Cancel' }}
            </button>
            <button @click="handleConfirm(true)" class="flex-1 btn-primary !bg-white !text-black hover:(!bg-white/90 !shadow-[0_0_25px_rgba(255,255,255,0.2)]) !py-3 !rounded-md border-none font-bold uppercase tracking-widest text-[11px]">
              {{ $t('common.confirm') || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
