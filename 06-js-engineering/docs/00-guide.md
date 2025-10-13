# Phase 06: JavaScript 工程化

## 🎯 学习目标

通过这个阶段，你将：
1. **掌握 Babel 的配置和使用**
2. **理解不同 Polyfill 方案的优劣**
3. **深入理解 Source Map 的工作原理**
4. **掌握现代 JavaScript 模块化方案**
5. **配置生产级的 JS 工程化方案**

---

## 📚 学习路径

```
理论学习（4-5小时）
    ↓
1. 阅读 docs/01-babel-core.md              (60分钟) - Babel 核心概念
2. 阅读 docs/02-polyfill-solutions.md      (60分钟) - Polyfill 方案
3. 阅读 docs/03-source-map.md              (45分钟) - Source Map 原理
4. 阅读 docs/04-module-systems.md          (60分钟) - 模块化方案
    ↓
实践体验（5-6小时）
    ↓
5. 运行 demos/01-babel-basics/             (1-1.5小时)
6. 运行 demos/02-polyfill-demo/            (1-1.5小时)
7. 运行 demos/03-sourcemap-demo/           (1小时)
8. 运行 demos/04-module-best-practice/     (1-1.5小时)
    ↓
深入实践（3-4小时）
    ↓
9. 配置自己的 Babel 方案                    (1-2小时)
10. 对比不同 Polyfill 方案                  (1小时)
11. 调试 Source Map                        (1小时)
    ↓
总结反思（30分钟）
    ↓
12. 总结 JS 工程化的配置技巧和最佳实践
```

---

## 📖 文档列表

### 1. [Babel 核心概念](./01-babel-core.md)
- 什么是 Babel？为什么需要它？
- Babel 的工作原理（Parser → Transform → Generate）
- preset vs plugin
- @babel/preset-env 详解
- browserslist 配置
- Babel 配置文件（.babelrc、babel.config.js）
- 常用 plugins 和 presets

### 2. [Polyfill 方案详解](./02-polyfill-solutions.md)
- 什么是 Polyfill？
- core-js 介绍
- @babel/preset-env 的 useBuiltIns 选项
  - false: 不自动引入
  - entry: 全量引入
  - usage: 按需引入
- @babel/plugin-transform-runtime
- Polyfill 方案对比与选择
- 最佳实践

### 3. [Source Map 原理与实践](./03-source-map.md)
- 什么是 Source Map？
- Source Map 的工作原理
- Webpack devtool 选项详解
- 不同 devtool 的性能对比
- 开发环境 vs 生产环境
- 调试技巧
- Source Map 安全性

### 4. [JavaScript 模块化方案](./04-module-systems.md)
- 模块化演进历史
- CommonJS vs ES Module
- Webpack 的模块处理
- 动态 import 与代码分割
- Tree Shaking 原理
- 副作用处理（sideEffects）
- 模块化最佳实践

---

## 🎮 Demo 列表

### Demo 1: [Babel 基础配置](../demos/01-babel-basics/)
**场景**：配置 Babel 转译 ES6+ 代码

**核心内容**：
- ✅ 安装和配置 Babel
- ✅ @babel/preset-env 使用
- ✅ browserslist 配置
- ✅ 转译结果对比
- ✅ 自定义 targets

**运行方式**：
```bash
cd demos/01-babel-basics
npm install
npm run build
npm run dev
```

---

### Demo 2: [Polyfill 方案对比](../demos/02-polyfill-demo/)
**场景**：对比不同 Polyfill 方案的效果

**核心内容**：
- ✅ useBuiltIns: false
- ✅ useBuiltIns: entry
- ✅ useBuiltIns: usage
- ✅ @babel/plugin-transform-runtime
- ✅ 打包体积对比
- ✅ 适用场景分析

**运行方式**：
```bash
cd demos/02-polyfill-demo
npm install
npm run build:all  # 生成所有方案的构建
npm run analyze    # 分析对比
```

---

### Demo 3: [Source Map 实战](../demos/03-sourcemap-demo/)
**场景**：理解和调试 Source Map

**核心内容**：
- ✅ 不同 devtool 对比
- ✅ Source Map 可视化
- ✅ 性能测试
- ✅ 调试演示
- ✅ 生产环境配置

**运行方式**：
```bash
cd demos/03-sourcemap-demo
npm install
npm run dev          # 开发模式
npm run build:all    # 生成所有 Source Map 类型
```

---

### Demo 4: [模块化最佳实践](../demos/04-module-best-practice/)
**场景**：现代 JavaScript 模块化方案

**核心内容**：
- ✅ ES Module vs CommonJS
- ✅ 动态 import
- ✅ Tree Shaking 演示
- ✅ sideEffects 配置
- ✅ 代码分割策略

**运行方式**：
```bash
cd demos/04-module-best-practice
npm install
npm run build
npm run analyze
```

