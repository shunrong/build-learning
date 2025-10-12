# Webpack 构建流程详解

## 🎯 核心问题

当你执行 `webpack` 命令时，背后到底发生了什么？

```bash
npx webpack
```

看似简单的一行命令，实际上经历了复杂的构建流程。理解这个流程，是深入掌握 Webpack 的关键。

---

## 📊 构建流程全景图

```
┌─────────────────────────────────────────────────────────────┐
│                    Webpack 构建流程                          │
└─────────────────────────────────────────────────────────────┘

1️⃣ 初始化阶段
   ├── 读取配置文件（webpack.config.js）
   ├── 合并命令行参数
   ├── 创建 Compiler 对象
   └── 加载插件（Plugin）

2️⃣ 编译阶段
   ├── 确定入口（Entry）
   ├── 编译模块（Module）
   │   ├── 从入口开始递归解析
   │   ├── 使用 Loader 转换文件
   │   ├── 解析依赖关系
   │   └── 构建依赖图（Dependency Graph）
   └── 完成模块编译

3️⃣ 输出阶段
   ├── 根据依赖图生成 Chunk
   ├── 将 Chunk 转换为文件
   ├── 输出到文件系统（dist/）
   └── 生成 Source Map（可选）

4️⃣ 完成阶段
   ├── 打印构建信息
   ├── 清理缓存
   └── 触发完成钩子
```

---

## 1️⃣ 初始化阶段

### 第一步：读取配置

```javascript
// webpack.config.js
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

Webpack 会：
1. 读取 `webpack.config.js` 文件
2. 读取命令行参数（如 `--mode production`）
3. 合并默认配置、文件配置、命令行配置
4. 得到最终的配置对象

**配置优先级**：
```
命令行参数 > webpack.config.js > 默认配置
```

### 第二步：创建 Compiler 对象

```javascript
// Webpack 内部逻辑（简化版）
const webpack = require('webpack');
const config = require('./webpack.config.js');

// 创建 Compiler 实例
const compiler = webpack(config);

// Compiler 是 Webpack 的核心控制器
// 负责整个编译流程的管理
```

**Compiler 的职责**：
- 📁 文件系统访问
- 🔄 编译流程控制
- 🎣 生命周期钩子管理
- 📊 构建信息统计

### 第三步：加载插件

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

// Webpack 会遍历所有插件，调用它们的 apply 方法
plugins.forEach(plugin => {
  plugin.apply(compiler);  // 插件注册到 Compiler 的钩子上
});
```

**Plugin 的工作方式**：
```javascript
// 简化的插件示例
class MyPlugin {
  apply(compiler) {
    // 在编译完成后执行
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('构建完成！');
    });
  }
}
```

---

## 2️⃣ 编译阶段（核心）

### 第一步：确定入口

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js'  // 单入口
  
  // 或多入口
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};
```

Webpack 从入口文件开始构建依赖图。

### 第二步：编译模块

这是整个构建流程的**核心**，让我们深入理解：

```javascript
// src/index.js（入口文件）
import { add } from './math.js';
import './style.css';

console.log(add(1, 2));
```

#### 2.1 加载模块内容

```javascript
// Webpack 读取文件内容
const fs = require('fs');
const content = fs.readFileSync('./src/index.js', 'utf-8');

// content = "import { add } from './math.js';\nimport './style.css';\n..."
```

#### 2.2 使用 Loader 转换

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'  // JS 文件用 Babel 转换
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  // CSS 文件用这些 Loader 处理
      }
    ]
  }
};
```

**Loader 的执行流程**：
```
源文件
  ↓
匹配规则（test）
  ↓
应用 Loader 链（从右到左）
  ↓
转换后的内容
```

**示例：CSS 处理**
```
style.css
  ↓
css-loader     # 解析 CSS，处理 @import 和 url()
  ↓
style-loader   # 把 CSS 插入到 <style> 标签
  ↓
转换为 JS 模块（可以被 Webpack 处理）
```

#### 2.3 解析 AST（抽象语法树）

```javascript
// Webpack 使用 Acorn/Babylon 解析 JS 代码
const acorn = require('acorn');

const ast = acorn.parse(content, {
  sourceType: 'module'
});

// AST 是代码的树形结构表示
// 可以遍历、分析、修改代码
```

**AST 示例**：
```javascript
// 源代码
import { add } from './math.js';

// AST（简化版）
{
  type: 'ImportDeclaration',
  specifiers: [
    {
      type: 'ImportSpecifier',
      imported: { name: 'add' }
    }
  ],
  source: {
    type: 'Literal',
    value: './math.js'
  }
}
```

#### 2.4 分析依赖关系

Webpack 遍历 AST，找出所有的依赖：

```javascript
// index.js 的依赖
dependencies = [
  './math.js',      // import { add } from './math.js'
  './style.css'     // import './style.css'
];
```

#### 2.5 递归处理依赖

```
index.js
  ├── math.js
  │   └── utils.js
  └── style.css
      └── base.css
```

对每个依赖，重复以上步骤：
1. 加载内容
2. 应用 Loader
3. 解析 AST
4. 分析依赖
5. 递归处理

