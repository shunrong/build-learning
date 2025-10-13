# 构建分析：性能优化的第一步

## 📖 为什么要先分析？

> **优化的第一原则：没有测量，就没有优化。**

### ❌ 错误的优化方式

```javascript
// 看别人的文章说要用 thread-loader
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['thread-loader', 'babel-loader']  // 盲目使用
    }
  ]
}

// 结果：
// - 小项目反而变慢了（Worker 启动开销 > 收益）
// - 不知道真正的瓶颈在哪里
// - 无法量化优化效果
```

### ✅ 正确的优化方式

```
1. 测量 Baseline
   └─ 当前构建时间：300s

2. 分析瓶颈
   ├─ babel-loader: 180s（60%）← 主要瓶颈
   ├─ TerserPlugin: 90s（30%）
   └─ 其他: 30s（10%）

3. 针对性优化
   └─ 优先优化 babel-loader（缓存 + 并行）

4. 验证效果
   └─ 优化后：60s（-80%）✅
```

---

## 🔍 Webpack 构建流程详解

### 完整的构建流程

```
┌─────────────────────────────────────────┐
│         Webpack 构建流程                 │
└─────────────────────────────────────────┘

1️⃣ 初始化阶段（Initialization）
   ├─ 读取配置文件
   ├─ 合并默认配置
   └─ 初始化 Compiler 对象
   
2️⃣ 编译阶段（Compilation）
   ├─ 创建 Compilation 对象
   ├─ 触发 compile 钩子
   └─ 确定入口（entry）
   
3️⃣ 构建模块阶段（Make）⭐️ 最耗时
   ├─ 从入口文件开始
   ├─ 调用 loader 转换源码
   ├─ 解析依赖（require/import）
   ├─ 递归构建所有依赖模块
   └─ 生成 AST 并分析
   
4️⃣ 生成代码阶段（Seal）
   ├─ 根据依赖关系生成 Chunk
   ├─ 优化 Chunk（Tree Shaking, Scope Hoisting）
   ├─ 生成 Runtime 代码
   └─ 生成最终的 Bundle 文件
   
5️⃣ 输出阶段（Emit）
   ├─ 写入文件到 dist/
   ├─ 生成 Source Map
   └─ 触发 done 钩子
   
6️⃣ 压缩阶段（Optimization）⭐️ 耗时
   ├─ TerserPlugin 压缩 JS
   ├─ CssMinimizerPlugin 压缩 CSS
   └─ 图片压缩等
```

### 性能瓶颈通常在哪里？

**按耗时占比排序**：

1. **构建模块阶段（60-70%）**⭐️⭐️⭐️
   - Loader 转换（babel-loader, ts-loader）
   - 依赖解析（resolve）
   - AST 解析和遍历

2. **压缩优化阶段（20-30%）**⭐️⭐️
   - TerserPlugin（JS 压缩）
   - CssMinimizerPlugin（CSS 压缩）

3. **其他阶段（5-10%）**⭐️
   - 初始化
   - 文件输出
   - Source Map 生成

**结论**：优化的重点在**构建模块**和**压缩优化**两个阶段！

---

## 🛠️ 分析工具

### 1. speed-measure-webpack-plugin ⭐️⭐️⭐️

**作用**：测量每个 Loader 和 Plugin 的耗时

#### 安装

```bash
npm install --save-dev speed-measure-webpack-plugin
```

#### 配置

```javascript
// webpack.config.js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // 你的 Webpack 配置
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  // ...
});
```

#### 输出示例

```
 SMP  ⏱  
General output time took 5 mins, 12.031 secs

 SMP  ⏱  Loaders
babel-loader took 3 mins, 45.234 secs  ← 主要瓶颈！
  module count = 1234
css-loader, and 
mini-css-extract-plugin, and 
postcss-loader took 1 min, 12.456 secs
  module count = 234

 SMP  ⏱  Plugins
TerserPlugin took 45.678 secs  ← 第二瓶颈
HtmlWebpackPlugin took 5.123 secs
```

**如何解读**：
- ✅ **找到最耗时的项**（如 babel-loader 3分45秒）
- ✅ **计算占比**（3:45 / 5:12 = 72%）
- ✅ **确定优化优先级**（优先优化 babel-loader）

