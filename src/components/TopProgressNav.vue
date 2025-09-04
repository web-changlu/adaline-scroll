<script setup>
import { computed } from 'vue'

const props = defineProps({
  sections: { type: Array, required: true },
  activeId: { type: String, required: true },
  progress: { type: Number, default: 0 }, // 当前激活 section 的局部进度 0~1
})

const activeIndex = computed(() => props.sections.findIndex(s => s.id === props.activeId))

function segFill(p, segIndex, segCount = 3) {
  const segSize = 1 / segCount
  const start = segIndex * segSize
  const end = start + segSize
  if (p <= start) return 0
  if (p >= end) return 1
  return (p - start) / segSize
}
</script>

<template>
  <nav class="top-progress" aria-label="页面进度导航">
    <div v-for="(s, i) in sections" :key="s.id" class="step" :class="{ active: s.id === activeId }">
      <div class="circle">
        <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
      </div>
      <div class="meta">
        <div class="name">{{ s.label }}</div>
        <transition name="fade-slide" mode="out-in">
          <div class="meta-row" v-if="s.id === activeId">
            <div class="bars">
              <span class="bar">
                <i :style="{ transform: `scaleX(${segFill(progress, 0)})` }"></i>
              </span>
              <span class="bar">
                <i :style="{ transform: `scaleX(${segFill(progress, 1)})` }"></i>
              </span>
              <span class="bar">
                <i :style="{ transform: `scaleX(${segFill(progress, 2)})` }"></i>
              </span>
            </div>
            <div class="fraction">{{ i + 1 }} / {{ sections.length }}</div>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.top-progress {
  position: fixed; left: 24px; top: 18px; right: 24px; z-index: 60;
  display: flex; align-items: center; gap: 28px; padding: 6px 10px;
  color: #c8d2c6; pointer-events: none; /* 容器不拦截，子元素可点击 */
}
.step { display: flex; align-items: center; gap: 10px; opacity: .5; pointer-events: auto; }
.step, .name { transition: opacity .2s cubic-bezier(.22,.61,.36,1), color .2s cubic-bezier(.22,.61,.36,1); }
.step.active { opacity: 1; }
.circle {
  width: 32px; height: 32px; border-radius: 999px;
  border: 1px dashed #cfd9c9; display: grid; place-items: center; color: #202a21; background: rgba(228,238,228,.5);
  box-shadow: inset 0 0 0 2px rgba(21,41,24,.6);
  transition: background-color .25s cubic-bezier(.22,.61,.36,1), border-color .25s cubic-bezier(.22,.61,.36,1), box-shadow .25s cubic-bezier(.22,.61,.36,1);
}
.step.active .circle { background: rgba(228,238,228,.7); box-shadow: inset 0 0 0 2px rgba(21,41,24,.75); }
.num { font-size: 12px; font-weight: 700; }
.meta { display: grid; gap: 2px; }
.name { color: #cfd9c9; font-weight: 600; font-size: 13px; }
.meta-row { display: flex; align-items: center; gap: 10px; }
.bars { display: flex; align-items: center; gap: 6px; height: 8px; }
.bar { width: 64px; height: 2px; background: #dfe7ff; display: block; overflow: hidden; border-radius: 2px; }
/* 进度颜色与全局 active 高亮一致（使用 --accent） */
.bar i { display: block; height: 100%; width: 100%; background: var(--accent); transform-origin: left center; transform: scaleX(0); transition: transform .45s cubic-bezier(.22,.61,.36,1); backface-visibility: hidden; will-change: transform; }
.fraction { color: #879487; font-size: 12px; }

@media (max-width: 900px) {
  .top-progress { gap: 16px; left: 12px; right: 12px; }
  .circle { width: 28px; height: 28px; }
  .num { font-size: 11px; }
  .bar { width: 52px; }
}

/* 过渡动画：切换阶段时轻微上移与淡入淡出 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity .28s cubic-bezier(.22,.61,.36,1), transform .28s cubic-bezier(.22,.61,.36,1); will-change: opacity, transform; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateX(6px); }

@media (prefers-reduced-motion: reduce) {
  .step, .name, .circle, .bar i, .fade-slide-enter-active, .fade-slide-leave-active { transition: none !important; }
}
</style>


