# Tree Shaking 原理与实战

## 📖 概述

**Tree Shaking**（摇树优化）是前端构建优化的**核心技术**，通过移除未使用的代码（Dead Code Elimination），可以显著减小 Bundle 体积。

**形象比喻**：
```
摇树 🌳 → 枯叶掉落 🍂 → 只留下健康的枝叶
代码树 → 未使用代码移除 → 只保留使用的代码
```

**本文目标**：
- 理解 Tree Shaking 的工作原理
- 掌握 Tree Shaking 的配置方法
- 学会验证 Tree Shaking 效果
- 了解 Tree Shaking 的限制和注意事项

## 🎯 什么是 Tree Shaking？

### 定义

**Tree Shaking** 是一种基于 **ES Module** 的**静态代码分析**技术，用于移除 JavaScript 中未使用的代码（Dead Code）。

### 核心原理

Tree Shaking 依赖于 **ES Module** 的两个关键特性：

1. **静态结构**
   ```javascript
   // ES Module 的 import/export 是静态的
   import { add } from './math';  // 编译时就能确定导入了什么
   
   // CommonJS 的 require 是动态的
   const math = require('./math');  // 运行时才知道导入了什么
   ```

2. **编译时确定**
   ```javascript
   // ✅ ES Module：编译时就知道导入了 add
   import { add } from './math';
   
   // ❌ CommonJS：编译时无法确定导入了什么
   const funcName = 'add';
   const math = require('./math')[funcName];
   ```

### 工作流程

```
1. 标记（Mark）
   ├─ 分析模块导入导出
   ├─ 标记使用的代码
   └─ 标记未使用的代码

2. 摇树（Shake）
   ├─ 移除未使用的导出
   ├─ 移除未引用的模块
   └─ 移除无效的代码

3. 压缩（Minify）
   └─ Terser 进一步压缩
```

## 🔍 Tree Shaking 原理深度解析

### 1. ESM 静态分析

**为什么需要 ESM？**

```javascript
// ❌ CommonJS - 无法静态分析
const utils = require('./utils');
if (condition) {
  const { debounce } = utils;  // 运行时才知道用了 debounce
}

// ✅ ES Module - 可以静态分析
import { debounce } from './utils';  // 编译时就知道只用了 debounce
```

**Webpack 如何分析？**

```javascript
// utils.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }

// index.js
import { add } from './utils';  // 只导入 add
console.log(add(1, 2));

// Webpack 分析结果:
// ✅ add - 被使用
// ❌ subtract - 未使用（可以移除）
// ❌ multiply - 未使用（可以移除）
```

### 2. 副作用（Side Effects）

**什么是副作用？**

副作用是指模块被导入时会执行的代码，即使没有使用任何导出：

```javascript
// utils.js
console.log('模块加载了');  // ← 副作用

export function add(a, b) {
  return a + b;
}

// index.js
import { add } from './utils';
// 即使不调用 add，console.log 也会执行
```

**常见副作用**：
- 修改全局变量（`window.foo = 'bar'`）
- 执行 polyfill（`import 'core-js/stable'`）
- 注册全局事件（`document.addEventListener(...)`）
- 修改原型链（`Array.prototype.myMethod = ...`）
- CSS 导入（`import './style.css'`）

**为什么需要声明副作用？**

```javascript
// ❌ 如果不声明副作用，Webpack 可能会错误地移除代码
// polyfill.js
Array.prototype.includes = function() { /* polyfill */ };

// index.js
import './polyfill';  // 期望执行 polyfill
import { add } from './math';

// 如果 Webpack 认为 polyfill.js 无副作用，可能会移除它！
```

### 3. sideEffects 配置

**package.json 中的 sideEffects**：

```json
{
  "name": "my-library",
  "sideEffects": false  // 告诉 Webpack：所有模块都无副作用，可安全 Tree Shaking
}
```

**精确配置副作用文件**：

```json
{
  "sideEffects": [
    "*.css",           // 所有 CSS 文件有副作用
    "*.scss",          // 所有 SCSS 文件有副作用
    "./src/polyfill.js"  // 特定文件有副作用
  ]
}
```

**Webpack 配置中的 sideEffects**：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        sideEffects: false  // 告诉 Webpack 这些文件无副作用
      },
      {
        test: /\.css$/,
        sideEffects: true   // CSS 文件有副作用（注入样式）
      }
    ]
  }
};
```

## ⚙️ 配置 Tree Shaking

### 1. 基础配置

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',  // production 模式自动开启 Tree Shaking
  
  optimization: {
    usedExports: true,      // 标记未使用的导出
    minimize: true,         // 启用压缩（移除未使用代码）
    sideEffects: true       // 尊重 package.json 的 sideEffects 声明
  }
};
```

