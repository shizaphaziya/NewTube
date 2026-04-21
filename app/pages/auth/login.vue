<script setup lang="ts">
import { useAppStore } from '~/store/app'

definePageMeta({
  layout: 'default'
})

const appStore = useAppStore()
const router = useRouter()

onMounted(() => {
  router.replace('/')
  appStore.openAuthModal()
})
</script>

<template>
  <div class="h-screen flex items-center justify-center">
  </div>
</template>
