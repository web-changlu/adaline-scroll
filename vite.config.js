import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // 如果你的仓库名是 adaline-scroll，请保留该 base；如果不同，请换成 '/<repo>/'
  // base: '/adaline-scroll/',
  plugins: [vue()],
})
