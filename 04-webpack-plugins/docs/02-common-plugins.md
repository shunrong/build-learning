# 常用 Plugin 详解

本文档详细介绍 Webpack 生态中最常用的 Plugin，理解它们的作用、配置和原理。

---

## 📋 目录

1. [HtmlWebpackPlugin](#1-htmlwebpackplugin) - 生成 HTML
2. [MiniCssExtractPlugin](#2-minicssextractplugin) - 提取 CSS
3. [CleanWebpackPlugin](#3-cleanwebpackplugin) - 清理目录
4. [CopyWebpackPlugin](#4-copywebpackplugin) - 复制文件
5. [DefinePlugin](#5-defineplugin) - 定义常量
6. [ProvidePlugin](#6-provideplugin) - 自动加载模块
7. [BundleAnalyzerPlugin](#7-bundleanalyzerplugin) - 分析打包
8. [CompressionPlugin](#8-compressionplugin) - Gzip 压缩
9. [HotModuleReplacementPlugin](#9-hotmodulereplacementplugin) - 热更新

---

## 1. HtmlWebpackPlugin

### 🎯 作用

自动生成 HTML 文件，并自动注入打包后的 JS 和 CSS。

### 📦 安装

```bash
npm install html-webpack-plugin --save-dev
```

### ⚙️ 基础配置

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // 模板文件
      filename: 'index.html',         // 输出文件名
      title: '我的应用'               // HTML 标题
    })
  ]
};
```

### 🔧 高级配置

```javascript
new HtmlWebpackPlugin({
  // 基础配置
  template: './src/index.html',
  filename: 'index.html',
  
  // 注入位置
  inject: 'body',  // 'head' | 'body' | true | false
  
  // 压缩选项（生产模式自动开启）
  minify: {
    removeComments: true,           // 移除注释
    collapseWhitespace: true,       // 压缩空白
    removeAttributeQuotes: true     // 移除属性引号
  },
  
  // 指定包含的 chunk
  chunks: ['main', 'vendor'],
  
  // chunk 排序
  chunksSortMode: 'manual',  // 'auto' | 'manual' | 'none'
  
  // 自定义元数据
  meta: {
    viewport: 'width=device-width, initial-scale=1',
    description: '应用描述'
  },
  
  // 添加 favicon
  favicon: './src/favicon.ico'
})
```

### 📝 模板语法

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- 使用 EJS 模板语法 -->
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <div id="app"></div>
  
  <!-- 访问配置 -->
  <script>
    window.CONFIG = {
      title: '<%= htmlWebpackPlugin.options.title %>',
      chunks: <%= JSON.stringify(htmlWebpackPlugin.options.chunks) %>
    };
  </script>
</body>
</html>
```

### 🎨 多页面配置

```javascript
module.exports = {
  entry: {
    home: './src/pages/home/index.js',
    about: './src/pages/about/index.js'
  },
  
  plugins: [
    // 首页
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html',
      filename: 'home.html',
      chunks: ['home', 'common'],  // 只包含这些 chunk
      title: '首页'
    }),
    
    // 关于页
    new HtmlWebpackPlugin({
      template: './src/pages/about/index.html',
      filename: 'about.html',
      chunks: ['about', 'common'],
      title: '关于我们'
    })
  ]
};
```

### 💡 原理解析

```javascript
// HtmlWebpackPlugin 简化原理
class SimpleHtmlWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('SimpleHtmlWebpackPlugin', (compilation, callback) => {
      // 1. 读取模板
      const template = fs.readFileSync(this.options.template, 'utf-8');
      
      // 2. 获取所有生成的 JS 和 CSS 文件
      const scripts = [];
      const styles = [];
      
      for (const filename in compilation.assets) {
        if (filename.endsWith('.js')) {
          scripts.push(`<script src="${filename}"></script>`);
        }
        if (filename.endsWith('.css')) {
          styles.push(`<link rel="stylesheet" href="${filename}">`);
        }
      }
      
      // 3. 替换模板中的占位符
      let html = template
        .replace('</head>', `${styles.join('\n')}</head>`)
        .replace('</body>', `${scripts.join('\n')}</body>`);
      
      // 4. 添加到输出文件
      compilation.assets['index.html'] = {
        source: () => html,
        size: () => html.length
      };
      
      callback();
    });
  }
}
```

---

## 2. MiniCssExtractPlugin

### 🎯 作用

将 CSS 从 JS 中提取到独立的 `.css` 文件，支持按需加载和长期缓存。

### 📦 安装

```bash
npm install mini-css-extract-plugin --save-dev
```

### ⚙️ 基础配置

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // 替代 style-loader
          'css-loader'
        ]
      }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css'
    })
  ]
};
```

### 🔧 开发 vs 生产配置

```javascript
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // 开发模式：style-loader（注入）
            // 生产模式：MiniCssExtractPlugin（提取）
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
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