### 第三步：构建依赖图（Dependency Graph）

最终，Webpack 会构建一个完整的依赖图：

```javascript
// 简化的依赖图结构
const dependencyGraph = {
  'src/index.js': {
    id: 0,
    path: 'src/index.js',
    dependencies: ['src/math.js', 'src/style.css'],
    code: '...'
  },
  'src/math.js': {
    id: 1,
    path: 'src/math.js',
    dependencies: ['src/utils.js'],
    code: '...'
  },
  'src/utils.js': {
    id: 2,
    path: 'src/utils.js',
    dependencies: [],
    code: '...'
  },
  'src/style.css': {
    id: 3,
    path: 'src/style.css',
    dependencies: ['src/base.css'],
    code: '...'
  },
  'src/base.css': {
    id: 4,
    path: 'src/base.css',
    dependencies: [],
    code: '...'
  }
};
```

**依赖图的作用**：
- 📊 清晰展示模块间的依赖关系
- 🔍 发现循环依赖
- 🌲 支持 Tree Shaking（去除未使用的代码）
- 📦 指导 Chunk 的生成

---

## 3️⃣ 输出阶段

### 第一步：生成 Chunk

**Chunk** 是 Webpack 打包的基本单位。

```javascript
// 根据依赖图生成 Chunk
// 一个入口通常对应一个 Chunk

Chunk 1: main.js（入口 chunk）
  ├── index.js
  ├── math.js
  ├── utils.js
  ├── style.css
  └── base.css
```

**多入口会生成多个 Chunk**：
```javascript
// webpack.config.js
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};

// 生成：
// Chunk 1: app.js
// Chunk 2: admin.js
```

**代码拆分会生成额外的 Chunk**：
```javascript
// 动态 import
import('./lazy-module.js').then(module => {
  // ...
});

// 生成：
// Chunk 1: main.js（主 chunk）
// Chunk 2: 0.js（lazy-module.js）
```

### 第二步：生成代码

Webpack 把每个 Chunk 转换成可执行的代码：

```javascript
// 简化版的打包结果
(function(modules) {
  // 模块缓存
  var installedModules = {};
  
  // require 函数
  function __webpack_require__(moduleId) {
    // 如果已加载，返回缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    
    // 创建模块
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    
    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    
    // 标记为已加载
    module.l = true;
    
    // 返回导出
    return module.exports;
  }
  
  // 加载入口模块
  return __webpack_require__(0);
})({
  // 模块映射
  0: function(module, exports, __webpack_require__) {
    // index.js 的代码
    const math = __webpack_require__(1);
    console.log(math.add(1, 2));
  },
  1: function(module, exports) {
    // math.js 的代码
    exports.add = function(a, b) { return a + b; };
  }
});
```

**代码结构解析**：
1. **IIFE 包裹**：整个打包文件是一个立即执行函数
2. **模块映射**：所有模块存储在对象中，用 ID 标识
3. **运行时代码**：`__webpack_require__` 实现模块加载
4. **模块缓存**：每个模块只执行一次

### 第三步：写入文件

```javascript
// Webpack 将生成的代码写入文件系统
const fs = require('fs');

fs.writeFileSync(
  'dist/bundle.js',
  generatedCode
);
```

**生成的文件**：
```
dist/
  ├── bundle.js         # 主 chunk
  ├── 0.bundle.js       # 动态加载的 chunk
  ├── bundle.js.map     # Source Map（如果开启）
  └── index.html        # HTML（如果使用 HtmlWebpackPlugin）
```

---

## 4️⃣ 完成阶段

### 打印构建信息

```bash
Hash: 4d9c4b7e8f6a3b5d
Version: webpack 5.75.0
Time: 1234ms
Built at: 2024/01/01 12:00:00

Asset       Size  Chunks             Chunk Names
bundle.js   256 KiB  main  [emitted]  main

Entrypoint main = bundle.js
[0] ./src/index.js 234 bytes {main} [built]
[1] ./src/math.js 123 bytes {main} [built]
[2] ./src/style.css 45 bytes {main} [built]

webpack compiled successfully in 1234ms
```

**关键信息**：
- **Hash**：本次构建的唯一标识
- **Time**：构建耗时
- **Asset**：生成的文件及大小
- **模块列表**：哪些模块被打包了

---

## 🎣 Webpack 生命周期钩子

Webpack 在构建的每个阶段都会触发钩子（Hook），插件可以监听这些钩子：

```javascript
Compiler 钩子（构建级别）
  ├── initialize        # 初始化
  ├── run              # 开始编译
  ├── compile          # 创建 Compilation
  ├── make             # 从入口开始构建
  ├── emit             # 输出文件前
  ├── afterEmit        # 输出文件后
  └── done             # 构建完成

Compilation 钩子（编译级别）
  ├── buildModule      # 构建模块前
  ├── succeedModule    # 模块构建成功
  ├── finishModules    # 所有模块构建完成
  ├── seal             # 封装 Chunk
  ├── optimize         # 优化阶段
  ├── optimizeChunks   # 优化 Chunk
  └── optimizeAssets   # 优化资源
```

