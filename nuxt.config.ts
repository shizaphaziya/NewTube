// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-04-27',

  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',

  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

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

  devtools: { enabled: false }
})
