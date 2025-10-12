# Demo 1: 单入口应用配置

## 📖 说明

这是一个单页应用（SPA）示例，演示如何配置单入口 Webpack 项目，并对比开发模式和生产模式的差异。

---

## 🎯 学习目标

- 理解单入口配置
- 对比开发模式和生产模式
- 理解 Source Map 的作用
- 体验热模块替换（HMR）
- 观察代码压缩和优化效果

---

## 🚀 运行方式

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式（推荐体验）
```bash
npm run dev
```

**效果**：
- 启动开发服务器（http://localhost:8080）
- 自动打开浏览器
- 支持热模块替换（修改代码自动刷新）
- 快速构建，完整 Source Map

### 3. 生产模式构建
```bash
npm run build
```

**效果**：
- 代码压缩混淆
- 文件名带 hash：`bundle.[contenthash:8].js`
- 生成 Source Map 文件（可选）
- 优化体积和性能

### 4. 开发模式构建（对比用）
```bash
npm run build:dev
```

**用途**：
- 生成未压缩的打包文件
- 对比生产模式的优化效果

### 5. 打包分析
```bash
npm run build:analyze
```

**效果**：
- 生成打包分析报告
- 可视化展示文件大小和依赖关系

---

## 🔍 体验要点

### 1. 对比构建结果

#### 开发模式
```bash
npm run build:dev
ls -lh dist/

# 输出示例：
# bundle.js          45KB  (未压缩)
# bundle.js.map      89KB  (完整 Source Map)
```

#### 生产模式
```bash
npm run build
ls -lh dist/

# 输出示例：
# bundle.a1b2c3d4.js     12KB  (压缩后)
# bundle.a1b2c3d4.js.map 35KB  (Source Map)
# runtime.e5f6g7h8.js    2KB   (runtime 代码)
```

**对比**：
- 文件大小：45KB → 12KB（减少 73%）
- 文件名：带 hash（利于缓存）
- 代码分割：提取 runtime

---

### 2. 观察 Webpack 配置

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    // 🔹 开发模式：bundle.js
    // 🔹 生产模式：bundle.[contenthash:8].js
    output: {
      filename: isDev ? 'bundle.js' : 'bundle.[contenthash:8].js'
    },
    
    // 🔹 开发模式：快速 Source Map
    // 🔹 生产模式：完整 Source Map
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    
    // 🔹 生产模式：代码压缩、分割
    optimization: {
      minimize: !isDev,
      runtimeChunk: isDev ? false : 'single',
      splitChunks: isDev ? false : { chunks: 'all' }
    }
  };
};
```

---

### 3. 体验热模块替换（HMR）

1. 运行 `npm run dev`
2. 打开浏览器（自动打开）
3. 修改 `src/utils.js` 中的代码：
```javascript
export function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] 🎉 ${message}`;  // 添加 emoji
  // ...
}
```
4. 保存文件
5. 观察浏览器**自动刷新**，新内容立即生效

**原理**：
- webpack-dev-server 监听文件变化
- 通过 WebSocket 推送更新
- 浏览器接收更新，局部替换模块
- **无需手动刷新页面**

---

### 4. 测试 Source Map

1. 运行 `npm run dev`
2. 点击"触发错误"按钮
3. 打开 Chrome DevTools
4. 切换到 **Sources** 面板
5. 观察错误堆栈

**开发模式**：
```
Error: 这是一个测试错误
    at triggerError (index.js:45)  ✅ 指向源代码
```

**生产模式（无 Source Map）**：
```
Error: 这是一个测试错误
    at t.triggerError (bundle.a1b2c3d4.js:1)  ❌ 指向压缩代码
```

---

### 5. 动态导入

点击"动态加载模块"按钮：

**开发模式**：
```
Network 面板：
- src_math_js.js  (动态加载的模块)
```

**生产模式**：
```
Network 面板：
- src_math_js.a1b2c3d4.js  (带 hash 的动态模块)
```

**代码**：
```javascript
// 动态导入
const { multiply } = await import('./math.js');
```

**效果**：
- 按需加载，减少初始包体积
- 独立的 chunk，可以单独缓存

