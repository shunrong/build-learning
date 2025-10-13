# Demo 4: 模块化最佳实践

## 📝 简介

本 Demo 演示现代 JavaScript 模块化的最佳实践，包括 ES Module、Tree Shaking 和动态 import。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式
```bash
npm run dev
```

### 3. 生产构建 + 打包分析
```bash
npm run analyze
```

## 🎯 核心知识点

### 1. Tree Shaking

**配置**：
```javascript
// webpack.config.js
{
  optimization: {
    usedExports: true,
    sideEffects: true
  }
}

// package.json
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}

// babel.config.js
{
  presets: [
    ['@babel/preset-env', {
      modules: false  // 关键配置！
    }]
  ]
}
```

### 2. 动态 import

```javascript
// 代码分割
const module = await import('./heavy-module');

// 魔法注释
const module = await import(
  /* webpackChunkName: "heavy-module" */
  './heavy-module'
);
```

## ✅ 验证

1. 运行 `npm run build`
2. 查看 `dist/main.js`
3. 搜索 `subtract` 和 `divide` - 应该找不到（已被 Tree Shaking）
4. 查看 `dist/` 目录 - 应该有 `heavy-module.chunk.js`（代码分割）

## 💡 最佳实践

1. ✅ 使用 ES Module
2. ✅ 配置 `modules: false`
3. ✅ 配置 `sideEffects`
4. ✅ 使用命名导出（更利于 Tree Shaking）
5. ✅ 动态 import 实现代码分割

