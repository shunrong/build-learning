# Vite 架构深度解析

## 🏗️ Vite 架构

```
Vite = Dev Server (开发) + Build (生产)

开发模式：
  ├─ Native ESM（浏览器原生模块）
  ├─ esbuild（依赖预构建）
  └─ Vite Plugin（插件系统）

生产模式：
  ├─ Rollup（打包）
  ├─ Tree Shaking（优化）
  └─ Code Splitting（分割）
```

---

## ⚡️ 开发模式原理

### 1. 预构建依赖

```
node_modules中的依赖 (CommonJS/多文件)
  ↓
esbuild 预构建
  ↓
转换为单个 ESM 文件
  ↓
缓存到 node_modules/.vite/
```

### 2. 按需编译

```
浏览器请求 /src/App.tsx
  ↓
Vite 拦截
  ↓
esbuild 编译 TSX → JS
  ↓
转换 import 路径
  ↓
返回 ESM 格式
```

### 3. HMR 原理

```
文件改动
  ↓
Vite 监听
  ↓
精准确定影响范围
  ↓
WebSocket 推送更新
  ↓
浏览器只更新该模块（< 100ms）
```

---

## 🔧 生产构建

### 使用 Rollup

```javascript
// 为什么生产用 Rollup？
1. 更成熟的优化
2. 更好的 Tree Shaking
3. 更好的 Code Splitting
4. 更小的输出体积
```

### 构建优化

```javascript
{
  build: {
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lodash': ['lodash']
        }
      }
    }
  }
}
```

---

## 📊 性能对比

| 场景 | Webpack | Vite |
|------|---------|------|
| **冷启动** | 30s | < 1s ⚡️ |
| **热更新** | 2s | < 0.1s ⚡️ |
| **生产构建** | 60s | 30s ⚡️ |

---

## 🎓 核心收获

1. **开发：Native ESM + esbuild**
2. **生产：Rollup 优化**
3. **HMR 极速（< 100ms）**
4. **预构建依赖缓存**
5. **代表前端构建未来**

**Vite：完美的开发体验 + 优化的生产构建！**

