<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import HeroSection from './components/HeroSection.vue'
import MetricsSection from './components/MetricsSection.vue'
import StorySection from './components/StorySection.vue'
import DeploySection from './components/DeploySection.vue'
import LogsSection from './components/LogsSection.vue'
import TopProgressNav from './components/TopProgressNav.vue'

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'story', label: 'Story' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'deploy', label: 'Deploy' },
  { id: 'logs', label: 'Logs' },
]

const activeId = ref(sections[0].id)
const localProgress = ref(0)
let rafId = 0

function updateActiveSection() {
  rafId = 0
  const nodes = Array.from(document.querySelectorAll('.snap-section'))
  if (!nodes.length) return
  const anchor = window.innerHeight * 0.5 // 以视口中线作为统一锚点

  // 优先找中线落入其内的 section
  let current = nodes.find((el) => {
    const r = el.getBoundingClientRect()
    return r.top <= anchor && r.bottom >= anchor
  })
  // 若没有完全包含，则退化到距离中线最近者
  if (!current) {
    let best = nodes[0]
    let bestDist = Number.POSITIVE_INFINITY
    nodes.forEach((el) => {
      const r = el.getBoundingClientRect()
      const dist = Math.min(Math.abs(r.top - anchor), Math.abs(r.bottom - anchor))
      if (dist < bestDist) { bestDist = dist; best = el }
    })
    current = best
  }

  if (current && activeId.value !== current.id) activeId.value = current.id

  // 使用同一锚点计算局部进度，确保顶部导航与圆点一致
  if (current) {
    const r = current.getBoundingClientRect()
    const prog = (anchor - r.top) / r.height
    localProgress.value = Math.max(0, Math.min(1, prog))
  }
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(updateActiveSection)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  updateActiveSection()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="snap-container">
    <TopProgressNav :sections="sections" :active-id="activeId" :progress="localProgress" />
    <section id="hero" class="snap-section" :class="{ 'is-active': activeId === 'hero' }">
      <HeroSection />
    </section>
    <section id="story" class="snap-section" :class="{ 'is-active': activeId === 'story' }">
      <StorySection />
    </section>
    <section id="metrics" class="snap-section" :class="{ 'is-active': activeId === 'metrics' }">
      <MetricsSection />
    </section>
    <section id="deploy" class="snap-section" :class="{ 'is-active': activeId === 'deploy' }">
      <DeploySection />
    </section>
    <section id="logs" class="snap-section" :class="{ 'is-active': activeId === 'logs' }">
      <LogsSection />
    </section>
  </div>

  <div class="nav-dots" aria-label="页面导航">
    <button v-for="s in sections" :key="s.id + '-dot'" class="dot" :class="{ active: activeId === s.id }" :aria-label="'跳转到 ' + s.id" @click="scrollToId(s.id)"></button>
  </div>
</template>

<style scoped>
</style>
