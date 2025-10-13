# Source Map 优化策略

## 📖 概述

**Source Map** 在开发和生产环境中扮演着不同的角色，需要针对性地优化配置，在**调试便利性**、**构建速度**、**安全性**之间取得平衡。

**本文目标**：
- 理解不同 Source Map 的特点和适用场景
- 掌握开发/生产环境的最佳配置
- 学会平衡调试体验和构建性能
- 了解生产环境的安全策略

## 🎯 Source Map 完整对比

### devtool 配置一览

| devtool | 构建速度 | 重建速度 | 生产环境 | 质量 | 文件大小 |
|---------|---------|---------|---------|------|---------|
| **eval** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐ | 小 |
| **eval-cheap-source-map** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐ | 小 |
| **eval-cheap-module-source-map** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ | 中 |
| **eval-source-map** | ⭐⭐ | ⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ | 大 |
| **cheap-source-map** | ⭐⭐⭐ | ⭐⭐ | ✅ | ⭐⭐ | 中 |
| **cheap-module-source-map** | ⭐⭐ | ⭐⭐ | ✅ | ⭐⭐⭐ | 中 |
| **source-map** | ⭐ | ⭐ | ✅ | ⭐⭐⭐⭐⭐ | 大 |
| **inline-source-map** | ⭐ | ⭐ | ❌ | ⭐⭐⭐⭐⭐ | 巨大 |
| **hidden-source-map** | ⭐ | ⭐ | ✅ | ⭐⭐⭐⭐⭐ | 大 |
| **nosources-source-map** | ⭐ | ⭐ | ✅ | ⭐⭐⭐ | 中 |

### 关键词解析

#### eval

```javascript
// 使用 eval 包裹模块代码
eval("var a = 1; console.log(a);\n//# sourceURL=webpack://./src/index.js");
```

- **特点**：代码在 `eval()` 中执行，通过 `sourceURL` 指向源文件
- **优点**：构建和重建速度最快
- **缺点**：无法定位到源码的准确行列

#### cheap

```javascript
// cheap: 只映射到行，不映射到列
// 原始代码: console.log('Hello');  // 第 5 行第 10 列
// cheap: 只知道第 5 行
// 非 cheap: 知道第 5 行第 10 列
```

- **优点**：生成速度更快，文件更小
- **缺点**：无法定位到具体列（通常行定位已足够）

#### module

```javascript
// module: 映射 Loader 处理前的代码
// 非 module: 映射 Loader 处理后的代码

// 原始代码 (TypeScript)
const greeting: string = 'Hello';

// 非 module: 映射到 Babel 转换后的代码
var greeting = 'Hello';

// module: 映射到原始 TypeScript 代码
const greeting: string = 'Hello';
```

- **优点**：调试时看到的是源码（TS/JSX/SCSS）
- **缺点**：生成速度稍慢

#### inline

```javascript
// inline: Source Map 内联到 Bundle 中
// 非 inline: Source Map 单独的 .map 文件

// inline
var a=1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9u...

// 非 inline
var a=1;
//# sourceMappingURL=main.js.map
```

- **优点**：不需要额外的 HTTP 请求
- **缺点**：显著增大 Bundle 体积（通常不推荐）

#### hidden

```javascript
// hidden: 生成 Source Map 但不在 Bundle 中引用
// 非 hidden
var a=1;
//# sourceMappingURL=main.js.map  // ← 引用了

// hidden
var a=1;
// ← 没有引用，但 main.js.map 文件存在
```

- **用途**：生产环境，Source Map 只上传到监控平台，不暴露给用户

#### nosources

```javascript
// nosources: Source Map 中不包含源码内容
// 只包含行列映射信息，不包含源码文本
```

- **优点**：安全，不泄露源码
- **缺点**：调试时需要本地源码

## ⚙️ 环境推荐配置

### 开发环境（推荐）

```javascript
// webpack.dev.js
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map'  // ⭐ 推荐
};
```

**理由**：
- ✅ **eval**：最快的重建速度（HMR 快）
- ✅ **cheap**：不需要列映射，构建更快
- ✅ **module**：映射到源码（TS/JSX），调试友好

**替代方案**：