### 2. Babel 配置

**⚠️ 关键**：Babel 不要转换 ES Module！

```javascript
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false  // ← 关键：保留 ES Module，不转换为 CommonJS
    }]
  ]
}
```

**为什么？**

```javascript
// 原始代码（ES Module）
import { add } from './utils';

// ❌ Babel 转换为 CommonJS（无法 Tree Shaking）
var _utils = require('./utils');
var add = _utils.add;

// ✅ 保留 ES Module（可以 Tree Shaking）
import { add } from './utils';
```

### 3. 第三方库的 Tree Shaking

**选择支持 Tree Shaking 的库**：

```javascript
// ❌ Lodash（CommonJS，无法 Tree Shaking）
import _ from 'lodash';
_.debounce(fn, 300);
// 打包整个 lodash (70 KB)

// ✅ Lodash-es（ES Module，支持 Tree Shaking）
import { debounce } from 'lodash-es';
debounce(fn, 300);
// 只打包 debounce (2 KB)

// ✅ 或者按需导入
import debounce from 'lodash/debounce';
```

**常见库的 Tree Shaking 支持**：

| 库 | 是否支持 | 替代方案 |
|----|---------|---------|
| Lodash | ❌ | ✅ lodash-es |
| Moment.js | ❌ | ✅ Day.js |
| jQuery | ❌ | ✅ 原生 JS |
| Ant Design | ✅ | 需要 babel-plugin-import |
| React | ✅ | - |
| Vue 3 | ✅ | - |

## 🧪 验证 Tree Shaking

### 方法1：查看打包产物

```javascript
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }  // 未使用

// index.js
import { add } from './math';
console.log(add(1, 2));

// 打包后查看 dist/main.js
// ✅ 如果 Tree Shaking 生效，应该只包含 add，不包含 subtract
```

### 方法2：使用 webpack-bundle-analyzer

```javascript
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

对比优化前后的 Bundle 体积：

```
优化前（完整导入 lodash）:
└── lodash: 70 KB

优化后（Tree Shaking）:
└── lodash-es/debounce: 2 KB

减少: 68 KB (97%)
```

### 方法3：添加调试代码

```javascript
// utils.js
export function add(a, b) {
  console.log('add 被使用了');
  return a + b;
}

export function subtract(a, b) {
  console.log('subtract 被使用了');  // ← 如果 Tree Shaking 生效，这行不会出现在产物中
  return a - b;
}

// index.js
import { add } from './utils';
console.log(add(1, 2));

// 打包后运行，只应该看到 "add 被使用了"
```

### 方法4：使用 Webpack Stats

```bash
# 生成构建统计
webpack --json > stats.json

# 查看 usedExports
grep "usedExports" stats.json
```

## ⚠️ Tree Shaking 的限制

### 1. 无法 Tree Shaking 的场景

#### 场景1：动态导入

```javascript
// ❌ 动态导入 - 无法 Tree Shaking
const moduleName = 'utils';
import(`./${moduleName}`).then(module => {
  // Webpack 无法静态分析
});

// ✅ 静态导入 - 可以 Tree Shaking
import { add } from './utils';
```

#### 场景2：CommonJS

```javascript
// ❌ CommonJS - 无法 Tree Shaking
const { add } = require('./utils');

// ✅ ES Module - 可以 Tree Shaking
import { add } from './utils';
```

#### 场景3：默认导出整个对象

```javascript
// ❌ 默认导出对象 - 难以 Tree Shaking
// utils.js
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// index.js
import utils from './utils';
utils.add(1, 2);  // Webpack 难以判断哪些方法被使用

// ✅ 命名导出 - 可以 Tree Shaking
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// index.js
import { add } from './utils';
add(1, 2);  // Webpack 明确知道只用了 add
```

### 2. 副作用导致的问题

```javascript
// utils.js
let count = 0;  // ← 副作用：模块级变量

export function add(a, b) {
  count++;  // 修改模块级变量
  return a + b;
}

export function getCount() {
  return count;
}

// 即使不使用 getCount，count 也不能被移除（有副作用）
```

### 3. 第三方库不支持

```javascript
// ❌ Moment.js 不支持 Tree Shaking
import moment from 'moment';
// 打包整个 moment (280 KB)

// ✅ Day.js 支持 Tree Shaking
import dayjs from 'dayjs';
// 打包 dayjs 核心 (2 KB)
```

## 💡 最佳实践

### 1. 编写 Tree Shaking 友好的代码

```javascript
// ✅ 推荐：使用命名导出
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// ❌ 不推荐：默认导出对象
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

