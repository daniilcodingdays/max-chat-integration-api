import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    tsconfigPaths: true,
  },
  base: '/max-chat-integration-api/',
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['src/shared/styles'],
      },
    },
  },
})