```javascript
// 方案 1：极致速度（牺牲调试体验）
devtool: 'eval'

// 方案 2：平衡方案（默认）
devtool: 'eval-cheap-module-source-map'

// 方案 3：最佳调试体验（较慢）
devtool: 'eval-source-map'
```

### 生产环境（推荐）

```javascript
// webpack.prod.js
module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map'  // ⭐ 推荐
};
```

**理由**：
- ✅ 生成完整的 Source Map（调试精准）
- ✅ 不在 Bundle 中引用（用户看不到）
- ✅ 上传到监控平台（Sentry/Bugsnag）
- ✅ 错误时可以反向映射

**替代方案**：

```javascript
// 方案 1：不需要调试（最快）
devtool: false  // 或不设置

// 方案 2：监控平台（推荐）
devtool: 'hidden-source-map'

// 方案 3：允许用户调试（不推荐，泄露源码）
devtool: 'source-map'

// 方案 4：安全调试（不包含源码）
devtool: 'nosources-source-map'
```

## 📊 性能对比实测

### 测试项目

中型 React 项目（50 个组件，总代码量 20,000 行）

| devtool | 首次构建 | 重建时间 | Bundle 大小 | .map 文件大小 |
|---------|---------|---------|------------|-------------|
| **无 Source Map** | 8s | 1s | 500 KB | 0 KB |
| **eval** | 10s | 1.2s | 500 KB | 0 KB |
| **eval-cheap-source-map** | 12s | 1.5s | 500 KB | 0 KB |
| **eval-cheap-module-source-map** | 15s | 2s | 500 KB | 0 KB |
| **eval-source-map** | 20s | 3s | 500 KB | 0 KB |
| **source-map** | 25s | 8s | 500 KB | 2 MB |
| **hidden-source-map** | 25s | 8s | 500 KB | 2 MB |

**关键发现**：
- `eval` 系列：重建快（1-3s），适合开发
- `source-map`：构建慢（25s），但质量最高，适合生产
- `hidden-source-map`：与 `source-map` 性能相同，但更安全

## 🔒 生产环境安全策略

### 问题：Source Map 泄露源码

```javascript
// 用户打开 DevTools
main.js (compressed)
└── main.js.map (full source code)  // ← 源码完全暴露！
```

### 解决方案 1：hidden-source-map

```javascript
// webpack.prod.js
module.exports = {
  devtool: 'hidden-source-map'
};

// 产物
dist/
├── main.abc123.js         // 不包含 sourceMappingURL
└── main.abc123.js.map     // Source Map 文件存在
```

**部署时**：

```bash
# 只部署 .js 文件到 CDN
rsync -av dist/*.js cdn:/
# 或使用 .gitignore
echo "*.map" >> .gitignore

# .map 文件上传到监控平台
sentry-cli upload-sourcemaps ./dist --url-prefix ~/
```

### 解决方案 2：nosources-source-map

```javascript
// webpack.prod.js
module.exports = {
  devtool: 'nosources-source-map'
};
```

**效果**：

```json
// Source Map 中不包含源码
{
  "version": 3,
  "sources": ["webpack://./src/index.js"],
  "sourcesContent": null,  // ← 没有源码内容
  "mappings": "AAAA,QAAQ,IAAI..."
}
```

**优点**：
- Source Map 可以公开
- 不泄露源码
- 可以定位错误位置（需要本地源码）

### 解决方案 3：SourceMapDevToolPlugin

精细控制 Source Map 生成：

```javascript
const webpack = require('webpack');

module.exports = {
  devtool: false,  // 禁用默认 Source Map
  
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath: 'https://sourcemaps.example.com/',  // Source Map 托管地址
      fileContext: 'src',
      exclude: /vendor/,  // 排除第三方库
      noSources: false,   // 包含源码
      moduleFilenameTemplate: '[resource-path]'
    })
  ]
};
```

## 🚀 监控平台集成

### Sentry 集成

```bash
npm install --save-dev @sentry/webpack-plugin
```

```javascript
// webpack.prod.js
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  devtool: 'hidden-source-map',
  
  plugins: [
    new SentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'your-org',
      project: 'your-project',
      include: './dist',  // 上传的目录
      ignore: ['node_modules', 'webpack.config.js'],
      urlPrefix: '~/static/',  // CDN 路径前缀
      release: process.env.RELEASE_VERSION,
      deploy: {
        env: 'production'
      }
    })
  ]
};
```

