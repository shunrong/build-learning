# Phase 04: Plugin 机制深入

## 🎯 学习目标

通过这个阶段，你将：
1. **理解 Plugin 的本质和工作原理**
2. **掌握 Webpack 的生命周期和 Hooks 系统**
3. **学会使用常用的 Plugin**
4. **理解 Loader vs Plugin 的区别**
5. **能够手写自定义 Plugin**
6. **理解 Tapable 事件流机制**

## 📚 学习路径

```
理论学习（3-4小时）
    ↓
1. 阅读 docs/01-plugin-concept.md          (60分钟) - Plugin 概念
2. 阅读 docs/02-common-plugins.md          (60分钟) - 常用 Plugin
3. 阅读 docs/03-webpack-lifecycle.md       (60分钟) - 生命周期
4. 阅读 docs/04-custom-plugin.md           (60分钟) - 自定义 Plugin
    ↓
实践体验（4-5小时）
    ↓
5. 运行 demos/01-common-plugins/           (1小时) - 常用 Plugin
6. 运行 demos/02-lifecycle-demo/           (1.5小时) - 生命周期
7. 运行 demos/03-custom-plugins/           (2小时) - 自定义 Plugin
    ↓
深入实践（3-4小时）
    ↓
8. 修改配置，观察效果                         (1小时)
9. 实现自己的 Plugin                         (2-3小时)
    ↓
总结反思（30分钟）
    ↓
10. 总结 Plugin 的核心原理和最佳实践
```

## 📖 文档列表

### 1. [Plugin 概念详解](./01-plugin-concept.md)
- Plugin 是什么？为什么需要它？
- Plugin vs Loader 的区别
- Plugin 的工作原理
- Tapable 事件流机制

### 2. [常用 Plugin 详解](./02-common-plugins.md)
- HtmlWebpackPlugin：生成 HTML
- MiniCssExtractPlugin：提取 CSS
- CleanWebpackPlugin：清理输出目录
- CopyWebpackPlugin：复制静态资源
- DefinePlugin：定义全局常量
- ProvidePlugin：自动加载模块
- BundleAnalyzerPlugin：分析打包产物

### 3. [Webpack 生命周期与 Hooks](./03-webpack-lifecycle.md)
- Webpack 编译流程详解
- Compiler 和 Compilation 对象
- 常用 Hooks 及其触发时机
- 同步 Hook vs 异步 Hook
- Hook 的类型（SyncHook/AsyncSeriesHook 等）

### 4. [手写自定义 Plugin](./04-custom-plugin.md)
- Plugin 的基本结构
- apply 方法详解
- 如何监听 Hooks
- 如何修改编译产物
- 异步 Plugin 实现
- Plugin 调试技巧

## 🎮 Demo 列表

### Demo 1: [常用 Plugin 使用](../demos/01-common-plugins/)
**场景**：使用主流 Plugin 构建完整的前端项目

**核心内容**：
- ✅ HtmlWebpackPlugin：自动生成 HTML
- ✅ MiniCssExtractPlugin：提取 CSS
- ✅ CopyWebpackPlugin：复制静态资源
- ✅ DefinePlugin：环境变量注入
- ✅ BundleAnalyzerPlugin：打包分析

**运行方式**：
```bash
cd demos/01-common-plugins
npm install
npm run dev      # 开发模式
npm run build    # 生产模式
npm run analyze  # 分析打包
```

---

### Demo 2: [生命周期演示](../demos/02-lifecycle-demo/)
**场景**：通过自定义 Plugin 理解 Webpack 编译流程

**核心内容**：
- ✅ Compiler Hooks 演示
- ✅ Compilation Hooks 演示
- ✅ 各个阶段的执行顺序
- ✅ Hook 类型演示（同步/异步）
- ✅ 打印完整生命周期日志

**运行方式**：
```bash
cd demos/02-lifecycle-demo
npm install
npm run build    # 观察生命周期日志
```

---

### Demo 3: [自定义 Plugin 实现](../demos/03-custom-plugins/)
**场景**：实现多个实用的自定义 Plugin

**核心内容**：
- ✅ FileListPlugin：生成文件清单
- ✅ InjectVersionPlugin：注入版本信息
- ✅ RemoveCommentsPlugin：移除注释
- ✅ CompressAssetsPlugin：自定义压缩
- ✅ 异步 Plugin 实现

