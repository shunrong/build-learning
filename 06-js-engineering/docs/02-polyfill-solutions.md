# Polyfill 方案详解

## 📖 目录

1. [什么是 Polyfill？](#什么是-polyfill)
2. [语法转换 vs Polyfill](#语法转换-vs-polyfill)
3. [core-js 介绍](#core-js-介绍)
4. [useBuiltIns 三种模式](#usebuiltins-三种模式)
5. [@babel/plugin-transform-runtime](#babelplugin-transform-runtime)
6. [方案对比](#方案对比)
7. [最佳实践](#最佳实践)

---

## 什么是 Polyfill？

**Polyfill（垫片）** 是一段代码，用于在不支持某些新特性的老旧浏览器中实现这些特性。

### 核心概念

```javascript
// 示例：Promise Polyfill
if (typeof Promise === 'undefined') {
  // 浏览器不支持 Promise
  window.Promise = function(executor) {
    // ... 实现 Promise 的功能
  };
}
```

### Babel 只能转换语法，无法转换 API

```javascript
// ✅ Babel 可以转换（语法）
const fn = () => {};  // 箭头函数 → 普通函数
class Person {}       // class → 构造函数

// ❌ Babel 无法转换（API），需要 Polyfill
Promise.resolve();        // Promise API
[1, 2, 3].includes(2);    // Array.prototype.includes
'abc'.padStart(5, '0');   // String.prototype.padStart
```

---

## 语法转换 vs Polyfill

### 1. 语法转换（Syntax Transform）

**由 Babel 插件完成**，将新语法转换为老语法。

```javascript
// 箭头函数
// 输入
const add = (a, b) => a + b;

// 输出（@babel/plugin-transform-arrow-functions）
var add = function add(a, b) {
  return a + b;
};
```

```javascript
// 解构赋值
// 输入
const { name, age } = person;

// 输出（@babel/plugin-transform-destructuring）
var name = person.name;
var age = person.age;
```

### 2. API Polyfill

**需要引入 core-js 等 Polyfill 库**，为缺失的 API 提供实现。

```javascript
// Promise
if (typeof Promise === 'undefined') {
  require('core-js/features/promise');
}

// Array.prototype.includes
if (!Array.prototype.includes) {
  require('core-js/features/array/includes');
}
```

### 对比总结

| 类型 | 示例 | 处理方式 | 是否需要 Polyfill |
|------|------|----------|-------------------|
| **语法** | 箭头函数、class、解构 | Babel 插件转换 | ❌ 否 |
| **API** | Promise、Map、Set | 引入 Polyfill | ✅ 是 |
| **实例方法** | includes、padStart | 引入 Polyfill | ✅ 是 |
| **静态方法** | Array.from、Object.assign | 引入 Polyfill | ✅ 是 |

---

## core-js 介绍

**core-js** 是最流行的 JavaScript 标准库 Polyfill，由 Babel 团队维护。

### 特点

- ✅ 覆盖 ES5、ES6+ 所有特性
- ✅ 支持按需引入
- ✅ 体积小、性能好
- ✅ 持续维护更新

### 版本

```bash
# core-js@2（已废弃）
npm install core-js@2

# core-js@3（推荐）
npm install core-js@3
```

**为什么推荐 core-js@3？**
- ✅ 支持更多新特性（如 flat、flatMap）
- ✅ 更好的模块化
- ✅ 持续维护

### 手动引入

```javascript
// 全量引入（不推荐）
import 'core-js';

// 按特性引入
import 'core-js/features/promise';
import 'core-js/features/array/includes';
import 'core-js/features/object/assign';

// 按模块引入
import 'core-js/es/promise';
import 'core-js/es/array';
import 'core-js/es/object';
```

---

## useBuiltIns 三种模式

`@babel/preset-env` 的 `useBuiltIns` 选项控制如何引入 Polyfill。

### 1️⃣ useBuiltIns: false（不引入）

**默认值**，不自动引入任何 Polyfill。

#### 配置

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: false  // 或不配置
    }]
  ]
};
```

#### 效果

```javascript
// 输入
const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);

// 输出
const promise = Promise.resolve(42);  // 不引入 Promise Polyfill
const result = [1, 2, 3].includes(2); // 不引入 includes Polyfill
```

#### 适用场景

- ✅ 目标环境本身就支持所有特性
- ✅ 手动管理 Polyfill
- ✅ 只需要语法转换

---

### 2️⃣ useBuiltIns: 'entry'（全量引入）

根据目标环境（`targets`）引入**所有可能**需要的 Polyfill。

#### 配置

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3,
      targets: {
        browsers: ['ie 11']
      }
    }]
  ]
};
```

#### 使用方式

```javascript
// 入口文件（必须手动引入）
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 你的代码
const promise = Promise.resolve(42);
```

#### 转换效果

```javascript
// 输入
import 'core-js/stable';

// 输出（Babel 会替换为具体的 Polyfill）
import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.async-iterator";
import "core-js/modules/es.symbol.iterator";
// ... 几百个
import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.fill";
import "core-js/modules/es.array.includes";
// ... 更多
```

#### 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 完整支持目标环境 | ❌ 打包体积大（引入很多用不到的） |
| ✅ 配置简单 | ❌ 需要手动引入 `core-js` |

#### 适用场景

- ✅ 应用较小，不在意体积
- ✅ 需要完整的 Polyfill 支持

---

### 3️⃣ useBuiltIns: 'usage'（按需引入）⭐️ 推荐

根据代码中**实际使用的特性**和**目标环境**，自动按需引入 Polyfill。

#### 配置

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',  // 按需引入
      corejs: 3,
      targets: {
        browsers: ['ie 11']
      }
    }]
  ]
};
```

#### 使用方式

```javascript
// 不需要手动引入 core-js，Babel 会自动分析并引入
const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);
```

#### 转换效果

```javascript
// 输入
const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);