**工作流程**：

```
1. 本地构建
   ├── 生成 main.js
   └── 生成 main.js.map

2. Sentry Plugin
   ├── 上传 main.js.map 到 Sentry
   └── 关联 Release 版本

3. 部署到 CDN
   └── 只部署 main.js（不部署 .map）

4. 用户访问
   └── 下载 main.js（无 Source Map）

5. 错误上报
   ├── 用户触发错误
   ├── Sentry 捕获错误（压缩后的代码）
   ├── Sentry 使用 Source Map 反向映射
   └── 显示原始源码和错误位置
```

### 错误映射示例

```javascript
// 用户浏览器中的错误
Error: Cannot read property 'foo' of undefined
  at Object.r (main.abc123.js:1:2345)

// Sentry 反向映射后
Error: Cannot read property 'foo' of undefined
  at UserProfile.render (src/components/UserProfile.jsx:42:15)
  //                     ↑ 原始文件                      ↑ 原始行列
```

## 💡 优化技巧

### 1. 按环境选择

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    devtool: isDevelopment
      ? 'eval-cheap-module-source-map'  // 开发：快速
      : 'hidden-source-map'             // 生产：安全
  };
};
```

### 2. 排除第三方库

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      exclude: /node_modules/  // 排除第三方库（减小 .map 文件）
    })
  ]
};
```

### 3. 使用 babel-loader 缓存

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,  // 加速重建
            sourceMap: true        // 保留 Source Map
          }
        }
      }
    ]
  }
};
```

### 4. 压缩 Source Map

```bash
# 压缩 .map 文件
gzip dist/*.map

# 减少 70-80% 的体积
main.js.map (2 MB) → main.js.map.gz (400 KB)
```

## 🎯 最佳实践

### 开发环境

```javascript
// webpack.dev.js
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  
  optimization: {
    minimize: false  // 不压缩，加快构建
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            sourceMap: true
          }
        }
      }
    ]
  }
};
```

### 生产环境

```javascript
// webpack.prod.js
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map',
  
  optimization: {
    minimize: true
  },
  
  plugins: [
    // 上传 Source Map 到 Sentry
    new SentryWebpackPlugin({
      include: './dist',
      ignore: ['node_modules'],
      urlPrefix: '~/static/',
      release: process.env.npm_package_version
    })
  ]
};

// package.json
{
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "deploy": "npm run build && rm dist/*.map && rsync -av dist/ cdn:/"
  }
}
```

## 📈 调试技巧

### Chrome DevTools 使用

```
1. 打开 DevTools → Sources
2. 查看 webpack:// (源码)
   ├── src/
   │   ├── index.js
   │   └── components/
3. 设置断点（在源码上，不是压缩后的代码）
4. 单步调试
5. 查看变量值
```

### Source Map 验证

```javascript
// 检查 Source Map 是否生效
console.error(new Error('Test error'));

// 查看错误栈
// ✅ 如果显示源文件名和行号，Source Map 生效
// ❌ 如果显示 main.js:1:2345，Source Map 未生效
```

## 🔗 相关资源

- [Webpack Devtool 官方文档](https://webpack.js.org/configuration/devtool/)
- [Source Map 规范](https://sourcemaps.info/spec.html)
- [Sentry 文档](https://docs.sentry.io/platforms/javascript/)

## 📝 总结

| 场景 | 推荐配置 | 理由 |
|------|---------|------|
| **开发环境** | `eval-cheap-module-source-map` | 快速重建 + 映射源码 |
| **生产环境（监控）** | `hidden-source-map` | 完整映射 + 安全 |
| **生产环境（无监控）** | `nosources-source-map` | 不泄露源码 |
| **快速原型** | `eval` | 极致速度 |
| **调试第三方库** | `eval-source-map` | 完整映射 |

---

**记住**：Source Map 是调试的利器，但也要注意安全性和性能平衡！

恭喜！🎉 你已经完成了 **Phase 13: 产物优化** 的全部文档学习！

下一步：运行 Demo 项目，实战体验产物优化的效果！

