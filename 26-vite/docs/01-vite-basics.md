# Vite 基础

## 🎯 Vite 是什么

**Vite** (法语"快速")是新一代前端构建工具，核心特点：

```
开发模式：Native ESM + esbuild（极速）
生产模式：Rollup（优化）
```

---

## ⚡️ 核心优势

### 1. 极速的开发服务器

```
启动速度：

Webpack Dev Server: 10-30 秒
Vite Dev Server:    < 1 秒 ⚡️

原理：无需打包，利用浏览器原生 ESM
```

### 2. 极速的 HMR

```
热更新速度：

Webpack HMR: 1-3 秒
Vite HMR:    < 100ms ⚡️

原理：精准的 HMR 边界 + Native ESM
```

### 3. 开箱即用

```
内置支持：
✅ TypeScript
✅ JSX/TSX
✅ CSS/Sass/Less
✅ 静态资源
✅ JSON 导入
✅ Web Assembly
✅ HMR
✅ 代码分割
```

---

## 🚀 快速开始

### 创建项目

```bash
npm create vite@latest my-app

# 选择框架
√ Select a framework: » React
√ Select a variant: » TypeScript

cd my-app
npm install
npm run dev
```

### 项目结构

```
my-app/
├── index.html        # 入口 HTML
├── src/
│   ├── main.tsx      # 入口 JS
│   ├── App.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
└── vite.config.ts    # Vite 配置
```

---

## ⚙️ 核心配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
```

---

## 💡 Vite 原理

### 开发模式

```
浏览器请求 /src/main.js
  ↓
Vite 拦截请求
  ↓
esbuild 编译（极快）
  ↓
返回 ESM 格式代码
  ↓
浏览器原生 ESM 加载
```

### 生产模式

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

---

## 🎯 适用场景

✅ **强烈推荐**：
- 所有新项目
- 任何框架（Vue/React/Svelte）
- 追求开发体验
- 中小型项目

✅ **可以尝试**：
- 大型项目
- 老项目迁移

❌ **暂不推荐**：
- 需要支持 IE11
- 依赖特定 Webpack 插件

---

## 🎓 核心收获

1. **Vite = 极速开发体验**
2. **开发：Native ESM + esbuild**
3. **生产：Rollup 优化**
4. **开箱即用**
5. **下一代构建工具**

**Vite：前端开发的未来！**