### 🎨 高级配置

```javascript
new MiniCssExtractPlugin({
  // 主 chunk 的 CSS 文件名
  filename: 'css/[name].[contenthash:8].css',
  
  // 异步 chunk 的 CSS 文件名
  chunkFilename: 'css/[id].[contenthash:8].css',
  
  // 忽略顺序警告
  ignoreOrder: false,
  
  // 自定义 loader 选项
  experimentalUseImportModule: true
})
```

### 💡 为什么需要提取 CSS？

```
style-loader（开发）          vs          MiniCssExtractPlugin（生产）
==================                      ======================

文件结构：                              文件结构：
└── main.js (100KB)                     ├── main.js (70KB)
    ├── 业务代码 (70KB)                 └── main.css (30KB)
    └── CSS (30KB) ← 包含在 JS 中

加载流程：                              加载流程：
1. 下载 main.js (100KB)                 1. 并行下载：
2. 执行 JS，创建 <style>                   - main.js (70KB)
3. 页面渲染                                - main.css (30KB)
                                        2. CSS 立即渲染
                                        3. JS 异步执行

缺点：                                  优点：
❌ 首屏渲染慢（JS 先执行）              ✅ 并行加载（更快）
❌ 无法利用浏览器缓存                   ✅ 单独缓存 CSS
❌ JS 体积大                            ✅ 减小 JS 体积
✅ 热更新快（适合开发）                 ✅ 首屏渲染快
```

---

## 3. CleanWebpackPlugin

### 🎯 作用

在每次构建前清理输出目录，避免旧文件残留。

### 📦 安装

```bash
npm install clean-webpack-plugin --save-dev
```

### ⚙️ 基础配置

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin()  // 默认清理 output.path 目录
  ]
};
```

### 🔧 高级配置

```javascript
new CleanWebpackPlugin({
  // 清理的文件/文件夹（glob 模式）
  cleanOnceBeforeBuildPatterns: [
    '**/*',           // 清理所有文件
    '!static-files*'  // 保留 static-files 开头的文件
  ],
  
  // 每次编译后清理（watch 模式）
  cleanAfterEveryBuildPatterns: ['!important.js'],
  
  // 允许清理输出目录外的文件
  dangerouslyAllowCleanPatternsOutsideProject: true,
  
  // 模拟删除（不实际删除）
  dry: false,
  
  // 打印日志
  verbose: true
})
```

### 💡 Webpack 5 内置方案

```javascript
// Webpack 5 推荐使用内置的 clean 选项
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true  // ✅ 自动清理
  }
};
```

---

## 4. CopyWebpackPlugin

### 🎯 作用

将文件或目录复制到输出目录，适合处理不需要打包的静态资源。

### 📦 安装

```bash
npm install copy-webpack-plugin --save-dev
```

### ⚙️ 基础配置

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' }
      ]
    })
  ]
};
```

### 🔧 高级配置

