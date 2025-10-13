# Demo 1: Babel 基础配置

## 📝 简介

本 Demo 演示如何配置 Babel 来转译 ES6+ 代码，让现代 JavaScript 特性能够在老旧浏览器中运行。

## 🎯 学习目标

通过本 Demo，你将学会：
1. ✅ 如何安装和配置 Babel
2. ✅ 理解 `@babel/preset-env` 的作用
3. ✅ 配置 `babel.config.js`
4. ✅ 在 Webpack 中集成 Babel
5. ✅ 查看 Babel 转译结果

## 📂 项目结构

```
01-babel-basics/
├── src/
│   ├── index.html          # HTML 入口
│   └── index.js            # JavaScript 源码（ES6+）
├── babel.config.js         # Babel 配置文件 ⭐️
├── webpack.config.js       # Webpack 配置
├── package.json            # 项目配置
└── README.md              # 说明文档
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:xxxx`

### 3. 查看效果

- **页面交互**：点击按钮测试各个 ES6+ 特性
- **源码查看**：DevTools → Sources → webpack://src/index.js

### 4. 查看 Babel 转译结果 ⭐️ 重要

Webpack 打包后的代码包含大量运行时代码，可读性差。推荐使用以下方法查看**纯粹的 Babel 转译结果**：

#### 方法 1：使用 Babel CLI（✅ 推荐）

```bash
# 单次转译（输出到 compiled.js）
npm run babel

# 实时监听转译
npm run babel:watch

# 针对老旧浏览器转译（IE 11, Chrome 49, Safari 10）
npm run babel:old  # 输出到 compiled.old.js
```

**对比差异**：
- `compiled.js`：现代浏览器目标，大部分 ES6+ 语法**保持原样**
- `compiled.old.js`：老旧浏览器目标，大量语法被**转译**（箭头函数 → 普通函数，Class → 构造函数，模板字符串 → `.concat()` 等）

#### 方法 2：浏览器 DevTools 查看

1. 打开 `http://localhost:xxxx`
2. 按 `F12` 打开开发者工具
3. **Sources** → `webpack://` → `./src/index.js`（Source Map 自动映射回原始代码）

#### 方法 3：构建后查看

```bash
npm run build
# 查看 dist/main.js（已压缩，可读性差）
```

### 5. 生产构建

```bash
npm run build
```

查看 `dist/main.js`，可以看到 Babel 转译后的代码。

## 📚 核心配置讲解

### 1. Babel 配置（babel.config.js）

```javascript
module.exports = (api) => {
  api.cache(true);
  
  const isDev = api.env('development');
  
  return {
    presets: [
      ['@babel/preset-env', {
        // 目标环境
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        },
        
        // 不转换模块语法（让 Webpack 处理）
        modules: false,
        
        // 调试信息
        debug: isDev,
        
        // Polyfill（暂不启用）
        useBuiltIns: false
      }]
    ]
  };
};
```

**关键配置项**：

| 配置项 | 作用 | 推荐值 |
|--------|------|--------|
| `targets` | 目标浏览器 | `['> 1%', 'last 2 versions']` |
| `modules` | 模块转换 | `false`（让 Webpack 处理） |
| `debug` | 调试信息 | 开发环境 `true` |
| `useBuiltIns` | Polyfill | `false`（Demo 2 讲解） |

### 2. Webpack 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
          // Babel 配置在 babel.config.js 中
        }
      }
    ]
  }
};
```

## 🎮 功能演示

### 1. 箭头函数

**源代码**：
```javascript
const greeting = (name) => `Hello, ${name}!`;
```

**转译后**（IE 11）：
```javascript
var greeting = function greeting(name) {
  return "Hello, " + name + "!";
};
```

### 2. Class 类

**源代码**：
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  
  introduce() {
    return `我叫 ${this.name}`;
  }
}
```

**转译后**：
```javascript
var Person = function Person(name) {
  this.name = name;
};

Person.prototype.introduce = function() {
  return "我叫 " + this.name;
};
```

### 3. 解构赋值

**源代码**：
```javascript
const { name, age } = person;
```

**转译后**：
```javascript
var name = person.name;
var age = person.age;
```

### 4. 展开运算符

**源代码**：
```javascript
const merged = { ...obj1, ...obj2 };
```

**转译后**：
```javascript
var merged = Object.assign({}, obj1, obj2);
```

### 5. 可选链 & 空值合并

