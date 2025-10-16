# Phase 24: Rollup

## 📋 本阶段概述

学习 Rollup 的核心原理和使用方法，理解为什么它是库（Library）打包的首选工具。

## 🎯 学习目标

- 理解 Rollup 的设计理念和优势
- 掌握 Rollup 的配置和插件系统
- 了解 ES Module 打包的最佳实践
- 学会使用 Rollup 打包库

## 📂 内容结构

```
24-rollup/
├── docs/                    # 📚 学习文档
│   ├── 00-guide.md         # 学习指南
│   └── 01-rollup-basics.md # Rollup 基础
│
└── demos/                   # 💻 实战项目
    └── 01-rollup-basics/   # Rollup 基础示例
```

## 🎯 核心特点

### Rollup vs Webpack

```
Rollup:
✅ Tree Shaking 更彻底
✅ 输出代码更简洁
✅ 适合打包库（Library）
✅ ES Module 原生支持
❌ 不适合应用打包（需要很多插件）

Webpack:
✅ 功能全面
✅ 适合应用打包
✅ 生态完善
✅ 支持各种资源
❌ 输出代码较冗余
```

## 💡 核心概念

### 1. Tree Shaking

```javascript
// utils.js
export function used() { return 'used'; }
export function unused() { return 'unused'; }

// main.js
import { used } from './utils.js';
console.log(used());

// Rollup 打包后
function used() { return 'used'; }
console.log(used());
// unused 函数被自动移除 ✅
```

### 2. ES Module 输出

```javascript
// Rollup 输出的代码非常干净
// 没有 Webpack 的 runtime 代码
function myFunction() {
  return 'Hello';
}

export { myFunction };
```

### 3. 多格式输出

```javascript
// rollup.config.js
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/bundle.cjs.js', format: 'cjs' },    // CommonJS
    { file: 'dist/bundle.esm.js', format: 'esm' },    // ES Module
    { file: 'dist/bundle.umd.js', format: 'umd' }     // UMD
  ]
};
```

## 🚀 快速开始

```bash
# 安装 Rollup
npm install --save-dev rollup

# 运行 Demo
cd demos/01-rollup-basics
npm install
npm run build
```

## 📊 适用场景

✅ **适合 Rollup**：
- 打包 JavaScript 库
- 需要多格式输出（ESM/CJS/UMD）
- 追求代码体积最小
- 输出代码需要可读

❌ **不适合 Rollup**：
- 复杂的 Web 应用
- 需要大量的资源处理
- 需要开发服务器
- 代码分割需求复杂

## 🌟 知名项目

使用 Rollup 的知名库：
- Vue.js
- React
- Three.js
- D3.js
- Redux

## 📚 扩展阅读

- [Rollup 官方文档](https://rollupjs.org/)
- [Rollup Plugin 开发](https://rollupjs.org/plugin-development/)

---

> 💡 Rollup 是库打包的黄金标准！

