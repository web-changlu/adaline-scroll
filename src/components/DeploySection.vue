<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { clamp, computePinnedSectionProgress } from '../utils/scroll'

const sceneRef = ref(null)
const panelsRef = ref([])
let rafId = 0

// 使用工具函数

function render() {
  rafId = 0
  const p = computePinnedSectionProgress(sceneRef.value)
  panelsRef.value.forEach((el, i) => {
    const start = i * 0.2
    const end = start + 0.35
    let t = (p - start) / (end - start)
    t = clamp(t, 0, 1)
    const y = 24 * (1 - t)
    const s = 0.98 + 0.02 * t
    el.style.opacity = String(t)
    el.style.transform = `translateY(${y}px) scale(${s})`
  })
}

function onScroll() { if (!rafId) rafId = requestAnimationFrame(render) }

onMounted(() => {
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll)
  render()
})
onBeforeUnmount(() => {
  removeEventListener('scroll', onScroll)
  removeEventListener('resize', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section class="deploy pin" ref="sceneRef">
    <div class="stage">
      <div class="copy">
        <div class="chip">Deploy · Multi-env · Rollback</div>
        <h2 class="title">多环境部署与一键回滚</h2>
        <p class="desc">将配置按环境管理，发布与回滚在秒级完成，并支持智能 diff 与审计。</p>
      </div>
      <div class="panels">
        <div class="panel env" :ref="el => el && (panelsRef[i] = el)" v-for="(x, i) in 3" :key="i">
          <div class="env-head">
            <span class="dot" :style="{ background: ['#5df2a5','#7aa2ff','#ffbd5d'][i] }"/>
            <span class="name">{{ ['Development','Staging','Production'][i] }}</span>
            <span class="status">{{ ['Deployed','Ready','Active'][i] }}</span>
          </div>
          <div class="env-body">
            <div class="row"><span>Model</span><span>{{ ['gpt-4o-mini','mistral-large','gpt-4o'][i] }}</span></div>
            <div class="row"><span>Prompt</span><span>v{{ 12 + i }}</span></div>
            <div class="row"><span>Temperature</span><span>{{ [0.3,0.2,0.1][i] }}</span></div>
            <div class="row"><span>Rollback</span><button class="btn">1-click</button></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pin { height: 260vh; position: relative; }
.stage { position: sticky; top: 0; height: 100vh; display: grid; grid-template-columns: 1fr 1.1fr; align-items: center; gap: 28px; padding: 48px 24px; }
.copy .title { font-size: clamp(28px, 4.6vw, 52px); margin: 10px 0 12px; }
.desc { color: var(--muted); max-width: 560px; }
.panels { display: grid; gap: 14px; }
.env { padding: 14px; }
.env-head { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid var(--border); }
.dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
.name { font-weight: 700; }
.status { margin-left: auto; color: #9fb2ff; font-size: 12px; }
.env-body { padding: 10px 12px; display: grid; gap: 10px; }
.row { display: grid; grid-template-columns: 120px 1fr; gap: 12px; }
.btn { padding: 6px 10px; background: #0b1220; color: #cfd9ff; border: 1px solid #233357; border-radius: 8px; cursor: pointer; }

.panel { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--glow); opacity: 0; transform: translateY(24px) scale(.98); will-change: transform, opacity; }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .panel { opacity: 1 !important; transform: none !important; }
}
</style>