---

### 2. webpack-bundle-analyzer ⭐️⭐️⭐️

**作用**：可视化分析打包体积，找出体积大户

#### 安装

```bash
npm install --save-dev webpack-bundle-analyzer
```

#### 配置

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // ...
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',        // 生成静态 HTML
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,           // 不自动打开浏览器
    })
  ]
};
```

#### 可视化报告

```
┌──────────────────────────────────────┐
│  Bundle Size: 5.2 MB                 │
├──────────────────────────────────────┤
│                                      │
│  ┌─────────────────────┐            │
│  │  moment.js (2.4 MB) │ ← 体积大户  │
│  │  ├─ locales (2 MB)  │ ← 不需要！  │
│  │  └─ core (0.4 MB)   │            │
│  └─────────────────────┘            │
│                                      │
│  ┌──────────────┐                   │
│  │ lodash (1MB) │ ← 只用了 3 个函数  │
│  └──────────────┘                   │
│                                      │
│  ┌────────────────┐                 │
│  │ your code (1MB)│                 │
│  └────────────────┘                 │
│                                      │
│  其他 (0.8 MB)                       │
│                                      │
└──────────────────────────────────────┘
```

**优化方向**：
1. moment.js → 使用 `IgnorePlugin` 忽略 locales
2. lodash → 使用 `lodash-es` + Tree Shaking
3. 分析是否有重复打包的模块

---

### 3. Webpack 内置分析

#### 方式 1：--profile --json

```bash
# 生成构建统计信息
webpack --profile --json > stats.json
```

**stats.json 包含**：
- 所有模块的信息
- 构建时间
- 依赖关系
- ...

**在线分析工具**：
- https://webpack.github.io/analyse/
- https://chrisbateman.github.io/webpack-visualizer/

#### 方式 2：使用 stats 配置

```javascript
// webpack.config.js
module.exports = {
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true,
    timings: true,  // ⭐️ 显示构建时间
    assets: true,
    chunks: true,
  }
};
```

**输出示例**：

```
Time: 312045ms  ← 总构建时间

           Asset       Size  Chunks
          main.js    2.5 MB       0
        main.css    500 KB       0
     1.bundle.js    800 KB       1
     
  [0] ./src/index.js 12.3 kB {0} [built]
      [built time: 345ms]  ← 单个模块构建时间
      
  [1] ./node_modules/react/index.js 200 bytes {0} [built]
      [built time: 45ms]
```

---

## 📊 实战分析案例

### 案例：一个"慢到爆炸"的项目

#### 问题描述

```
项目信息：
├─ 技术栈：React + TypeScript
├─ 模块数量：~3000
├─ 构建时间：5 分钟 20 秒（首次）
├─ 二次构建：3 分钟 10 秒
└─ 热更新：8 秒

开发体验：💀💀💀
```

#### 第一步：使用 speed-measure-webpack-plugin

```bash
npm run build
```

**输出**：

```
SMP  ⏱  General output time took 5 mins, 20 secs

SMP  ⏱  Loaders
ts-loader took 3 mins, 45 secs (70%)  ← ⚠️ 最大瓶颈
  module count = 2800
  
css-loader, style-loader took 45 secs (14%)
  module count = 120

file-loader took 10 secs (3%)
  module count = 200

SMP  ⏱  Plugins
TerserPlugin took 50 secs (15%)  ← ⚠️ 第二瓶颈
HtmlWebpackPlugin took 5 secs (1%)
```

#### 分析结论

1. **ts-loader 占用 70% 时间**
   - 原因：同步进行类型检查 + 编译
   - 优化方向：分离类型检查，使用缓存

2. **TerserPlugin 占用 15% 时间**
   - 原因：单线程压缩
   - 优化方向：并行压缩

3. **没有使用缓存**
   - 原因：默认配置
   - 优化方向：启用 filesystem cache

---

#### 第二步：使用 webpack-bundle-analyzer

```bash
npm run build
# 打开 bundle-report.html
```

**发现的问题**：

```
总体积：5.2 MB（未压缩）

问题 1：moment.js (2.4 MB)
  └─ 包含了所有 locale 文件（不需要）
  
问题 2：lodash (1.2 MB)
  └─ 全量引入，只用了 3 个函数
  
