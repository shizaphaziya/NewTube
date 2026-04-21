<script setup lang="ts">
import { useToast } from '~/composables/useToast'
const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-24 md:bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto px-6 py-3.5 rounded-2xl flex items-center gap-4 min-w-[280px] max-w-sm
                 backdrop-blur-2xl border shadow-2xl transition-all"
          :class="[
            toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-100' :
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' :
            'bg-white/5 border-white/10 text-white'
          ]"
        >
          <div
            class="text-xl shrink-0"
            :class="[
              toast.type === 'error' ? 'i-ph-warning-circle-bold text-red-500' :
              toast.type === 'success' ? 'i-ph-check-circle-bold text-emerald-500' :
              'i-ph-info-bold text-white/50'
            ]"
          ></div>
          <p class="text-[13px] font-medium leading-tight flex-1">{{ toast.message }}</p>
          <button
            @click="removeToast(toast.id)"
            class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            <div class="i-ph-x-bold text-sm opacity-50 hover:opacity-100"></div>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
