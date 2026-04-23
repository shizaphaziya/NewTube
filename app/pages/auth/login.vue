<script setup lang="ts">
import { useAppStore } from '~/store/app'

definePageMeta({
  layout: 'default'
})


const router = useRouter()

onMounted(() => {
  router.replace(useRoute().query.redirect || '/')
  useAppStore().openAuthModal()
})
</script>

<template>
  <div class="h-screen flex items-center justify-center">
  </div>
</template>
