<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { clamp, lerp, mapWindow, computePinnedSectionProgress } from '../utils/scroll'

const sceneRef = ref(null)
const stageRef = ref(null)
const layer1Ref = ref(null)
const layer2Ref = ref(null)
const titleRef = ref(null)

let rafId = 0
let onScrollHandler = null
let onResizeHandler = null

// 使用 utils 中的通用函数

function draw(p) {
  // 标题：0%~25% 渐入
  const tTitle = mapWindow(p, 0.0, 0.25)
  const titleEl = titleRef.value
  if (titleEl) {
    titleEl.style.opacity = String(tTitle)
    titleEl.style.transform = `translateY(${lerp(24, 0, tTitle)}px)`
  }

  // layer1：0%~40% 渐入，位移与缩放
  const l1 = layer1Ref.value
  if (l1) {
    const t = mapWindow(p, 0.0, 0.4)
    l1.style.opacity = String(t)
    const y = lerp(40, 0, t)
    const s = lerp(0.96, 1.0, t)
    l1.style.transform = `translateY(${y}px) scale(${s})`
  }

  // layer2：30%~70% 渐入并微视差上移
  const l2 = layer2Ref.value
  if (l2) {
    const t = mapWindow(p, 0.3, 0.7)
    l2.style.opacity = String(t)
    const y = lerp(60, -10, t)
    const s = lerp(0.94, 1.0, t)
    l2.style.transform = `translateY(${y}px) scale(${s})`
  }
}

function render() {
  rafId = 0
  const scene = sceneRef.value
  if (!scene) return
  const p = computePinnedSectionProgress(scene)
  draw(p)
}

onMounted(() => {
  const scene = sceneRef.value
  if (!scene) return

  onScrollHandler = () => {
    if (rafId) return
    rafId = requestAnimationFrame(render)
  }
  onResizeHandler = onScrollHandler

  window.addEventListener('scroll', onScrollHandler, { passive: true })
  window.addEventListener('resize', onResizeHandler)

  // 初始绘制
  render()
})

onBeforeUnmount(() => {
  if (onScrollHandler) window.removeEventListener('scroll', onScrollHandler)
  if (onResizeHandler) window.removeEventListener('resize', onResizeHandler)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section class="hero pin" ref="sceneRef">
    <div class="stage" ref="stageRef">
      <div class="copy">
        <div class="eyebrow">Adaline</div>
        <h1 class="title" ref="titleRef">单平台迭代 / 评估 / 部署 / 监控</h1>
        <p class="desc">多供应商提示管理、环境化部署、回滚、全链路追踪与连续评估</p>
      </div>
      <div class="visuals">
        <div class="visual layer-1" ref="layer1Ref"></div>
        <div class="visual layer-2" ref="layer2Ref"></div>
      </div>
    </div>
  </section>
  
</template>

<style scoped>
.pin { height: 300vh; position: relative; }
.stage {
  position: sticky; top: 0; height: 100vh; overflow: hidden;
  display: grid; grid-template-columns: 1fr; place-items: center; padding: 56px 24px;
}

.copy {
  text-align: center; z-index: 2; max-width: 980px; width: 100%;
  padding: 20px 24px; border-radius: 16px;
  background: linear-gradient(180deg, rgba(14,18,28,.55), rgba(14,18,28,.35));
  border: 1px solid var(--border);
  box-shadow: var(--glow);
  backdrop-filter: saturate(1.1) blur(6px);
}
.eyebrow { display: inline-block; padding: 6px 10px; border-radius: 999px; background: rgba(122,162,255,.12); color: #cdd8ff; border: 1px solid #283456; letter-spacing: .08em; font-weight: 700; text-transform: uppercase; }
.title { margin: 12px 0 8px; font-size: clamp(30px, 5.6vw, 64px); line-height: 1.05; font-weight: 900; letter-spacing: .01em;
  background: linear-gradient(92deg, #eef2ff 0%, #d7e0ff 45%, #bcd0ff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.desc { color: var(--muted); max-width: 820px; margin: 0 auto; font-size: clamp(14px, 1.8vw, 18px); }

.visuals { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }
.visual {
  width: min(64vmin, 980px); height: min(40vmin, 680px); border-radius: 20px;
  background-image: url(../assets/img/search01.jfif); background-size: cover; background-position: center; background-repeat: no-repeat;
  border: 1px solid rgba(255,255,255,.06); box-shadow: 0 20px 80px rgba(0,0,0,.45);
  position: relative; overflow: hidden;
  will-change: transform, opacity; opacity: 0; transform: translateY(40px) scale(.96);
}
.visual::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(80% 60% at 50% 20%, rgba(0,0,0,0) 0%, rgba(0,0,0,.2) 60%, rgba(0,0,0,.45) 100%),
              linear-gradient(180deg, rgba(10,12,18,0) 0%, rgba(10,12,18,.25) 100%);
  pointer-events: none;
}
.layer-2 {
  width: min(56vmin, 900px); height: min(34vmin, 600px); border-radius: 18px;
  background-image: url(../assets/img/search02.jfif); background-size: cover; background-position: center; background-repeat: no-repeat;
  border: 1px solid rgba(255,255,255,.05);
}

@media (prefers-reduced-motion: reduce) {
  .visual { opacity: 1 !important; transform: none !important; }
  .title { opacity: 1 !important; transform: none !important; }
}
</style>


