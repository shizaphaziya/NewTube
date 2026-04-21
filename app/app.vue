<template>
  <div>
    <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
    <ToastContainer />
    <AuthModal />
  </div>
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