---

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 理解 Babel 的工作原理
- [ ] 理解不同 Polyfill 方案的区别
- [ ] 理解 Source Map 的生成和使用
- [ ] 理解 ES Module 和 Tree Shaking
- [ ] 能画出 Babel 的编译流程图

### 实践层面
- [ ] 能独立配置 Babel
- [ ] 能选择合适的 Polyfill 方案
- [ ] 能配置合适的 Source Map
- [ ] 能优化模块打包体积
- [ ] 能调试生产环境代码

### 面试层面
能够清晰回答以下面试问题：

1. **Babel 的工作原理是什么？**
2. **@babel/preset-env 的作用是什么？**
3. **useBuiltIns 的三个选项有什么区别？**
4. **什么时候用 @babel/plugin-transform-runtime？**
5. **Source Map 是如何工作的？**
6. **开发和生产环境应该用什么 devtool？**
7. **Tree Shaking 的原理是什么？**
8. **如何配置才能让 Tree Shaking 生效？**
9. **ES Module 和 CommonJS 有什么区别？**
10. **动态 import 是如何实现代码分割的？**

---

## 🎯 核心知识点

### 1. Babel 转译流程

```
源代码 (ES6+)
    ↓
Parser (词法分析 + 语法分析)
    ↓
AST (抽象语法树)
    ↓
Transform (遍历 + 转换)
    ↓
新的 AST
    ↓
Generate (生成代码)
    ↓
转译后代码 (ES5)
```

### 2. Polyfill 方案对比

| 方案 | 体积 | 污染全局 | 适用场景 |
|------|------|----------|----------|
| **useBuiltIns: false** | 最小 | ❌ 否 | 不需要 Polyfill |
| **useBuiltIns: entry** | 大 | ✅ 是 | 应用开发 |
| **useBuiltIns: usage** | 中 | ✅ 是 | 应用开发（推荐） |
| **transform-runtime** | 小 | ❌ 否 | 库开发 |

### 3. Source Map 类型对比

| devtool | 构建速度 | 重构建速度 | 生产环境 | 质量 |
|---------|----------|------------|----------|------|
| **(none)** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ✅ | - |
| **eval** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ❌ | 生成代码 |
| **source-map** | ⚡ | ⚡ | ✅ | 原始代码 |
| **eval-source-map** | ⚡⚡ | ⚡⚡⚡⚡ | ❌ | 原始代码 |
| **cheap-source-map** | ⚡⚡ | ⚡⚡ | ❌ | 转换代码 |
| **cheap-module-source-map** | ⚡⚡ | ⚡⚡⚡ | ❌ | 原始代码 |

**推荐配置**：
- 开发环境：`eval-source-map` 或 `eval-cheap-module-source-map`
- 生产环境：`source-map`（如果需要调试）或 `(none)`

### 4. Tree Shaking 工作原理

```javascript
// 条件
1. 使用 ES Module (import/export)
2. production 模式
3. sideEffects 正确配置
4. usedExports: true

// 工作流程
静态分析 import/export
    ↓
标记未使用的导出
    ↓
Terser 删除死代码
    ↓
最终产物（只包含使用的代码）
```

---

## 💡 最佳实践

### 1. Babel 配置

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      // 目标环境
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead']
      },
      // Polyfill 方案
      useBuiltIns: 'usage',
      corejs: 3,
      // 开发环境保留模块
      modules: false
    }]
  ]
};
```

### 2. Polyfill 方案选择

```
应用开发：
  ✅ useBuiltIns: 'usage' + core-js@3

库开发：
  ✅ @babel/plugin-transform-runtime

不需要兼容老浏览器：
  ✅ useBuiltIns: false
```

### 3. Source Map 配置

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    devtool: isDev 
      ? 'eval-cheap-module-source-map'  // 开发：快速 + 准确
      : 'source-map',                   // 生产：完整映射
  };
};
```

### 4. Tree Shaking 优化

```javascript
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: true
  }
};
```

---

## 🔗 相关资源

- [Babel 官方文档](https://babeljs.io/docs/)
- [core-js 文档](https://github.com/zloirock/core-js)
- [Source Map 规范](https://sourcemaps.info/spec.html)
- [ES Module 规范](https://tc39.es/ecma262/#sec-modules)
- [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)

---

## 🎓 学习建议

1. **先理解原理，再配置实践**
   - Babel 的编译流程
   - Polyfill 的注入机制
   - Source Map 的映射原理

2. **对比学习**
   - 不同 Polyfill 方案的效果
   - 不同 Source Map 的特点
   - 不同模块化方案的差异

3. **关注性能**
   - 构建时间
   - 打包体积
   - 运行时性能

4. **面向生产**
   - 考虑浏览器兼容性
   - 考虑包体积优化
   - 考虑调试便利性

---

**准备好了吗？让我们开始 JavaScript 工程化的学习之旅！** 🚀