```javascript
new CopyWebpackPlugin({
  patterns: [
    // 1. 复制整个目录
    {
      from: 'public',
      to: 'public'
    },
    
    // 2. 复制单个文件
    {
      from: 'src/favicon.ico',
      to: 'favicon.ico'
    },
    
    // 3. 使用 glob 模式
    {
      from: 'assets/**/*.png',
      to: 'images/[name][ext]'
    },
    
    // 4. 转换文件内容
    {
      from: 'config.json',
      to: 'config.json',
      transform(content, path) {
        const config = JSON.parse(content);
        config.buildTime = new Date().toISOString();
        return JSON.stringify(config, null, 2);
      }
    },
    
    // 5. 排除某些文件
    {
      from: 'public',
      to: 'public',
      globOptions: {
        ignore: ['**/*.md', '**/.DS_Store']
      }
    }
  ]
})
```

### 💡 使用场景

```
需要复制的文件：
================
✅ favicon.ico
✅ robots.txt
✅ manifest.json
✅ 第三方库的静态文件（如 PDFJS）
✅ 配置文件

不需要复制的文件：
================
❌ 图片（应该用 asset modules）
❌ 字体（应该用 asset modules）
❌ CSS/JS（应该通过 import 引入）
```

---

## 5. DefinePlugin

### 🎯 作用

在编译时创建全局常量，常用于区分环境和注入配置。

### ⚙️ 基础配置

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // 注意：值会被直接替换到代码中
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify('https://api.example.com'),
      '__VERSION__': JSON.stringify('1.0.0'),
      '__DEV__': false  // 布尔值不需要 JSON.stringify
    })
  ]
};
```

### 🔧 实际效果

```javascript
// 源代码：
if (process.env.NODE_ENV === 'production') {
  console.log('生产环境');
}
console.log(__VERSION__);

// 编译后：
if ('production' === 'production') {  // ← 直接替换
  console.log('生产环境');
}
console.log('1.0.0');  // ← 直接替换
```

### 💡 注意事项

```javascript
// ❌ 错误：没有 JSON.stringify
new webpack.DefinePlugin({
  'process.env.NODE_ENV': 'production'  // 错误！
});

// 编译后会变成（语法错误）：
if (process.env.NODE_ENV === production) {  // production 未定义
  //...
}

// ✅ 正确：使用 JSON.stringify
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
});

// 编译后：
if (process.env.NODE_ENV === 'production') {  // ← 正确
  //...
}
```

### 🎨 高级用法

```javascript
const pkg = require('./package.json');

new webpack.DefinePlugin({
  // 环境变量
  'process.env': JSON.stringify({
    NODE_ENV: 'production',
    API_URL: 'https://api.example.com',
    DEBUG: false
  }),
  
  // 版本信息
  '__VERSION__': JSON.stringify(pkg.version),
  '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
  
  // 功能开关
  '__FEATURE_FLAGS__': JSON.stringify({
    enableNewUI: true,
    enableAnalytics: false
  })
});

// 在代码中使用：
console.log(`版本：${__VERSION__}`);
console.log(`构建时间：${__BUILD_TIME__}`);

if (__FEATURE_FLAGS__.enableNewUI) {
  // 使用新 UI
}
```

---

## 6. ProvidePlugin

### 🎯 作用

自动加载模块，无需手动 import，常用于全局库（如 jQuery）。

### ⚙️ 基础配置

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',              // 遇到 $ 自动 import jquery
      jQuery: 'jquery',         // 遇到 jQuery 也自动 import jquery
      _: 'lodash'               // 遇到 _ 自动 import lodash
    })
  ]
};
```

### 🔧 实际效果

```javascript
// 源代码（没有 import）：
$('#app').text('Hello');
const arr = _.chunk([1, 2, 3, 4], 2);

// 等价于：
import $ from 'jquery';
import _ from 'lodash';

$('#app').text('Hello');
const arr = _.chunk([1, 2, 3, 4], 2);
```

### 🎨 高级用法

```javascript
new webpack.ProvidePlugin({
  // 导入默认导出
  React: 'react',
  
  // 导入命名导出
  Promise: ['es6-promise', 'Promise'],
  
  // 导入模块的某个方法
  join: ['lodash', 'join'],
  
  // 自定义模块
  utils: path.resolve(__dirname, 'src/utils')
});
```

### 💡 使用场景

