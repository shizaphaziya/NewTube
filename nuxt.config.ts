// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/supabase',
    '@unocss/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],

  // Supabase integration via official module
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/', '/watch/*', '/api/*'],
    }
  },

  // i18n configuration for RU (default) and EN
  i18n: {
    locales: [
      { code: 'ru', file: 'ru.json', name: 'Русский' },
      { code: 'en', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'ru',
    lazy: true,
    langDir: '../i18n/locales/'
  },

  // Motion One configuration
  motion: {
    directives: {
      'pop-in': {
        initial: { scale: 0.8, opacity: 0 },
        enter: { scale: 1, opacity: 1, transition: { duration: 400, ease: 'easeOut' } }
      }
    }
  },

  // Required for ffmpeg.wasm
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
        }
      }
    }
  },

  devServer: {
    https: false, // Default
  },

  experimental: {
    viewTransition: true
  },

  devtools: { enabled: true }
})