// 输出（Babel 自动注入需要的 Polyfill）
import "core-js/modules/es.promise";
import "core-js/modules/es.array.includes";

const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);
```

#### 智能分析

```javascript
// 如果 targets 是现代浏览器
{
  targets: { browsers: ['chrome 90'] }
}

// 输入
const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);

// 输出（Chrome 90 原生支持，不引入 Polyfill）
const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);
```

#### 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 体积最小（只引入用到的） | ❌ 可能漏掉动态使用的特性 |
| ✅ 自动分析，无需手动引入 | ❌ 多个文件可能重复引入 |
| ✅ 智能根据目标环境 | |

#### 适用场景

- ✅ **应用开发（最推荐）** ⭐️
- ✅ 关注打包体积
- ✅ 代码中使用的特性不多

---

### 三种模式对比

| 选项 | 引入方式 | 体积 | 适用场景 | 推荐度 |
|------|----------|------|----------|--------|
| **false** | 不引入 | 最小 | 现代浏览器 | ⭐⭐⭐ |
| **entry** | 全量引入 | 大（200KB+） | 小应用 | ⭐⭐ |
| **usage** | 按需引入 | 小（10-50KB） | 应用开发 | ⭐⭐⭐⭐⭐ |

### 体积对比示例

```javascript
// 代码
const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);

// false：0KB（不引入）
// entry：~250KB（引入所有 IE 11 需要的 Polyfill）
// usage：~15KB（只引入 Promise 和 includes）
```

---

## @babel/plugin-transform-runtime

**`@babel/plugin-transform-runtime`** 是另一种 Polyfill 方案，**不污染全局作用域**。

### 为什么需要它？

**问题**：`useBuiltIns` 会污染全局

```javascript
// useBuiltIns: 'usage' 引入的 Polyfill
import "core-js/modules/es.promise";

// 实际上会修改全局对象
window.Promise = CoreJSPromise;

// ❌ 如果你开发的是库，会影响使用者的环境
```

**解决**：`transform-runtime` 通过局部变量引入 Polyfill

```javascript
// 使用 transform-runtime
import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";

var promise = _Promise.resolve(42);

// ✅ 不修改全局的 Promise
```

### 配置

#### 1. 安装依赖

```bash
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs3
```

#### 2. 配置 Babel

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false  // 不配置 useBuiltIns
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3  // 使用 core-js@3
    }]
  ]
};
```

### 转换效果

```javascript
// 输入
const promise = Promise.resolve(42);
const arr = [1, 2, 3];
const result = arr.includes(2);

// 输出（不污染全局）
import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";

var promise = _Promise.resolve(42);
var arr = [1, 2, 3];
var result = _includesInstanceProperty(arr).call(arr, 2);
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 不污染全局作用域 | ❌ 代码稍微啰嗦 |
| ✅ 适合库开发 | ❌ 可能增加体积（每个文件都引入辅助函数） |
| ✅ 避免重复的辅助函数 | ❌ 无法 Polyfill 实例方法（`includes`） |

### 适用场景

- ✅ **库/组件开发** ⭐️
- ✅ 不想污染全局
- ❌ 应用开发（不推荐，`useBuiltIns: 'usage'` 更好）

---

## 方案对比

### 完整对比表

| 方案 | 体积 | 全局污染 | 配置复杂度 | 适用场景 | 推荐度 |
|------|------|----------|------------|----------|--------|
| **useBuiltIns: false** | ⚡⚡⚡⚡⚡ | ❌ | ⚡⚡⚡⚡⚡ | 现代浏览器 | ⭐⭐⭐ |
| **useBuiltIns: 'entry'** | ⚡ | ✅ | ⚡⚡⚡⚡ | 小应用 | ⭐⭐ |
| **useBuiltIns: 'usage'** | ⚡⚡⚡⚡ | ✅ | ⚡⚡⚡⚡⚡ | 应用开发 | ⭐⭐⭐⭐⭐ |
| **transform-runtime** | ⚡⚡⚡ | ❌ | ⚡⚡⚡ | 库开发 | ⭐⭐⭐⭐ |

### 实际案例对比

假设有以下代码：

```javascript
const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);
const obj = { ...other };
```

#### 1. useBuiltIns: false

```javascript
// 不引入任何 Polyfill
const promise = Promise.resolve(42);  // 老浏览器可能报错
const result = [1, 2, 3].includes(2);
const obj = { ...other };
```

**打包体积**：0KB（Polyfill 部分）

#### 2. useBuiltIns: 'entry'

```javascript
// 引入所有目标环境需要的 Polyfill（几百个）
import "core-js/modules/es.symbol";
import "core-js/modules/es.promise";
import "core-js/modules/es.array.includes";
// ... 几百个

