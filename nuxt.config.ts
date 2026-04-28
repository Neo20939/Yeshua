// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    devProxy: {
      '/api-proxy': {
        target: 'http://192.168.1.26/shdhfh%40s/api/',
        changeOrigin: true,
      }
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/api-proxy/**': { proxy: 'http://192.168.1.26/shdhfh%40s/api/**' }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
