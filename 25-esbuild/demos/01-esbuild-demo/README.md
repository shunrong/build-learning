# Demo: esbuild 极速构建

## 功能

演示 esbuild 的极速构建能力：
- TypeScript 支持
- JSX 支持
- 极速编译（10-100x）

## 快速开始

```bash
npm install --save-dev esbuild

# 打包
esbuild src/index.ts --bundle --outfile=dist/bundle.js

# 压缩
esbuild src/index.ts --bundle --minify --outfile=dist/bundle.min.js

# 开发服务器
esbuild src/index.ts --bundle --servedir=public --serve
```

## 学习要点

- esbuild 基础使用
- 性能对比
- 适用场景

---

> ⚡️ esbuild: 速度的极致追求！

