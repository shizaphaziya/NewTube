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
body {
  @apply bg-void text-white;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* View Transition API — navigation */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(video-thumb-*),
::view-transition-new(video-thumb-*) {
  mix-blend-mode: normal;
  height: 100%;
  overflow: clip;
  object-fit: cover;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(video-title-*),
::view-transition-new(video-title-*) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
