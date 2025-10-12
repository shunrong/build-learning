# Plugin 概念详解

## 🎯 什么是 Plugin？

### 简单理解

**Plugin（插件）是用来扩展 Webpack 功能的工具**。

如果把 Webpack 比作一个工厂：
- **Loader** 是流水线上的工人，负责**转换**原材料（文件）
- **Plugin** 是工厂的**管理系统**，可以在生产的各个环节**介入和控制**

```javascript
// Loader：转换单个文件
function cssLoader(source) {
  return transformedCSS;  // 输入 CSS，输出转换后的 CSS
}

// Plugin：扩展 Webpack 功能
class MyPlugin {
  apply(compiler) {
    // 监听整个编译过程的各个阶段
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在生成文件之前，可以做任何事情：
      // - 修改文件内容
      // - 生成新文件
      // -

 分析代码
      // - 发送通知
    });
  }
}
```

---

## 🔍 为什么需要 Plugin？

### Loader 的局限性

Loader 很强大，但有局限：

```javascript
// ❌ Loader 无法做到的事情：

// 1. 自动生成 HTML 文件
// Loader 只能转换已有文件，无法创建新文件

// 2. 清理输出目录
// Loader 只关注文件转换，不能操作文件系统

// 3. 提取 CSS 到独立文件
// Loader 是单向的转换，无法"逆向"提取

// 4. 分析打包结果
// Loader 看不到整体，只能处理单个模块

// 5. 注入环境变量
// Loader 只能转换文件内容，无法在编译时注入

// 6. 压缩代码
// 压缩需要看到完整的打包结果，Loader 做不到
```

### Plugin 的能力

Plugin 可以介入 Webpack 编译的**整个生命周期**：

```javascript
// ✅ Plugin 可以做的事情：

class ComprehensivePlugin {
  apply(compiler) {
    // 1. 在编译开始前准备环境
    compiler.hooks.beforeRun.tap('Plugin', () => {
      console.log('清理旧文件...');
    });
    
    // 2. 在模块解析时注入代码
    compiler.hooks.compilation.tap('Plugin', (compilation) => {
      compilation.hooks.buildModule.tap('Plugin', (module) => {
        console.log('正在构建模块:', module.resource);
      });
    });
    
    // 3. 在生成文件前修改内容
    compiler.hooks.emit.tap('Plugin', (compilation) => {
      // 可以修改任何文件
      // 可以生成新文件
      // 可以删除文件
    });
    
    // 4. 在编译完成后发送通知
    compiler.hooks.done.tap('Plugin', (stats) => {
      console.log('编译完成！耗时:', stats.endTime - stats.startTime);
    });
  }
}
```

---

## 📊 Loader vs Plugin 完整对比

| 对比维度 | Loader | Plugin |
|---------|--------|--------|
| **本质** | 函数（接收源码，返回转换后的代码） | 类（包含 `apply` 方法）|
| **作用对象** | 单个文件/模块 | 整个编译过程 |
| **执行时机** | 模块加载时 | 整个生命周期的各个阶段 |
| **能力范围** | 文件内容转换 | 几乎可以做任何事情 |
| **配置位置** | `module.rules` | `plugins` 数组 |
| **输入输出** | 输入文件内容，输出转换后的内容 | 通过 Hooks 监听事件，执行操作 |
| **典型用途** | JS 转译、CSS 处理、图片转换 | HTML 生成、资源优化、环境变量注入 |
| **复杂度** | 相对简单（纯函数） | 相对复杂（需要理解生命周期）|

### 形象类比

```
Loader：专业的翻译员
===============
输入：英文文档
输出：中文文档
特点：只负责翻译这一件事，翻译完就结束

Plugin：项目经理
===============
能力：可以在项目的各个阶段介入
  - 项目启动前：准备环境
  - 项目进行中：监督进度
  - 项目完成后：生成报告、发送通知
  - 还可以：修改交付物、优化流程
```

---

## 🏗️ Plugin 的工作原理

### 1. 基本结构

```javascript
// 最简单的 Plugin
class BasicPlugin {
  // 构造函数：接收配置参数
  constructor(options = {}) {
    this.options = options;
  }
  
  // apply 方法：Webpack 会调用这个方法
  apply(compiler) {
    // compiler 是 Webpack 的核心对象
    console.log('Plugin 已应用！');
    console.log('配置参数:', this.options);
  }
}

module.exports = BasicPlugin;
```

