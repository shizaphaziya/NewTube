<script setup lang="ts">


const props = defineProps<{
  initialLikes: number
  initialDislikes: number
  initialState: 'like' | 'dislike' | 'none'
}>()

const emit = defineEmits<{
  (e: 'change', state: 'like' | 'dislike' | 'none', revert: () => void): void
}>()

const currentState = ref(props.initialState)
const localLikes = ref(props.initialLikes)
const localDislikes = ref(props.initialDislikes)

const toggleLike = () => {
  const previousState = currentState.value
  const previousLikes = localLikes.value
  const previousDislikes = localDislikes.value

  if (currentState.value === 'like') {
    currentState.value = 'none'
    localLikes.value--
  } else {
    if (currentState.value === 'dislike') localDislikes.value--
    currentState.value = 'like'
    localLikes.value++
  }
  emit('change', currentState.value, () => {
    currentState.value = previousState
    localLikes.value = previousLikes
    localDislikes.value = previousDislikes
  })
}

const toggleDislike = () => {
  const previousState = currentState.value
  const previousLikes = localLikes.value
  const previousDislikes = localDislikes.value

  if (currentState.value === 'dislike') {
    currentState.value = 'none'
    localDislikes.value--
  } else {
    if (currentState.value === 'like') localLikes.value--
    currentState.value = 'dislike'
    localDislikes.value++
  }
  emit('change', currentState.value, () => {
    currentState.value = previousState
    localLikes.value = previousLikes
    localDislikes.value = previousDislikes
  })
}

import { watch } from 'vue'
watch(() => props.initialState, (newVal) => { currentState.value = newVal })
watch(() => props.initialLikes, (newVal) => { localLikes.value = newVal })
watch(() => props.initialDislikes, (newVal) => { localDislikes.value = newVal })

const formatCount = (count: number) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}
</script>

<template>
  <div class="flex items-center rounded-md bg-white/[0.03] border border-white/[0.08] p-1 shadow-inner overflow-hidden transition-colors hover:bg-white/[0.05]">
    <!-- Like Zone -->
    <button
      @click="toggleLike"
      class="flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-200"
      :class="currentState === 'like' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'"
    >
      <div
        class="text-lg transition-transform duration-200"
        :class="[
          currentState === 'like' ? 'i-ph-thumbs-up-fill' : 'i-ph-thumbs-up-bold',
        ]"
      ></div>
      <span class="text-xs font-bold tracking-tight">{{ formatCount(localLikes) }}</span>
    </button>

    <!-- Separator -->
    <div class="w-px h-5 bg-white/10 mx-1"></div>

    <!-- Dislike Zone -->
    <button
      @click="toggleDislike"
      class="flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-200"
      :class="currentState === 'dislike' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'"
    >
      <div
        class="text-lg transition-transform duration-200 mt-1"
        :class="[
          currentState === 'dislike' ? 'i-ph-thumbs-down-fill' : 'i-ph-thumbs-down-bold',
        ]"
      ></div>
    </button>
  </div>
</template>
