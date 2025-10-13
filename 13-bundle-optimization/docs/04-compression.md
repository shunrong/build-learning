# 压缩优化全解析

## 📖 概述

**压缩（Compression）** 是减小产物体积的最直接手段，通过移除空格、注释、缩短变量名、混淆代码等技术，可以将代码体积减少 **50-90%**。

**压缩的层级**：
```
源代码
  ↓ JavaScript 压缩（Terser）
混淆后的代码（减少 40-60%）
  ↓ Gzip 压缩
Gzip 文件（再减少 70-80%）
  ↓ Brotli 压缩（可选）
Brotli 文件（比 Gzip 再减少 15-20%）
```

**本文目标**：
- 掌握 JavaScript、CSS、HTML 压缩
- 理解 Gzip 和 Brotli 压缩
- 学会配置压缩插件
- 平衡压缩率和构建速度

## 🎯 JavaScript 压缩

### 1. Terser（推荐）

Webpack 5 默认使用 **Terser** 进行 JS 压缩。

**安装**：

```bash
npm install --save-dev terser-webpack-plugin
```

**基础配置**：

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',  // production 模式自动启用 Terser
  
  optimization: {
    minimize: true,  // 启用压缩
    minimizer: [
      new TerserPlugin({
        parallel: true,  // 并行压缩，加快速度
        terserOptions: {
          compress: {
            drop_console: true,      // 移除 console.log
            drop_debugger: true,     // 移除 debugger
            pure_funcs: ['console.log']  // 移除特定函数调用
          },
          output: {
            comments: false,  // 移除注释
            ascii_only: true  // 将 Unicode 字符转为 ASCII
          }
        },
        extractComments: false  // 不将注释提取到单独文件
      })
    ]
  }
};
```

### 2. Terser 配置详解

#### compress 选项（压缩）

```javascript
terserOptions: {
  compress: {
    // 1. 移除 console
    drop_console: true,  // 移除所有 console.*
    pure_funcs: ['console.log', 'console.info'],  // 移除特定 console 方法
    
    // 2. 移除 debugger
    drop_debugger: true,
    
    // 3. 移除未使用的代码
    dead_code: true,  // 移除不可达代码
    unused: true,     // 移除未使用的函数和变量
    
    // 4. 优化布尔值和条件
    booleans: true,   // 优化布尔值表达式
    conditionals: true,  // 优化 if 语句
    
    // 5. 内联函数
    inline: true,     // 内联简单函数
    
    // 6. 压缩警告
    warnings: false,  // 不显示警告
    
    // 7. 传递次数（优化深度）
    passes: 2  // 多次传递，进一步优化（默认 1）
  }
}
```

**效果示例**：

```javascript
// 原始代码
function add(a, b) {
  console.log('Adding', a, b);
  debugger;
  return a + b;
}

const result = add(1, 2);
if (result === 3) {
  console.log('Correct!');
}

// 压缩后（drop_console: true, drop_debugger: true）
function add(a,b){return a+b}const result=add(1,2);
```

#### mangle 选项（混淆变量名）

```javascript
terserOptions: {
  mangle: {
    toplevel: true,  // 混淆顶层作用域的变量名
    properties: {
      regex: /^_/  // 混淆以 _ 开头的属性名
    },
    keep_classnames: false,  // 不保留类名
    keep_fnames: false,      // 不保留函数名
    reserved: ['$', 'jQuery']  // 保留特定变量名
  }
}
```

**效果示例**：

```javascript
// 原始代码
function calculateTotal(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  return subtotal + tax;
}

// 混淆后
function a(b){const c=b.reduce((d,e)=>d+e.price,0),f=.1*c;return c+f}
```

#### output 选项（输出格式）

```javascript
terserOptions: {
  output: {
    comments: false,          // 移除所有注释
    beautify: false,          // 不美化输出
    ascii_only: true,         // Unicode 转 ASCII
    quote_style: 3,           // 引号风格（0=首选双引号, 1=首选单引号, 2=首选原始, 3=首选原始最小）
    wrap_iife: true,          // 包裹立即执行函数
    ecma: 2015                // 指定 ECMAScript 版本
  }
}
```

### 3. 压缩率对比

| 配置 | 体积 | 压缩率 | 构建时间 |
|------|------|--------|---------|
| 未压缩 | 1000 KB | 0% | 1s |
| 基础压缩 | 500 KB | 50% | 5s |
| 深度压缩 (passes: 2) | 450 KB | 55% | 10s |
| 深度压缩 + mangle | 400 KB | 60% | 12s |

**建议**：
- 开发环境：不压缩（快速构建）
- 生产环境：深度压缩 + mangle（体积最小）

## 🎨 CSS 压缩

### 1. CssMinimizerPlugin（推荐）

Webpack 5 推荐使用 **CssMinimizerPlugin**。

**安装**：

```bash
npm install --save-dev css-minimizer-webpack-plugin
```

**配置**：

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      `...`,  // 保留默认的 JS 压缩器
      new CssMinimizerPlugin({
        parallel: true,  // 并行压缩
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },  // 移除所有注释
              normalizeWhitespace: true,             // 标准化空格
              colormin: true,                        // 压缩颜色值
              minifyFontValues: true,                // 压缩字体值
              minifyGradients: true                  // 压缩渐变
            }
          ]
        }
      })
    ]
  }
};
```

