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
/* View Transition API — Advanced Macro */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.7s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(video-thumb-*),
::view-transition-new(video-thumb-*) {
  mix-blend-mode: normal;
  height: 100%;
  overflow: clip;
  object-fit: cover;
  animation-duration: 0.7s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-old(video-title-*),
::view-transition-new(video-title-*) {
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Blur the old view during transition for a cinematic effect */
::view-transition-old(root) {
  animation: nt-fade-out 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
::view-transition-new(root) {
  animation: nt-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes nt-fade-out {
  to {
    opacity: 0;
    filter: blur(8px);
    transform: scale(0.96);
  }
}

@keyframes nt-fade-in {
  from {
    opacity: 0;
    filter: blur(8px);
    transform: scale(1.04);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
