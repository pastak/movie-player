import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/movie-player/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        player: 'player.html',
        videoWithNotice: 'video-with-notice.html',
        slide: 'slide.html',
        sponsor: 'sponsor.html',
        futa: 'futa.html',
      }
    }
  }
})
