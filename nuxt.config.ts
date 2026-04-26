// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-04-27',

  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',

  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase',
    '@unocss/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],

  // i18n configuration (Nuxt 4 / v10 standards)
  i18n: {
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'ru',
    langDir: 'locales',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts'
  },

  // Supabase integration via official module
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/', '/watch/*', '/api/*'],
    }
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

  // Nitro configuration
  nitro: {
    // Standard Nitro config
  },

  devServer: {
    https: false, // Default
  },

  experimental: {
    viewTransition: true
  },

  devtools: { enabled: true }
})