### 2. 避免副作用

```javascript
// ❌ 有副作用
let count = 0;
export function add(a, b) {
  count++;
  return a + b;
}

// ✅ 无副作用（纯函数）
export function add(a, b) {
  return a + b;
}
```

### 3. 正确配置 sideEffects

```json
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfill.js"
  ]
}
```

### 4. 优先使用支持 Tree Shaking 的库

```javascript
// ✅ 支持 Tree Shaking 的库
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';
import { Button } from 'antd';

// ❌ 不支持 Tree Shaking 的库
import _ from 'lodash';
import moment from 'moment';
```

## 🎯 CSS Tree Shaking

### 1. PurgeCSS

移除未使用的 CSS：

```bash
npm install --save-dev purgecss-webpack-plugin glob
```

```javascript
// webpack.config.js
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const path = require('path');

module.exports = {
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true })
    })
  ]
};
```

**效果**：

```css
/* style.css - 100 KB */
.button { /* ... */ }
.card { /* ... */ }
.modal { /* ... */ }
/* ... 1000+ 个样式 */

/* 实际只用了 */
<button class="button">Click</button>

/* PurgeCSS 后 - 2 KB */
.button { /* ... */ }  // 只保留使用的样式
```

### 2. UnCSS

另一个 CSS Tree Shaking 工具：

```bash
npm install --save-dev uncss-webpack-plugin
```

```javascript
const UnCSSPlugin = require('uncss-webpack-plugin');

module.exports = {
  plugins: [
    new UnCSSPlugin({
      html: ['index.html']
    })
  ]
};
```

## 📊 实战案例

### 案例1：Lodash 优化

**优化前**：

```javascript
// index.js
import _ from 'lodash';

const debounced = _.debounce(fn, 300);
const throttled = _.throttle(fn, 300);

// Bundle 体积: 70 KB
```

**优化后**：

```javascript
// 方案1：按需导入
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
// Bundle 体积: 4 KB (减少 94%)

// 方案2：使用 lodash-es
import { debounce, throttle } from 'lodash-es';
// Bundle 体积: 4 KB (减少 94%)
```

### 案例2：Ant Design 优化

**优化前**：

```javascript
import { Button, Table, Modal } from 'antd';
import 'antd/dist/antd.css';
// Bundle 体积: 500 KB
```

**优化后**：

```javascript
// .babelrc
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "style": true  // 自动导入对应的 CSS
    }]
  ]
}

// index.js
import { Button, Table } from 'antd';
// Bundle 体积: 150 KB (减少 70%)
```

### 案例3：Moment.js 替换

**优化前**：

```javascript
import moment from 'moment';
import 'moment/locale/zh-cn';

const date = moment().format('YYYY-MM-DD');
// Bundle 体积: 280 KB
```

**优化后**：

```javascript
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const date = dayjs().format('YYYY-MM-DD');
// Bundle 体积: 2 KB (减少 99%)
```

## 🎓 延伸思考

### 1. 为什么有些库不支持 Tree Shaking？

**历史原因**：
- 早期的库使用 CommonJS（如 Lodash）
- CommonJS 无法静态分析
- 迁移成本高（需要重写）

**解决方案**：
- 库作者提供 ES Module 版本（如 lodash-es）
- 用户按需导入（如 `import debounce from 'lodash/debounce'`）

### 2. Tree Shaking 能减少多少体积？

**取决于**：
- 代码冗余度（未使用代码的比例）
- 第三方库的使用方式
- 是否有大量副作用

**典型数据**：
- 第三方库优化：30-70%
- 业务代码优化：5-20%
- 综合优化：15-40%

### 3. 开发环境要开启 Tree Shaking 吗？

**❌ 不推荐**：
- Tree Shaking 增加构建时间
- 开发环境需要快速反馈
- 调试时需要完整代码

**✅ 只在生产环境开启**：

```javascript
module.exports = {
  optimization: {
    usedExports: process.env.NODE_ENV === 'production'
  }
};
```

## 📚 推荐资源

- [Webpack Tree Shaking 官方文档](https://webpack.js.org/guides/tree-shaking/)
- [You Don't Need Lodash](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)
- [PurgeCSS 文档](https://purgecss.com/)
- [Bundlephobia](https://bundlephobia.com/) - 查询包体积

## 🔗 下一步

掌握了 Tree Shaking 后，接下来学习：

👉 [03-code-splitting.md](./03-code-splitting.md) - 代码分割最佳实践

---

**记住**：Tree Shaking 是减少 Bundle 体积的核心技术，但需要代码和配置的双重配合！