**使用示例**：
```javascript
class MyPlugin {
  apply(compiler) {
    // 在编译开始前
    compiler.hooks.compile.tap('MyPlugin', () => {
      console.log('开始编译...');
    });
    
    // 在生成文件前
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      console.log('即将输出文件...');
      // 可以修改输出的文件
    });
    
    // 在构建完成后
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('构建完成！');
      console.log('耗时:', stats.endTime - stats.startTime, 'ms');
    });
  }
}
```

---

## 🔍 深入理解：Compiler vs Compilation

### Compiler
- **单例**：整个 Webpack 生命周期只有一个 Compiler 实例
- **职责**：控制整个构建流程
- **生命周期**：从启动到结束

### Compilation
- **多例**：每次文件变化都会创建新的 Compilation
- **职责**：负责具体的编译工作
- **生命周期**：一次编译过程

```javascript
// 简化理解
const compiler = new Compiler();  // 创建一次

// 开发模式下，每次文件变化：
compiler.run(() => {
  const compilation = new Compilation();  // 创建新的 Compilation
  compilation.build();                     // 执行编译
});
```

---

## 📊 完整流程示例

让我们用一个具体的例子串联整个流程：

### 项目结构
```
my-app/
  ├── src/
  │   ├── index.js        # 入口
  │   ├── math.js         # 工具模块
  │   └── style.css       # 样式
  ├── webpack.config.js
  └── package.json
```

### 文件内容

```javascript
// src/index.js
import { add } from './math.js';
import './style.css';

document.body.innerHTML = `1 + 2 = ${add(1, 2)}`;

// src/math.js
export function add(a, b) {
  return a + b;
}

// src/style.css
body { color: blue; }

// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  }
};
```

### 构建流程

```
1️⃣ 初始化
   ├── 读取 webpack.config.js
   ├── 创建 Compiler
   └── 加载插件

2️⃣ 编译
   ├── 从 src/index.js 开始
   ├── 读取内容，解析 import
   ├── 发现依赖: math.js, style.css
   │
   ├── 处理 math.js
   │   ├── 读取内容
   │   ├── 解析 export
   │   └── 无依赖
   │
   └── 处理 style.css
       ├── 读取内容
       ├── 应用 css-loader（解析 CSS）
       ├── 应用 style-loader（转为 JS）
       └── 无依赖

3️⃣ 生成依赖图
   {
     'src/index.js': { id: 0, deps: ['src/math.js', 'src/style.css'] },
     'src/math.js': { id: 1, deps: [] },
     'src/style.css': { id: 2, deps: [] }
   }

4️⃣ 输出
   ├── 生成 Chunk: main
   ├── 生成代码: bundle.js
   └── 写入 dist/bundle.js

5️⃣ 完成
   └── 打印构建信息
```

---

## 📝 总结

### Webpack 构建流程的 5 个核心步骤

1. **初始化**：读取配置，创建 Compiler，加载插件
2. **编译**：从入口开始，递归解析所有模块
3. **依赖图**：构建完整的模块依赖关系
4. **输出**：生成 Chunk，转换为代码，写入文件
5. **完成**：打印信息，触发钩子

### 核心概念

- **Module**：每个文件都是一个模块
- **Chunk**：打包的基本单位，一个或多个模块的集合
- **Bundle**：最终输出的文件
- **Loader**：转换特定类型的文件
- **Plugin**：在构建流程的各个阶段执行自定义操作
- **Dependency Graph**：模块间的依赖关系图

### 关键原理

1. **一切皆模块**：JS、CSS、图片都可以作为模块
2. **依赖分析**：递归解析所有依赖，构建依赖图
3. **Loader 链**：从右到左，链式处理文件
4. **Plugin 钩子**：在生命周期的各个阶段执行
5. **Runtime 代码**：打包后的 `__webpack_require__` 实现模块加载

### 为什么理解构建流程很重要？

1. **优化性能**：知道瓶颈在哪里（Parse、Transform、Emit）
2. **解决问题**：遇到错误能快速定位
3. **定制需求**：知道在哪个阶段做什么事
4. **深入原理**：为学习 Rollup、Vite 打基础

---

## 🎯 下一步

理解了 Webpack 的构建流程，接下来：

1. **实践 Demo**：
   - [Demo 1: 不用打包工具的痛点](../demos/01-no-bundler/)
   - [Demo 2: 最简单的 Webpack 打包](../demos/02-basic-bundle/)

2. **继续学习**：
   - Phase 1.2: 配置系统入门
   - Phase 1.3: Loader 机制深入
   - Phase 1.4: Plugin 机制深入

---

## 💡 思考题

完成理论学习后，思考这些问题：

1. Webpack 如何知道一个模块依赖了哪些其他模块？
2. 为什么 Loader 要从右到左执行？
3. Plugin 和 Loader 的区别是什么？
4. 什么情况下会生成多个 Chunk？
5. 打包后的代码如何实现模块化？

带着这些问题去看 Demo，会有更深的理解！

