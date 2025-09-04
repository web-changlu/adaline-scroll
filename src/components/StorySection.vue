<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { clamp, computePinnedSectionProgress } from '../utils/scroll'

const sceneRef = ref(null)
const stepsRef = ref([])
let rafId = 0

// 使用工具函数

function render() {
  rafId = 0
  const scene = sceneRef.value
  if (!scene) return
  const p = computePinnedSectionProgress(scene)
  stepsRef.value.forEach((el, i) => {
    const seg = 1 / stepsRef.value.length
    const start = seg * i
    const end = start + seg
    const local = clamp((p - start) / (end - start), 0, 1)
    el.style.opacity = String(local)
    el.style.transform = `translateY(${(1 - local) * 24}px)`
  })
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(render)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  render()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section class="story pin" ref="sceneRef">
    <div class="stage">
      <div class="left">
        <div class="chip">Prompt 管理 · 多模型 · 版本</div>
        <h2 class="title">从草稿到上线：一处管理，统一一致</h2>
        <p class="desc">集中式的提示与数据集管理，自动化版本对比与回滚，帮助你快速验证并稳定上线。</p>
      </div>
      <div class="right">
        <div class="step panel" :ref="el => el && (stepsRef[i] = el)" v-for="(s, i) in 4" :key="i">
          <div class="badge">Step {{ i + 1 }}</div>
          <div class="line"></div>
          <div class="content">
            <div class="k">{{ ['编辑 Prompt','生成测试用例','对比评估','一键部署'][i] }}</div>
            <div class="v">{{ ['多变量与 RAG 片段动态注入','AI 辅助生成边界场景','历史与当前版本智能 diff','多环境与配置灰度切换'][i] }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pin { height: 320vh; position: relative; }
.stage { position: sticky; top: 0; height: 100vh; display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; align-items: center; padding: 48px 24px; }
.left .title { font-size: clamp(28px, 4.8vw, 56px); margin: 10px 0 12px; }
.desc { color: var(--muted); max-width: 640px; }
.chip { display: inline-block; margin-bottom: 8px; }

.right { display: grid; gap: 14px; }
.step { opacity: 0; transform: translateY(24px); padding: 16px; display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; }
.badge { background: #0b1220; color: #9db4ff; border: 1px solid #203055; padding: 6px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: .04em; }
.line { height: 1px; background: linear-gradient(90deg, #26324a, transparent); grid-column: 1 / -1; opacity: .7; }
.content .k { font-weight: 700; }
.content .v { color: var(--muted); font-size: 14px; margin-top: 2px; }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; gap: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .step { opacity: 1 !important; transform: none !important; }
}
</style>


