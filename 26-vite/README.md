# Phase 26: Vite

## 📋 本阶段概述

学习 Vite 的架构设计，理解新一代前端构建工具的最佳实践。

## 🎯 学习目标

- 理解 Vite 的核心设计理念
- 掌握 Vite 的开发和生产构建
- 了解 Native ESM 的优势
- 学会 Vite 项目配置

## 🚀 核心理念

### Vite 的创新

```
传统构建（Webpack）：
  开发时：打包整个项目 → 启动慢

Vite 的方案：
  开发时：利用浏览器原生 ESM → 秒启动
  生产时：使用 Rollup 打包 → 优化产物
```

## ⚡️ 核心优势

### 1. 极速的开发服务器

```
启动速度：

Webpack Dev Server: 10-30 秒
Vite Dev Server:    1 秒以内 ⚡️

原理：
- 无需打包，直接利用浏览器 ESM
- 按需编译（只编译当前访问的文件）
- esbuild 预构建依赖
```

### 2. 极速的 HMR

```
热更新速度：

Webpack HMR: 1-3 秒
Vite HMR:    100ms 以内 ⚡️

原理：
- 精准的 HMR 边界
- 原生 ESM 的优势
- 不需要重新打包
```

### 3. 开箱即用

```
Vite 内置支持：
✅ TypeScript
✅ JSX/TSX
✅ CSS/Sass/Less
✅ 静态资源
✅ JSON 导入
✅ Web Assembly
✅ HMR
✅ 代码分割
```

## 🏗️ Vite 架构

```
Vite = esbuild（开发） + Rollup（生产）

开发模式：
  └─ esbuild 预构建依赖
  └─ Native ESM 按需加载
  └─ 极速 HMR

生产模式：
  └─ Rollup 打包
  └─ 完整的代码优化
  └─ Tree Shaking
  └─ Chunk 分割
```

## 💡 核心特点

```
Vite:
✅ 开发启动极快（< 1秒）
✅ HMR 极快（< 100ms）
✅ 开箱即用
✅ 生产构建优化
✅ 插件生态丰富
✅ 框架无关（Vue/React/Svelte）
⚠️ 需要现代浏览器（支持 ESM）
```

## 🚀 快速开始

```bash
# 创建项目
npm create vite@latest my-app

# 进入目录
cd my-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

## 📊 适用场景

✅ **强烈推荐**：
- 新项目（任何框架）
- 追求开发体验
- 现代浏览器支持
- 中小型项目

✅ **可以尝试**：
- 大型项目
- 需要迁移的老项目

❌ **暂不推荐**：
- 需要支持 IE11
- 依赖大量 Webpack 特定插件

## 🌟 生态

### 官方插件
- @vitejs/plugin-vue
- @vitejs/plugin-react
- @vitejs/plugin-legacy（兼容旧浏览器）

### 框架模板
- Vue 3
- React
- Preact
- Lit
- Svelte
- Solid

## 📈 市场占有率

```
2021: Vite 崭露头角
2022: Vite 快速增长
2023: Vite 成为主流选择之一
2024: Vite 成为新项目首选

知名项目使用 Vite：
- Vue 3 生态
- Nuxt 3
- SvelteKit
- Astro
- Storybook
```

## 🆚 对比

| 特性 | Vite | Webpack | 
|------|------|---------|
| 开发启动 | ⚡️ < 1s | 🐌 10-30s |
| HMR 速度 | ⚡️ < 100ms | 🐢 1-3s |
| 配置复杂度 | 🟢 简单 | 🔴 复杂 |
| 生态成熟度 | 🟡 成长中 | 🟢 非常成熟 |
| 生产构建 | Rollup | Webpack |
| 学习曲线 | 🟢 平缓 | 🔴 陡峭 |

## 💡 核心原理

### 1. Dev Server（开发模式）

```javascript
// 浏览器请求
import { createApp } from 'vue'

// Vite 拦截并转换
import { createApp } from '/node_modules/.vite/vue.js?v=xxx'

// 浏览器原生 ESM 加载
// 无需打包，按需编译
```

### 2. Pre-bundling（依赖预构建）

```
node_modules 中的依赖：
  ↓
  esbuild 预构建（极快）
  ↓
  转换为 ESM 格式
  ↓
  缓存到 node_modules/.vite/
```

### 3. Production Build（生产构建）

```
源代码
  ↓
  Rollup 打包
  ↓
  Tree Shaking
  ↓
  代码分割
  ↓
  压缩优化
  ↓
  输出 dist/
```

## 🎓 学习建议

1. **动手实践**：创建一个 Vite 项目
2. **对比体验**：感受开发速度差异
3. **阅读文档**：理解核心原理
4. **尝试迁移**：将老项目迁移到 Vite

## 📚 扩展阅读

- [Vite 官方文档](https://vitejs.dev/)
- [为什么选择 Vite](https://vitejs.dev/guide/why.html)
- [Vite 插件开发](https://vitejs.dev/guide/api-plugin.html)

---

> ⚡️ Vite: 下一代前端构建工具！

