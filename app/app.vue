<script setup>
const { t, locale } = useI18n()

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | NewTube` : `NewTube | ${t('meta.title')}`
  },
  meta: [
    { name: 'description', content: t('meta.description') },
    { name: 'theme-color', content: '#0A0A0B' },
    { property: 'og:site_name', content: 'NewTube' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: locale.value
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
