# 贡献指南

感谢你愿意为本项目做出贡献！

## 开发环境
1. 克隆仓库并安装依赖：`npm i`
2. 启动开发：`npm run dev`
3. 构建产物：`npm run build`，本地预览：`npm run preview`

## 分支与提交
- 建议使用分支：`feat/*`、`fix/*`、`docs/*`、`chore/*`
- 提交信息建议遵循 Conventional Commits：`feat: xxx`、`fix: yyy`

## 代码规范
- 保持组件内逻辑简洁；通用函数放在 `src/utils/`
- 动画尽量使用 `transform/opacity`，避免 layout thrash
- 变量与函数名使用有意义的完整词；避免缩写

## 提交 PR
1. 从 `main` 切分支
2. 确保 `npm run build` 无误
3. 描述变更动机、效果与截图/GIF（如涉及 UI）
4. 等待维护者 Review

## 问题反馈
请尽量提供：复现步骤、期望行为、实际行为、浏览器/系统信息与截图。