const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);
const obj = { ...other };
```

**打包体积**：~250KB（压缩后 ~80KB）

#### 3. useBuiltIns: 'usage'（推荐）

```javascript
// 只引入代码中用到的 Polyfill
import "core-js/modules/es.promise";
import "core-js/modules/es.array.includes";
import "core-js/modules/es.object.assign";  // 对象展开需要

const promise = Promise.resolve(42);
const result = [1, 2, 3].includes(2);
const obj = { ...other };
```

**打包体积**：~15KB（压缩后 ~5KB）

#### 4. transform-runtime

```javascript
// 通过局部变量引入
import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";

var promise = _Promise.resolve(42);
var arr = [1, 2, 3];
var result = _includesInstanceProperty(arr).call(arr, 2);
var obj = Object.assign({}, other);
```

**打包体积**：~12KB（压缩后 ~4KB），但代码更啰嗦

---

## 最佳实践

### 1. 应用开发（推荐）

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      // 目标环境
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead']
      },
      // 按需引入 Polyfill ⭐️
      useBuiltIns: 'usage',
      corejs: 3,
      // 不转换模块
      modules: false
    }]
  ]
};
```

**优点**：
- ✅ 自动分析、按需引入
- ✅ 体积最小
- ✅ 配置简单

---

### 2. 库/组件开发（推荐）

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false  // 不转换模块
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3  // 不污染全局 ⭐️
    }]
  ]
};
```

**优点**：
- ✅ 不污染使用者的全局环境
- ✅ 避免重复引入辅助函数

---

### 3. 现代浏览器（推荐）

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['chrome 90', 'firefox 88', 'safari 14']
      },
      useBuiltIns: false,  // 不需要 Polyfill ⭐️
      modules: false
    }]
  ]
};
```

**优点**：
- ✅ 体积最小
- ✅ 性能最好
- ✅ 代码最简洁

---

### 4. 需要完整兼容性

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['ie 11']
      },
      useBuiltIns: 'entry',  // 全量引入
      corejs: 3
    }]
  ]
};

// 入口文件
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

---

### 5. 分环境配置

```javascript
// babel.config.js
module.exports = (api) => {
  const isProd = api.env('production');
  
  return {
    presets: [
      ['@babel/preset-env', {
        targets: isProd
          ? { browsers: ['> 1%', 'not dead'] }  // 生产：兼容性
          : { browsers: ['last 1 chrome version'] },  // 开发：快速
        useBuiltIns: 'usage',
        corejs: 3
      }]
    ]
  };
};
```

---

## 🎯 总结

### 核心要点

1. **Polyfill 的作用**：为老浏览器提供新 API 的实现
2. **core-js**：最流行的 Polyfill 库，推荐使用 core-js@3
3. **useBuiltIns**：
   - `false`：不引入（现代浏览器）
   - `'entry'`：全量引入（完整兼容）
   - `'usage'`：按需引入（应用开发推荐）⭐️
4. **transform-runtime**：不污染全局（库开发推荐）⭐️

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

### 推荐配置

```javascript
// 应用开发（最常见）
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { browsers: ['> 1%', 'last 2 versions'] },
      useBuiltIns: 'usage',
      corejs: 3,
      modules: false
    }]
  ]
};
```

### 常见面试题

1. **什么是 Polyfill？**
   - 答：为老浏览器提供新 API 实现的代码

2. **Babel 能处理所有兼容性问题吗？**
   - 答：不能。Babel 只能转换语法，API 需要 Polyfill

3. **useBuiltIns 的三个选项有什么区别？**
   - 答：false 不引入，entry 全量引入，usage 按需引入

4. **为什么推荐 useBuiltIns: 'usage'？**
   - 答：自动分析、按需引入，体积最小

5. **什么时候用 @babel/plugin-transform-runtime？**
   - 答：库/组件开发，不想污染全局环境

6. **transform-runtime 和 useBuiltIns 的区别？**
   - 答：transform-runtime 不污染全局，useBuiltIns 会修改全局对象

---

**下一步**：学习 [Source Map 原理与实践](./03-source-map.md)，了解如何调试转换后的代码。

