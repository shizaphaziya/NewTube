<script setup lang="ts">
import { useConfirm } from '~/composables/useConfirm'

const { isOpen, message, handleConfirm } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
        <div class="bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-sm p-8 shadow-xl text-center">
          <div class="i-ph-warning-circle-bold text-4xl text-white/50 mx-auto mb-4"></div>
          <p class="text-white text-sm mb-8">{{ message }}</p>
          <div class="flex gap-4">
            <button @click="handleConfirm(false)" class="flex-1 btn-secondary !py-3">Cancel</button>
            <button @click="handleConfirm(true)" class="flex-1 btn-primary !bg-red-500 !text-white !py-3">Confirm</button>
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
