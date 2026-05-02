<template>
  <div>
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
    <Toaster />
    <AuthModal />
  </div>
</template>

<style>
/* Root transition: elegant fade + slight scale + subtle blur */
::view-transition-old(root) {
  animation: nt-page-out 0.4s cubic-bezier(0.4, 0, 1, 1) both;
}
::view-transition-new(root) {
  animation: nt-page-in 0.6s cubic-bezier(0, 0, 0.2, 1) both;
}

@keyframes nt-page-out {
  from {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1);
  }
  to {
    opacity: 0;
    filter: blur(8px);
    transform: scale(0.98);
  }
}

@keyframes nt-page-in {
  from {
    opacity: 0;
    filter: blur(12px);
    transform: scale(1.02);
  }
  to {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1);
  }
}

/* Shared element: video thumbnail — morphing with elastic feel */
::view-transition-group(video-thumb) {
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.85, 0, 0.15, 1);
}

/* Shared element: video title */
::view-transition-group(video-title) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
::view-transition-old(video-title) {
  animation: nt-title-out 0.25s ease both;
}
::view-transition-new(video-title) {
  animation: nt-title-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

@keyframes nt-title-out {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
@keyframes nt-title-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
