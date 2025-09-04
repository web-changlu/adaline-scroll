import { createApp, onMounted } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 初始化 Lenis 平滑滚动（在组件外创建，避免重复实例化）
app.mixin({
  mounted() {
    if (typeof window === 'undefined') return
    // 动态导入以避免 SSR/构建期问题
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (window.__lenis) return
      const lenis = new Lenis({
        duration: 1.1,
        smoothTouch: true,
        smoothWheel: true,
        wheelMultiplier: 1.0,
      })
      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
      window.__lenis = lenis
    }).catch(() => {})
  }
})

app.mount('#app')
