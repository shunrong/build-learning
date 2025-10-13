# DLL 和 Externals：预编译优化

## 📖 核心问题

### 大型第三方库的构建瓶颈

```
典型的 React 项目：

node_modules/
  ├─ react (200 KB)
  ├─ react-dom (1.2 MB)
  ├─ lodash (500 KB)
  ├─ moment (2.4 MB)  ← ⚠️ 体积大户
  └─ antd (3 MB)      ← ⚠️ 体积大户

问题：
  └─ 每次构建都要重新打包这些库
  └─ 即使它们从不改变 😫
```

**解决思路**：
- 这些库很少变化
- 可以预先编译
- 构建时直接使用

---

## 🔧 方案一：DLLPlugin ⭐️⭐️

### 什么是 DLL？

**DLL (Dynamic Link Library)** = 动态链接库

**原理**：

```
传统构建：
  每次构建 →  打包 react + react-dom + ...
             ↓ (耗时 40s)
  生成 →  bundle.js

DLL 构建：
  第一次 →  预编译 react + react-dom → dll.vendor.js
           ↓ (只需一次，耗时 40s)
  之后 →  直接引用 dll.vendor.js
         ↓ (耗时 0s) ⚡️
  生成 →  bundle.js (更小，更快)
```

---

### 配置步骤

#### 步骤 1：创建 DLL 配置

```javascript
// webpack.dll.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  
  entry: {
    vendor: [
      'react',
      'react-dom',
      'lodash',
      // 其他不常变化的库
    ]
  },
  
  output: {
    path: path.resolve(__dirname, 'dll'),
    filename: '[name].dll.js',
    library: '[name]_library'  // ⭐️ 暴露的全局变量名
  },
  
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.resolve(__dirname, 'dll/[name]-manifest.json')
      //                                 ↑
      //                         ⭐️ manifest 文件（映射关系）
    })
  ]
};
```

---

#### 步骤 2：构建 DLL

```bash
# package.json
{
  "scripts": {
    "build:dll": "webpack --config webpack.dll.config.js"
  }
}

# 执行构建
npm run build:dll
```

**生成文件**：

```
dll/
  ├─ vendor.dll.js           ← DLL 文件（包含 react, react-dom 等）
  └─ vendor-manifest.json    ← manifest 文件（模块映射）
```

---

#### 步骤 3：在主配置中引用 DLL

```javascript
// webpack.config.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  // ...
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./dll/vendor-manifest.json')
      //                    ↑
      //            ⭐️ 引用 manifest 文件
    }),
    
    // 可选：自动在 HTML 中注入 DLL
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dll/vendor.dll.js')
    })
  ]
};
```

---

#### 步骤 4：在 HTML 中引用 DLL

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
  
  <!-- ⭐️ 先加载 DLL -->
  <script src="/dll/vendor.dll.js"></script>
  
  <!-- 再加载主应用 -->
  <script src="/main.js"></script>
</body>
</html>
```

---

### 实战效果

#### 项目背景

```
├─ 技术栈：React + Lodash + Moment
├─ 第三方库体积：5 MB
└─ 第三方库构建时间：40s
```

#### 数据对比

```
┌─────────────────┬──────────┬──────────┬──────────┐
│     场景         │  无 DLL  │ 有 DLL   │  提升    │
├─────────────────┼──────────┼──────────┼──────────┤
│ 首次构建         │  180s    │  140s    │  -22%   │
│ 修改业务代码     │  180s    │  120s    │  -33%   │
│ 修改第三方库     │  180s    │  180s    │   0%    │
│ DLL 预编译       │   -      │  40s     │  (一次性) │
└─────────────────┴──────────┴──────────┴──────────┘

结论：
  ├─ 业务代码修改：提升 30% ⚡️
  ├─ 第三方库修改：需要重新构建 DLL
  └─ 适合：第三方库稳定的项目
```

---

### DLL 的优缺点

#### 优点 ✅

```
1. 加速构建
   └─ 第三方库不需要重复打包

2. 独立部署
   └─ DLL 文件可以长期缓存