---

## 📊 配置详解

### Entry（入口）
```javascript
entry: './src/index.js'
```
- 单个入口文件
- 最简单的配置
- 适合 SPA（单页应用）

### Output（输出）
```javascript
output: {
  path: path.resolve(__dirname, 'dist'),         // 输出目录
  filename: isDev ? 'bundle.js' : 'bundle.[contenthash:8].js',
  clean: true                                     // 清空旧文件
}
```

**文件名策略**：
- 开发模式：`bundle.js`（简单）
- 生产模式：`bundle.[contenthash:8].js`（缓存）

### DevServer（开发服务器）
```javascript
devServer: {
  static: './dist',    // 静态文件目录
  hot: true,           // 热模块替换
  port: 8080,          // 端口
  open: true,          // 自动打开浏览器
  compress: true       // gzip 压缩
}
```

### Optimization（优化）
```javascript
optimization: {
  minimize: !isDev,                    // 是否压缩
  runtimeChunk: isDev ? false : 'single',  // 提取 runtime
  splitChunks: isDev ? false : {       // 代码分割
    chunks: 'all'
  }
}
```

---

## 📝 常见问题

### Q1: 为什么生产模式构建时间更长？

**原因**：
- 代码压缩（Terser）
- Tree Shaking
- Scope Hoisting
- Source Map 生成

**对比**：
```
开发模式: 2 秒
生产模式: 8 秒
```

### Q2: 什么是 contenthash？

**contenthash**：根据文件内容生成的 hash

**作用**：
- 内容不变，hash 不变 → 浏览器使用缓存
- 内容改变，hash 改变 → 浏览器下载新文件

**示例**：
```
第一次构建: bundle.a1b2c3d4.js
修改代码后: bundle.e5f6g7h8.js  (hash 变了)
未修改的文件: vendors.x9y0z1w2.js  (hash 不变)
```

### Q3: 为什么要提取 runtime？

**runtime**：Webpack 的运行时代码，用于加载模块

**不提取**：
```
bundle.js  (业务代码 + runtime)
```
- 业务代码变化 → bundle.js hash 变化
- runtime 也被重新下载

**提取后**：
```
runtime.js  (只有 runtime)
bundle.js   (只有业务代码)
```
- 业务代码变化 → 只有 bundle.js hash 变化
- runtime.js hash 不变，继续使用缓存

---

## 🎯 练习建议

1. **修改配置实验**：
   - 改变输出文件名
   - 尝试不同的 Source Map 类型
   - 调整优化配置

2. **对比效果**：
   - 运行 `npm run build:dev` 和 `npm run build`
   - 对比文件大小和内容
   - 使用 `npm run build:analyze` 分析打包结果

3. **理解 HMR**：
   - 修改不同的模块
   - 观察热更新效果
   - 理解 `module.hot.accept()` 的作用

4. **测试 Source Map**：
   - 触发错误，查看堆栈
   - 对比有无 Source Map 的差异
   - 尝试不同的 devtool 配置

---

## 📊 核心要点总结

### 单入口配置
- ✅ 使用字符串：`entry: './src/index.js'`
- ✅ 适合 SPA（单页应用）
- ✅ 配置简单，易于理解

### 开发 vs 生产
| 特性 | 开发模式 | 生产模式 |
|------|---------|---------|
| **文件名** | `bundle.js` | `bundle.[hash].js` |
| **代码压缩** | ❌ | ✅ |
| **Source Map** | 完整 | 可选 |
| **HMR** | ✅ | ❌ |
| **构建速度** | 快 | 慢 |
| **文件大小** | 大 | 小 |

### 最佳实践
1. 开发模式重视速度和调试体验
2. 生产模式重视体积和性能
3. 使用 contenthash 实现长期缓存
4. 提取 runtime 和公共代码

---

## 🎯 下一步

完成 Demo 1 后，继续学习：
- [Demo 2: 多入口应用](../02-multi-entry/) - 多页应用配置
- [Demo 3: 动态入口](../03-dynamic-entry/) - 自动发现入口文件
- [Demo 4: 输出命名策略](../04-output-patterns/) - Hash 策略详解