**运行方式**：
```bash
cd demos/03-custom-plugins
npm install
npm run build
```

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 能解释 Plugin 是什么，工作原理
- [ ] 能说出 Plugin 和 Loader 的区别
- [ ] 能画出 Webpack 编译流程图
- [ ] 能说出常用 Hooks 的触发时机
- [ ] 能解释 Tapable 事件流机制

### 实践层面
- [ ] 能配置常用的 Plugin
- [ ] 能根据需求选择合适的 Plugin
- [ ] 能手写一个简单的 Plugin
- [ ] 能调试 Plugin 的执行过程
- [ ] 能修改编译产物

### 面试层面
能够清晰回答以下面试问题：

1. **Plugin 是什么？为什么需要 Plugin？**
2. **Plugin 和 Loader 有什么区别？**
3. **如何实现一个自定义 Plugin？**
4. **Webpack 的编译流程是怎样的？**
5. **Compiler 和 Compilation 有什么区别？**
6. **常用的 Plugin Hooks 有哪些？**
7. **同步 Hook 和异步 Hook 有什么区别？**

## 🎯 核心知识点

### 1. Plugin 的本质

```javascript
// Plugin 本质上是一个类（或包含 apply 方法的对象）
class MyPlugin {
  apply(compiler) {
    // compiler 是 Webpack 的核心对象
    // 通过 compiler.hooks 可以监听各种事件
    compiler.hooks.emit.tapAsync(
      'MyPlugin',
      (compilation, callback) => {
        // 在生成文件之前执行
        console.log('即将生成打包文件！');
        callback();
      }
    );
  }
}

module.exports = MyPlugin;
```

**核心概念**：
- Plugin 是一个类或包含 `apply` 方法的对象
- `apply` 方法会被 Webpack 调用，传入 `compiler` 对象
- 通过监听 `compiler.hooks` 来介入编译过程
- 基于 Tapable 事件流机制

---

### 2. Loader vs Plugin

| 对比维度 | Loader | Plugin |
|---------|--------|--------|
| **本质** | 函数 | 类（包含 apply 方法）|
| **作用范围** | 单个文件 | 整个编译过程 |
| **执行时机** | 模块转换阶段 | 整个生命周期 |
| **能力** | 文件转换 | 功能扩展、产物优化 |
| **配置位置** | `module.rules` | `plugins` 数组 |

**简单记忆**：
- Loader：**转换**单个文件（文件 → 文件）
- Plugin：**扩展** Webpack 功能（监听事件，执行操作）

---

### 3. Webpack 编译流程（简化版）

```
初始化阶段
    ↓
① 创建 Compiler 对象
    ↓
② 加载配置和插件
    ↓
③ 执行 compiler.run()
    ↓
编译阶段
    ↓
④ 创建 Compilation 对象
    ↓
⑤ 从 entry 开始递归解析模块
    ↓
⑥ 调用 Loader 转换模块
    ↓
⑦ 生成依赖图
    ↓
输出阶段
    ↓
⑧ 根据依赖图生成 chunk
    ↓
⑨ 将 chunk 转换成文件
    ↓
⑩ 写入文件系统
```

**关键对象**：
- **Compiler**：贯穿整个 Webpack 生命周期，代表整个构建过程
- **Compilation**：每次编译创建一次，代表一次编译过程

---

### 4. 常用 Plugin 速查

| Plugin | 作用 | 配置 |
|--------|------|------|
| **HtmlWebpackPlugin** | 生成 HTML 文件 | `new HtmlWebpackPlugin({ template: './index.html' })` |
| **MiniCssExtractPlugin** | 提取 CSS 到独立文件 | `new MiniCssExtractPlugin({ filename: '[name].css' })` |
| **CleanWebpackPlugin** | 清理输出目录 | `new CleanWebpackPlugin()` |
| **CopyWebpackPlugin** | 复制静态资源 | `new CopyWebpackPlugin({ patterns: [...] })` |
| **DefinePlugin** | 定义全局常量 | `new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })` |
| **ProvidePlugin** | 自动加载模块 | `new webpack.ProvidePlugin({ $: 'jquery' })` |
| **BundleAnalyzerPlugin** | 分析打包产物 | `new BundleAnalyzerPlugin()` |