3. 减少构建体积
   └─ 主 bundle 更小
```

#### 缺点 ❌

```
1. 配置复杂
   └─ 需要维护两个配置文件

2. 维护成本高
   └─ 第三方库更新时需要重新构建 DLL

3. 效果不如缓存
   └─ Webpack 5 的 filesystem cache 更简单、效果更好

4. 调试困难
   └─ Source Map 复杂
```

---

## 🌐 方案二：Externals ⭐️⭐️⭐️

### 什么是 Externals？

**将某些依赖排除在打包之外，改用 CDN 加载。**

**原理**：

```
传统构建：
  打包：react + react-dom + 你的代码 → bundle.js (5 MB)
         ↓
  加载：bundle.js (5 MB)

Externals 构建：
  打包：你的代码 → bundle.js (500 KB)
         ↓
  加载：
    1. CDN 加载 react.js (200 KB)  ← 全球 CDN，超快
    2. CDN 加载 react-dom.js (1 MB)
    3. 加载 bundle.js (500 KB)
    
  总体积：1.7 MB vs 5 MB（减少 66%）⚡️
```

---

### 配置

```javascript
// webpack.config.js
module.exports = {
  externals: {
    // 包名: 全局变量名
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lodash': '_',
    'moment': 'moment',
    'antd': 'antd'
  }
};
```

**含义**：
- 遇到 `import React from 'react'` 时
- 不打包 react
- 而是使用全局变量 `window.React`

---

### HTML 中引入 CDN

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  
  <!-- ⭐️ 从 CDN 加载第三方库 -->
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js"></script>
</head>
<body>
  <div id="app"></div>
  
  <!-- 你的应用代码 -->
  <script src="/main.js"></script>
</body>
</html>
```

---

### 使用 HtmlWebpackExternalsPlugin

**自动注入 CDN 链接**：

```bash
npm install --save-dev html-webpack-externals-plugin
```

```javascript
// webpack.config.js
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js',
          global: 'React'
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js',
          global: 'ReactDOM'
        }
      ]
    })
  ]
};
```

---

### 实战效果

```
┌─────────────────┬──────────┬──────────┬──────────┐
│     指标         │  无优化   │ Externals│  提升    │
├─────────────────┼──────────┼──────────┼──────────┤
│ 构建时间         │  180s    │  100s    │  -44%   │
│ bundle 体积      │  5 MB    │  800 KB  │  -84%   │
│ 首屏加载时间     │  3.5s    │  1.8s    │  -49%   │
└─────────────────┴──────────┴──────────┴──────────┘

额外优势：
  ├─ CDN 缓存（用户可能已有缓存）
  ├─ 并行加载（浏览器可以同时下载）
  └─ 全球加速（CDN 就近访问）
```

---

### Externals 的优缺点

#### 优点 ✅

```
1. 配置简单
   └─ 只需要配置 externals 对象

2. 构建更快
   └─ 不需要打包第三方库

3. 体积更小
   └─ bundle 体积大幅减少

4. 加载更快
   └─ CDN 缓存 + 并行加载

5. 维护简单
   └─ 不需要重新构建
```

#### 缺点 ❌

```
1. 依赖 CDN 可用性
   └─ CDN 挂了，应用也挂了

2. 版本管理复杂
   └─ 需要确保 CDN 版本和 package.json 一致

3. 本地开发不便
   └─ 需要网络连接

4. 不适合内网环境
   └─ 内网无法访问公共 CDN
```

---

## 📊 方案对比

### 三种方案对比

| 方案 | 构建时间 | 配置复杂度 | 维护成本 | 适用场景 | 推荐度 |
|------|---------|-----------|---------|---------|--------|
| **无优化** | 180s | ⭐️ 简单 | ⭐️ 低 | - | ❌ |
| **DLLPlugin** | 120s | ⭐️⭐️⭐️ 复杂 | ⭐️⭐️⭐️ 高 | 内网、大型项目 | ⭐️ |
| **Externals** | 100s | ⭐️ 简单 | ⭐️ 低 | 公网项目 | ⭐️⭐️⭐️ |
| **Filesystem Cache** | 15s | ⭐️ 简单 | ⭐️ 低 | 所有项目 | ⭐️⭐️⭐️ |

