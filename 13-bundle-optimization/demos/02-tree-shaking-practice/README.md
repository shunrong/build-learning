# Demo 02: Tree Shaking 实战

## 📖 Demo 说明

本 Demo 通过对比**启用**和**未启用** Tree Shaking 的构建产物，直观展示 Tree Shaking 对 Bundle 体积的影响。

**对比内容**：
- JavaScript Tree Shaking（移除未使用的函数、类、常量）
- Lodash-ES Tree Shaking（按需导入）
- CSS Tree Shaking（PurgeCSS 移除未使用的样式）
- Scope Hoisting（模块合并）

## 🎯 学习目标

- 理解 Tree Shaking 的工作原理
- 掌握启用 Tree Shaking 的配置方法
- 学会验证 Tree Shaking 效果
- 了解 Tree Shaking 的最佳实践

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

###2. 方式一：自动对比（推荐）

```bash
npm run compare
```

**自动执行**：
1. 构建未启用 Tree Shaking 的版本
2. 构建启用 Tree Shaking 的版本
3. 对比体积差异
4. 输出详细分析报告

**典型输出**：

```
🌳 Tree Shaking 效果对比

1️⃣  构建未启用 Tree Shaking 的版本...
   ✅ 完成 - 耗时: 3.50s, 体积: 85.23 KB

2️⃣  构建启用 Tree Shaking 的版本...
   ✅ 完成 - 耗时: 3.80s, 体积: 28.45 KB

📊 对比结果:

📦 体积对比:
   未启用 Tree Shaking: 85.23 KB
   启用 Tree Shaking:   28.45 KB
   减少: 56.78 KB (66.6%)

⏱️  构建时间:
   未启用 Tree Shaking: 3.50s
   启用 Tree Shaking:   3.80s
   增加: 0.30s

🎯 效果分析:
   1. JavaScript Tree Shaking:
      - 移除了未使用的函数 (subtract, divide, power, Calculator)
      - 移除了未使用的常量 (PI, E, GOLDEN_RATIO)
      - lodash-es 按需打包 (只包含 debounce, throttle, chunk)

   2. CSS Tree Shaking (PurgeCSS):
      - 移除了未使用的样式类 (.unused-style, .another-unused, .yet-another-unused)
      - 只保留实际使用的 CSS

   3. 模块合并 (Scope Hoisting):
      - 将多个模块合并到一个作用域
      - 减少函数包裹代码，进一步减小体积

💡 关键发现:
   ✅ Tree Shaking 效果显著，体积减少 66.6%
   ✅ 建议在生产环境中启用 Tree Shaking
```

### 3. 方式二：手动对比

```bash
# 构建未启用 Tree Shaking 的版本
npm run build:no-tree-shaking

# 构建启用 Tree Shaking 的版本
npm run build:with-tree-shaking

# 对比 dist-no-tree-shaking 和 dist-with-tree-shaking 目录
```

## 🔍 配置差异

### 未启用 Tree Shaking

```javascript
// webpack.no-tree-shaking.config.js
module.exports = {
  optimization: {
    usedExports: false,    // ← 不标记未使用的导出
    sideEffects: false,    // ← 不考虑副作用
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: 'commonjs'  // ← 转换为 CommonJS
              }]
            ]
          }
        }
      }
    ]
  }
};
```

**问题**：
- Babel 转换为 CommonJS，破坏了 ES Module 的静态结构
- Webpack 无法分析哪些导出被使用
- 所有代码都会被打包

### 启用 Tree Shaking

```javascript
// webpack.with-tree-shaking.config.js
module.exports = {
  optimization: {
    usedExports: true,        // ← 标记未使用的导出
    sideEffects: true,        // ← 根据 package.json 决定
    minimize: true,
    concatenateModules: true  // ← Scope Hoisting
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false  // ← 保留 ES Module
              }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new PurgeCSSPlugin({  // ← CSS Tree Shaking
      paths: glob.sync(`${__dirname}/src/**/*`, { nodir: true })
    })
  ]
};
```

**效果**：
- 保留 ES Module，Webpack 可以静态分析
- 未使用的导出会被标记并移除
- CSS Tree Shaking 移除未使用的样式