**使用方式**：

```javascript
// webpack.config.js
const BasicPlugin = require('./BasicPlugin');

module.exports = {
  plugins: [
    new BasicPlugin({ name: 'test' })
    //  ↑ new 关键字创建实例
    //  Webpack 会自动调用实例的 apply 方法
  ]
};
```

---

### 2. 执行流程

```
1. Webpack 初始化
   └─ 读取配置文件
        ↓
2. 创建 Compiler 对象
   └─ Compiler 代表整个 Webpack 实例
        ↓
3. 加载所有 Plugin
   └─ 遍历 plugins 数组
        ↓
4. 调用每个 Plugin 的 apply 方法
   └─ 传入 compiler 对象
        ↓
5. Plugin 监听 Hooks
   └─ compiler.hooks.xxx.tap(...)
        ↓
6. 编译开始
   └─ 触发各个阶段的 Hooks
        ↓
7. Plugin 的回调函数执行
   └─ 在特定时机执行特定操作
        ↓
8. 编译完成
```

**示例代码**：

```javascript
class LifecyclePlugin {
  apply(compiler) {
    console.log('1. Plugin 被加载');
    
    // 监听编译开始
    compiler.hooks.run.tap('LifecyclePlugin', () => {
      console.log('2. 编译开始');
    });
    
    // 监听编译进行中
    compiler.hooks.compile.tap('LifecyclePlugin', () => {
      console.log('3. 正在编译...');
    });
    
    // 监听编译完成
    compiler.hooks.done.tap('LifecyclePlugin', () => {
      console.log('4. 编译完成');
    });
  }
}

// 输出：
// 1. Plugin 被加载
// 2. 编译开始
// 3. 正在编译...
// 4. 编译完成
```

---

## 🔌 Tapable 事件流机制

Webpack 的 Plugin 系统基于 **Tapable** 库，这是一个强大的事件流控制库。

### 什么是 Tapable？

```javascript
// Tapable 是 Webpack 自己开发的事件库
// 类似于 Node.js 的 EventEmitter，但功能更强大

const { SyncHook } = require('tapable');

// 1. 创建一个 Hook
const myHook = new SyncHook(['arg1', 'arg2']);

// 2. 监听 Hook（tap = 订阅事件）
myHook.tap('Plugin1', (arg1, arg2) => {
  console.log('Plugin1:', arg1, arg2);
});

myHook.tap('Plugin2', (arg1, arg2) => {
  console.log('Plugin2:', arg1, arg2);
});

// 3. 触发 Hook（call = 发布事件）
myHook.call('hello', 'world');

// 输出：
// Plugin1: hello world
// Plugin2: hello world
```

---

### Tapable 的 Hook 类型

Tapable 提供了多种 Hook 类型：

```javascript
const {
  SyncHook,              // 同步串行
  SyncBailHook,          // 同步串行，可中断
  SyncWaterfallHook,     // 同步串行，上一个返回值传给下一个
  SyncLoopHook,          // 同步循环
  
  AsyncParallelHook,     // 异步并行
  AsyncParallelBailHook, // 异步并行，可中断
  AsyncSeriesHook,       // 异步串行
  AsyncSeriesBailHook,   // 异步串行，可中断
  AsyncSeriesWaterfallHook // 异步串行，瀑布流
} = require('tapable');
```

#### 1. SyncHook（同步串行）

```javascript
const { SyncHook } = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['speed'])
    };
  }
  
  start() {
    this.hooks.accelerate.call(100);
  }
}

const car = new Car();

// 注册监听器
car.hooks.accelerate.tap('LogPlugin', (speed) => {
  console.log(`加速到 ${speed} km/h`);
});

car.hooks.accelerate.tap('NotifyPlugin', (speed) => {
  console.log(`通知：当前速度 ${speed}`);
});

car.start();
// 输出：
// 加速到 100 km/h
// 通知：当前速度 100
```

#### 2. SyncBailHook（可中断）