问题 3：antd 图标 (800 KB)
  └─ 引入了所有图标
  
问题 4：重复的 React (600 KB)
  └─ 主应用和某个第三方库都打包了 React
```

---

#### 第三步：确定优化优先级

**优化计划**：

| 优先级 | 问题 | 优化方案 | 预期收益 |
|-------|------|---------|---------|
| P0（最高）| ts-loader 慢 | 分离类型检查 + 缓存 | -70% 构建时间 |
| P0 | 无缓存 | Webpack 5 filesystem cache | -80% 二次构建 |
| P1 | TerserPlugin 慢 | 并行压缩 | -40% 压缩时间 |
| P1 | moment.js 体积大 | IgnorePlugin | -2MB 体积 |
| P2 | lodash 体积大 | lodash-es + Tree Shaking | -1MB 体积 |
| P2 | antd 图标体积大 | 按需引入 | -600KB 体积 |

---

#### 第四步：实施优化（后续文档详解）

**优化 1：ts-loader 配置**

```javascript
// webpack.config.js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,  // ⭐️ 只编译，不检查类型
          }
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()  // ⭐️ 异步检查类型
  ]
};
```

**效果**：3:45 → 1:20（-64%）

---

**优化 2：Webpack 5 缓存**

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',  // ⭐️ 文件系统缓存
    buildDependencies: {
      config: [__filename]
    }
  }
};
```

**效果**：
- 首次：5:20 → 5:20（无变化）
- 二次：3:10 → 18s（-91%）⚡️⚡️⚡️

---

**优化 3：并行压缩**

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,  // ⭐️ 并行压缩
      })
    ]
  }
};
```

**效果**：50s → 28s（-44%）

---

**优化 4：moment.js locale**

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,  // ⭐️ 忽略 locale
      contextRegExp: /moment$/,
    })
  ]
};
```

**效果**：5.2 MB → 3.2 MB（-38%）

---

#### 最终效果对比

```
┌─────────────────┬──────────┬──────────┬──────────┐
│     指标         │  优化前   │  优化后   │  提升    │
├─────────────────┼──────────┼──────────┼──────────┤
│ 首次构建时间     │  320s    │   75s    │  -77%   │
│ 二次构建时间     │  190s    │   18s    │  -91%   │
│ 热更新时间       │   8s     │  0.8s    │  -90%   │
│ 包体积（未压缩） │ 5.2 MB   │ 2.1 MB   │  -60%   │
│ 包体积（Gzip）   │ 1.8 MB   │ 650 KB   │  -64%   │
└─────────────────┴──────────┴──────────┴──────────┘

开发体验：💀💀💀 → 🚀🚀🚀
```

---

## 🎯 分析工具对比

| 工具 | 分析内容 | 适用场景 | 优点 | 缺点 |
|------|---------|---------|------|------|
| **speed-measure-webpack-plugin** | 构建时间 | 找出慢的 Loader/Plugin | 精准定位瓶颈 | 配置稍复杂 |
| **webpack-bundle-analyzer** | 包体积 | 优化产物大小 | 可视化清晰 | 只能分析体积 |
| **webpack --profile --json** | 完整统计 | 深度分析 | 信息最全 | 不够直观 |
| **Webpack 内置 stats** | 构建统计 | 快速查看 | 无需插件 | 信息有限 |

**建议**：
- 🚀 **首次分析**：speed-measure-webpack-plugin + webpack-bundle-analyzer
- 🔍 **深度分析**：webpack --profile --json
- 📊 **日常监控**：Webpack 内置 stats

---

## 🎓 面试攻防

### 问题 1：如何分析 Webpack 构建慢的原因？

**标准回答**：

```
第一步：使用 speed-measure-webpack-plugin 测量耗时
  └─ 找出最慢的 Loader 和 Plugin

第二步：分析构建流程
  ├─ 构建模块阶段（通常占 60-70%）
  │   ├─ Loader 转换（babel-loader, ts-loader）
  │   └─ 依赖解析
  └─ 压缩优化阶段（通常占 20-30%）
      └─ TerserPlugin

第三步：定位具体瓶颈
  ├─ 哪个 Loader 最慢？
  ├─ 处理了多少模块？
  └─ 是否有优化空间？

第四步：针对性优化
  ├─ 缓存优化（效果最好）
  ├─ 并行构建（CPU 密集型）
  └─ 减少构建范围（exclude, noParse）
```