```
适合使用 ProvidePlugin 的场景：
============================
✅ jQuery（老项目迁移）
✅ Lodash 工具函数
✅ Polyfill（如 Promise）

不适合使用的场景：
==================
❌ React（现代项目应该显式 import）
❌ Vue（应该显式 import）
❌ 业务模块（应该显式 import，保持清晰）
```

---

## 7. BundleAnalyzerPlugin

### 🎯 作用

可视化分析打包产物，找出体积大的模块，优化打包体积。

### 📦 安装

```bash
npm install webpack-bundle-analyzer --save-dev
```

### ⚙️ 基础配置

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### 🔧 高级配置

```javascript
new BundleAnalyzerPlugin({
  // 分析模式
  analyzerMode: 'server',  // 'server' | 'static' | 'json' | 'disabled'
  
  // 服务器配置
  analyzerHost: '127.0.0.1',
  analyzerPort: 8888,
  
  // 生成静态 HTML
  reportFilename: 'bundle-report.html',
  
  // 默认大小类型
  defaultSizes: 'parsed',  // 'stat' | 'parsed' | 'gzip'
  
  // 自动打开浏览器
  openAnalyzer: true,
  
  // 生成统计 JSON
  generateStatsFile: false,
  statsFilename: 'stats.json'
})
```

### 🎨 不同模式对比

```javascript
// 模式 1：开发模式（启动服务器）
new BundleAnalyzerPlugin({
  analyzerMode: 'server',
  openAnalyzer: true
});
// 运行后自动打开 http://127.0.0.1:8888

// 模式 2：生成静态 HTML
new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  reportFilename: 'report.html',
  openAnalyzer: false
});
// 生成 dist/report.html，可以直接打开查看

// 模式 3：仅生成 JSON 数据
new BundleAnalyzerPlugin({
  analyzerMode: 'json',
  generateStatsFile: true,
  statsFilename: 'stats.json'
});
// 生成 JSON 文件，可以用其他工具分析
```

### 💡 使用技巧

```bash
# 方式 1：作为插件（推荐生产环境分析）
npm run build

# 方式 2：分析脚本
{
  "scripts": {
    "analyze": "webpack --mode production --profile --json > stats.json && webpack-bundle-analyzer stats.json"
  }
}
npm run analyze

# 方式 3：只在需要时启用
ANALYZE=true npm run build
```

```javascript
// webpack.config.js
const shouldAnalyze = process.env.ANALYZE === 'true';

module.exports = {
  plugins: [
    shouldAnalyze && new BundleAnalyzerPlugin()
  ].filter(Boolean)
};
```

---

## 8. CompressionPlugin

### 🎯 作用

生成 Gzip 压缩版本的资源，减少网络传输体积。

### 📦 安装

```bash
npm install compression-webpack-plugin --save-dev
```

### ⚙️ 基础配置

```javascript
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin()
  ]
};
```

### 🔧 高级配置

```javascript
new CompressionPlugin({
  // 压缩算法
  algorithm: 'gzip',  // 'gzip' | 'brotliCompress'
  
  // 匹配文件
  test: /\.(js|css|html|svg)$/,
  
  // 只压缩大于 10KB 的文件
  threshold: 10240,
  
  // 压缩比小于 0.8 才保留
  minRatio: 0.8,
  
  // 删除原文件（不推荐）
  deleteOriginalAssets: false,
  
  // 自定义文件名
  filename: '[path][base].gz'
})
```

### 💡 压缩效果

```
原始文件：
main.js          500 KB

压缩后：
main.js          500 KB  ← 原文件保留
main.js.gz       150 KB  ← Gzip 压缩版本（70% 减少）

服务器配置（Nginx）：
gzip_static on;  # 优先使用 .gz 文件
```

### 🎨 Gzip vs Brotli

```javascript
// Gzip（兼容性好）
new CompressionPlugin({
  algorithm: 'gzip',
  test: /\.(js|css|html)$/,
  filename: '[path][base].gz'
});

// Brotli（压缩率更高，但需要更新的浏览器）
new CompressionPlugin({
  algorithm: 'brotliCompress',
  test: /\.(js|css|html|svg)$/,
  filename: '[path][base].br',
  compressionOptions: { level: 11 },
  minRatio: 0.8
});
```

