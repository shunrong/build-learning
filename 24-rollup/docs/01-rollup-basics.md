# Rollup 基础

## 🎯 Rollup 的定位

**Rollup** 是专为 ES Module 设计的打包工具，是**库（Library）打包的首选**。

```
Webpack  → 应用（Application）打包
Rollup   → 库（Library）打包
```

---

## ⚡️ 核心优势

### 1. Tree Shaking 最彻底

```javascript
// utils.js
export function used() { return 'used'; }
export function unused() { return 'unused'; }

// main.js
import { used } from './utils';
console.log(used());

// Rollup 打包后：unused 完全消失 ✅
function used() { return 'used'; }
console.log(used());
```

### 2. 输出代码最简洁

```javascript
// Webpack 输出（包含 runtime）
(function(modules) {
  // ... 大量 runtime 代码
})([/* modules */]);

// Rollup 输出（几乎就是源码）
function myFunction() {
  return 'Hello';
}

export { myFunction };
```

### 3. 多格式输出

```javascript
// 一次构建，输出多种格式
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/bundle.cjs.js', format: 'cjs' },
    { file: 'dist/bundle.esm.js', format: 'esm' },
    { file: 'dist/bundle.umd.js', format: 'umd', name: 'MyLib' }
  ]
};
```

---

## 🚀 快速开始

### 1. 安装

```bash
npm install --save-dev rollup
```

### 2. 基础配置

```javascript
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  }
};
```

### 3. 运行

```bash
rollup -c
```

---

## ⚙️ 核心配置

### 1. Input 配置

```javascript
{
  // 单入口
  input: 'src/index.js',
  
  // 或多入口
  input: {
    main: 'src/index.js',
    utils: 'src/utils.js'
  }
}
```

### 2. Output 配置

```javascript
{
  output: {
    file: 'dist/bundle.js',      // 输出文件
    format: 'esm',                // 输出格式
    name: 'MyLib',                // UMD/IIFE 的全局变量名
    sourcemap: true,              // Source Map
    exports: 'named'              // 导出模式
  }
}
```

### 3. 输出格式

```javascript
// ESM (ES Module)
format: 'esm'
// 输出: export { myFunction };

// CJS (CommonJS)
format: 'cjs'
// 输出: module.exports = { myFunction };

// UMD (Universal Module Definition)
format: 'umd'
// 输出: 同时支持 AMD、CommonJS、全局变量

// IIFE (Immediately Invoked Function Expression)
format: 'iife'
// 输出: (function() { })();
```

---

## 🎯 实战示例

### 打包一个工具库

```javascript
// src/index.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// rollup.config.js
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/math-utils.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/math-utils.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/math-utils.umd.js',
      format: 'umd',
      name: 'MathUtils'
    }
  ]
};

// package.json
{
  "main": "dist/math-utils.cjs.js",
  "module": "dist/math-utils.esm.js",
  "browser": "dist/math-utils.umd.js"
}
```

---

## 🎓 核心收获

1. **Rollup 专注于库打包**
2. **Tree Shaking 最彻底**
3. **输出代码最简洁**
4. **多格式输出**
5. **Vue/React 都在用**

**Rollup：库打包的黄金标准！**

