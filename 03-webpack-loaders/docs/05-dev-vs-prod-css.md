# 开发 vs 生产：CSS 处理策略详解

## 🎯 核心差异

| 环境 | Loader | CSS 位置 | 特点 | 适用场景 |
|------|--------|---------|------|----------|
| **开发** | `style-loader` | `<style>` 标签 | 热更新快、调试方便 | 本地开发 |
| **生产** | `MiniCssExtractPlugin.loader` | 独立 `.css` 文件 | 可缓存、并行加载 | 线上部署 |

---

## 📋 配置对比

### 1️⃣ 开发环境配置

```javascript
// webpack.config.js
module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    }
  };
};
```

**关键点**：
- ✅ 使用 `argv.mode` 而不是 `process.env.NODE_ENV`（更可靠）
- ✅ 三元表达式动态选择 loader

---

### 2️⃣ 生产环境配置

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    },
    
    plugins: [
      // 只在生产环境启用
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
      })
    ].filter(Boolean)  // 过滤掉 false 值
  };
};
```

---

## 🔬 底层原理详解

### style-loader 的工作原理

```javascript
// 1. 输入：css-loader 输出的 CSS 模块
const cssModule = require('css-loader!./style.css');

// 2. style-loader 内部实现（简化版）
function styleLoader(css) {
  // 创建 <style> 标签
  const style = document.createElement('style');
  style.textContent = css;
  
  // 插入到 <head>
  document.head.appendChild(style);
  
  // 支持热更新
  if (module.hot) {
    module.hot.accept('./style.css', () => {
      style.textContent = newCss;  // 更新样式
    });
  }
}

// 3. 输出：运行时注入
// 最终 HTML：
// <head>
//   <style>
//     .button { background: blue; }
//   </style>
// </head>
```

**执行时机**：
- 在浏览器**运行时**执行
- CSS 包含在 JS bundle 中
- 动态创建 `<style>` 标签

---

### MiniCssExtractPlugin.loader 的工作原理

```javascript
// 1. 构建阶段：提取 CSS
class MiniCssExtractPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('Plugin', (compilation) => {
      // 收集所有 CSS 模块
      const cssChunks = new Map();
      
      compilation.hooks.processAssets.tap('Plugin', (assets) => {
        // 从 JS 中提取 CSS
        for (const chunk of compilation.chunks) {
          const cssContent = extractCSSFromChunk(chunk);
          
          // 生成独立的 CSS 文件
          const filename = `css/main.${contentHash}.css`;
          assets[filename] = {
            source: () => cssContent,
            size: () => cssContent.length
          };
        }
      });
    });
  }
}

// 2. 构建输出：
// dist/
//   ├── js/main.abc123.js  (不包含 CSS)
//   └── css/main.def456.css  (独立的 CSS)

// 3. HTML 输出：
// <head>
//   <link rel="stylesheet" href="css/main.def456.css">
// </head>
// <body>
//   <script src="js/main.abc123.js"></script>
// </body>
```

**执行时机**：
- 在**构建时**执行
- CSS 从 JS 中分离
- 生成独立的 `.css` 文件

---

## 🚀 性能对比

### 开发环境：style-loader

```
文件结构：
└── js/main.js (100KB)
    ├── 业务代码 (70KB)
    └── CSS 代码 (30KB) ← 包含在 JS 中

加载流程：
1. 下载 main.js (100KB)
2. 执行 JS，动态创建 <style>
3. 渲染页面

优点：
✅ 热更新极快（只更新 <style> 内容）
✅ 不需要额外 HTTP 请求
✅ Source Map 调试方便

缺点：
❌ 初始 JS 体积大（包含 CSS）
❌ 首屏渲染慢（先执行 JS 才有样式）
❌ 无法利用浏览器并行加载
```

---

### 生产环境：MiniCssExtractPlugin

```
文件结构：
├── js/main.abc123.js (70KB)  ← 纯业务代码
└── css/main.def456.css (30KB)  ← 独立 CSS

加载流程：
1. 并行下载：
   - main.js (70KB)
   - main.css (30KB)
2. CSS 立即渲染
3. JS 异步执行

优点：
✅ 并行加载（JS + CSS 同时下载）
✅ 首屏渲染快（CSS 先生效）
✅ 浏览器缓存（CSS 单独缓存）
✅ 减小 JS 体积

缺点：
❌ 额外 HTTP 请求
❌ 构建时间略长（需要提取）
```

---

## 📊 实际场景对比

### 场景 1：首次访问（冷缓存）

#### style-loader（开发）
```
时间线：
0ms     →  请求 main.js (100KB)
200ms   →  下载完成
220ms   →  执行 JS，创建 <style>
250ms   →  页面渲染 ✅
```

#### MiniCssExtractPlugin（生产）
```
时间线：
0ms     →  并行请求：
            - main.js (70KB)
            - main.css (30KB)
140ms   →  main.css 下载完成
160ms   →  CSS 渲染 ✅（页面有样式了！）
180ms   →  main.js 下载完成
200ms   →  JS 执行，功能就绪
```

**结论**：生产环境首屏更快！

---

### 场景 2：修改 CSS 样式

#### style-loader（开发）
```
修改 button.css:
  .button { background: blue; }
        ↓
  .button { background: red; }

HMR 流程：
1. Webpack 检测到文件变化
2. 重新编译 CSS (10ms)
3. 推送更新到浏览器
4. style-loader 更新 <style> 内容 (2ms)
5. 浏览器重绘 ✅

总耗时：~12ms（极快！）
```

#### MiniCssExtractPlugin（生产）
```
修改 button.css:
1. 重新编译 CSS (10ms)
2. 提取到独立文件 (50ms)
3. 生成新的 contenthash (20ms)
4. 刷新页面 (200ms)

