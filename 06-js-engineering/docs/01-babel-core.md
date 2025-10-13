# Babel 核心概念

## 📖 目录

1. [什么是 Babel？](#什么是-babel)
2. [为什么需要 Babel？](#为什么需要-babel)
3. [Babel 工作原理](#babel-工作原理)
4. [核心概念](#核心概念)
5. [@babel/preset-env 详解](#babelpreset-env-详解)
6. [browserslist 配置](#browserslist-配置)
7. [Babel 兼容性机制深度解析](#babel-兼容性机制深度解析) ⭐️
8. [配置文件](#配置文件)
9. [常用 Plugins 和 Presets](#常用-plugins-和-presets)
10. [最佳实践](#最佳实践)

---

## 什么是 Babel？

**Babel** 是一个 **JavaScript 编译器（Transpiler）**，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

### 核心能力

```javascript
// 输入（ES6+）
const greeting = (name) => `Hello, ${name}!`;
class Person {
  constructor(name) {
    this.name = name;
  }
}

// 输出（ES5）
var greeting = function greeting(name) {
  return "Hello, " + name + "!";
};
var Person = function Person(name) {
  this.name = name;
};
```

### 主要功能

1. **语法转换**：将新语法转换为老语法
2. **Polyfill 注入**：为目标环境添加缺失的特性
3. **源码转换**：通过插件进行代码转换
4. **类型检查**：配合 TypeScript/Flow 使用

---

## 为什么需要 Babel？

### 1. 浏览器兼容性问题

```javascript
// 箭头函数 - IE 11 不支持
const add = (a, b) => a + b;

// Promise - IE 不支持
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data));

// 可选链 - 旧浏览器不支持
const userName = user?.profile?.name;

// 空值合并 - 旧浏览器不支持
const count = data?.count ?? 0;
```

### 2. 使用最新 JavaScript 特性

```javascript
// ES2015+ 特性
import { module } from './module';
export default class MyClass {}

// ES2020 特性
const value = obj?.property;
const result = value ?? defaultValue;

// ES2021 特性
const newStr = str.replaceAll('old', 'new');

// ES2022 特性
class MyClass {
  #privateField = 'private';
}
```

### 3. 框架和工具链需要

- **React**：JSX 语法需要转换
- **TypeScript**：类型需要擦除
- **实验性特性**：装饰器等提案阶段的特性

---

## Babel 工作原理

### 编译流程

Babel 的转换过程分为三个阶段：

```
源代码（ES6+）
      ↓
【解析 Parse】
      ↓
   AST（抽象语法树）
      ↓
【转换 Transform】
      ↓
   新的 AST
      ↓
【生成 Generate】
      ↓
目标代码（ES5）
```

### 详细流程

#### 1️⃣ **解析（Parse）**

将源代码解析成 AST（Abstract Syntax Tree）

```javascript
// 输入代码
const add = (a, b) => a + b;

// 词法分析（Tokenization）
[
  { type: 'Keyword', value: 'const' },
  { type: 'Identifier', value: 'add' },
  { type: 'Punctuator', value: '=' },
  { type: 'Punctuator', value: '(' },
  // ...
]

// 语法分析（Parsing）
{
  type: "VariableDeclaration",
  declarations: [{
    type: "VariableDeclarator",
    id: { type: "Identifier", name: "add" },
    init: {
      type: "ArrowFunctionExpression",
      params: [
        { type: "Identifier", name: "a" },
        { type: "Identifier", name: "b" }
      ],
      body: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "Identifier", name: "a" },
        right: { type: "Identifier", name: "b" }
      }
    }
  }]
}
```

#### 2️⃣ **转换（Transform）**

遍历 AST，应用各种插件进行转换

```javascript
// 访问器模式
{
  ArrowFunctionExpression(path) {
    // 将箭头函数转换为普通函数
    path.replaceWith(
      t.functionExpression(
        null,
        path.node.params,
        t.blockStatement([
          t.returnStatement(path.node.body)
        ])
      )
    );
  }
}
```

#### 3️⃣ **生成（Generate）**

将转换后的 AST 生成为目标代码

```javascript
// 新的 AST
{
  type: "VariableDeclaration",
  declarations: [{
    init: {
      type: "FunctionExpression",  // 箭头函数 → 普通函数
      params: [...],
      body: {
        type: "BlockStatement",
        body: [
          { type: "ReturnStatement", ... }
        ]
      }
    }
  }]
}

// 输出代码
var add = function(a, b) {
  return a + b;
};
```

### 核心包

```javascript
// @babel/parser - 解析器
import { parse } from '@babel/parser';
const ast = parse(code);

// @babel/traverse - 遍历器
import traverse from '@babel/traverse';
traverse(ast, { /* 访问器 */ });

// @babel/generator - 生成器
import generate from '@babel/generator';
const output = generate(ast);

// @babel/core - 完整流程
import { transform } from '@babel/core';
const result = transform(code, options);
```

---

## 核心概念

### 1. Plugin（插件）

**插件是 Babel 转换的最小单元**，每个插件负责一种语法的转换。

```javascript
// babel.config.js
module.exports = {
  plugins: [
    '@babel/plugin-transform-arrow-functions',      // 转换箭头函数
    '@babel/plugin-transform-block-scoping',        // 转换 let/const
    '@babel/plugin-transform-classes',              // 转换 class
    '@babel/plugin-transform-template-literals',    // 转换模板字符串
  ]
};
```

**示例转换**：

```javascript
// 输入
const add = (a, b) => a + b;

// @babel/plugin-transform-arrow-functions 转换后
const add = function(a, b) {
  return a + b;
};
```

### 2. Preset（预设）

**预设是一组插件的集合**，避免手动配置大量插件。

```javascript
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',      // 智能转换（最常用）
    '@babel/preset-react',    // React JSX
    '@babel/preset-typescript' // TypeScript
  ]
};
```

**常用 Preset**：

| Preset | 作用 | 包含内容 |
|--------|------|----------|
| **@babel/preset-env** | 智能转换 ES6+ | 根据目标环境自动选择插件 |
| **@babel/preset-react** | React 支持 | JSX、React 优化 |
| **@babel/preset-typescript** | TypeScript 支持 | 类型擦除 |
| **@babel/preset-flow** | Flow 支持 | 类型擦除 |

### 3. Preset vs Plugin

```javascript
// ❌ 手动配置插件（繁琐）
{
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-classes",
    "@babel/plugin-transform-destructuring",
    "@babel/plugin-transform-parameters",
    "@babel/plugin-transform-shorthand-properties",
    "@babel/plugin-transform-spread",
    "@babel/plugin-transform-template-literals",
    // ... 还有几十个
  ]
}

// ✅ 使用 Preset（简洁）
{
  "presets": ["@babel/preset-env"]
}
```

### 4. 执行顺序

```javascript
{
  "plugins": ["A", "B"],
  "presets": ["X", "Y"]
}
```

**执行顺序**：
1. **Plugins 先执行**，从前往后（A → B）
2. **Presets 后执行**，从后往前（Y → X）

**为什么 Presets 倒序执行？**

```javascript
// 期望的转换流程
ES2020 → ES2019 → ES2018 → ES2017 → ... → ES5

// 所以配置要倒序
{
  "presets": [
    "@babel/preset-env"  // 最后执行，处理所有 ES6+ 特性
  ]
}
```

---

## @babel/preset-env 详解

**`@babel/preset-env` 是最智能、最常用的 Preset**，它可以根据目标环境自动确定需要的插件和 Polyfill。

### 基本配置

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      // 目标环境
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead'],
        node: '14'
      },
      
      // Polyfill 策略
      useBuiltIns: 'usage',
      corejs: 3,
      
      // 是否转换模块语法
      modules: false,
      
      // 调试信息
      debug: false
    }]
  ]
};
```

### 核心选项

#### 1️⃣ **targets - 目标环境**

指定代码运行的目标环境，Babel 会根据目标环境自动选择需要的转换。

```javascript
// 方式1：在 babel.config.js 中配置
{
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead'],
        node: '14'
      }
    }]
  ]
}

// 方式2：使用 browserslist 配置（推荐）
// 在 package.json 或 .browserslistrc 中配置
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

**示例：不同 targets 的转换结果**

```javascript
// 源代码
const greeting = (name) => `Hello, ${name}!`;

// targets: { browsers: 'ie 11' }
var greeting = function greeting(name) {
  return "Hello, " + name + "!";
};

// targets: { browsers: 'chrome 90' }
const greeting = (name) => `Hello, ${name}!`;  // 不转换，Chrome 90 支持
```

#### 2️⃣ **useBuiltIns - Polyfill 策略**

控制如何引入 Polyfill（详细内容见 [02-polyfill-solutions.md](./02-polyfill-solutions.md)）

```javascript
// false：不自动引入 Polyfill
useBuiltIns: false

// 'entry'：根据 targets 全量引入
useBuiltIns: 'entry'

// 'usage'：根据代码使用情况按需引入（推荐）
useBuiltIns: 'usage'
```

#### 3️⃣ **corejs - core-js 版本**

```javascript
{
  useBuiltIns: 'usage',
  corejs: 3  // 使用 core-js@3
}
```

#### 4️⃣ **modules - 模块转换**

```javascript
// false：不转换模块语法（推荐，让 Webpack 处理）
modules: false

// 'auto'：根据 Babel 调用方决定
modules: 'auto'

// 'commonjs'：转换为 CommonJS
modules: 'commonjs'

// 'amd'：转换为 AMD
modules: 'amd'

// 'umd'：转换为 UMD
modules: 'umd'
```

**为什么推荐 `modules: false`？**

```javascript
// modules: false（推荐）
import { add } from './utils';

// Tree Shaking 可以生效 ✅
// Webpack 可以静态分析，删除未使用的代码

// modules: 'commonjs'
var _utils = require('./utils');
var add = _utils.add;

// Tree Shaking 无法生效 ❌
// CommonJS 是动态的，无法静态分析
```

#### 5️⃣ **debug - 调试信息**

```javascript
{
  debug: true
}

// 输出信息：
// - 使用的 Babel 版本
// - 目标环境
// - 启用的插件
// - 引入的 Polyfill
```

---

## browserslist 配置

**browserslist** 是一个在不同前端工具（Babel、PostCSS、Autoprefixer 等）之间共享目标浏览器的配置。

### 配置方式

#### 方式1：package.json

```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

#### 方式2：.browserslistrc

```
# 生产环境（默认）
> 0.5%
last 2 versions
Firefox ESR
not dead

# 开发环境
[development]
last 1 chrome version
last 1 firefox version
```

#### 方式3：babel.config.js

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions']
      }
    }]
  ]
};
```

### 查询语法

```
> 1%           # 全球使用率 > 1%
> 5% in US     # 美国使用率 > 5%
last 2 versions # 每个浏览器的最新 2 个版本
not dead       # 24 个月内有更新的浏览器
ie 10-11       # IE 10 和 11
Firefox ESR    # Firefox 长期支持版
Chrome > 90    # Chrome 版本 > 90
```

### 常用配置

```
# 现代浏览器（推荐）
> 1%
last 2 versions
not dead
not ie 11

# 移动端
iOS >= 10
Android >= 6
ChromeAndroid > 90

# 兼容老浏览器
> 0.5%
last 2 versions
Firefox ESR
not dead

# 仅现代浏览器（最激进）
last 1 chrome version
last 1 firefox version
last 1 safari version
```

### 查看目标浏览器

```bash
# 查看当前配置覆盖的浏览器
npx browserslist

# 输出示例：
# chrome 96
# chrome 95
# edge 96
# edge 95
# firefox 94
# firefox 93
# safari 15
# safari 14.1
```

---

## Babel 兼容性机制深度解析

### 🎯 核心问题

你提出了一个非常关键的问题：**Babel 如何保证不会遗漏或错误地转换代码？**

这涉及到 Babel 生态系统中最精妙的部分，让我们深入解析这个机制。

---

### 1. 数据来源：兼容性数据库

#### @babel/compat-data

Babel 使用 **`@babel/compat-data`** 包来存储所有浏览器的特性支持数据。

```javascript
// @babel/compat-data/data/plugins.json（简化版）
{
  "transform-arrow-functions": {
    "chrome": "45",      // Chrome 45+ 支持箭头函数
    "firefox": "22",     // Firefox 22+ 支持
    "safari": "10",      // Safari 10+ 支持
    "ie": false,         // IE 全系列不支持
    "edge": "12"         // Edge 12+ 支持
  },
  "transform-classes": {
    "chrome": "46",
    "firefox": "45",
    "safari": "10",
    "ie": false,
    "edge": "13"
  },
  "transform-optional-chaining": {
    "chrome": "80",
    "firefox": "74",
    "safari": "13.1",
    "ie": false,
    "edge": "80"
  }
}
```

#### core-js-compat

对于 API polyfill，使用 **`core-js-compat`** 包存储兼容性数据。

```javascript
// core-js-compat/data.json（简化版）
{
  "es.promise": {
    "chrome": "32",      // Promise 在 Chrome 32+ 可用
    "firefox": "29",
    "safari": "7.1",
    "ie": false,         // IE 全系列不可用
    "edge": "12"
  },
  "es.array.includes": {
    "chrome": "47",
    "firefox": "43",
    "safari": "9",
    "ie": false,
    "edge": "14"
  },
  "es.string.replace-all": {
    "chrome": "85",
    "firefox": "77",
    "safari": "13.1",
    "ie": false,
    "edge": "85"
  }
}
```

---

### 2. 数据来源和维护

#### 兼容性数据的来源

```
数据来源渠道：
├── 📊 caniuse.com
│   └── 全球最权威的浏览器兼容性数据库
│
├── 📚 MDN (Mozilla Developer Network)
│   └── Mozilla 维护的详细特性文档
│
├── 🧪 自动化测试
│   ├── Test262（ECMAScript 官方测试套件）
│   └── Babel 自己的兼容性测试
│
└── 👥 社区贡献
    └── 开发者反馈和 PR
```

#### 数据维护流程

```javascript
// 1. 新特性发布
ECMAScript 2023 发布 → Array.prototype.toSorted()

// 2. 浏览器实现
Chrome 110 → 支持 ✅
Firefox 115 → 支持 ✅
Safari 16 → 支持 ✅
IE → 不支持 ❌

// 3. 更新兼容性数据
// core-js-compat/data.json
{
  "es.array.to-sorted": {
    "chrome": "110",
    "firefox": "115",
    "safari": "16",
    "ie": false
  }
}

// 4. 发布新版本
npm publish core-js-compat@3.x.x
npm publish @babel/compat-data@7.x.x
```

---

### 3. 工作流程：如何决定转换什么

#### 完整流程图

```
1️⃣ 解析 browserslist
    ↓
    ['> 1%', 'last 2 versions']
    ↓
    解析为具体浏览器版本
    ↓
    [
      'chrome 120',
      'firefox 119',
      'safari 17',
      'edge 120',
      'ie 11'  ← 注意 IE 11
    ]

2️⃣ 对比兼容性数据
    ↓
    检查每个插件的支持情况
    ↓
    transform-arrow-functions:
      chrome 120 ✅ (45+)
      firefox 119 ✅ (22+)
      safari 17 ✅ (10+)
      edge 120 ✅ (12+)
      ie 11 ❌ (不支持)
    ↓
    结论：需要这个插件！（因为 IE 11 不支持）

3️⃣ 确定所需插件列表
    ↓
    [
      'transform-arrow-functions',    // IE 11 需要
      'transform-classes',            // IE 11 需要
      'transform-optional-chaining',  // IE 11 需要
      'transform-nullish-coalescing', // IE 11 需要
      // ... 更多插件
    ]

4️⃣ 确定所需 polyfill
    ↓
    检查 core-js-compat 数据
    ↓
    [
      'es.promise',           // IE 11 需要
      'es.array.includes',    // IE 11 需要
      'es.object.assign',     // IE 11 需要
      // ... 更多 polyfill
    ]

5️⃣ 应用转换
    ↓
    加载选定的插件
    ↓
    转换源代码
    ↓
    注入必要的 polyfill
```

---

### 4. 语法转换 vs API Polyfill

#### 语法转换（Syntax Transform）

**定义**：语法层面的特性，需要编译时转换。

```javascript
// ❌ 运行时无法解决
const fn = () => {};  // 箭头函数语法
class User {}         // class 语法
const { a, b } = obj; // 解构语法

// ✅ 必须在编译时转换
var fn = function() {};
var User = function User() {};
var a = obj.a, b = obj.b;
```

**对应的 Babel 插件**：

```javascript
// @babel/preset-env 会根据 target 自动包含这些插件
[
  '@babel/plugin-transform-arrow-functions',
  '@babel/plugin-transform-classes',
  '@babel/plugin-transform-destructuring',
  '@babel/plugin-transform-block-scoping',
  '@babel/plugin-transform-template-literals',
  '@babel/plugin-transform-spread',
  '@babel/plugin-transform-for-of',
  // ... 总共 50+ 个语法转换插件
]
```

#### API Polyfill

**定义**：运行时 API，可以通过注入代码实现。

```javascript
// ❌ 旧浏览器没有这些 API
Promise
Array.prototype.includes()
Object.assign()
String.prototype.replaceAll()

// ✅ 可以通过 polyfill 实现
// core-js 提供了这些 API 的实现
import 'core-js/modules/es.promise';
import 'core-js/modules/es.array.includes';
```

**core-js 模块**：

```javascript
// core-js/modules/es.array.includes.js（简化版）
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement, fromIndex) {
    // polyfill 实现
    var O = Object(this);
    var len = O.length >>> 0;
    if (len === 0) return false;
    // ... 完整实现
  };
}
```

---

### 5. @babel/preset-env 的精确匹配机制

#### 源码实现（简化版）

```javascript
// @babel/preset-env/lib/index.js（核心逻辑简化版）

function getPluginList(targets, compatData) {
  const plugins = [];
  
  // 遍历所有可用的转换插件
  for (const [pluginName, browserSupport] of Object.entries(compatData)) {
    let needsPlugin = false;
    
    // 检查每个目标浏览器
    for (const [browser, version] of Object.entries(targets)) {
      const minVersion = browserSupport[browser];
      
      // 判断是否需要这个插件
      if (minVersion === false || version < minVersion) {
        needsPlugin = true;
        break;
      }
    }
    
    if (needsPlugin) {
      plugins.push(pluginName);
    }
  }
  
  return plugins;
}

// 使用示例
const targets = {
  chrome: '120',
  firefox: '119',
  safari: '17',
  ie: '11'
};

const compatData = {
  'transform-arrow-functions': {
    chrome: '45',
    firefox: '22',
    safari: '10',
    ie: false  // IE 全版本不支持
  }
};

// 结果：需要 transform-arrow-functions
// 因为 ie: false 表示 IE 11 不支持箭头函数
```

#### useBuiltIns 的工作机制

```javascript
// useBuiltIns: 'usage' 的实现逻辑

// 1. 分析代码，找到使用的 API
const code = `
  const p = Promise.resolve(1);
  const arr = [1, 2, 3];
  arr.includes(2);
`;

// 2. 扫描到的 API
const usedAPIs = [
  'es.promise',
  'es.array.includes'
];

// 3. 对比目标浏览器支持情况
const targets = { chrome: '110', ie: '11' };

// 4. 查询 core-js-compat
// es.promise
//   chrome: '32' ✅ (110 > 32)
//   ie: false ❌ (需要 polyfill)

// 5. 只注入必要的 polyfill
import 'core-js/modules/es.promise';
import 'core-js/modules/es.array.includes';
```

---

### 6. 如何保证不遗漏和不错误

#### 多重保障机制

```
✅ 1. 权威数据源
   └── caniuse + MDN + Test262

✅ 2. 持续更新
   └── 跟随 ECMAScript 标准和浏览器发布

✅ 3. 自动化测试
   └── 10000+ 测试用例保证准确性

✅ 4. 社区监督
   └── 数百万开发者的实际使用反馈

✅ 5. 版本化管理
   └── 明确的数据版本和更新记录

✅ 6. 精确匹配算法
   └── 对每个特性和每个浏览器版本精确判断

✅ 7. 保守策略
   └── 宁可多转换，不能漏转换
```

---

### 7. 调试和验证

#### 查看实际使用的插件

```bash
# 使用环境变量调试
BABEL_ENV=development DEBUG=@babel/preset-env npx babel src/index.js
```

输出示例：
```
@babel/preset-env: Using targets:
{
  "chrome": "120",
  "firefox": "119",
  "safari": "17"
}

@babel/preset-env: Using plugins:
{
  "transform-arrow-functions": false,  // 不需要
  "transform-classes": false,          // 不需要
  "transform-optional-chaining": false // 不需要
}

@babel/preset-env: Using polyfills with `usage` option:
{
  "es.promise": false,        // 不需要
  "es.array.includes": false  // 不需要
}
```

#### 查看转换后的代码

```bash
# 转换代码并输出
npx babel src/index.js --out-file dist/index.js

# 查看使用的插件
npx babel src/index.js --plugins=@babel/plugin-transform-arrow-functions
```

---

### 8. 实际案例：可选链运算符

```javascript
// 2020 年，可选链运算符成为标准

// 1. 兼容性数据收集
//    - Chrome 80+ 支持
//    - Firefox 74+ 支持
//    - Safari 13.1+ 支持
//    - IE 全系列不支持

// 2. 创建转换插件
//    @babel/plugin-proposal-optional-chaining

// 3. 添加到 @babel/compat-data
{
  "transform-optional-chaining": {
    "chrome": "80",
    "firefox": "74",
    "safari": "13.1",
    "ie": false
  }
}

// 4. @babel/preset-env 自动包含
//    当 targets 包含不支持的浏览器时

// 5. 转换效果
// 输入
const name = obj?.user?.name;

// 输出（当目标浏览器不支持时）
var _obj$user;
const name = obj === null || obj === void 0 
  ? void 0 
  : (_obj$user = obj.user) === null || _obj$user === void 0 
    ? void 0 
    : _obj$user.name;
```

---

### 9. 总结：为什么这套机制可靠

```
🎯 精确的兼容性数据
   └── @babel/compat-data + core-js-compat

🎯 智能的匹配算法
   └── 每个特性 × 每个浏览器版本 = 精确判断

🎯 完善的测试体系
   └── Test262 + 10000+ Babel 测试用例

🎯 持续的社区维护
   └── 数百位贡献者 + 数百万开发者

🎯 保守的转换策略
   └── 宁可多转换，不能漏转换

这就是为什么 Babel 能够成为前端工程化的基石！
```

---

## 配置文件

### 文件类型

Babel 支持多种配置文件格式：

| 文件名 | 格式 | 作用域 | 推荐度 |
|--------|------|--------|--------|
| **babel.config.js** | JavaScript | 项目级（推荐） | ⭐⭐⭐⭐⭐ |
| **babel.config.json** | JSON | 项目级 | ⭐⭐⭐⭐ |
| **.babelrc.js** | JavaScript | 文件级 | ⭐⭐⭐ |
| **.babelrc** | JSON | 文件级 | ⭐⭐⭐ |
| **.babelrc.json** | JSON | 文件级 | ⭐⭐⭐ |
| **package.json** | JSON | 项目级 | ⭐⭐ |

### babel.config.js（推荐）

```javascript
module.exports = (api) => {
  // 缓存配置
  api.cache(true);
  
  // 判断环境
  const isDev = api.env('development');
  const isProd = api.env('production');
  
  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        },
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false
      }],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      // 开发环境启用 React Fast Refresh
      isDev && 'react-refresh/babel',
      // 生产环境移除 console
      isProd && 'babel-plugin-transform-remove-console'
    ].filter(Boolean)
  };
};
```

### .babelrc

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not dead"]
      },
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ],
  "plugins": []
}
```

### 项目级 vs 文件级

```
项目级（babel.config.js）
  - 适用于整个项目
  - 包括 node_modules
  - 适合 Monorepo
  - 推荐使用 ✅

