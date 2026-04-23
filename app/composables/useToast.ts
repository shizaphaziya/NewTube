import { ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    // Limit to 3 toasts max
    if (toasts.value.length >= 3) {
      toasts.value.shift()
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      useTimeoutFn(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg: string, duration?: number) => addToast(msg, 'success', duration)
  const error = (msg: string, duration?: number) => addToast(msg, 'error', duration)
  const info = (msg: string, duration?: number) => addToast(msg, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info
  }
}
