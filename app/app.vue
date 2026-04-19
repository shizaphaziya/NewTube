<script setup>
const { t } = useI18n()

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | NewTube` : 'NewTube | Next-Gen Video Collective'
  },
  meta: [
    { name: 'description', content: 'A premium decentralized-feeling video platform built for the next generation of creators.' },
    { name: 'theme-color', content: '#050505' },
    { property: 'og:site_name', content: 'NewTube' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
</template>

<style>
/* View Transition API — navigation */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
}

::view-transition-old(video-thumb-*),
::view-transition-new(video-thumb-*) {
  mix-blend-mode: normal;
  height: 100%;
  overflow: clip;
  object-fit: cover;
}
</style>