**源代码**：
```javascript
const userName = user?.profile?.name;
const count = data?.count ?? 0;
```

**转译后**：
```javascript
var userName = user == null ? void 0 : 
  (user.profile == null ? void 0 : user.profile.name);
var count = (data == null ? void 0 : data.count) !== null && 
  (data == null ? void 0 : data.count) !== void 0 ? 
  data.count : 0;
```

### 6. Async/Await

**源代码**：
```javascript
async function fetchData() {
  const data = await fetch('/api');
  return data.json();
}
```

**转译后**：
```javascript
function fetchData() {
  return regeneratorRuntime.async(function fetchData$(context) {
    while (1) {
      switch (context.prev = context.next) {
        case 0:
          context.next = 2;
          return regeneratorRuntime.awrap(fetch('/api'));
        // ...
      }
    }
  });
}
```

## 🔍 实验

### 实验1：修改目标浏览器

```javascript
// babel.config.js
targets: {
  browsers: ['ie 11']  // 只兼容 IE 11
}
```

运行 `npm run build`，查看转译结果的差异。

### 实验2：查看启用的插件

```javascript
// babel.config.js
debug: true
```

运行 `npm run dev`，控制台会输出 Babel 启用的所有插件。

### 实验3：不同目标环境的对比

```javascript
// 目标1：现代浏览器
targets: { browsers: ['chrome 90'] }

// 目标2：老旧浏览器
targets: { browsers: ['ie 11'] }
```

对比两种配置下的打包体积和转译结果。

## 💡 关键知识点

### 1. Babel 只转换语法

```javascript
// ✅ Babel 可以转换（语法）
const fn = () => {};  // 箭头函数 → 普通函数
class Person {}       // class → 构造函数

// ❌ Babel 无法转换（API），需要 Polyfill
Promise.resolve();        // Promise API
[1, 2, 3].includes(2);    // Array.prototype.includes
'abc'.padStart(5, '0');   // String.prototype.padStart
```

### 2. modules: false 的重要性

```javascript
// modules: false（推荐）
import { add } from './utils';
// Webpack 可以进行 Tree Shaking ✅

// modules: 'commonjs'
var _utils = require('./utils');
// 无法 Tree Shaking ❌
```

### 3. browserslist 配置

```json
// package.json
{
  "browserslist": [
    "> 1%",           // 全球使用率 > 1%
    "last 2 versions", // 每个浏览器的最新 2 个版本
    "not dead"        // 24 个月内有更新的浏览器
  ]
}
```

## ❓ 常见问题

### 1. 为什么代码还是报错？

**答**：Babel 只转换语法，不提供 API Polyfill。如果使用了 Promise、Map、Set 等 API，需要配置 Polyfill（见 Demo 2）。

### 2. 如何查看转译后的代码？

**答**：
- 方式1：`npm run build`，查看 `dist/main.js`
- 方式2：DevTools → Sources → dist/main.js
- 方式3：使用 [Babel REPL](https://babeljs.io/repl)

### 3. babel-loader 和 babel.config.js 的关系？

**答**：
- `babel-loader`：Webpack 插件，负责调用 Babel
- `babel.config.js`：Babel 配置文件，定义转译规则
- 它们配合工作：Webpack 使用 babel-loader 调用 Babel，Babel 根据配置文件进行转译

### 4. 为什么要 exclude: /node_modules/？

**答**：
- node_modules 中的代码已经是编译好的
- 不需要再次转译，可以提升构建速度
- 如果某些第三方库需要转译，可以使用 `include: [...]` 指定

## 🎯 验证清单

完成本 Demo 后，请确认：

- [ ] 理解 Babel 的作用（转译 ES6+ 语法）
- [ ] 会配置 `babel.config.js`
- [ ] 理解 `@babel/preset-env` 的作用
- [ ] 知道 `modules: false` 的重要性
- [ ] 会在 Webpack 中集成 Babel
- [ ] 能查看和理解转译后的代码
- [ ] 理解 Babel 只转换语法，不提供 Polyfill

## 🔗 相关资源

- [Babel 官方文档](https://babeljs.io/docs/)
- [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)
- [Babel REPL（在线转译）](https://babeljs.io/repl)
- [browserslist](https://github.com/browserslist/browserslist)

## 📖 下一步

学习 [Demo 2: Polyfill 方案对比](../02-polyfill-demo/)，了解如何为老浏览器提供 API 支持。

