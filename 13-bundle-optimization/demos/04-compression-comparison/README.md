# Demo 04: 压缩方案对比

## 📖 Demo 说明

本 Demo 通过对比 **5 种不同的压缩方案**，全面展示压缩对 Bundle 体积的影响，帮助你选择最适合的压缩策略。

**对比的压缩方案**：
1. **未压缩**：原始代码（基准）
2. **基础压缩**：默认的 Terser + CSS Minifier
3. **高级压缩**：深度优化配置（移除 console、多次传递、深度混淆）
4. **Gzip 压缩**：高级压缩 + Gzip
5. **Brotli 压缩**：高级压缩 + Gzip + Brotli

## 🎯 学习目标

- 理解不同压缩级别的效果
- 掌握 Terser 和 CSS Minifier 的配置
- 学会使用 Gzip 和 Brotli 压缩
- 平衡压缩率和构建速度

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 自动对比（推荐）

```bash
npm run compare
```

**执行流程**：
1. 依次构建 5 种压缩方案
2. 分析每种方案的体积
3. 输出详细对比报告

**典型输出**：

```
🗜️  压缩方案全面对比

1️⃣  构建 未压缩...
   ✅ 完成 - 耗时: 2.50s
   📦 JS 体积: 250.45 KB
   🎨 CSS 体积: 15.23 KB

2️⃣  构建 基础压缩...
   ✅ 完成 - 耗时: 4.20s
   📦 JS 体积: 95.32 KB
   🎨 CSS 体积: 8.15 KB

3️⃣  构建 高级压缩...
   ✅ 完成 - 耗时: 5.80s
   📦 JS 体积: 82.45 KB
   🎨 CSS 体积: 7.85 KB

4️⃣  构建 Gzip 压缩...
   ✅ 完成 - 耗时: 6.10s
   📦 JS 体积: 82.45 KB
   🎨 CSS 体积: 7.85 KB
   📦 Gzip: 28.67 KB

5️⃣  构建 Brotli 压缩...
   ✅ 完成 - 耗时: 7.50s
   📦 JS 体积: 82.45 KB
   🎨 CSS 体积: 7.85 KB
   📦 Gzip: 28.67 KB
   📦 Brotli: 24.15 KB

📊 详细对比:

JavaScript 体积:
   1. 未压缩           250.45 KB
   2. 基础压缩          95.32 KB (减少 61.9%)
   3. 高级压缩          82.45 KB (减少 67.1%)
   4. Gzip 压缩         82.45 KB (减少 67.1%)
   5. Brotli 压缩       82.45 KB (减少 67.1%)

Gzip 压缩后:
   4. Gzip 压缩         28.67 KB (再减少 68.2%)

Brotli 压缩后:
   5. Brotli 压缩       24.15 KB (再减少 73.2%) [比Gzip小 15.8%]

💡 关键发现:

JavaScript 压缩效果:
   未压缩 → 基础压缩: 减少 61.9%
   基础 → 高级压缩: 再减少 13.5%
   累计减少: 67.1%

Gzip 压缩效果:
   高级压缩 → Gzip: 再减少 68.2%
   相对未压缩: 减少 89.2%

Brotli 压缩效果:
   Brotli vs Gzip: 再减少 15.8%
   相对未压缩: 减少 90.9%

🎯 推荐配置:
   开发环境: 不压缩或基础压缩（快速构建）
   测试环境: 基础压缩（平衡速度和体积）
   生产环境: 高级压缩 + Gzip（标准配置）
   追求极致: 高级压缩 + Gzip + Brotli（体积最小）
```

### 3. 单独构建

```bash
# 未压缩
npm run build:no-compress

# 基础压缩
npm run build:basic

# 高级压缩
npm run build:advanced

# Gzip 压缩
npm run build:gzip

# Brotli 压缩
npm run build:brotli
```

## 🔍 配置详解

### 1. 未压缩

```javascript
// webpack.no-compress.config.js
optimization: {
  minimize: false  // 不压缩
}
```

**特点**：
- 保留所有格式和空格
- 保留所有注释
- 保留完整的变量名
- 可读性最好
- 体积最大

### 2. 基础压缩

```javascript
// webpack.basic.config.js
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin(),           // 默认配置
    new CssMinimizerPlugin()      // 默认配置
  ]
}
```

**效果**：
- 移除空格和换行
- 移除注释
- 基础变量名混淆
- 保留 console.log
- 体积减少 60-70%

### 3. 高级压缩

```javascript
// webpack.advanced.config.js
new TerserPlugin({
  parallel: true,
  terserOptions: {
    compress: {
      drop_console: true,      // ← 移除 console
      drop_debugger: true,     // ← 移除 debugger
      passes: 2,               // ← 多次传递优化
      dead_code: true,         // ← 移除死代码
      unused: true             // ← 移除未使用的函数
    },
    mangle: {
      toplevel: true           // ← 深度混淆
    }
  }
})
```

**效果**：
- 基础压缩的所有优化
- 移除 console.log/info/debug
- 深度变量名混淆
- 移除未使用的代码
- 内联简单函数
- 体积再减少 10-15%