文件级（.babelrc）
  - 仅适用于当前目录及子目录
  - 不包括 node_modules
  - 适合小型项目
```

---

## 常用 Plugins 和 Presets

### 官方 Plugins

#### 语法转换

```javascript
'@babel/plugin-transform-arrow-functions'      // 箭头函数
'@babel/plugin-transform-block-scoping'        // let/const
'@babel/plugin-transform-classes'              // class
'@babel/plugin-transform-template-literals'    // 模板字符串
'@babel/plugin-transform-destructuring'        // 解构
'@babel/plugin-transform-spread'               // 展开运算符
'@babel/plugin-transform-parameters'           // 默认参数
'@babel/plugin-transform-async-to-generator'   // async/await
'@babel/plugin-transform-optional-chaining'    // 可选链 ?.
'@babel/plugin-transform-nullish-coalescing-operator'  // 空值合并 ??
```

#### 提案特性

```javascript
'@babel/plugin-proposal-decorators'            // 装饰器
'@babel/plugin-proposal-class-properties'      // 类属性
'@babel/plugin-proposal-private-methods'       // 私有方法
'@babel/plugin-proposal-do-expressions'        // do 表达式
'@babel/plugin-proposal-pipeline-operator'     // 管道运算符
```

### 官方 Presets

```javascript
'@babel/preset-env'        // 智能转换 ES6+
'@babel/preset-react'      // React JSX
'@babel/preset-typescript' // TypeScript
'@babel/preset-flow'       // Flow
```

### 社区 Plugins

```javascript
'babel-plugin-import'                          // 按需引入（Ant Design 等）
'babel-plugin-transform-remove-console'        // 移除 console
'babel-plugin-lodash'                          // Lodash 优化
'babel-plugin-styled-components'               // styled-components
'react-refresh/babel'                          // React Fast Refresh
```

---

## 最佳实践

### 1. 使用 @babel/preset-env

```javascript
// ✅ 推荐：让 Babel 智能选择
{
  presets: [
    ['@babel/preset-env', {
      targets: { browsers: ['> 1%', 'last 2 versions'] },
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ]
}

// ❌ 不推荐：手动配置大量插件
{
  plugins: [
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-block-scoping',
    // ... 几十个插件
  ]
}
```

### 2. 配置 browserslist

```json
// package.json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

### 3. modules: false

```javascript
{
  presets: [
    ['@babel/preset-env', {
      modules: false  // 让 Webpack 处理模块，支持 Tree Shaking
    }]
  ]
}
```

### 4. 环境区分

```javascript
module.exports = (api) => {
  const isDev = api.env('development');
  
  return {
    presets: ['@babel/preset-env'],
    plugins: [
      isDev && 'react-refresh/babel'  // 开发环境才启用
    ].filter(Boolean)
  };
};
```

### 5. 缓存配置

```javascript
module.exports = (api) => {
  api.cache(true);  // 缓存配置，提升性能
  
  return {
    presets: ['@babel/preset-env']
  };
};
```

### 6. 应用开发 vs 库开发

```javascript
// 应用开发
{
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',  // 按需引入 Polyfill
      corejs: 3
    }]
  ]
}

// 库开发
{
  presets: [
    ['@babel/preset-env', {
      modules: false
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3  // 不污染全局
    }]
  ]
}
```

---

## 🎯 总结

### 核心要点

1. **Babel 是什么**：JavaScript 编译器，转换 ES6+ 代码
2. **工作原理**：Parse（解析）→ Transform（转换）→ Generate（生成）
3. **核心概念**：Plugin 是最小单元，Preset 是插件集合
4. **@babel/preset-env**：最智能的 Preset，根据目标环境自动选择转换
5. **配置文件**：推荐使用 `babel.config.js`

### 关键配置

```javascript
// babel.config.js
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

1. **Babel 的工作原理是什么？**
   - 答：Parse → Transform → Generate

2. **@babel/preset-env 的作用是什么？**
   - 答：根据目标环境自动选择需要的插件和 Polyfill

3. **为什么推荐 modules: false？**
   - 答：让 Webpack 处理模块，支持 Tree Shaking

4. **Plugin 和 Preset 的区别？**
   - 答：Plugin 是最小转换单元，Preset 是插件集合

5. **browserslist 的作用？**
   - 答：定义目标浏览器，多个工具共享配置

---

**下一步**：学习 [Polyfill 方案详解](./02-polyfill-solutions.md)，了解如何为代码添加缺失的特性支持。

