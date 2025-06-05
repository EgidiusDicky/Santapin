import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',        // Avoid legacy JS for modern browsers
    minify: 'esbuild',       // Fastest and efficient minifier
    cssCodeSplit: true,      // Split CSS to reduce initial load
    outDir: 'dist',
    assetsInlineLimit: 4096, // Inline small assets
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'  // Create a separate vendor chunk
          }
        }
      }
    }
  },
  server: {
    compress: true, // enable gzip for local dev too
  }
})