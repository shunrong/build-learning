# Demo 2: Webpack 生命周期演示

通过自定义 Plugin 演示 Webpack 完整的编译生命周期。

---

## 🎯 学习目标

- 理解 Webpack 的完整编译流程
- 掌握 Compiler 和 Compilation Hooks 的触发顺序
- 学会在不同阶段介入编译过程
- 理解同步和异步 Hooks 的使用

---

## 🚀 运行方式

### 1. 安装依赖

```bash
npm install
```

### 2. 运行构建

```bash
npm run build
```

**观察控制台输出**，会看到完整的生命周期日志。

---

## 📊 生命周期流程

### 1. 初始化阶段

```
✅ environment           - 环境准备
✅ afterEnvironment      - 环境准备完成
✅ entryOption          - 读取入口配置
✅ afterPlugins         - 插件加载完成
✅ afterResolvers       - 解析器准备完成
```

### 2. 编译前

```
🚀 beforeRun            - 准备开始编译
🚀 run                  - 开始编译
```

### 3. 编译中

```
⚙️  beforeCompile        - 编译准备
⚙️  compile              - 开始编译
📦 thisCompilation      - Compilation 对象创建
📦 compilation          - Compilation 准备完成
🏗️  make                 - 开始构建模块树
   └─ buildModule       - 构建各个模块
🔒 seal                 - 封装阶段开始
🎯 optimize             - 优化阶段
   └─ optimizeModules   - 优化模块
   └─ optimizeChunks    - 优化 Chunk
   └─ beforeHash        - Hash 生成前
   └─ afterHash         - Hash 生成完成
🔒 afterSeal            - 封装完成
✅ afterCompile         - 编译完成
```

### 4. 输出阶段

```
🤔 shouldEmit           - 检查是否需要输出
📝 emit                 - 输出资源文件
✅ afterEmit            - 资源输出完成
```

### 5. 完成

```
🎉 done                 - 编译全部完成
```

---

## 🔍 核心 Hooks 详解

### Compiler Hooks

| Hook | 类型 | 时机 | 用途 |
|------|------|------|------|
| `environment` | Sync | 最开始 | 环境准备 |
| `beforeRun` | Async | 编译前 | 准备工作 |
| `run` | Async | 编译开始 | 开始编译 |
| `compilation` | Sync | Compilation 创建 | 获取 Compilation |
| `make` | Async | 构建模块 | 构建入口 |
| `emit` | Async | 输出前 | **最常用**，修改资源 |
| `done` | Async | 完成 | 输出统计 |

### Compilation Hooks

| Hook | 类型 | 时机 | 用途 |
|------|------|------|------|
| `buildModule` | Sync | 构建模块 | 监听模块构建 |
| `seal` | Sync | 封装开始 | 优化前 |
| `optimize` | Sync | 优化 | 优化阶段 |
| `optimizeModules` | SyncBail | 优化模块 | 模块优化 |
| `optimizeChunks` | SyncBail | 优化 Chunk | Chunk 优化 |
| `afterHash` | Sync | Hash 生成后 | 获取 Hash |

---

## 💡 实战要点

### 1. Hook 的注册方式

```javascript
// 同步 Hook
compiler.hooks.compile.tap('PluginName', () => {
  console.log('同步操作');
});

// 异步 Hook（回调）
compiler.hooks.emit.tapAsync('PluginName', (compilation, callback) => {
  console.log('异步操作');
  callback();  // 必须调用
});

// 异步 Hook（Promise）
compiler.hooks.emit.tapPromise('PluginName', (compilation) => {
  return new Promise((resolve) => {
    console.log('异步操作');
    resolve();
  });
});
```

### 2. 获取 Compilation

```javascript
compiler.hooks.compilation.tap('PluginName', (compilation) => {
  // 现在可以访问 compilation
  console.log('模块数:', compilation.modules.size);
  
  // 注册 Compilation Hooks
  compilation.hooks.seal.tap('PluginName', () => {
    console.log('封装开始');
  });
});
```

### 3. 常用时机选择

```javascript
// ✅ 修改配置 → beforeRun
compiler.hooks.beforeRun.tapAsync('Plugin', (compiler, callback) => {
  // 修改 compiler.options
  callback();
});

// ✅ 添加入口 → make
compiler.hooks.make.tapAsync('Plugin', (compilation, callback) => {
  compilation.addEntry(/*...*/);
  callback();
});

// ✅ 修改资源 → emit
compiler.hooks.emit.tapAsync('Plugin', (compilation, callback) => {
  // 修改 compilation.assets
  callback();
});

// ✅ 输出统计 → done
compiler.hooks.done.tap('Plugin', (stats) => {
  console.log('耗时:', stats.toJson().time);
});
```

---

## 📄 输出文件

运行后会生成：

```
dist/
├── index.html
├── main.abc12345.js
└── lifecycle-log.txt    ← 完整的生命周期日志
```

打开 `lifecycle-log.txt` 查看详细的生命周期记录。

---

## 🎯 实验建议

### 实验 1：修改 LifecyclePlugin

尝试添加更多 Hooks：

```javascript
compiler.hooks.watchRun.tapAsync('LifecyclePlugin', (compiler, callback) => {
  console.log('watch 模式运行');
  callback();
});
```

### 实验 2：在不同阶段修改编译

```javascript
// 在 emit 阶段添加文件
compiler.hooks.emit.tap('Plugin', (compilation) => {
  compilation.assets['custom.txt'] = {
    source: () => 'Custom content',
    size: () => 14
  };
});
```

### 实验 3：统计模块信息

```javascript
compilation.hooks.seal.tap('Plugin', () => {
  const modules = Array.from(compilation.modules);
  modules.forEach(module => {
    console.log('模块:', module.resource);
  });
});
```

---

## 📚 相关文档

- [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/)
- [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)
- [Tapable](https://github.com/webpack/tapable)

---

**继续学习**：[Demo 3: 自定义 Plugin 实现](../03-custom-plugins/)