```javascript
const { SyncBailHook } = require('tapable');

const hook = new SyncBailHook(['value']);

hook.tap('Plugin1', (value) => {
  console.log('Plugin1:', value);
  if (value < 0) {
    return true;  // 返回非 undefined 会中断后续执行
  }
});

hook.tap('Plugin2', (value) => {
  console.log('Plugin2:', value);  // 如果 Plugin1 返回了值，这里不会执行
});

hook.call(10);   // 两个都执行
hook.call(-1);   // 只执行 Plugin1

// 输出：
// Plugin1: 10
// Plugin2: 10
// Plugin1: -1  （中断，Plugin2 不执行）
```

#### 3. AsyncSeriesHook（异步串行）

```javascript
const { AsyncSeriesHook } = require('tapable');

const hook = new AsyncSeriesHook(['name']);

// tapAsync：回调风格
hook.tapAsync('Plugin1', (name, callback) => {
  setTimeout(() => {
    console.log('Plugin1:', name);
    callback();  // 必须调用 callback
  }, 1000);
});

// tapPromise：Promise 风格
hook.tapPromise('Plugin2', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Plugin2:', name);
      resolve();
    }, 500);
  });
});

// 调用
hook.callAsync('Webpack', (err) => {
  console.log('所有插件执行完毕');
});

// 输出（按顺序）：
// Plugin1: Webpack  （1秒后）
// Plugin2: Webpack  （1.5秒后）
// 所有插件执行完毕
```

---

### Webpack 中的 Hook 使用

```javascript
class MyPlugin {
  apply(compiler) {
    // 1. 同步 Hook
    compiler.hooks.compile.tap('MyPlugin', (params) => {
      console.log('同步操作');
    });
    
    // 2. 异步 Hook（回调风格）
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('异步操作完成');
        callback();  // 必须调用
      }, 1000);
    });
    
    // 3. 异步 Hook（Promise 风格）
    compiler.hooks.emit.tapPromise('MyPlugin', (compilation) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('异步操作完成');
          resolve();
        }, 1000);
      });
    });
  }
}
```

---

## 🎯 核心概念总结

### 1. Compiler

**Compiler 对象代表完整的 Webpack 配置**，在 Webpack 启动时创建，贯穿整个生命周期。

```javascript
class MyPlugin {
  apply(compiler) {
    // compiler 包含：
    console.log(compiler.options);        // Webpack 配置
    console.log(compiler.inputFileSystem); // 文件系统（读）
    console.log(compiler.outputFileSystem);// 文件系统（写）
    console.log(compiler.hooks);          // 所有 Hooks
  }
}
```

**特点**：
- ✅ 全局唯一
- ✅ 贯穿整个生命周期
- ✅ 包含完整配置
- ✅ 提供文件系统访问

---

### 2. Compilation

**Compilation 对象代表一次编译**，每次文件变化都会创建新的 Compilation。

```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      // compilation 包含：
      console.log(compilation.modules);    // 所有模块
      console.log(compilation.chunks);     // 所有 chunk
      console.log(compilation.assets);     // 所有生成的文件
      console.log(compilation.hooks);      // Compilation 相关的 Hooks
    });
  }
}
```

**特点**：
- ✅ 每次编译创建一次
- ✅ 包含本次编译的所有信息
- ✅ 可以修改编译结果
- ✅ 提供更细粒度的 Hooks

---

### 3. Compiler vs Compilation

```javascript
class ComparePlugin {
  apply(compiler) {
    // Compiler：整个 Webpack 实例
    console.log('Compiler 创建一次');
    
    let compilationCount = 0;
    
    compiler.hooks.compilation.tap('ComparePlugin', (compilation) => {
      // Compilation：每次编译创建
      compilationCount++;
      console.log(`Compilation 创建 ${compilationCount} 次`);
    });
  }
}

// 运行 webpack --watch：
// Compiler 创建一次
// Compilation 创建 1 次  （首次编译）
// Compilation 创建 2 次  （修改文件）
// Compilation 创建 3 次  （再次修改）
// ...
```

**简单记忆**：
- **Compiler** = 整个工厂（固定不变）
- **Compilation** = 每次生产（每次都是新的）

---

## 💡 实际示例

### 示例 1：记录编译时间

```javascript
class BuildTimePlugin {
  apply(compiler) {
    let startTime;
    
    // 编译开始
    compiler.hooks.compile.tap('BuildTimePlugin', () => {
      startTime = Date.now();
      console.log('⏰ 开始编译...');
    });
    
    // 编译完成
    compiler.hooks.done.tap('BuildTimePlugin', (stats) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`✅ 编译完成！耗时: ${duration}ms`);
    });
  }
}

module.exports = BuildTimePlugin;
```

