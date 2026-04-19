// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/main.css'],

  ssr: false,

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
    langDir: '../i18n/locales/'
  },

  // Motion One configuration
  motion: {
    directives: {
      'pop-in': {
        initial: { scale: 0.8, opacity: 0 },
        enter: { scale: 1, opacity: 1, transition: { duration: 400, ease: 'easeOut' } }
      },
      'fade': {
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: { duration: 300 } }
      }
    }
  },

  devServer: {
    https: false, // Default
    port: 3000,
  },

  experimental: {
    viewTransition: true,
    typedPages: false
  },

  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  },

  devtools: { enabled: true }
})
