import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'ads.txt', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Hardware Test Online by sessea',
        short_name: 'hw test',
        description:
          'Free browser hardware tests for microphone, camera, speakers, keyboard, and mouse.',
        theme_color: '#1c1c1c',
        background_color: '#f3f3f3',
        display: 'standalone',
        start_url: '/mic',
        lang: 'en',
        categories: ['utilities'],
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff,woff2,ico,txt,xml}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
