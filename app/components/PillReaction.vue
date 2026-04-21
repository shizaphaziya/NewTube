<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  initialLikes: number
  initialDislikes: number
  initialState: 'like' | 'dislike' | 'none'
}>()

const emit = defineEmits<{
  (e: 'change', state: 'like' | 'dislike' | 'none'): void
}>()

const currentState = ref(props.initialState)
const localLikes = ref(props.initialLikes)
const localDislikes = ref(props.initialDislikes)

// Optimistic UI toggle: instantly update the local state to make the app feel blazing fast,
// before receiving confirmation from the server.
const toggleLike = () => {
  if (currentState.value === 'like') {
    currentState.value = 'none'
    localLikes.value--
  } else {
    if (currentState.value === 'dislike') localDislikes.value--
    currentState.value = 'like'
    localLikes.value++
  }
  emit('change', currentState.value)
}

const toggleDislike = () => {
  if (currentState.value === 'dislike') {
    currentState.value = 'none'
    localDislikes.value--
  } else {
    if (currentState.value === 'like') localLikes.value--
    currentState.value = 'dislike'
    localDislikes.value++
  }
  emit('change', currentState.value)
}

const formatCount = (count: number) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}
</script>

<template>
  <div class="flex items-center rounded-full bg-white/[0.03] border border-white/[0.08] p-1 shadow-inner overflow-hidden transition-colors hover:bg-white/[0.05]">
    <!-- Like Zone -->
    <button
      @click="toggleLike"
      class="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
      :class="currentState === 'like' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'"
    >
      <div
        class="text-lg transition-transform duration-300"
        :class="[
          currentState === 'like' ? 'i-ph-thumbs-up-fill scale-110' : 'i-ph-thumbs-up-bold',
        ]"
      ></div>
      <span class="text-xs font-bold tracking-wide">{{ formatCount(localLikes) }}</span>
    </button>

    <!-- Separator -->
    <div class="w-px h-5 bg-white/10 mx-1"></div>

    <!-- Dislike Zone -->
    <button
      @click="toggleDislike"
      class="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
      :class="currentState === 'dislike' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'"
    >
      <div
        class="text-lg transition-transform duration-300 mt-1"
        :class="[
          currentState === 'dislike' ? 'i-ph-thumbs-down-fill scale-110' : 'i-ph-thumbs-down-bold',
        ]"
      ></div>
    </button>
  </div>
</template>