---

### 5. 常用 Compiler Hooks

```javascript
compiler.hooks.entryOption        // 读取 entry 配置
compiler.hooks.beforeRun          // 运行之前
compiler.hooks.run                // 开始编译
compiler.hooks.compile            // 创建 compilation 之前
compiler.hooks.compilation        // compilation 创建完成
compiler.hooks.make               // 从 entry 开始递归分析依赖
compiler.hooks.emit               // 生成资源到 output 目录之前
compiler.hooks.afterEmit          // 生成资源到 output 目录之后
compiler.hooks.done               // 编译完成
```

---

### 6. 常用 Compilation Hooks

```javascript
compilation.hooks.buildModule     // 构建模块之前
compilation.hooks.succeedModule   // 模块构建成功
compilation.hooks.seal            // 优化开始之前
compilation.hooks.optimize        // 优化阶段
compilation.hooks.optimizeChunks  // 优化 chunk
compilation.hooks.optimizeAssets  // 优化资源
```

---

## 💡 学习建议

### 1. 循序渐进
- 先理解 Plugin 的概念和必要性
- 再学习常用 Plugin 的使用
- 然后理解 Webpack 生命周期
- 最后尝试手写 Plugin

### 2. 对比学习
- 对比 Loader 和 Plugin
- 对比 Compiler 和 Compilation
- 对比同步 Hook 和异步 Hook
- 对比不同 Plugin 的实现方式

### 3. 动手实践
- 每个 Demo 都要亲自运行
- 尝试修改 Plugin 配置
- 观察输出结果的变化
- 理解每个 Plugin 的作用

### 4. 深入原理
- 阅读 Webpack 源码（从简单的开始）
- 理解 Tapable 事件流
- 实现自己的 Plugin
- 调试 Plugin 的执行过程

---

## 🎯 实战技巧

### 1. Plugin 的基本结构

```javascript
class MyPlugin {
  constructor(options) {
    // 接收配置参数
    this.options = options;
  }
  
  apply(compiler) {
    // 监听 Hooks
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在生成文件之前执行
      console.log('MyPlugin is running!');
    });
  }
}

module.exports = MyPlugin;
```

### 2. 异步 Plugin

```javascript
class AsyncPlugin {
  apply(compiler) {
    // tapAsync：回调风格
    compiler.hooks.emit.tapAsync('AsyncPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('异步操作完成');
        callback();  // 必须调用 callback
      }, 1000);
    });
    
    // tapPromise：Promise 风格
    compiler.hooks.emit.tapPromise('AsyncPlugin', (compilation) => {
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

### 3. 修改编译产物

```javascript
class ModifyAssetsPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('ModifyAssetsPlugin', (compilation) => {
      // 遍历所有生成的文件
      for (const filename in compilation.assets) {
        if (filename.endsWith('.js')) {
          // 获取文件内容
          const content = compilation.assets[filename].source();
          
          // 修改内容
          const newContent = `/** Modified by Plugin */\n${content}`;
          
          // 更新文件
          compilation.assets[filename] = {
            source: () => newContent,
            size: () => newContent.length
          };
        }
      }
    });
  }
}
```

---

## 📝 预计学习时间

- **快速模式**：6 小时（理论 + 运行 Demo）
- **标准模式**：12 小时（深入学习 + 实践 + 总结）
- **深入模式**：3-4 天（研究源码 + 手写 Plugin + 扩展）

选择适合自己的节奏，重要的是理解透彻。

---

## 🎯 下一步

完成 Phase 04 后，继续学习：
- **Phase 05**: 开发服务器 - webpack-dev-server 深入
- **Phase 06**: JavaScript 工程化 - Babel/Polyfill/SourceMap

---

## 💡 常见问题预告

### Q1: Plugin 和 Loader 有什么区别？
→ 在 `01-plugin-concept.md` 中详细对比

### Q2: 如何调试 Plugin？
→ 在 `04-custom-plugin.md` 中实践演示

### Q3: Compiler 和 Compilation 有什么区别？
→ 在 `03-webpack-lifecycle.md` 中详细说明

### Q4: 如何选择合适的 Hook？
→ 在 `03-webpack-lifecycle.md` 中提供决策树

准备好了吗？开始你的 Plugin 学习之旅！🚀

