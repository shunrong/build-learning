# Demo 2: Polyfill 方案对比

## 📝 简介

本 Demo 对比了 4 种不同的 Polyfill 方案，帮助你理解它们的区别和适用场景。

## 🎯 对比方案

| 方案 | 配置 | 特点 | 体积 | 适用场景 |
|------|------|------|------|----------|
| **useBuiltIns: false** | 不引入 Polyfill | 最小 | ~10KB | 现代浏览器 |
| **useBuiltIns: 'entry'** | 全量引入 | 完整 | ~250KB | 小应用 |
| **useBuiltIns: 'usage'** | 按需引入（推荐）| 智能 | ~20KB | 应用开发 ⭐️ |
| **transform-runtime** | 不污染全局 | 安全 | ~15KB | 库开发 ⭐️ |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器（默认使用 usage 方案）

```bash
npm run dev
```

### 3. 构建所有方案

```bash
npm run build:all
```

这会生成 4 个不同的构建：
- `dist/false/` - useBuiltIns: false
- `dist/entry/` - useBuiltIns: 'entry'
- `dist/usage/` - useBuiltIns: 'usage'
- `dist/runtime/` - @babel/plugin-transform-runtime

### 4. 分析体积对比

```bash
npm run analyze
```

输出示例：
```
========================================
  Polyfill 方案体积对比
========================================

1. useBuiltIns: false ⭐ (最小)
   体积: 2.45 KB

2. transform-runtime
   体积: 15.32 KB
   比最小方案多: 12.87 KB (525.3%)

3. useBuiltIns: usage
   体积: 18.76 KB
   比最小方案多: 16.31 KB (665.7%)

4. useBuiltIns: entry
   体积: 254.12 KB
   比最小方案多: 251.67 KB (10272.2%)
```

## 📚 方案详解

### 方案1：useBuiltIns: false

**配置**：
```javascript
// babel.config.js
{
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: false  // 不引入 Polyfill
    }]
  ]
}
```

**效果**：
```javascript
// 源代码
Promise.resolve(42);

// 转译后（不添加 Polyfill）
Promise.resolve(42);  // 如果浏览器不支持，会报错
```

**适用场景**：
- ✅ 目标环境本身就支持所有特性
- ✅ 手动管理 Polyfill
- ✅ 只需要语法转换

---

### 方案2：useBuiltIns: 'entry'

**配置**：
```javascript
// babel.config.js
{
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3,
      targets: { browsers: ['ie 11'] }
    }]
  ]
}
```

**使用方式**：
```javascript
// 入口文件必须手动引入
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 你的代码...
```

**效果**：
```javascript
// 输入
import 'core-js/stable';

// Babel 替换为具体的 Polyfill
import "core-js/modules/es.symbol";
import "core-js/modules/es.promise";
import "core-js/modules/es.array.includes";
// ... 几百个
```

**优缺点**：
- ✅ 完整支持目标环境
- ❌ 体积大（引入很多用不到的）
- ❌ 需要手动引入

---

### 方案3：useBuiltIns: 'usage' ⭐️ 推荐

**配置**：
```javascript
// babel.config.js
{
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
      targets: { browsers: ['ie 11'] }
    }]
  ]
}
```

**使用方式**：
```javascript
// 不需要手动引入，Babel 会自动分析并注入
Promise.resolve(42);
[1, 2, 3].includes(2);
```

**效果**：
```javascript
// 输入
Promise.resolve(42);
[1, 2, 3].includes(2);

// Babel 自动注入需要的 Polyfill
import "core-js/modules/es.promise";
import "core-js/modules/es.array.includes";

Promise.resolve(42);
[1, 2, 3].includes(2);
```

**优缺点**：
- ✅ 体积最小（只引入用到的）
- ✅ 自动分析，无需手动引入
- ✅ 智能根据目标环境

---

### 方案4：@babel/plugin-transform-runtime

**配置**：
```javascript
// babel.config.js
{
  presets: [
    ['@babel/preset-env', { modules: false }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3  // 不污染全局
    }]
  ]
}
```

**效果**：
```javascript
// 输入
Promise.resolve(42);
[1, 2, 3].includes(2);

// 输出（不污染全局）
import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";

_Promise.resolve(42);
_includesInstanceProperty([1, 2, 3]).call([1, 2, 3], 2);
```

**优缺点**：
- ✅ 不污染全局作用域
- ✅ 适合库开发
- ❌ 代码稍微啰嗦

---

## 🔍 体积对比

运行 `npm run build:all && npm run analyze` 查看实际体积对比。

**典型结果**（压缩后）：