### 2. CSS 压缩技巧

**压缩效果示例**：

```css
/* 原始 CSS */
.button {
  background-color: #ffffff;
  padding: 10px 20px;
  margin: 0px;
  border-radius: 4px;
}

.button:hover {
  background-color: #f0f0f0;
}

/* 压缩后 */
.button{background-color:#fff;padding:10px 20px;margin:0;border-radius:4px}.button:hover{background-color:#f0f0f0}
```

**高级优化**：

```css
/* 颜色压缩 */
color: #ffffff → color:#fff
color: rgb(255, 255, 255) → color:#fff

/* 单位简化 */
margin: 0px → margin:0
padding: 10px 10px 10px 10px → padding:10px

/* 值简化 */
font-weight: normal → font-weight:400
font-weight: bold → font-weight:700
```

### 3. PurgeCSS（移除未使用的 CSS）

```bash
npm install --save-dev purgecss-webpack-plugin glob
```

```javascript
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const path = require('path');

module.exports = {
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      safelist: ['active', 'selected']  // 保留特定类名
    })
  ]
};
```

**效果**：

```
优化前: bootstrap.css (200 KB)
       实际使用: 20%

优化后: 移除未使用样式 (40 KB)
       减少: 160 KB (80%)
```

## 📄 HTML 压缩

### HtmlWebpackPlugin

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,               // 移除注释
        collapseWhitespace: true,           // 折叠空格
        removeRedundantAttributes: true,    // 移除冗余属性
        useShortDoctype: true,              // 使用短 doctype
        removeEmptyAttributes: true,        // 移除空属性
        removeStyleLinkTypeAttributes: true,// 移除 style/link 的 type 属性
        keepClosingSlash: true,             // 保留自闭合标签的斜杠
        minifyJS: true,                     // 压缩内联 JS
        minifyCSS: true,                    // 压缩内联 CSS
        minifyURLs: true                    // 压缩 URL
      }
    })
  ]
};
```

**效果示例**：

```html
<!-- 原始 HTML -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My App</title>
    <!-- This is a comment -->
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="main.js"></script>
  </body>
</html>

<!-- 压缩后 -->
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>My App</title></head><body><div id="root"></div><script src="main.js"></script></body></html>
```

## 🗜️ Gzip / Brotli 压缩

### 1. Gzip 压缩

**原理**：
- LZ77 算法 + Huffman 编码
- 查找重复字符串，用引用替代
- 典型压缩率：70-80%

**Webpack 配置**：

```bash
npm install --save-dev compression-webpack-plugin
```

```javascript
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',  // 压缩算法
      test: /\.(js|css|html|svg)$/,  // 匹配文件
      threshold: 10240,   // 只压缩超过 10KB 的文件
      minRatio: 0.8,      // 只保留压缩率小于 0.8 的文件
      deleteOriginalAssets: false  // 保留原始文件
    })
  ]
};
```

**产物**：

```
dist/
├── main.js (500 KB)
└── main.js.gz (100 KB)  ← Gzip 压缩后
```

**Nginx 配置**：

```nginx
# 启用 Gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
```

### 2. Brotli 压缩

**优势**：
- 比 Gzip 压缩率高 15-20%
- 特别适合文本文件
- 浏览器支持：Chrome 50+, Firefox 44+, Edge 15+

**Webpack 配置**：

```javascript
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    // Gzip
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240
    }),
    // Brotli
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      compressionOptions: {
        level: 11  // Brotli 压缩级别（0-11）
      },
      filename: '[path][base].br'  // .br 后缀
    })
  ]
};
```

**产物**：

```
dist/
├── main.js (500 KB)
├── main.js.gz (100 KB)   ← Gzip
└── main.js.br (85 KB)    ← Brotli（更小）
```

**Nginx 配置**：

```nginx
# 优先使用 Brotli
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
brotli_comp_level 6;