---

## 9. HotModuleReplacementPlugin

### 🎯 作用

启用热模块替换（HMR），无需刷新页面即可更新模块。

### ⚙️ 配置

```javascript
const webpack = require('webpack');

module.exports = {
  devServer: {
    hot: true  // 自动启用 HMR，无需手动添加插件
  },
  
  // 或手动添加插件（Webpack 4）
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

### 💡 HMR 原理

```
1. 文件变化
   ↓
2. Webpack 重新编译
   ↓
3. 生成 update manifest（JSON）
   ↓
4. 通过 WebSocket 推送给浏览器
   ↓
5. 浏览器下载更新的模块
   ↓
6. HMR Runtime 替换旧模块
   ↓
7. 执行 module.hot.accept 回调
```

### 🎨 在代码中使用 HMR

```javascript
// 1. CSS 文件（自动支持）
import './style.css';
// CSS 修改后自动热更新，无需配置

// 2. JS 模块（需要手动配置）
import { render } from './app.js';

render();

if (module.hot) {
  module.hot.accept('./app.js', () => {
    // 模块更新后的回调
    console.log('app.js 已更新');
    render();  // 重新渲染
  });
}

// 3. React（使用 react-refresh）
// 自动支持，无需手动配置
```

---

## 📊 Plugin 选择指南

### 必备 Plugin

```javascript
module.exports = {
  plugins: [
    // ✅ 必须：生成 HTML
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    
    // ✅ 生产必须：提取 CSS
    !isDev && new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    }),
    
    // ✅ 推荐：清理目录（或使用 output.clean）
    new CleanWebpackPlugin()
  ].filter(Boolean)
};
```

### 优化 Plugin

```javascript
plugins: [
  // 🎯 分析打包（按需）
  process.env.ANALYZE && new BundleAnalyzerPlugin(),
  
  // 🎯 Gzip 压缩（生产）
  !isDev && new CompressionPlugin(),
  
  // 🎯 定义环境变量
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
].filter(Boolean)
```

### 特殊场景 Plugin

```javascript
plugins: [
  // 📦 复制静态资源
  new CopyWebpackPlugin({
    patterns: [{ from: 'public', to: 'public' }]
  }),
  
  // 🔧 自动加载模块（老项目）
  new webpack.ProvidePlugin({
    $: 'jquery'
  })
]
```

---

## 🎯 总结

### 按用途分类

| 用途 | Plugin | 必要性 |
|------|--------|--------|
| **HTML 生成** | HtmlWebpackPlugin | ⭐⭐⭐⭐⭐ |
| **CSS 提取** | MiniCssExtractPlugin | ⭐⭐⭐⭐ |
| **目录清理** | CleanWebpackPlugin / output.clean | ⭐⭐⭐⭐ |
| **环境变量** | DefinePlugin | ⭐⭐⭐⭐ |
| **文件复制** | CopyWebpackPlugin | ⭐⭐⭐ |
| **打包分析** | BundleAnalyzerPlugin | ⭐⭐⭐ |
| **Gzip 压缩** | CompressionPlugin | ⭐⭐ |
| **自动加载** | ProvidePlugin | ⭐ |
| **热更新** | HotModuleReplacementPlugin | 自动 |

### 推荐配置

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const shouldAnalyze = process.env.ANALYZE === 'true';
  
  return {
    plugins: [
      // HTML 生成
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: !isDev
      }),
      
      // CSS 提取（仅生产）
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
      }),
      
      // 环境变量
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
        '__VERSION__': JSON.stringify(require('./package.json').version)
      }),
      
      // Gzip 压缩（仅生产）
      !isDev && new CompressionPlugin(),
      
      // 打包分析（按需）
      shouldAnalyze && new BundleAnalyzerPlugin()
    ].filter(Boolean),
    
    output: {
      clean: true  // Webpack 5 内置清理
    }
  };
};
```

---

下一步，继续学习：[Webpack 生命周期与 Hooks](./03-webpack-lifecycle.md)

