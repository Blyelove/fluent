import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Fluent — taal leren die plakt',
        short_name: 'Fluent',
        description: 'Leer 6 talen: lessen, toetsen, doelen en landen veroveren.',
        lang: 'nl',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0e0b1f',
        background_color: '#0e0b1f',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /audio\/.+\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fluent-audio',
              expiration: { maxEntries: 2500, maxAgeSeconds: 60 * 60 * 24 * 180 },
            },
          },
          {
            urlPattern: /audio\/manifest\.json$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'fluent-audio-manifest' },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base: './',
  // poort komt van de omgeving (PORT) zodat meerdere sessies naast elkaar kunnen draaien; 5199 als basis
  server: { port: Number(process.env.PORT) || 5199, strictPort: true, host: true },
})
