<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { clamp, lerp, computePinnedSectionProgress } from '../utils/scroll'

const sceneRef = ref(null)
const cardsRef = ref([])
const valuesRef = ref([])

let rafId = 0
let onScrollHandler = null

function render() {
  rafId = 0
  const scene = sceneRef.value
  if (!scene) return
  const p = computePinnedSectionProgress(scene)
  const items = cardsRef.value
  items.forEach((el, i) => {
    const start = 0.2 + i * 0.1
    const end = start + 0.25
    let t = (p - start) / (end - start)
    t = clamp(t, 0, 1)
    el.style.opacity = String(t)
    el.style.transform = `translateY(${lerp(24, 0, t)}px)`
  })

  // 数字计数：简单线性补间到目标值
  valuesRef.value.forEach((el, i) => {
    const target = [200, 5000, 300, 99.998][i]
    const unit = ['M+','M+','+','%'][i]
    const start = 0.2 + i * 0.1
    const end = start + 0.25
    let t = (p - start) / (end - start)
    t = clamp(t, 0, 1)
    const val = i === 1 ? Math.round(lerp(0, target, t)) : (i === 3 ? (lerp(80, target, t)).toFixed(3) : Math.round(lerp(0, target, t)))
    el.textContent = `${val}${unit}`
  })
}

onMounted(() => {
  onScrollHandler = () => {
    if (rafId) return
    rafId = requestAnimationFrame(render)
  }
  window.addEventListener('scroll', onScrollHandler, { passive: true })
  render()
})

onBeforeUnmount(() => {
  if (onScrollHandler) window.removeEventListener('scroll', onScrollHandler)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section class="metrics pin" ref="sceneRef">
    <div class="stage">
      <div class="grid">
        <div class="card" :ref="el => el && (cardsRef[i] = el)" v-for="(c, i) in 4" :key="i">
          <div class="value" :ref="el => el && (valuesRef[i] = el)">0</div>
          <div class="label">{{ ['API calls/day','Tokens/day','Models','Uptime'][i] }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pin { height: 250vh; position: relative; }
.stage { position: sticky; top: 0; height: 100vh; display: grid; place-items: center; padding: 48px 24px; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 20px;
  max-width: 1000px; width: 100%;
}
.card {
  background: #0f1117; border: 1px solid #1c2230; border-radius: 14px; padding: 20px 24px;
  box-shadow: 0 8px 30px rgba(0,0,0,.25);
  opacity: 0; transform: translateY(24px); will-change: transform, opacity;
}
.value { font-size: clamp(26px, 4vw, 44px); font-weight: 800; letter-spacing: .02em; }
.label { color: var(--muted); margin-top: 6px; }

@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, minmax(200px, 1fr)); } }
@media (max-width: 600px) {
  .grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .card { opacity: 1 !important; transform: none !important; }
}
</style>