| 方案 | 未压缩 | Gzip 压缩 | 说明 |
|------|--------|-----------|------|
| **false** | 2.5 KB | 1.2 KB | 不包含 Polyfill |
| **runtime** | 15 KB | 5 KB | 局部引入 |
| **usage** | 19 KB | 7 KB | 按需引入（推荐）⭐️ |
| **entry** | 254 KB | 80 KB | 全量引入 |

## 💡 如何选择？

### 快速决策

```
你在开发应用？
  ├─ 是 → useBuiltIns: 'usage' ⭐️⭐️⭐️⭐️⭐️
  └─ 否 → 你在开发库/组件？
           ├─ 是 → transform-runtime ⭐️⭐️⭐️⭐️
           └─ 否 → 只需要现代浏览器？
                    ├─ 是 → useBuiltIns: false ⭐️⭐️⭐️
                    └─ 否 → useBuiltIns: 'entry' ⭐️⭐️
```

### 详细推荐

#### 1. 应用开发（最常见）

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',  // 按需引入 ⭐️
      corejs: 3,
      targets: { browsers: ['> 1%', 'last 2 versions'] }
    }]
  ]
};
```

**理由**：
- ✅ 自动分析、按需引入
- ✅ 体积最小
- ✅ 配置简单

---

#### 2. 库/组件开发

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3  // 不污染全局 ⭐️
    }]
  ]
};
```

**理由**：
- ✅ 不污染使用者的全局环境
- ✅ 避免重复引入辅助函数

---

#### 3. 现代浏览器项目

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { browsers: ['chrome 90', 'firefox 88'] },
      useBuiltIns: false  // 不需要 Polyfill ⭐️
    }]
  ]
};
```

**理由**：
- ✅ 体积最小
- ✅ 性能最好

---

## 🎮 测试说明

### 1. 测试内容

本 Demo 测试了以下 API：
- **Promise**：异步操作
- **Array 方法**：includes, find, findIndex, flat
- **Object 方法**：assign, entries, values
- **String 方法**：includes, padStart, repeat
- **Map/Set**：新的数据结构

### 2. 测试结果

| 方案 | 测试结果 |
|------|----------|
| **false** | ❌ 所有测试失败（无 Polyfill） |
| **entry** | ✅ 所有测试通过（全量引入） |
| **usage** | ✅ 所有测试通过（按需引入） |
| **runtime** | ✅ 所有测试通过（不污染全局） |

### 3. 如何验证

1. 构建所有方案：`npm run build:all`
2. 分别打开 `dist/*/index.html`
3. 查看测试结果和控制台日志

---

## 🔧 实验

### 实验1：对比体积

```bash
npm run build:all
npm run analyze
```

### 实验2：查看引入的 Polyfill

```bash
# 使用 debug: true
npm run build:usage

# 控制台会输出引入的 Polyfill 列表
```

### 实验3：修改目标浏览器

```javascript
// 修改 package.json
{
  "browserslist": [
    "chrome 90"  // 现代浏览器
  ]
}

// 再次构建，体积会大幅减小
```

---

## ❓ 常见问题

### 1. useBuiltIns: 'entry' 为什么这么大？

**答**：因为它会引入目标环境所有可能需要的 Polyfill，即使你的代码中没有使用。这就是为什么推荐 `usage`。

### 2. transform-runtime 和 useBuiltIns: 'usage' 的区别？

**答**：
- `transform-runtime`：不污染全局，适合库开发
- `useBuiltIns: 'usage'`：会修改全局对象，适合应用开发

### 3. 为什么有些方法还是不能用？

**答**：
- 确认 `corejs` 版本是否正确（推荐使用 3）
- 确认 `targets` 是否正确配置
- 有些实例方法可能需要额外配置

---

## 🎯 验证清单

完成本 Demo 后，请确认：

- [ ] 理解 4 种 Polyfill 方案的区别
- [ ] 知道如何配置每种方案
- [ ] 理解体积差异的原因
- [ ] 能根据场景选择合适的方案
- [ ] 知道 `useBuiltIns: 'usage'` 是应用开发的推荐方案
- [ ] 知道 `transform-runtime` 是库开发的推荐方案

---

## 🔗 相关资源

- [Babel Polyfill 文档](https://babeljs.io/docs/babel-polyfill)
- [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)
- [@babel/plugin-transform-runtime](https://babeljs.io/docs/babel-plugin-transform-runtime)
- [core-js 文档](https://github.com/zloirock/core-js)

## 📖 下一步

学习 [Demo 3: Source Map 实战](../03-sourcemap-demo/)，了解如何调试转换后的代码。

