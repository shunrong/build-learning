# Webpack 生命周期与 Hooks

理解 Webpack 的生命周期是掌握 Plugin 开发的关键。本文档将深入讲解编译流程、核心对象和 Hooks 系统。

---

## 📋 目录

1. [Webpack 编译流程](#webpack-编译流程)
2. [Compiler 对象](#compiler-对象)
3. [Compilation 对象](#compilation-对象)
4. [Compiler Hooks 详解](#compiler-hooks-详解)
5. [Compilation Hooks 详解](#compilation-hooks-详解)
6. [Hook 类型与用法](#hook-类型与用法)
7. [实战示例](#实战示例)

---

## Webpack 编译流程

### 🎯 完整流程图

```
┌─────────────────────────────────────────────────────────┐
│                     初始化阶段                           │
├─────────────────────────────────────────────────────────┤
│  1. 读取配置文件（webpack.config.js）                    │
│  2. 合并默认配置和用户配置                               │
│  3. 创建 Compiler 对象                                  │
│  4. 加载所有 Plugin                                     │
│  5. 调用 Plugin.apply() 注册 Hooks                      │
│  6. 初始化文件系统、输入输出等                            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     编译阶段                             │
├─────────────────────────────────────────────────────────┤
│  7. 触发 compiler.hooks.beforeRun                       │
│  8. 触发 compiler.hooks.run                             │
│  9. 创建 Compilation 对象                               │
│ 10. 触发 compiler.hooks.compilation                     │
│ 11. 触发 compiler.hooks.make（开始编译）                │
│ 12. 从 entry 开始递归解析依赖                            │
│     ├─ 调用 Loader 转换模块                             │
│     ├─ 解析 import/require                              │
│     ├─ 递归处理依赖模块                                  │
│     └─ 生成 AST 和依赖图                                │
│ 13. 触发 compilation.hooks.seal（封装）                 │
│ 14. 优化阶段                                            │
│     ├─ Tree Shaking                                    │
│     ├─ Scope Hoisting                                  │
│     └─ 代码分割（SplitChunks）                          │
│ 15. 生成 chunk                                          │
│ 16. 生成模板代码                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     输出阶段                             │
├─────────────────────────────────────────────────────────┤
│ 17. 触发 compiler.hooks.emit（生成文件前）              │
│ 18. 将 chunk 转换成文件内容                              │
│ 19. 写入文件系统                                         │
│ 20. 触发 compiler.hooks.afterEmit                       │
│ 21. 触发 compiler.hooks.done（编译完成）                │
│ 22. 输出统计信息（stats）                                │
└─────────────────────────────────────────────────────────┘
```

---

### 🔍 核心阶段详解

#### 阶段 1：初始化（Initialization）

```javascript
// 1. Webpack 启动
const webpack = require('webpack');
const config = require('./webpack.config.js');

// 2. 创建 Compiler
const compiler = webpack(config);

// 3. Compiler 做了什么？
class Compiler {
  constructor(context) {
    // 初始化 Hooks
    this.hooks = {
      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),
      emit: new AsyncSeriesHook(['compilation']),
      done: new SyncHook(['stats']),
      //...
    };
    
    // 加载配置
    this.options = {};
    
    // 初始化文件系统
    this.inputFileSystem = new NodeJsInputFileSystem();
    this.outputFileSystem = new NodeJsOutputFileSystem();
  }
}

// 4. 加载插件
config.plugins.forEach(plugin => {
  plugin.apply(compiler);  // 调用每个插件的 apply 方法
});
```

---

#### 阶段 2：编译（Compilation）

```javascript
// 1. 启动编译
compiler.hooks.run.callAsync(compiler, err => {
  // 2. 创建 Compilation
  const compilation = new Compilation(compiler);
  
  // 3. 从入口开始
  compiler.hooks.make.callAsync(compilation, err => {
    // 4. 解析入口文件
    compilation.addEntry(context, entry, name, callback);
    
    // 5. 递归构建模块
    compilation.buildModule(module, err => {
      // 6. 调用 Loader
      const source = runLoaders(module);
      
      // 7. 解析 AST
      const ast = parse(source);
      
      // 8. 提取依赖
      const dependencies = extractDependencies(ast);
      
      // 9. 递归处理依赖
      dependencies.forEach(dep => {
        compilation.buildModule(dep);
      });
    });
  });
});
```

---

#### 阶段 3：优化（Optimization）

```javascript
// 1. 封装（Seal）
compilation.hooks.seal.call();

// 2. 优化模块
compilation.hooks.optimize.call();

// 3. Tree Shaking
compilation.hooks.optimizeModules.call(modules);

// 4. 生成 Chunk
compilation.hooks.optimizeChunks.call(chunks);

// 5. 优化 Chunk
compilation.hooks.optimizeChunkModules.call(chunks, modules);

// 6. Hash 生成
compilation.hooks.beforeHash.call();
compilation.createHash();
compilation.hooks.afterHash.call();
```

---

#### 阶段 4：输出（Emit）

```javascript
// 1. 准备输出
compiler.hooks.emit.callAsync(compilation, err => {
  // 2. 遍历所有 chunk
  for (const chunk of compilation.chunks) {
    // 3. 生成文件内容
    const template = compilation.mainTemplate;
    const source = template.render(chunk);
    
    // 4. 添加到 assets
    compilation.assets[filename] = {
      source: () => source,
      size: () => source.length
    };
  }
  
  // 5. 写入文件系统
  compiler.outputFileSystem.writeFile(filename, content, callback);
  
  // 6. 输出完成
  compiler.hooks.afterEmit.callAsync(compilation, err => {
    compiler.hooks.done.callAsync(stats, err => {
      console.log('编译完成！');
    });
  });
});
```

---

## Compiler 对象

### 🎯 什么是 Compiler？

**Compiler 代表整个 Webpack 环境配置**，在 Webpack 启动时创建，贯穿整个生命周期。

### 核心属性

```javascript
class Compiler {
  // 配置对象
  options: WebpackOptions
  
  // Hooks（生命周期钩子）
  hooks: {
    beforeRun: AsyncSeriesHook,
    run: AsyncSeriesHook,
    compile: SyncHook,
    compilation: SyncHook,
    make: AsyncParallelHook,
    emit: AsyncSeriesHook,
    done: AsyncSeriesHook,
    // ...
  }
  
  // 文件系统
  inputFileSystem: NodeJsInputFileSystem    // 读文件
  outputFileSystem: NodeJsOutputFileSystem  // 写文件
  
  // 当前编译对象
  compilation: Compilation
  
  // 上下文路径
  context: string
  
  // 输出路径
  outputPath: string
}
```

### 常用方法

```javascript
// 1. 运行编译
compiler.run((err, stats) => {
  console.log('编译完成');
});

// 2. 监听模式
compiler.watch(watchOptions, (err, stats) => {
  console.log('文件变化，重新编译');
});

// 3. 停止监听
watching.close(() => {
  console.log('停止监听');
});

// 4. 获取编译统计
compiler.getStats();
```

---

## Compilation 对象

### 🎯 什么是 Compilation？

**Compilation 代表一次编译过程**，每次文件变化都会创建新的 Compilation。

### 核心属性

```javascript
class Compilation {
  // 所有模块
  modules: Set<Module>
  
  // 所有 Chunk
  chunks: Set<Chunk>
  
  // 生成的资源文件
  assets: {
    [filename: string]: {
      source: () => string,
      size: () => number
    }
  }
  
  // 依赖图
  moduleGraph: ModuleGraph
  
  // Hooks
  hooks: {
    buildModule: SyncHook,
    seal: SyncHook,
    optimize: SyncHook,
    optimizeModules: SyncBailHook,
    optimizeChunks: SyncBailHook,
    // ...
  }
  
  // Compiler 引用
  compiler: Compiler
}
```

### 常用方法

```javascript
// 1. 添加模块
compilation.addModule(module);

// 2. 构建模块
compilation.buildModule(module, callback);

// 3. 添加 Chunk
compilation.addChunk(name);

// 4. 创建资源
compilation.emitAsset(filename, source);

// 5. 获取模块
compilation.getModule(dependency);

// 6. 报告错误/警告
compilation.errors.push(new Error('错误'));
compilation.warnings.push(new Error('警告'));
```

---

## Compiler vs Compilation

### 📊 详细对比

| 对比维度 | Compiler | Compilation |
|---------|----------|-------------|
| **生命周期** | 整个 Webpack 生命周期 | 单次编译 |
| **创建时机** | Webpack 启动时 | 每次编译时 |
| **创建次数** | 1 次 | 多次（watch 模式） |
| **作用域** | 全局 | 单次编译 |
| **包含内容** | 配置、文件系统、Hooks | 模块、Chunk、资源 |
| **适用场景** | 全局性操作 | 编译级操作 |

### 实际示例

```javascript
class ExamplePlugin {
  apply(compiler) {
    console.log('Compiler 创建：只打印 1 次');
    
    let compilationCount = 0;
    
    // Compiler Hook：全局事件
    compiler.hooks.run.tap('ExamplePlugin', () => {
      console.log('开始编译（只在 run 时触发）');
    });
    
    // 获取 Compilation
    compiler.hooks.compilation.tap('ExamplePlugin', (compilation) => {
      compilationCount++;
      console.log(`Compilation 创建：第 ${compilationCount} 次`);
      
      // Compilation Hook：编译事件
      compilation.hooks.seal.tap('ExamplePlugin', () => {
        console.log(`封装阶段（每次编译都触发）`);
        console.log(`模块数量：${compilation.modules.size}`);
        console.log(`Chunk 数量：${compilation.chunks.size}`);
      });
    });
  }
}

// 运行 webpack --watch：
// Compiler 创建：只打印 1 次
// 开始编译（只在 run 时触发）
// Compilation 创建：第 1 次
// 封装阶段（每次编译都触发）
// 模块数量：150
// Chunk 数量：3
// 
// [修改文件]
// Compilation 创建：第 2 次  ← 新的 Compilation
// 封装阶段（每次编译都触发）
// 模块数量：151
// Chunk 数量：3
```

---

## Compiler Hooks 详解

### 🎯 完整的 Hooks 列表

```javascript
compiler.hooks = {
  // === 初始化阶段 ===
  environment: new SyncHook([]),
  afterEnvironment: new SyncHook([]),
  entryOption: new SyncBailHook(['context', 'entry']),
  afterPlugins: new SyncHook(['compiler']),
  afterResolvers: new SyncHook(['compiler']),
  
  // === 编译前 ===
  beforeRun: new AsyncSeriesHook(['compiler']),
  run: new AsyncSeriesHook(['compiler']),
  
  // === 编译中 ===
  watchRun: new AsyncSeriesHook(['compiler']),
  normalModuleFactory: new SyncHook(['normalModuleFactory']),
  contextModuleFactory: new SyncHook(['contextModuleFactory']),
  
  beforeCompile: new AsyncSeriesHook(['params']),
  compile: new SyncHook(['params']),
  thisCompilation: new SyncHook(['compilation', 'params']),
  compilation: new SyncHook(['compilation', 'params']),
  make: new AsyncParallelHook(['compilation']),
  
  // === 编译后 ===
  afterCompile: new AsyncSeriesHook(['compilation']),
  
  // === 输出前 ===
  shouldEmit: new SyncBailHook(['compilation']),
  emit: new AsyncSeriesHook(['compilation']),
  afterEmit: new AsyncSeriesHook(['compilation']),
  
  // === 完成 ===
  assetEmitted: new AsyncSeriesHook(['file', 'info']),
  done: new AsyncSeriesHook(['stats']),
  failed: new SyncHook(['error']),
  invalid: new SyncHook(['filename', 'changeTime']),
  
  // === 监听 ===
  watchClose: new SyncHook([])
};
```

---

### 常用 Compiler Hooks

#### 1. beforeRun / run

**时机**：编译开始之前 / 开始

```javascript
compiler.hooks.beforeRun.tapAsync('MyPlugin', (compiler, callback) => {
  console.log('准备开始编译...');
  // 可以做一些准备工作：清理文件、检查环境等
  callback();
});

compiler.hooks.run.tapAsync('MyPlugin', (compiler, callback) => {
  console.log('开始编译！');
  callback();
});
```

---

#### 2. compilation

**时机**：Compilation 对象创建完成

**用途**：获取 Compilation，注册 Compilation Hooks

```javascript
compiler.hooks.compilation.tap('MyPlugin', (compilation, compilationParams) => {
  console.log('Compilation 创建完成');
  
  // 可以访问 compilation
  console.log('模块数量：', compilation.modules.size);
  
  // 注册 Compilation Hooks
  compilation.hooks.optimize.tap('MyPlugin', () => {
    console.log('开始优化');
  });
});
```

---

#### 3. make

**时机**：从 entry 开始递归分析依赖

**用途**：添加额外的入口

```javascript
compiler.hooks.make.tapAsync('MyPlugin', (compilation, callback) => {
  // 添加额外的入口
  compilation.addEntry(
    context,
    entryDependency,
    'extra-entry',
    callback
  );
});
```

---

#### 4. emit

**时机**：生成资源到 output 目录之前

**用途**：**最常用**，修改/添加/删除资源文件

```javascript
compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
  // 遍历所有生成的文件
  for (const filename in compilation.assets) {
    if (filename.endsWith('.js')) {
      // 获取文件内容
      const content = compilation.assets[filename].source();
      
      // 修改内容
      const newContent = `/* Modified */\n${content}`;
      
      // 更新文件
      compilation.assets[filename] = {
        source: () => newContent,
        size: () => newContent.length
      };
    }
  }
  
  // 添加新文件
  compilation.assets['filelist.txt'] = {
    source: () => Object.keys(compilation.assets).join('\n'),
    size: () => Object.keys(compilation.assets).join('\n').length
  };
  
  callback();
});
```

---

#### 5. afterEmit

**时机**：资源输出到目录之后

**用途**：上传文件、发送通知

```javascript
compiler.hooks.afterEmit.tapAsync('MyPlugin', (compilation, callback) => {
  console.log('文件已输出');
  
  // 上传到 CDN
  uploadToCDN(compilation.assets).then(() => {
    callback();
  });
});
```

---

#### 6. done

**时机**：编译完成

**用途**：输出统计信息、发送通知

```javascript
compiler.hooks.done.tap('MyPlugin', (stats) => {
  const info = stats.toJson();
  
  console.log('编译完成！');
  console.log('耗时：', info.time, 'ms');
  console.log('模块数：', info.modules.length);
  console.log('Chunk 数：', info.chunks.length);
  console.log('资源数：', info.assets.length);
  
  if (stats.hasErrors()) {
    console.error('编译出错：', info.errors);
  }
  
  if (stats.hasWarnings()) {
    console.warn('编译警告：', info.warnings);
  }
});
```

---

#### 7. failed

**时机**：编译失败

```javascript
compiler.hooks.failed.tap('MyPlugin', (error) => {
  console.error('编译失败：', error);
  // 发送错误通知
});
```

---

## Compilation Hooks 详解

### 🎯 常用 Compilation Hooks

```javascript
compilation.hooks = {
  // === 构建模块 ===
  buildModule: new SyncHook(['module']),
  rebuildModule: new SyncHook(['module']),
  failedModule: new SyncHook(['module', 'error']),
  succeedModule: new SyncHook(['module']),
  
  // === 优化阶段 ===
  seal: new SyncHook([]),
  optimize: new SyncHook([]),
  optimizeModules: new SyncBailHook(['modules']),
  afterOptimizeModules: new SyncHook(['modules']),
  
  optimizeChunks: new SyncBailHook(['chunks', 'chunkGroups']),
  afterOptimizeChunks: new SyncHook(['chunks', 'chunkGroups']),
  
  optimizeTree: new AsyncSeriesHook(['chunks', 'modules']),
  optimizeChunkModules: new AsyncSeriesBailHook(['chunks', 'modules']),
  
  // === 资源处理 ===
  processAssets: new AsyncSeriesHook(['assets']),
  afterProcessAssets: new SyncHook(['assets']),
  
  // === Hash ===
  beforeHash: new SyncHook([]),
  afterHash: new SyncHook([]),
  
  // === 完成 ===
  record: new SyncHook(['compilation', 'records']),
  afterSeal: new AsyncSeriesHook([])
};
```

---

### 实战示例

#### 示例 1：监听模块构建

```javascript
compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
  compilation.hooks.buildModule.tap('MyPlugin', (module) => {
    console.log('开始构建模块：', module.resource);
  });
  
  compilation.hooks.succeedModule.tap('MyPlugin', (module) => {
    console.log('模块构建成功：', module.resource);
  });
  
  compilation.hooks.failedModule.tap('MyPlugin', (module, error) => {
    console.error('模块构建失败：', module.resource, error);
  });
});
```

---

#### 示例 2：优化阶段操作

```javascript
compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
  compilation.hooks.optimize.tap('MyPlugin', () => {
    console.log('开始优化');
  });
  
  compilation.hooks.optimizeModules.tap('MyPlugin', (modules) => {
    console.log('优化模块：', modules.size, '个');
    // 可以添加/删除/修改模块
  });
  
  compilation.hooks.optimizeChunks.tap('MyPlugin', (chunks) => {
    console.log('优化 Chunk：', chunks.size, '个');
    // 可以合并/拆分 chunk
  });
});
```

---

#### 示例 3：处理资源（Webpack 5）

```javascript
compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
  compilation.hooks.processAssets.tapAsync(
    {
      name: 'MyPlugin',
      stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
    },
    (assets, callback) => {
      // 遍历所有资源
      for (const name in assets) {
        const asset = assets[name];
        const content = asset.source();
        
        // 修改内容
        const newContent = content.replace(/console\.log/g, '');
        
        // 更新资源
        compilation.updateAsset(name, new RawSource(newContent));
      }
      
      callback();
    }
  );
});
```

---

## Hook 类型与用法

### 🎯 Hook 类型总览

```javascript
const {
  SyncHook,                 // 同步串行
  SyncBailHook,             // 同步串行（可中断）
  SyncWaterfallHook,        // 同步串行（瀑布）
  SyncLoopHook,             // 同步循环
  
  AsyncParallelHook,        // 异步并行
  AsyncParallelBailHook,    // 异步并行（可中断）
  AsyncSeriesHook,          // 异步串行
  AsyncSeriesBailHook,      // 异步串行（可中断）
  AsyncSeriesWaterfallHook, // 异步串行（瀑布）
  AsyncSeriesLoopHook       // 异步串行（循环）
} = require('tapable');
```

---

### 使用方法

#### 1. tap（同步）

```javascript
// 适用于所有 Hook
compiler.hooks.compile.tap('MyPlugin', (params) => {
  console.log('同步操作');
});
```

---

#### 2. tapAsync（异步回调）

```javascript
// 适用于 Async 开头的 Hook
compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
  setTimeout(() => {
    console.log('异步操作完成');
    callback();  // 必须调用 callback
  }, 1000);
});
```

---

#### 3. tapPromise（异步 Promise）

```javascript
// 适用于 Async 开头的 Hook
compiler.hooks.emit.tapPromise('MyPlugin', (compilation) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('异步操作完成');
      resolve();
    }, 1000);
  });
});
```

---

### Hook 选择指南

```
需要按顺序执行？
├─ 是
│  ├─ 需要异步操作？
│  │  ├─ 是 → AsyncSeriesHook
│  │  └─ 否 → SyncHook
│  └─ 需要传递返回值？
│     └─ 是 → SyncWaterfallHook / AsyncSeriesWaterfallHook
│
└─ 否（可以并行）
   └─ AsyncParallelHook

需要中断后续执行？
└─ 使用 Bail 类型（SyncBailHook / AsyncSeriesBailHook）
```

---

## 实战示例

### 示例 1：完整的生命周期监听

```javascript
class LifecyclePlugin {
  apply(compiler) {
    console.log('\n========== Webpack 编译开始 ==========\n');
    
    // 1. 初始化
    compiler.hooks.environment.tap('LifecyclePlugin', () => {
      console.log('1. environment - 环境准备');
    });
    
    compiler.hooks.afterEnvironment.tap('LifecyclePlugin', () => {
      console.log('2. afterEnvironment - 环境准备完成');
    });
    
    compiler.hooks.afterPlugins.tap('LifecyclePlugin', () => {
      console.log('3. afterPlugins - 插件加载完成');
    });
    
    // 2. 编译前
    compiler.hooks.beforeRun.tapAsync('LifecyclePlugin', (compiler, callback) => {
      console.log('4. beforeRun - 准备编译');
      callback();
    });
    
    compiler.hooks.run.tapAsync('LifecyclePlugin', (compiler, callback) => {
      console.log('5. run - 开始编译');
      callback();
    });
    
    // 3. 编译中
    compiler.hooks.beforeCompile.tapAsync('LifecyclePlugin', (params, callback) => {
      console.log('6. beforeCompile - 编译准备');
      callback();
    });
    
    compiler.hooks.compile.tap('LifecyclePlugin', () => {
      console.log('7. compile - 编译中');
    });
    
    compiler.hooks.thisCompilation.tap('LifecyclePlugin', (compilation) => {
      console.log('8. thisCompilation - Compilation 创建');
    });
    
    compiler.hooks.compilation.tap('LifecyclePlugin', (compilation) => {
      console.log('9. compilation - Compilation 完成');
      
      // Compilation Hooks
      compilation.hooks.buildModule.tap('LifecyclePlugin', (module) => {
        console.log('   └─ buildModule:', module.resource);
      });
      
      compilation.hooks.seal.tap('LifecyclePlugin', () => {
        console.log('10. seal - 封装开始');
      });
      
      compilation.hooks.optimize.tap('LifecyclePlugin', () => {
        console.log('11. optimize - 优化开始');
      });
    });
    
    compiler.hooks.make.tapAsync('LifecyclePlugin', (compilation, callback) => {
      console.log('12. make - 开始构建模块');
      callback();
    });
    
    compiler.hooks.afterCompile.tapAsync('LifecyclePlugin', (compilation, callback) => {
      console.log('13. afterCompile - 编译完成');
      callback();
    });
    
    // 4. 输出
    compiler.hooks.shouldEmit.tap('LifecyclePlugin', (compilation) => {
      console.log('14. shouldEmit - 检查是否需要输出');
      return true;
    });
    
    compiler.hooks.emit.tapAsync('LifecyclePlugin', (compilation, callback) => {
      console.log('15. emit - 输出资源');
      console.log(`    资源数量: ${Object.keys(compilation.assets).length}`);
      callback();
    });
    
    compiler.hooks.afterEmit.tapAsync('LifecyclePlugin', (compilation, callback) => {
      console.log('16. afterEmit - 输出完成');
      callback();
    });
    
    // 5. 完成
    compiler.hooks.done.tap('LifecyclePlugin', (stats) => {
      const info = stats.toJson();
      console.log('17. done - 全部完成');
      console.log(`    耗时: ${info.time}ms`);
      console.log(`    模块数: ${info.modules.length}`);
      console.log(`    Chunk 数: ${info.chunks.length}`);
      console.log('\n========== Webpack 编译结束 ==========\n');
    });
    
    // 6. 失败
    compiler.hooks.failed.tap('LifecyclePlugin', (error) => {
      console.error('❌ failed - 编译失败:', error);
    });
  }
}

module.exports = LifecyclePlugin;
```

---

### 示例 2：统计构建时间

```javascript
class BuildTimePlugin {
  apply(compiler) {
    const times = {};
    
    compiler.hooks.compile.tap('BuildTimePlugin', () => {
      times.start = Date.now();
    });
    
    compiler.hooks.emit.tap('BuildTimePlugin', () => {
      times.emit = Date.now();
    });
    
    compiler.hooks.done.tap('BuildTimePlugin', () => {
      times.done = Date.now();
      
      console.log('\n⏱️  构建时间统计：');
      console.log(`总耗时: ${times.done - times.start}ms`);
      console.log(`编译阶段: ${times.emit - times.start}ms`);
      console.log(`输出阶段: ${times.done - times.emit}ms`);
    });
  }
}
```

---

## 📚 总结

### 核心要点

1. **Webpack 编译流程**
   - 初始化 → 编译 → 优化 → 输出
   - 理解每个阶段的作用

2. **Compiler vs Compilation**
   - Compiler：全局唯一，整个生命周期
   - Compilation：每次编译创建，包含编译信息

3. **常用 Hooks**
   - `compiler.hooks.compilation` - 获取 Compilation
   - `compiler.hooks.emit` - 修改资源（最常用）
   - `compiler.hooks.done` - 编译完成
   - `compilation.hooks.seal` - 优化阶段
   - `compilation.hooks.processAssets` - 处理资源（Webpack 5）

4. **Hook 类型**
   - 同步：SyncHook（tap）
   - 异步：AsyncSeriesHook（tapAsync / tapPromise）
   - 中断：BailHook

### 学习建议

1. **先理解流程**：知道编译经历哪些阶段
2. **再学习对象**：理解 Compiler 和 Compilation 的区别
3. **然后实践 Hooks**：从简单的 Hook 开始
4. **最后综合应用**：结合多个 Hook 实现复杂功能

---

下一步，继续学习：[手写自定义 Plugin](./04-custom-plugin.md)