**案例**：
"我们项目从 5 分钟优化到 30 秒，首先用 speed-measure-webpack-plugin 发现 ts-loader 占用 70% 时间，然后使用 transpileOnly + 缓存优化，最终构建时间减少了 77%。"

---

### 问题 2：webpack-bundle-analyzer 能发现什么问题？

**标准回答**：

```
主要功能：
  └─ 可视化打包体积，识别体积大户

常见问题：
  1. 第三方库体积过大
     └─ moment.js 包含了所有 locale

  2. 重复打包
     └─ 多个模块都打包了 React

  3. 未使用的代码
     └─ lodash 全量引入，只用了 3 个函数

  4. Tree Shaking 失效
     └─ 使用了 CommonJS 而非 ES Module
```

**优化方向**：
- ✅ IgnorePlugin 忽略不需要的模块
- ✅ 按需引入（如 lodash-es）
- ✅ Externals 使用 CDN
- ✅ 代码分割减少单个 bundle 体积

---

### 问题 3：Webpack 构建流程中哪个阶段最耗时？

**标准回答**：

```
按耗时占比：

1. 构建模块阶段（Make）：60-70%  ⭐️⭐️⭐️
   ├─ Loader 转换（babel-loader, ts-loader）
   ├─ 依赖解析（resolve）
   └─ AST 解析

2. 压缩优化阶段：20-30%  ⭐️⭐️
   ├─ TerserPlugin（JS 压缩）
   └─ CssMinimizerPlugin（CSS 压缩）

3. 其他阶段：5-10%  ⭐️
   ├─ 初始化
   ├─ 文件输出
   └─ Source Map 生成
```

**优化重点**：
- ✅ 优先优化构建模块阶段（缓存 + 并行）
- ✅ 其次优化压缩阶段（并行压缩）

---

### 问题 4：如何定位是哪个 Loader 慢？

**实战技巧**：

**方式 1：speed-measure-webpack-plugin**（推荐）

```javascript
const smp = new SpeedMeasurePlugin();
module.exports = smp.wrap(yourWebpackConfig);
```

**方式 2：手动计时**

```javascript
// 自定义 Loader
module.exports = function(source) {
  const start = Date.now();
  
  // ... Loader 逻辑
  
  const end = Date.now();
  console.log(`${this.resourcePath}: ${end - start}ms`);
  
  return source;
};
```

**方式 3：Webpack 内置 stats**

```bash
webpack --profile --json > stats.json
# 分析 stats.json 中的 "profile" 字段
```

---

## 📝 实践建议

### 1. 建立 Baseline

优化前**必须**先测量：

```bash
# 记录构建时间
time npm run build

# 生成分析报告
npm run build -- --profile --json > stats-before.json
```

### 2. 单点优化

每次只优化一个点：

```
优化流程：
1. 测量 Baseline
2. 修改配置（只改一个点）
3. 测量优化后
4. 对比效果
5. 记录数据
```

**不要同时改多个配置，否则无法确定哪个有效！**

### 3. 记录优化数据

建立优化日志：

```markdown
## 优化记录

### 2024-01-15：启用 filesystem cache
- 首次构建：320s → 320s（无变化）
- 二次构建：190s → 18s（-91%）✅
- 结论：二次构建效果显著

### 2024-01-16：ts-loader transpileOnly
- 首次构建：320s → 120s（-63%）✅
- 结论：效果明显，继续
```

### 4. 持续监控

将构建时间纳入 CI/CD：

```yaml
# .github/workflows/ci.yml
- name: Build and measure
  run: |
    time npm run build
    # 如果构建时间 > 3 分钟，则失败
```

---

## 🚀 下一步

现在你已经学会了**如何分析构建性能**：
- ✅ 理解 Webpack 构建流程
- ✅ 掌握分析工具使用
- ✅ 能够定位性能瓶颈
- ✅ 能够确定优化优先级

**下一步**：学习最有效的优化手段 - [02-cache-strategies.md](./02-cache-strategies.md) 🚀

