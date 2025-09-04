# Adaline-style Scroll Story (Vue + Vite)

现代滚动叙事与分镜式交互 👉[在线预览](https://web-changlu.github.io/adaline-scroll/)

## 特性

- 分镜滚动：`Hero / Story / Metrics / Deploy / Logs` 五个分镜，逐段 pin 与局部进度
- 导航同步：顶部步骤导航（分段细条）与右侧圆点激活状态严格对齐
- DOM 实现：不依赖 canvas/video，纯 section/div 与 transform/opacity 动画
- 可访问性：`prefers-reduced-motion` 降级，键盘与触控滚动友好
- 工程化：通用滚动与数学工具 `src/utils/scroll.js`，组件化拆分

## 技术栈

- Vue 3 + Vite
- 原生滚动/`requestAnimationFrame`
- 可选：GSAP（已安装，当前未使用，可扩展）

## 开发

```bash
npm i
npm run dev
```

## 构建与本地预览

```bash
npm run build
npm run preview
```

## 目录结构

```
src/
  components/
    HeroSection.vue
    StorySection.vue
    MetricsSection.vue
    DeploySection.vue
    LogsSection.vue
    TopProgressNav.vue
  assets/
    img/
  utils/
    scroll.js
  App.vue
  main.js
```

## 自定义与扩展

- 新增分镜：复制一个 `XxxSection.vue`，在 `App.vue` 的 `sections` 中注册并添加一个 `.snap-section`
- 更新导航：在 `sections` 里调整顺序与标题，自动同步顶部/右侧导航
- 主题颜色：在 `src/style.css :root` 修改 `--accent` 即可统一变更

## 部署到 GitHub Pages

1) 设置 Vite 基础路径（如果仓库名为 `adaline-scroll`）：

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({ base: '/adaline-scroll/', plugins: [vue()] })
```

2) 推送到 GitHub，启用 Actions。CI 会自动构建并发布到 Pages。

## 贡献

欢迎 PR 与 Issue。请先阅读 `CONTRIBUTING.md` 与 `CODE_OF_CONDUCT.md`。

## 许可证

MIT。详见 `LICENSE`。
