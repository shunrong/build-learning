# JavaScript 模块化方案

## 📖 目录

1. [模块化演进历史](#模块化演进历史)
2. [CommonJS 详解](#commonjs-详解)
3. [ES Module 详解](#es-module-详解)
4. [CommonJS vs ES Module](#commonjs-vs-es-module)
5. [Webpack 的模块处理](#webpack-的模块处理)
6. [动态 import 与代码分割](#动态-import-与代码分割)
7. [Tree Shaking 原理](#tree-shaking-原理)
8. [副作用处理](#副作用处理)
9. [模块化最佳实践](#模块化最佳实践)

---

## 模块化演进历史

### 1. 无模块化时代（2000s 早期）

```html
<!-- index.html -->
<script src="jquery.js"></script>
<script src="utils.js"></script>
<script src="app.js"></script>

<script>
  // ❌ 问题
  // 1. 全局变量污染
  // 2. 依赖关系不明确
  // 3. 加载顺序有要求
  // 4. 命名冲突
</script>
```

### 2. IIFE 模式（立即执行函数）

```javascript
// utils.js
var Utils = (function() {
  var privateVar = 'private';
  
  return {
    publicMethod: function() {
      return privateVar;
    }
  };
})();

// ✅ 避免全局污染
// ❌ 依然需要手动管理依赖
```

### 3. CommonJS（2009，Node.js）

```javascript
// utils.js
const privateVar = 'private';

function publicMethod() {
  return privateVar;
}

module.exports = { publicMethod };

// app.js
const utils = require('./utils');
utils.publicMethod();

// ✅ 模块化
// ✅ 依赖管理
// ❌ 同步加载，不适合浏览器
```

### 4. AMD（2011，RequireJS）

```javascript
// 异步模块定义
define(['jquery', './utils'], function($, utils) {
  return {
    init: function() {
      utils.publicMethod();
    }
  };
});

// ✅ 异步加载，适合浏览器
// ❌ 语法复杂
```

### 5. UMD（Universal Module Definition）

```javascript
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // 全局变量
    root.MyModule = factory(root.jQuery);
  }
}(this, function($) {
  return {
    init: function() {
      // ...
    }
  };
}));

// ✅ 兼容多种模块系统
// ❌ 代码冗长
```

### 6. ES Module（2015，ES6 标准）

```javascript
// utils.js
export const publicMethod = () => {
  return 'public';
};

// app.js
import { publicMethod } from './utils.js';

// ✅ 语法简洁
// ✅ 静态分析
// ✅ Tree Shaking
// ✅ 浏览器原生支持
```

---

## CommonJS 详解

**CommonJS** 是 Node.js 采用的模块规范，**同步加载**，适合服务端。

### 1. 导出（module.exports / exports）

#### module.exports

```javascript
// utils.js

// 方式1：导出对象
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// 方式2：导出函数
module.exports = function(x) {
  return x * 2;
};

// 方式3：导出类
module.exports = class Calculator {
  add(a, b) {
    return a + b;
  }
};
```

#### exports（module.exports 的引用）

```javascript
// ✅ 正确使用
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// ❌ 错误使用（重新赋值会断开引用）
exports = {
  add: (a, b) => a + b
};

// 正确的理解
console.log(exports === module.exports);  // true

// exports 只是 module.exports 的简写
// 实际导出的是 module.exports
```

### 2. 导入（require）

```javascript
// 方式1：导入整个模块
const utils = require('./utils');
utils.add(1, 2);

// 方式2：解构导入
const { add, subtract } = require('./utils');
add(1, 2);

// 方式3：导入并重命名
const { add: addition } = require('./utils');
addition(1, 2);
```

### 3. 特点

#### 同步加载

```javascript
const fs = require('fs');  // 同步加载
const data = fs.readFileSync('./file.txt');  // 阻塞
console.log(data);

// ✅ Node.js 中没问题（文件在本地）
// ❌ 浏览器中会阻塞（网络延迟）
```

#### 运行时加载

```javascript
// 动态路径
const moduleName = Math.random() > 0.5 ? 'a' : 'b';
const module = require(`./${moduleName}`);  // ✅ 可以动态

// 条件加载
if (isDev) {
  const devTools = require('./dev-tools');  // ✅ 可以条件加载
}
```

#### 值拷贝

```javascript
// counter.js
let count = 0;
module.exports = {
  count,
  increment() {
    count++;
  }
};

// app.js
const counter = require('./counter');
console.log(counter.count);  // 0
counter.increment();
console.log(counter.count);  // 0  ⚠️ 仍然是 0（值拷贝）
```

#### 缓存

```javascript
// utils.js
console.log('utils.js loaded');
module.exports = { name: 'Utils' };

// app.js
const utils1 = require('./utils');  // 输出：utils.js loaded
const utils2 = require('./utils');  // 不输出（使用缓存）
console.log(utils1 === utils2);     // true（同一个对象）
```

---

## ES Module 详解

**ES Module** 是 ECMAScript 2015（ES6）引入的官方模块规范。

### 1. 导出（export）

#### 命名导出（Named Export）

```javascript
// utils.js

// 方式1：声明时导出
export const PI = 3.14;
export function add(a, b) {
  return a + b;
}
export class Calculator {
  // ...
}

// 方式2：统一导出
const PI = 3.14;
function add(a, b) {
  return a + b;
}
class Calculator {
  // ...
}
export { PI, add, Calculator };

// 方式3：重命名导出
export { add as addition, Calculator as Calc };
```

#### 默认导出（Default Export）

```javascript
// utils.js

// 方式1：导出值
export default 42;

// 方式2：导出函数
export default function add(a, b) {
  return a + b;
}

// 方式3：导出类
export default class Calculator {
  // ...
}

// 方式4：导出对象
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// ⚠️ 一个模块只能有一个默认导出
```

#### 混合导出

```javascript
// utils.js
export const PI = 3.14;
export function add(a, b) {
  return a + b;
}
export default class Calculator {
  // ...
}

// app.js
import Calculator, { PI, add } from './utils';
```

### 2. 导入（import）

#### 命名导入

```javascript
// 导入指定成员
import { add, subtract } from './utils';

// 导入并重命名
import { add as addition } from './utils';

// 导入所有命名导出
import * as utils from './utils';
utils.add(1, 2);
```

#### 默认导入

```javascript
// 默认导入（名称可以自定义）
import Calculator from './utils';
import MyCalculator from './utils';  // ✅ 任意命名
```

#### 混合导入

```javascript
// 同时导入默认和命名导出
import Calculator, { PI, add } from './utils';
```

#### 仅执行模块

```javascript
// 不导入任何内容，只执行模块代码
import './polyfills';
import './styles.css';
```

### 3. 特点

#### 静态分析

```javascript
// ✅ 静态导入（编译时确定）
import { add } from './utils';

// ❌ 不能动态导入（语法错误）
const moduleName = 'utils';
import { add } from `./${moduleName}`;  // ❌ 语法错误

// ❌ 不能条件导入
if (isDev) {
  import { devTools } from './dev-tools';  // ❌ 语法错误
}

// ✅ 使用动态 import() 解决
const module = await import(`./${moduleName}`);
```

#### 值引用

```javascript
// counter.js
export let count = 0;
export function increment() {
  count++;
}

// app.js
import { count, increment } from './counter';
console.log(count);  // 0
increment();
console.log(count);  // 1  ✅ 是引用，会更新
```

#### 只读

```javascript
// utils.js
export let count = 0;

// app.js
import { count } from './utils';
count = 1;  // ❌ TypeError: Assignment to constant variable
```

#### 提升

```javascript
// ✅ import 会提升到顶部
console.log(add(1, 2));  // 3
import { add } from './utils';

// 实际执行顺序
import { add } from './utils';
console.log(add(1, 2));
```

---

## CommonJS vs ES Module

### 完整对比

| 特性 | CommonJS | ES Module |
|------|----------|-----------|
| **标准** | Node.js 规范 | ECMAScript 标准 |
| **语法** | `require`/`module.exports` | `import`/`export` |
| **加载时机** | 运行时 | 编译时 |
| **加载方式** | 同步 | 异步（浏览器）/同步（打包器） |
| **动态加载** | ✅ 支持 | ❌ 不支持（需要 `import()`） |
| **值类型** | 值拷贝 | 值引用 |
| **修改导出** | ✅ 可以 | ❌ 只读 |
| **Tree Shaking** | ❌ 不支持 | ✅ 支持 |
| **循环依赖** | ⚠️ 部分导出 | ✅ 完整支持 |
| **浏览器支持** | ❌ 不支持 | ✅ 原生支持（现代浏览器） |
| **Node.js 支持** | ✅ 原生支持 | ✅ 支持（`.mjs` 或 `type: "module"`） |

### 代码对比

```javascript
// ===== CommonJS =====

// 导出
module.exports = { add };
exports.add = add;

// 导入
const utils = require('./utils');
const { add } = require('./utils');

// 特点
// - 运行时加载
// - 可以动态路径
// - 值拷贝

// ===== ES Module =====

// 导出
export { add };
export default Calculator;

// 导入
import { add } from './utils';
import Calculator from './utils';

// 特点
// - 编译时加载
// - 静态分析
// - 值引用
// - Tree Shaking
```

### Tree Shaking 对比

```javascript
// utils.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }

// ===== ES Module =====
import { add } from './utils';  // ✅ 只打包 add

// 打包结果：
function add(a,b){return a+b}

// ===== CommonJS =====
const { add } = require('./utils');  // ❌ 打包所有

// 打包结果：
function add(a,b){return a+b}
function subtract(a,b){return a-b}
function multiply(a,b){return a*b}
```

---

## Webpack 的模块处理

Webpack 支持多种模块系统，并统一处理。

### 1. 支持的模块类型

```javascript
// ES Module
import { add } from './utils';

// CommonJS
const add = require('./utils');

// AMD
define(['./utils'], function(utils) {
  // ...
});

// 资源模块
import styles from './styles.css';
import logo from './logo.png';
```

### 2. 模块解析

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    // 模块搜索目录
    modules: ['node_modules', 'src'],
    
    // 自动补全扩展名
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    
    // 路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    },
    
    // 主文件
    mainFiles: ['index'],
    
    // package.json 中的字段
    mainFields: ['browser', 'module', 'main']
  }
};
```

### 3. 模块类型配置

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        type: 'javascript/auto'  // CommonJS + ES Module
      },
      {
        test: /\.mjs$/,
        type: 'javascript/esm'   // 仅 ES Module
      },
      {
        test: /\.json$/,
        type: 'json'             // JSON 模块
      },
      {
        test: /\.css$/,
        type: 'asset/resource'   // 资源模块
      }
    ]
  }
};
```

### 4. 打包输出格式

```javascript
// webpack.config.js
module.exports = {
  output: {
    // UMD 格式（兼容多种模块系统）
    library: 'MyLibrary',
    libraryTarget: 'umd',
    
    // 其他格式
    // libraryTarget: 'var'         // 全局变量
    // libraryTarget: 'this'        // this 对象
    // libraryTarget: 'window'      // window 对象
    // libraryTarget: 'commonjs'    // CommonJS
    // libraryTarget: 'commonjs2'   // CommonJS2
    // libraryTarget: 'amd'         // AMD
    // libraryTarget: 'module'      // ES Module
  }
};
```

---

## 动态 import 与代码分割

**动态 import** 是 ES2020 新特性，返回一个 Promise。

### 1. 基本语法

```javascript
// 静态 import
import { add } from './utils';

// 动态 import
const module = await import('./utils');
const { add } = module;

// 或使用 Promise
import('./utils').then(module => {
  const { add } = module;
  console.log(add(1, 2));
});
```

### 2. 使用场景

#### 场景1：条件加载

```javascript
if (isDev) {
  import('./dev-tools').then(devTools => {
    devTools.init();
  });
}
```

#### 场景2：按需加载（懒加载）

```javascript
// 点击按钮时才加载模块
button.addEventListener('click', async () => {
  const { showModal } = await import('./modal');
  showModal();
});
```

#### 场景3：动态路径

```javascript
const locale = 'zh-CN';
const messages = await import(`./locales/${locale}.js`);
```

#### 场景4：React 路由懒加载

```javascript
import { lazy, Suspense } from 'react';

// 懒加载组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

### 3. Webpack 代码分割

#### 魔法注释（Magic Comments）

```javascript
import(
  /* webpackChunkName: "utils" */  // 指定 chunk 名称
  /* webpackPrefetch: true */      // 预取（空闲时加载）
  /* webpackPreload: true */       // 预加载（并行加载）
  './utils'
).then(module => {
  // ...
});
```

#### 分割配置

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',  // 所有模块都可以被分割
      cacheGroups: {
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        // 公共模块
        common: {
          minChunks: 2,  // 至少被 2 个 chunk 使用
          name: 'common',
          priority: 5
        }
      }
    }
  }
};
```

---

## Tree Shaking 原理

**Tree Shaking** 是一种消除未使用代码（Dead Code）的优化技术。

### 1. 工作原理

```javascript
// utils.js
export function add(a, b) { return a + b; }        // ✅ 被使用
export function subtract(a, b) { return a - b; }   // ❌ 未使用
export function multiply(a, b) { return a * b; }   // ❌ 未使用

// app.js
import { add } from './utils';
console.log(add(1, 2));

// 打包后（production 模式）
function add(a,b){return a+b}console.log(add(1,2));
// ✅ subtract 和 multiply 被删除
```

### 2. 实现条件

Tree Shaking 需要满足以下条件：

#### ✅ 1. 使用 ES Module

```javascript
// ✅ 可以 Tree Shaking
import { add } from './utils';

// ❌ 无法 Tree Shaking
const { add } = require('./utils');
```

#### ✅ 2. production 模式

```javascript
// webpack.config.js
module.exports = {
  mode: 'production'  // 启用 Tree Shaking
};
```

#### ✅ 3. usedExports: true

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true  // 标记未使用的导出
  }
};
```

#### ✅ 4. 正确的 sideEffects 配置

```javascript
// package.json
{
  "sideEffects": false  // 所有模块都没有副作用
}
```

### 3. 工作流程

```
1. 【静态分析】
   Webpack 分析 import/export，确定哪些导出被使用

2. 【标记】
   usedExports: true 标记未使用的导出
   
3. 【删除】
   Terser 删除标记的未使用代码

4. 【输出】
   最终产物只包含使用的代码
```

### 4. 示例

#### 示例1：基础 Tree Shaking

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// app.js
import { add } from './math';
console.log(add(1, 2));

// 打包后（只保留 add）
const add=(a,b)=>a+b;console.log(add(1,2));
```

#### 示例2：类方法 Tree Shaking

```javascript
// Calculator.js
export class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
  multiply(a, b) { return a * b; }
}

// app.js
import { Calculator } from './Calculator';
const calc = new Calculator();
console.log(calc.add(1, 2));

// ❌ 无法删除 subtract 和 multiply
// 因为是类方法，可能通过原型链访问
```

#### 示例3：副作用导致无法 Tree Shaking

```javascript
// utils.js
export const add = (a, b) => a + b;

// 副作用：修改全局对象
window.myGlobal = 'value';

// app.js
import { add } from './utils';  // 即使不用 add，也会执行副作用

// 解决：拆分文件
// utils.js - 纯函数
// global.js - 副作用代码
```

---

## 副作用处理

**副作用（Side Effects）** 是指模块执行时对外部环境的改变。

### 1. 什么是副作用？

```javascript
// ✅ 无副作用（纯函数）
export const add = (a, b) => a + b;

// ❌ 有副作用
export const API_URL = 'https://api.example.com';
console.log('Module loaded');  // 副作用：输出
window.myGlobal = 'value';    // 副作用：修改全局
document.title = 'My App';    // 副作用：修改 DOM

// CSS 导入也是副作用
import './styles.css';

// Polyfill 是副作用
import 'core-js/features/promise';
```

### 2. sideEffects 配置

#### 配置1：无副作用（最激进）

```javascript
// package.json
{
  "sideEffects": false
}

// 表示：所有模块都没有副作用，可以安全删除未使用的导出
```

#### 配置2：指定有副作用的文件

```javascript
// package.json
{
  "sideEffects": [
    "*.css",              // 所有 CSS 文件
    "*.scss",             // 所有 SCSS 文件
    "./src/polyfills.js", // Polyfill 文件
    "./src/global.js"     // 全局配置文件
  ]
}

// 表示：只有这些文件有副作用，其他文件可以 Tree Shaking
```

#### 配置3：所有文件都有副作用（默认）

```javascript
// package.json
{
  "sideEffects": true
}

// 或不配置
// 表示：所有文件都可能有副作用，不进行 Tree Shaking
```

### 3. 实战示例

```javascript
// ===== 配置前 =====

// package.json
{
  // 没有配置 sideEffects
}

// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// app.js
import { add } from './utils';

// 打包后（包含所有代码，因为默认有副作用）
const add=(a,b)=>a+b;
const subtract=(a,b)=>a-b;  // ❌ 未使用但保留

// ===== 配置后 =====

// package.json
{
  "sideEffects": false
}

// 打包后（删除未使用代码）
const add=(a,b)=>a+b;  // ✅ 只保留 add
```

---

## 模块化最佳实践

### 1. 优先使用 ES Module

```javascript
// ✅ 推荐：ES Module
import { add } from './utils';
export const subtract = (a, b) => a - b;

// ❌ 不推荐：CommonJS（除非 Node.js 老项目）
const { add } = require('./utils');
module.exports = { subtract };

// 理由：
// - ES Module 支持 Tree Shaking
// - 静态分析，编译时优化
// - 未来标准
```

### 2. 命名导出 vs 默认导出

```javascript
// ✅ 推荐：命名导出（更灵活）
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 导入时可以按需
import { add } from './utils';

// ❌ 不推荐：默认导出对象
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// 无法 Tree Shaking
import utils from './utils';  // 整个对象都会被打包
```

### 3. 配置 sideEffects

```javascript
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// ✅ 明确声明副作用，帮助 Webpack 优化
```

### 4. Babel 配置

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false  // ✅ 不转换模块，让 Webpack 处理
    }]
  ]
};

// ❌ 错误配置
{
  presets: [
    ['@babel/preset-env', {
      modules: 'commonjs'  // ❌ 转换为 CommonJS，无法 Tree Shaking
    }]
  ]
}
```

### 5. 动态 import 代码分割

```javascript
// ✅ 推荐：按需加载
button.addEventListener('click', async () => {
  const { showModal } = await import('./modal');
  showModal();
});

// ❌ 不推荐：全部打包
import { showModal } from './modal';
button.addEventListener('click', () => {
  showModal();
});
```

### 6. 避免导入整个库

```javascript
// ❌ 不推荐：导入整个库
import _ from 'lodash';
_.add(1, 2);

// ✅ 推荐：按需导入
import { add } from 'lodash-es';
add(1, 2);

// 或使用 babel-plugin-import
{
  "plugins": [
    ["import", {
      "libraryName": "lodash",
      "libraryDirectory": "",
      "camel2DashComponentName": false
    }]
  ]
}
```

### 7. 模块组织

```javascript
// ✅ 推荐：每个模块职责单一
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// string.js
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// index.js（桶文件）
export * from './math';
export * from './string';

// ❌ 不推荐：一个大文件
// utils.js
export const add = ...
export const subtract = ...
export const capitalize = ...
// ... 几百行
```

---

## 🎯 总结

### 核心要点

1. **模块化演进**：无模块化 → IIFE → CommonJS → AMD → UMD → ES Module
2. **CommonJS**：Node.js 规范，同步加载，运行时，值拷贝
3. **ES Module**：ECMAScript 标准，静态分析，编译时，值引用
4. **Tree Shaking**：ES Module + production 模式 + sideEffects 配置
5. **动态 import**：按需加载，代码分割，优化性能

### 最佳实践

```javascript
// 1. 使用 ES Module
import { add } from './utils';
export const subtract = (a, b) => a - b;

// 2. 配置 Babel
{
  presets: [['@babel/preset-env', { modules: false }]]
}

// 3. 配置 sideEffects
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}

// 4. 动态 import
const module = await import('./heavy-module');

// 5. 命名导出
export const func1 = () => {};
export const func2 = () => {};
```

### 常见面试题

1. **CommonJS 和 ES Module 的区别？**
   - 答：加载时机（运行时 vs 编译时）、值类型（拷贝 vs 引用）、Tree Shaking（不支持 vs 支持）

2. **为什么 ES Module 支持 Tree Shaking？**
   - 答：静态分析，编译时确定依赖关系，可以删除未使用代码

3. **Tree Shaking 的工作原理？**
   - 答：静态分析 → 标记未使用 → Terser 删除 → 输出优化代码

4. **什么是 sideEffects？**
   - 答：模块执行时对外部环境的改变（如修改全局变量、输出日志）

5. **如何配置才能让 Tree Shaking 生效？**
   - 答：ES Module + production 模式 + usedExports + sideEffects 配置

6. **动态 import 和静态 import 的区别？**
   - 答：动态 import 返回 Promise，可以按需加载、代码分割

7. **Babel 配置 modules: false 的作用？**
   - 答：不转换 ES Module，让 Webpack 处理，支持 Tree Shaking

---

**Phase 06 所有文档已完成！接下来将创建配套的 Demo 项目。** 🎉

