<script setup>
const props = defineProps({
  active: Boolean
})

const emit = defineEmits(['update:active'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-1000 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-1000 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="active" 
        class="fixed inset-0 bg-void/90 backdrop-blur-3xl z-[45] pointer-events-auto"
        @click="emit('update:active', false)"
      ></div>
    </Transition>
  </Teleport>
</template>