### 4. Gzip 压缩

```javascript
// webpack.gzip.config.js
new CompressionPlugin({
  algorithm: 'gzip',
  test: /\.(js|css|html|svg)$/,
  threshold: 10240,      // 只压缩 > 10KB 的文件
  minRatio: 0.8          // 压缩率 < 0.8 才保留
})
```

**效果**：
- 生成 .gz 文件
- 典型压缩率：70-80%
- 浏览器自动解压
- 需要服务器支持

### 5. Brotli 压缩

```javascript
// webpack.brotli.config.js
// Gzip
new CompressionPlugin({ algorithm: 'gzip', ... }),

// Brotli
new CompressionPlugin({
  algorithm: 'brotliCompress',
  compressionOptions: { level: 11 },  // 最高压缩级别
  filename: '[path][base].br'
})
```

**效果**：
- 同时生成 .gz 和 .br
- Brotli 比 Gzip 再减少 15-20%
- 现代浏览器支持（Chrome 50+, Firefox 44+）
- 服务器优先使用 Brotli

## 📊 压缩对比表

| 方案 | 构建时间 | JS 体积 | CSS 体积 | 总减少 | 适用场景 |
|------|---------|---------|---------|--------|---------|
| 未压缩 | 2.5s | 250 KB | 15 KB | 0% | 调试 |
| 基础压缩 | 4.2s | 95 KB | 8 KB | 62% | 开发/测试 |
| 高级压缩 | 5.8s | 82 KB | 7.8 KB | 67% | 生产（推荐）|
| Gzip | 6.1s | 28.7 KB (gzip) | - | 89% | 生产（推荐）|
| Brotli | 7.5s | 24.2 KB (br) | - | 91% | 追求极致 |

## 💡 最佳实践

### 1. 环境选择

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    optimization: {
      minimize: isProduction,
      minimizer: isProduction ? [
        new TerserPlugin({ /* 高级配置 */ }),
        new CssMinimizerPlugin()
      ] : []
    }
  };
};
```

### 2. 服务器配置

**Nginx 配置**：

```nginx
# Gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1024;
gzip_vary on;

# Brotli（需要模块）
brotli on;
brotli_types text/plain text/css application/json application/javascript;
brotli_comp_level 6;
```

**Express 配置**：

```javascript
const express = require('express');
const compression = require('compression');

const app = express();

// 启用 Gzip
app.use(compression());

// 静态文件
app.use(express.static('dist'));
```

### 3. 条件压缩

```javascript
new CompressionPlugin({
  threshold: 10240,      // 只压缩 > 10KB
  minRatio: 0.8,         // 压缩率 < 0.8 才保留
  exclude: /\.map$/      // 排除 Source Map
})
```

## ⚠️ 注意事项

### 1. 不要过度压缩

```javascript
// ❌ 错误：最高压缩级别（太慢）
new CompressionPlugin({
  algorithm: 'brotliCompress',
  compressionOptions: { level: 11 }  // 构建非常慢
})

// ✅ 正确：平衡压缩级别
new CompressionPlugin({
  algorithm: 'brotliCompress',
  compressionOptions: { level: 6 }   // 平衡速度和体积
})
```

### 2. Source Map 处理

```javascript
// 生产环境
devtool: 'hidden-source-map',  // 不在 bundle 中引用

// 不压缩 Source Map
new TerserPlugin({
  sourceMap: true,
  extractComments: false
})
```

### 3. console.log 处理

```javascript
// ❌ 错误：开发环境也移除 console
drop_console: true

// ✅ 正确：只在生产环境移除
drop_console: process.env.NODE_ENV === 'production'
```

## 🎓 延伸思考

### Q1: 为什么 Gzip/Brotli 压缩率这么高？

**答**：
- Gzip/Brotli 使用字典压缩
- 识别重复的字符串模式
- JavaScript 代码有大量重复（函数名、关键字）
- 典型压缩率：70-85%

### Q2: 如何验证 Gzip 是否生效？

**方法 1**：Chrome DevTools

```
1. 打开 Network 面板
2. 查看 Response Headers
3. 找到 Content-Encoding: gzip 或 br
4. 查看 Size 列（显示压缩后体积）
```

**方法 2**：curl 命令

```bash
curl -H "Accept-Encoding: gzip" -I https://your-site.com/main.js
# 查看 Content-Encoding 响应头
```

### Q3: Brotli 兼容性如何？

**浏览器支持**：
- ✅ Chrome 50+
- ✅ Firefox 44+
- ✅ Safari 11+
- ✅ Edge 15+
- ❌ IE（不支持）

**回退策略**：
- 同时生成 .gz 和 .br
- 服务器优先返回 .br
- 不支持的浏览器返回 .gz

## 📚 相关资源

- [Terser 文档](https://terser.org/)
- [compression-webpack-plugin](https://webpack.js.org/plugins/compression-webpack-plugin/)
- [Brotli 规范](https://github.com/google/brotli)

---

**下一步**：在生产环境中应用高级压缩 + Gzip，体验体积优化的效果！