# 回退到 Gzip
gzip on;
gzip_types ...;
```

### 3. 压缩对比

| 算法 | 压缩率 | 速度 | 兼容性 | 推荐场景 |
|------|--------|------|--------|---------|
| **Gzip** | 70-80% | 快 | ✅ 所有浏览器 | 默认方案 |
| **Brotli** | 75-85% | 较慢 | ✅ 现代浏览器 | 追求极致体积 |
| **Zstd** | 75-85% | 中等 | ❌ 浏览器不支持 | 服务端压缩 |

**示例数据**：

```
原始文件: main.js (500 KB)

Terser 压缩:    200 KB (减少 60%)
Gzip:            40 KB (减少 80%, 相对 Terser)
Brotli:          34 KB (减少 83%, 相对 Terser)

总压缩率: 93.2% (500 KB → 34 KB)
```

## 📊 图片压缩

### 1. ImageMinimizerPlugin

```bash
npm install --save-dev image-minimizer-webpack-plugin imagemin
```

```javascript
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['imagemin-mozjpeg', { quality: 80 }],  // JPEG
              ['imagemin-pngquant', { quality: [0.6, 0.8] }],  // PNG
              ['imagemin-svgo', {  // SVG
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false
                  }
                ]
              }]
            ]
          }
        }
      })
    ]
  }
};
```

### 2. 使用 WebP 格式

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },
          {
            loader: 'webp-loader',
            options: {
              quality: 80
            }
          }
        ]
      }
    ]
  }
};
```

**效果**：

```
原始 PNG: 500 KB
压缩后 PNG: 300 KB (减少 40%)
转换为 WebP: 150 KB (减少 70%)
```

## ⚙️ 压缩配置最佳实践

### 开发环境

```javascript
// webpack.dev.js
module.exports = {
  mode: 'development',
  optimization: {
    minimize: false  // ← 不压缩，加快构建速度
  },
  devtool: 'eval-cheap-module-source-map'  // 快速的 Source Map
};
```

### 生产环境

```javascript
// webpack.prod.js
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  
  optimization: {
    minimize: true,
    minimizer: [
      // JavaScript 压缩
      new TerserPlugin({
        parallel: 4,  // 并行数量（根据 CPU 核心数调整）
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
            passes: 2
          },
          mangle: {
            toplevel: true
          },
          output: {
            comments: false,
            ascii_only: true
          }
        },
        extractComments: false
      }),
      
      // CSS 压缩
      new CssMinimizerPlugin({
        parallel: true
      })
    ]
  },
  
  plugins: [
    // Gzip 压缩
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    
    // Brotli 压缩（可选）
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      compressionOptions: { level: 11 },
      filename: '[path][base].br'
    })
  ]
};
```

## 🎯 性能平衡

### 压缩级别 vs 构建时间

| 配置 | 体积 | 构建时间 | 推荐场景 |
|------|------|---------|---------|
| 不压缩 | 1000 KB | 5s | ❌ 不推荐 |
| 基础压缩 | 500 KB | 15s | ✅ 开发测试 |
| 标准压缩 | 400 KB | 30s | ✅ 生产环境 |
| 深度压缩 | 350 KB | 60s | ⚠️ 追求极致 |

**建议**：
- 频繁构建：标准压缩
- 正式发布：深度压缩
- 大型项目：使用缓存 + 并行压缩

### 并行压缩优化

```javascript
const os = require('os');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: os.cpus().length - 1  // 使用 CPU 核心数 - 1
      })
    ]
  }
};
```

## 💡 进阶技巧

### 1. 条件压缩

```javascript
module.exports = (env) => ({
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // 只在生产环境移除 console
            drop_console: env.production,
            drop_debugger: env.production
          }
        }
      })
    ]
  }
});
```

### 2. 保留特定注释

```javascript
terserOptions: {
  output: {
    comments: /^\**!|@preserve|@license|@cc_on/i  // 保留特殊注释
  }
}
```

### 3. Source Map 与压缩

```javascript
// 生产环境
devtool: 'hidden-source-map',  // 生成 Source Map 但不引用
optimization: {
  minimize: true  // 压缩代码
}
```

## 📈 效果评估

### 压缩前后对比

```
项目: 中型 SPA (React + Ant Design)

压缩前:
├── main.js: 1.2 MB
├── vendors.js: 800 KB
└── Total: 2.0 MB

Terser 压缩:
├── main.js: 480 KB (减少 60%)
├── vendors.js: 320 KB (减少 60%)
└── Total: 800 KB

Gzip 压缩:
├── main.js.gz: 96 KB (减少 80%)
├── vendors.js.gz: 64 KB (减少 80%)
└── Total: 160 KB

总压缩率: 92% (2 MB → 160 KB)
```

## 🔗 下一步

掌握了压缩优化后，接下来学习：

👉 [05-sourcemap-optimization.md](./05-sourcemap-optimization.md) - Source Map 优化策略

---

**记住**：压缩是性能优化的最后一环，也是最见效的一环！