总耗时：~280ms（慢！）
```

**结论**：开发环境热更新更快！

---

## 🛠️ 完整配置示例

### 基础配置（单一 CSS 类型）

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  console.log('🔧 构建模式:', argv.mode);
  console.log('  - CSS 处理:', isDev ? 'style-loader' : 'extract');
  
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // 根据环境选择 loader
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev  // 开发环境启用 source map
              }
            }
          ]
        }
      ]
    },
    
    plugins: [
      // 生产环境才启用提取插件
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[id].[contenthash:8].css'
      })
    ].filter(Boolean),
    
    optimization: {
      minimizer: [
        // 生产环境压缩 CSS
        !isDev && new CssMinimizerPlugin()
      ].filter(Boolean)
    }
  };
};
```

---

### 高级配置（Sass + PostCSS）

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            // 1. 环境切换
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            
            // 2. CSS 模块化
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
                importLoaders: 2  // sass + postcss
              }
            },
            
            // 3. PostCSS 处理
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isDev
              }
            },
            
            // 4. Sass 编译
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev,
                api: 'modern'
              }
            }
          ]
        }
      ]
    },
    
    plugins: [
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
      })
    ].filter(Boolean)
  };
};
```

---

## 🎯 关键技术点

### 1. 为什么不能用 `process.env.NODE_ENV`？

```javascript
// ❌ 不可靠
const isDev = process.env.NODE_ENV === 'development';

// ✅ 可靠
module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  // ...
};
```

**原因**：
- `process.env.NODE_ENV` 可能未设置
- 不同操作系统设置方式不同（Windows vs Unix）
- `argv.mode` 直接来自 `--mode` 参数，100% 准确

---

### 2. 插件条件启用的技巧

```javascript
plugins: [
  // 方式 1：三元表达式
  isDev ? null : new MiniCssExtractPlugin(),
  
  // 方式 2：逻辑与
  !isDev && new MiniCssExtractPlugin(),
  
  // 方式 3：数组展开
  ...(isDev ? [] : [new MiniCssExtractPlugin()])
].filter(Boolean)  // 过滤掉 false/null/undefined
```

**推荐**：方式 2（逻辑与），简洁清晰。

---

### 3. contenthash 的重要性

```javascript
// 生产环境配置
new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash:8].css'
  //                    ↑ 基于内容生成 hash
})
```

**作用**：
- CSS 内容不变 → hash 不变 → 浏览器缓存生效
- CSS 内容变化 → hash 变化 → 浏览器重新下载

```
部署流程：
v1: main.abc12345.css (浏览器缓存 1 年)
      ↓
修改样式
      ↓
v2: main.def67890.css (新文件，用户自动获取)
```

---

## 🐛 常见问题

### 问题 1：开发环境也提取了 CSS

```javascript
// ❌ 错误配置
const isDev = process.env.NODE_ENV === 'development';  // 可能未定义

// ✅ 正确配置
module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  // ...
};
```

---

### 问题 2：生产环境没有提取 CSS

```javascript
// ❌ 忘记添加插件
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
  // plugins: []  ← 缺少 MiniCssExtractPlugin 实例
};

// ✅ 完整配置
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ]
};
```

---

### 问题 3：HMR 不工作

```javascript
// ❌ 生产环境用了 style-loader
module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  // 不利于缓存
      }
    ]
  }
};

// ✅ 开发环境才用 style-loader
module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    },
    devServer: {
      hot: true  // 确保开启 HMR
    }
  };
};
```

---

## 📚 完整流程图

```
开发环境（npm run dev）
====================
.scss 文件
    ↓
sass-loader: Sass → CSS
    ↓
postcss-loader: 添加前缀
    ↓
css-loader: CSS → JS 模块
    ↓
style-loader: JS 模块 → <style> 标签 ← 运行时注入
    ↓
浏览器：立即应用样式
    ↓
修改 CSS → HMR 热更新 <style> 内容 (超快！)


生产环境（npm run build）
====================
.scss 文件
    ↓
sass-loader: Sass → CSS
    ↓
postcss-loader: 添加前缀
    ↓
css-loader: CSS → JS 模块
    ↓
MiniCssExtractPlugin.loader: 提取 → 独立 .css 文件 ← 构建时提取
    ↓
CssMinimizerPlugin: 压缩 CSS
    ↓
生成文件：
  - js/main.abc123.js (70KB)
  - css/main.def456.css (30KB)
    ↓
HTML 注入：
  <link rel="stylesheet" href="css/main.def456.css">
  <script src="js/main.abc123.js"></script>
```

---

## 🎯 最佳实践总结

### 开发环境
```javascript
✅ 使用 style-loader
✅ 开启 HMR
✅ 启用 sourceMap
✅ 不压缩、不优化
```

### 生产环境
```javascript
✅ 使用 MiniCssExtractPlugin
✅ 启用 contenthash
✅ CSS 压缩（CssMinimizerPlugin）
✅ 启用长期缓存
```

### 配置检查清单
- [ ] 使用 `argv.mode` 判断环境
- [ ] loader 根据环境动态切换
- [ ] 插件条件启用 + `.filter(Boolean)`
- [ ] 输出文件名包含 `[contenthash]`
- [ ] 开发环境开启 `devServer.hot`

---

## 🔗 相关文档

- [style-loader 官方文档](https://webpack.js.org/loaders/style-loader/)
- [MiniCssExtractPlugin 官方文档](https://webpack.js.org/plugins/mini-css-extract-plugin/)
- [Webpack Mode 配置](https://webpack.js.org/configuration/mode/)

