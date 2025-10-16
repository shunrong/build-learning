# esbuild 基础

## 🎯 esbuild 简介

**esbuild** 是用 Go 语言编写的极速 JavaScript 打包工具，比 Webpack 快 **10-100 倍**。

---

## ⚡️ 性能数据

```
打包 10000 个文件：

Webpack: 45 秒
Rollup:  30 秒
esbuild: 0.5 秒 ⚡️（90x 更快！）
```

---

## 🚀 快速开始

### 安装

```bash
npm install --save-dev esbuild
```

### 使用

```bash
# 打包
esbuild src/index.js --bundle --outfile=dist/bundle.js

# 压缩
esbuild src/index.js --bundle --minify --outfile=dist/bundle.min.js

# 开发服务器
esbuild src/index.js --bundle --servedir=public --serve
```

---

## ⚙️ 核心特性

### 1. 内置 TypeScript 支持

```bash
esbuild src/index.ts --bundle --outfile=dist/bundle.js
# 无需配置，自动编译 TS
```

### 2. 内置 JSX 支持

```bash
esbuild src/App.jsx --bundle --loader:.jsx=jsx --outfile=dist/bundle.js
```

### 3. 极速构建

```javascript
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true
}).then(() => console.log('✅ Build complete!'));
```

---

## 🎯 适用场景

✅ **适合**：
- 开发环境（极速 HMR）
- 简单项目
- TypeScript/JSX 项目

⚠️ **不适合**：
- 复杂的代码分割
- 需要特定 Webpack 插件

---

## 🎓 核心收获

1. **esbuild = 极致速度**
2. **Go 语言实现，10-100x 更快**
3. **内置 TS/JSX 支持**
4. **Vite 的开发模式引擎**
5. **未来趋势**

**esbuild：速度的极致追求！**

