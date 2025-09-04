export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function lerp(start, end, t) {
  return start + (end - start) * t
}

export function mapWindow(progress, start, end) {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return (progress - start) / (end - start)
}

export function computePinnedSectionProgress(sectionElement) {
  const rect = sectionElement.getBoundingClientRect()
  const totalScrollable = rect.height - window.innerHeight
  if (totalScrollable <= 0) return 0
  const progressed = -rect.top
  return clamp(progressed / totalScrollable, 0, 1)
}


