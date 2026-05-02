import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  // Integrate with Vue Router
  const router = useRouter()
  router.afterEach(() => {
    lenis.scrollTo(0, { immediate: true })
  })

  return {
    provide: {
      lenis
    }
  }
})
