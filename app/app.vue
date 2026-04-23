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
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* View Transition API — navigation */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.2s;
}

::view-transition-old(video-thumb-*),
::view-transition-new(video-thumb-*) {
  mix-blend-mode: normal;
  height: 100%;
  overflow: clip;
  object-fit: cover;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