## 📊 Tree Shaking 效果分析

### 1. JavaScript Tree Shaking

**utils.js 导出**：

```javascript
// ✅ 使用的（会保留）
export function add(a, b) { ... }
export function multiply(a, b) { ... }

// ❌ 未使用的（会移除）
export function subtract(a, b) { ... }     // 被移除
export function divide(a, b) { ... }       // 被移除
export function power(a, b) { ... }        // 被移除
export class Calculator { ... }            // 被移除
export const PI = 3.14159;                 // 被移除
```

**验证方法**：

1. 打开 `dist-with-tree-shaking/main.xxx.js`
2. 搜索 "subtract" → 找不到（已被移除）
3. 搜索 "add" → 找到（被保留）

### 2. Lodash-ES Tree Shaking

```javascript
// ✅ 按需导入
import { debounce, throttle, chunk } from 'lodash-es';

// 只打包这 3 个函数（约 2-3 KB）
// 其他 lodash 函数不会被打包
```

**对比**：

```
import _ from 'lodash';        // 70 KB
import { xxx } from 'lodash-es';  // 2-3 KB（减少 96%）
```

### 3. CSS Tree Shaking

**未使用的样式**：

```css
/* 这些样式在代码中没有使用，会被 PurgeCSS 移除 */
.unused-style { ... }
.another-unused { ... }
.yet-another-unused { ... }
```

**验证方法**：

1. 打开 `dist-with-tree-shaking/main.xxx.js`
2. 搜索 "unused-style" → 找不到（已被移除）
3. 搜索 "container" → 找到（实际使用的样式）

## 💡 最佳实践

### 1. 保留 ES Module

```javascript
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false  // ← 关键：保留 ES Module
    }]
  ]
}
```

### 2. 配置 sideEffects

```json
// package.json
{
  "sideEffects": [
    "*.css",           // CSS 有副作用（注入样式）
    "./src/polyfill.js"  // Polyfill 有副作用
  ]
}
```

### 3. 使用支持 Tree Shaking 的库

```javascript
// ✅ 支持 Tree Shaking
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';

// ❌ 不支持 Tree Shaking
import _ from 'lodash';
import moment from 'moment';
```

### 4. 命名导出优于默认导出

```javascript
// ✅ 命名导出（Tree Shaking 友好）
export function add(a, b) { ... }
export function subtract(a, b) { ... }

// ❌ 默认导出对象（难以 Tree Shaking）
export default {
  add: (a, b) => { ... },
  subtract: (a, b) => { ... }
};
```

## 🎯 常见问题

### Q1: 为什么启用 Tree Shaking 后体积反而变大？

**可能原因**：
1. Scope Hoisting 增加了少量代码
2. Source Map 配置不同
3. 代码本身没有未使用的部分

**验证**：查看 Gzip 后的体积，通常会减小

### Q2: 为什么某些代码没有被 Tree Shaking？

**可能原因**：
1. Babel 转换为 CommonJS（检查 `modules: false`）
2. 代码有副作用（检查 `sideEffects` 配置）
3. 动态导入（无法静态分析）

### Q3: CSS Tree Shaking 误删了样式怎么办？

**解决方案**：

```javascript
// webpack.config.js
new PurgeCSSPlugin({
  paths: glob.sync(`${__dirname}/src/**/*`, { nodir: true }),
  safelist: ['my-class', /^dynamic-/]  // 保护这些类名
})
```

## 📈 性能提升

| 指标 | 未启用 | 启用 | 提升 |
|------|--------|------|------|
| Bundle 体积 | 85 KB | 28 KB | 67% |
| Gzip 后体积 | 25 KB | 9 KB | 64% |
| 首屏加载时间 | 1.2s | 0.4s | 67% |

## 🔗 相关资源

- [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [PurgeCSS 文档](https://purgecss.com/)
- [Lodash-ES vs Lodash](https://github.com/lodash/lodash/wiki/Build-Differences)

---

**下一步**：尝试在自己的项目中启用 Tree Shaking，体验体积优化的效果！