---

### 示例 2：生成文件清单

```javascript
class FileListPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('FileListPlugin', (compilation) => {
      // 获取所有生成的文件
      const fileList = Object.keys(compilation.assets).join('\n');
      
      // 生成文件清单
      const content = `构建时间: ${new Date().toLocaleString()}\n\n文件列表:\n${fileList}`;
      
      // 添加到输出文件
      compilation.assets['filelist.txt'] = {
        source: () => content,
        size: () => content.length
      };
    });
  }
}

module.exports = FileListPlugin;
```

---

### 示例 3：环境变量注入

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify('https://api.example.com'),
      '__VERSION__': JSON.stringify('1.0.0')
    })
  ]
};

// 在代码中使用：
console.log(process.env.NODE_ENV);  // 'production'
console.log(process.env.API_URL);   // 'https://api.example.com'
console.log(__VERSION__);           // '1.0.0'
```

---

## 🎯 面试角度理解

### 面试问题 1：Plugin 和 Loader 有什么区别？

**考察点**：
- 理解两者的本质区别
- 能说出应用场景
- 能举例说明

**标准答案**：

```
从三个维度理解：

1. 本质不同
   - Loader：函数，输入源码，输出转换后的代码
   - Plugin：类，通过监听 Hooks 介入编译过程

2. 作用范围不同
   - Loader：针对单个文件（模块级别）
   - Plugin：针对整个编译过程（全局级别）

3. 能力不同
   - Loader：只能做文件转换（CSS→JS、TS→JS）
   - Plugin：可以做任何事情（生成文件、优化代码、注入变量）

举例：
- 需要把 Sass 转成 CSS？用 Loader（sass-loader）
- 需要自动生成 HTML？用 Plugin（HtmlWebpackPlugin）
```

---

### 面试问题 2：如何实现一个 Plugin？

**考察点**：
- 理解 Plugin 的结构
- 知道如何监听 Hooks
- 能写出基本代码

**标准答案**：

```javascript
// Plugin 必须是一个类或包含 apply 方法的对象
class MyPlugin {
  // 1. 接收配置参数
  constructor(options) {
    this.options = options;
  }
  
  // 2. apply 方法会被 Webpack 调用
  apply(compiler) {
    // 3. 监听特定的 Hook
    compiler.hooks.emit.tap(
      'MyPlugin',  // Plugin 名称
      (compilation) => {
        // 4. 在特定时机执行操作
        console.log('即将生成文件');
      }
    );
  }
}

// 使用
module.exports = {
  plugins: [
    new MyPlugin({ name: 'test' })
  ]
};
```

---

### 面试问题 3：Compiler 和 Compilation 有什么区别？

**考察点**：
- 理解 Webpack 核心对象
- 知道各自的生命周期
- 能说出应用场景

**标准答案**：

```
Compiler：
- 代表整个 Webpack 实例
- 全局唯一，在启动时创建
- 贯穿整个生命周期
- 包含配置、文件系统、Hooks
- 适合做全局性的操作

Compilation：
- 代表一次编译过程
- 每次文件变化都会创建新的 Compilation
- 包含本次编译的所有信息（模块、chunk、资源）
- 适合做编译级别的操作

形象记忆：
- Compiler = 工厂（固定）
- Compilation = 每次生产（每次都新建）
```

---

## 📚 总结

### 核心要点

1. **Plugin 是什么**
   - 扩展 Webpack 功能的类
   - 通过监听 Hooks 介入编译过程
   - 能力远超 Loader

2. **Plugin vs Loader**
   - Loader：文件转换（模块级）
   - Plugin：功能扩展（全局级）

3. **工作原理**
   - 基于 Tapable 事件流
   - 监听 Compiler/Compilation 的 Hooks
   - 在特定时机执行操作

4. **核心对象**
   - Compiler：整个 Webpack 实例
   - Compilation：单次编译过程

### 学习路径

```
理解概念（本文档）
    ↓
学习常用 Plugin
    ↓
理解生命周期和 Hooks
    ↓
手写自定义 Plugin
    ↓
深入 Tapable 源码
```

---

下一步，继续学习：[常用 Plugin 详解](./02-common-plugins.md)

