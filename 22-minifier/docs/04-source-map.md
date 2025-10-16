# Source Map 与 Minifier

## 🎯 为什么需要 Source Map

```javascript
// 开发环境：可读的代码
function calculateDiscount(price, discountRate) {
  if (discountRate > 1 || discountRate < 0) {
    throw new Error('Invalid discount rate');
  }
  return price * (1 - discountRate);
}

// 生产环境：压缩后的代码
function calculateDiscount(t,e){if(e>1||e<0)throw new Error("Invalid discount rate");return t*(1-e)}

// 问题：报错时如何定位到原始代码？
// 答案：Source Map！
```

---

## 📖 Source Map 基础

### 1. Source Map 格式

```json
{
  "version": 3,
  "file": "bundle.min.js",
  "sources": ["src/index.js", "src/utils.js"],
  "sourcesContent": ["...", "..."],
  "names": ["calculateDiscount", "price", "discountRate"],
  "mappings": "AAAA,SAASA,iBAAiBC,EAAOC,GAC/B..."
}
```

### 2. Mappings 编码

```
"AAAA,SAASA,iBAAiBC,EAAOC"

解码后：
- 第 1 列对应源文件第 1 行第 1 列
- 变量名 calculateDiscount 对应 names[0]
- 参数 price 对应 names[1]
- 参数 discountRate 对应 names[2]
```

---

## 🔧 Terser + Source Map

### 1. 生成 Source Map

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  devtool: 'source-map',  // 生成 Source Map
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,  // Terser 处理 Source Map
        terserOptions: {
          compress: true,
          mangle: true
        }
      })
    ]
  }
};
```

输出文件：
```
dist/
  bundle.js
  bundle.js.map  ← Source Map 文件
```

### 2. devtool 选项

```javascript
// 开发环境
devtool: 'eval-cheap-module-source-map'
// - 快速重建
// - 包含列信息
// - 适合开发

// 生产环境
devtool: 'source-map'
// - 完整的 Source Map
// - 单独文件
// - 适合生产调试

// 生产环境（不暴露源码）
devtool: 'hidden-source-map'
// - 生成 Source Map
// - 但不在 bundle 中引用
// - 上传到错误监控平台
```

---

## 🎨 Source Map 类型对比

| devtool | 构建速度 | 重建速度 | 质量 | 适用场景 |
|---------|---------|---------|------|---------|
| `eval` | +++ | +++ | - | 开发（最快） |
| `eval-cheap-source-map` | ++ | +++ | + | 开发（推荐） |
| `eval-cheap-module-source-map` | + | ++ | ++ | 开发（完整） |
| `source-map` | --- | --- | ++++ | 生产 |
| `hidden-source-map` | --- | --- | ++++ | 生产（隐藏） |
| `nosources-source-map` | --- | --- | +++ | 生产（无源码） |

---

## 🚀 生产环境最佳实践

### 1. Hidden Source Map

```javascript
// webpack.config.js
{
  devtool: 'hidden-source-map',
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: false
      })
    ]
  }
}
```

生成的 `bundle.js` **不包含** Source Map 引用：
```javascript
// bundle.js
function calculateDiscount(t,e){...}
// ❌ 没有 //# sourceMappingURL=bundle.js.map
```

但 `bundle.js.map` 文件仍然存在。

### 2. 上传到错误监控平台

```javascript
// 上传 Source Map 到 Sentry
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

{
  plugins: [
    new SentryWebpackPlugin({
      include: './dist',
      ignore: ['node_modules'],
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'my-org',
      project: 'my-project'
    })
  ]
}
```

### 3. 自动删除 Source Map

```javascript
// 构建后删除 .map 文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

{
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist/**/*.map']
    })
  ]
}
```

或使用脚本：
```json
{
  "scripts": {
    "build": "webpack && node scripts/upload-sourcemaps.js && rm dist/*.map"
  }
}
```

---

## 🔍 调试流程

### 1. 浏览器中的 Source Map

```
浏览器加载 bundle.js
  ↓
发现 //# sourceMappingURL=bundle.js.map
  ↓
下载 bundle.js.map
  ↓
DevTools 显示原始源码
  ↓
断点、堆栈追踪映射到源码
```

### 2. 错误监控平台

```
生产环境报错
  ↓
错误信息 + 堆栈追踪（压缩后）
  ↓
上传到 Sentry
  ↓
Sentry 使用 Source Map 还原
  ↓
显示原始源码 + 准确行号
```

---

## 💡 Source Map 性能优化

### 1. 开发环境优化

```javascript
// 最快的开发配置
{
  devtool: 'eval',
  
  optimization: {
    minimize: false  // 开发环境不压缩
  }
}

// 平衡配置（推荐）
{
  devtool: 'eval-cheap-module-source-map'
}
```

### 2. 生产环境优化

```javascript
// 完整 Source Map（调试用）
{
  devtool: 'source-map'
}

// 仅行映射（更快）
{
  devtool: 'cheap-source-map'
}

// 不包含源码内容
{
  devtool: 'nosources-source-map'
}
```

---

## 🎯 实际应用案例

### 案例 1：本地开发

```javascript
// webpack.dev.js
{
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  
  optimization: {
    minimize: false
  }
}
```

**结果**：
- 快速重建
- 准确的错误定位
- 完整的调试体验

### 案例 2：生产构建（开源项目）

```javascript
// webpack.prod.js
{
  mode: 'production',
  devtool: 'source-map',
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true
      })
    ]
  }
}
```

**结果**：
- 用户可以调试
- 完整的错误追踪
- 源码可见（开源项目无所谓）

### 案例 3：生产构建（商业项目）

```javascript
// webpack.prod.js
{
  mode: 'production',
  devtool: 'hidden-source-map',
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true
      })
    ]
  },
  
  plugins: [
    new SentryWebpackPlugin({
      include: './dist',
      urlPrefix: '~/static/js/'
    })
  ]
}

// 构建后脚本
// upload-sourcemaps.js
const fs = require('fs');
const glob = require('glob');

// 上传 Source Map 到私有服务器
glob.sync('dist/**/*.map').forEach(file => {
  uploadToPrivateServer(file);
  fs.unlinkSync(file);  // 删除本地 .map 文件
});
```

**结果**：
- 用户看不到源码
- 错误监控平台可以还原
- 安全性和可调试性兼得

---

## 🛠️ 调试工具

### 1. Chrome DevTools

```
Sources 面板：
- 查看原始源码
- 设置断点
- 单步调试

Console 面板：
- 错误堆栈映射到源码
- 准确的行号
```

### 2. Source Map Explorer

```bash
npm install -g source-map-explorer

# 分析 bundle
source-map-explorer bundle.js bundle.js.map
```

输出：
- 可视化 bundle 组成
- 每个模块的大小
- 帮助优化

---

## 🎓 核心收获

1. **Source Map 是压缩代码的必备**
2. **开发环境**：`eval-cheap-module-source-map`
3. **生产环境**：`hidden-source-map` + 错误监控
4. **安全性**：不要暴露 Source Map 给最终用户
5. **性能**：Source Map 生成有成本，选择合适的类型

**Source Map 让压缩后的代码依然可调试！**

