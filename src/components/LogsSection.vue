<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { clamp, computePinnedSectionProgress } from '../utils/scroll'

const sceneRef = ref(null)
const rowsRef = ref([])
let rafId = 0

// 使用工具函数

function render() {
  rafId = 0
  const p = computePinnedSectionProgress(sceneRef.value)
  rowsRef.value.forEach((el, i) => {
    const start = 0.15 + i * 0.08
    const end = start + 0.2
    let t = (p - start) / (end - start)
    t = clamp(t, 0, 1)
    el.style.opacity = String(t)
    el.style.transform = `translateY(${(1 - t) * 18}px)`
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
  <section class="logs pin" ref="sceneRef">
    <div class="stage">
      <div class="copy">
        <div class="chip">Logs · Traces · Analytics</div>
        <h2 class="title">生产日志与 Trace 可视化</h2>
        <p class="desc">按请求级别追踪与聚合，快速定位瓶颈，支持人审标注闭环与持续评估。</p>
      </div>
      <div class="table panel">
        <div class="thead">
          <div class="th">Time</div>
          <div class="th">User</div>
          <div class="th">Model</div>
          <div class="th">Latency</div>
          <div class="th">Tokens</div>
          <div class="th">Status</div>
        </div>
        <div class="tbody">
          <div class="tr" :ref="el => el && (rowsRef[i] = el)" v-for="(x, i) in 8" :key="i">
            <div class="td">12:0{{ i }}:{{ 10 + i }}</div>
            <div class="td">user-{{ 100 + i }}</div>
            <div class="td">{{ ['gpt-4o','mistral','llama3'][i % 3] }}</div>
            <div class="td">{{ 120 + i * 7 }} ms</div>
            <div class="td">{{ 800 + i * 50 }}</div>
            <div class="td"><span class="pill" :class="{ ok: i % 5 !== 0, warn: i % 5 === 0 }">{{ i % 5 === 0 ? 'Warn' : 'OK' }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pin { height: 260vh; position: relative; }
.stage { position: sticky; top: 0; height: 100vh; display: grid; grid-template-columns: 1fr; align-items: center; gap: 24px; padding: 48px 24px; }
.copy { text-align: center; }
.copy .title { font-size: clamp(28px, 4.6vw, 52px); margin: 6px 0 8px; }
.desc { color: var(--muted); max-width: 720px; margin: 0 auto; }

.table { width: min(1100px, 92vw); }
.thead, .tr { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr .8fr; }
.thead { padding: 12px 16px; border-bottom: 1px solid var(--border); color: #aab6c5; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
.tbody { display: grid; }
.tr { padding: 12px 16px; border-bottom: 1px solid #1a2230; opacity: 0; transform: translateY(18px); }
.td { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pill { padding: 3px 8px; border-radius: 999px; font-size: 12px; border: 1px solid #27314a; background: #0c1220; color: #c5d2ff; }
.pill.ok { border-color: #1f4331; background: #0e1f17; color: #aef1c6; }
.pill.warn { border-color: #4a2f27; background: #21120e; color: #ffc9a6; }

@media (prefers-reduced-motion: reduce) {
  .tr { opacity: 1 !important; transform: none !important; }
}
</style>


