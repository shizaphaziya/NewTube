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
/* ============================================================
   View Transition API — Cinematic Macro
   ============================================================ */

/* Root transition: clip-path reveal from center + blur */
::view-transition-old(root) {
  animation: nt-page-out 0.45s cubic-bezier(0.4, 0, 1, 1) both;
}
::view-transition-new(root) {
  animation: nt-page-in 0.65s cubic-bezier(0, 0, 0.2, 1) both;
}

@keyframes nt-page-out {
  0%   { opacity: 1; filter: blur(0px); transform: scale(1); clip-path: inset(0% 0% 0% 0% round 0px); }
  100% { opacity: 0; filter: blur(6px); transform: scale(0.97); clip-path: inset(2% 2% 2% 2% round 16px); }
}

@keyframes nt-page-in {
  0%   { opacity: 0; filter: blur(10px); transform: scale(1.03); clip-path: inset(4% 4% 4% 4% round 32px); }
  100% { opacity: 1; filter: blur(0px);  transform: scale(1);    clip-path: inset(0% 0% 0% 0% round 0px); }
}

/* Shared element: video thumbnail — morphing card-to-hero */
::view-transition-group(video-thumb) {
  animation-duration: 0.55s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
::view-transition-old(video-thumb),
::view-transition-new(video-thumb) {
  height: 100%;
  overflow: clip;
  object-fit: cover;
}

/* Shared element: video title */
::view-transition-group(video-title) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
::view-transition-old(video-title) {
  animation: nt-title-out 0.3s ease both;
}
::view-transition-new(video-title) {
  animation: nt-title-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

@keyframes nt-title-out {
  to { opacity: 0; transform: translateY(-8px); }
}
@keyframes nt-title-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