---

### Webpack 5 时代的选择

```
优先级：

P0（最高）：Filesystem Cache
  ├─ 配置简单
  ├─ 效果最好（-90%+）
  └─ 强烈推荐 ⭐️⭐️⭐️

P1（次要）：Externals
  ├─ 配置简单
  ├─ 减少体积
  └─ 推荐（公网项目）⭐️⭐️

P2（可选）：DLLPlugin
  ├─ 配置复杂
  ├─ 维护成本高
  └─ 不推荐（Webpack 5）⭐️

结论：
  └─ Webpack 5 已经不需要 DLL 了
  └─ 优先使用 Cache + Externals
```

---

## 🎯 实战建议

### 推荐组合

```javascript
// webpack.config.js（生产级配置）
module.exports = {
  // 1. 启用缓存（最重要）
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  // 2. 使用 Externals（公网项目）
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lodash': '_'
  },
  
  // 3. 其他优化...
};
```

**效果**：
- 首次构建：180s → 100s（-44%）
- 二次构建：180s → 12s（-93%）⚡️⚡️⚡️
- 包体积：5 MB → 800 KB（-84%）

---

## 🎓 面试攻防

### 问题 1：DLLPlugin 和 Externals 有什么区别？

**标准回答**：

| 对比维度 | DLLPlugin | Externals |
|---------|-----------|-----------|
| **原理** | 预编译第三方库为 DLL | 排除第三方库，使用 CDN |
| **配置** | 复杂（需要两个配置） | 简单（一个配置） |
| **构建时间** | 中等（-30%） | 快（-40%） |
| **包体积** | 中等（分离） | 小（不打包） |
| **依赖性** | 不依赖外部 | 依赖 CDN |
| **适用场景** | 内网环境 | 公网环境 |
| **Webpack 5** | 不推荐 | 推荐 |

**推荐**：
- 公网项目 → Externals
- 内网项目 → Filesystem Cache（不需要 DLL）

---

### 问题 2：Webpack 5 还需要使用 DLL 吗？

**标准回答**：

```
结论：不需要了 ❌

原因：
1. Filesystem Cache 效果更好
   └─ 二次构建提升 90%+
   └─ 配置更简单

2. DLL 的优势已经不明显
   └─ 只能提升 30-40%
   └─ 配置复杂，维护成本高

3. 官方不再推荐
   └─ Webpack 5 文档已不推荐 DLL

替代方案：
  ├─ 缓存：filesystem cache
  ├─ 体积：Externals
  └─ 速度：thread-loader
```

**数据对比**：

```
Filesystem Cache：
  └─ 二次构建：-93% ⚡️⚡️⚡️

DLLPlugin：
  └─ 业务代码修改：-30% ⚡️

谁更好？显而易见。
```

---

### 问题 3：使用 Externals 有什么风险？

**风险和解决方案**：

```
风险 1：CDN 不可用
  └─ 解决：使用 fallback
  
风险 2：版本不一致
  └─ 解决：锁定 CDN 版本号
  
风险 3：本地开发不便
  └─ 解决：开发环境不使用 Externals
  
风险 4：网络延迟
  └─ 解决：选择优质 CDN（如 jsDelivr）
```

**Fallback 配置**：

```html
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script>
  // ⭐️ CDN 加载失败时，加载本地文件
  if (!window.React) {
    document.write('<script src="/vendor/react.min.js"><\/script>');
  }
</script>
```

---

## 🚀 下一步

现在你已经掌握了**预编译优化**：
- ✅ 理解 DLL 和 Externals 的原理
- ✅ 知道如何配置 DLLPlugin
- ✅ 掌握 Externals 的最佳实践
- ✅ 明白 Webpack 5 的优化选择

**Externals 配置简单，效果显著！** ⚡️⚡️

**下一步**：学习综合优化最佳实践 - [05-optimization-best-practices.md](./05-optimization-best-practices.md) 🚀

