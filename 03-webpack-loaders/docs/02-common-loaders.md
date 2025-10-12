# 常用 Loader 详解

## 📌 Loader 分类

```
样式 Loader
├── css-loader        # 解析 CSS
├── style-loader      # 注入到 DOM
├── sass-loader       # 编译 Sass
├── less-loader       # 编译 Less
└── postcss-loader    # PostCSS 处理

文件 Loader
├── asset/resource    # 输出文件
├── asset/inline      # 转 base64
├── asset/source      # 导出源码
└── asset             # 自动选择

JavaScript Loader
├── babel-loader      # JavaScript 转译
├── ts-loader         # TypeScript 编译
└── eslint-loader     # ESLint 检查
```

---

## 1️⃣ CSS Loader 详解

### css-loader

**作用**：解析 CSS 文件，处理 `@import` 和 `url()`

```javascript
{
  test: /\.css$/,
  use: 'css-loader'
}
```

**功能**：
1. 解析 `@import` 语句
2. 解析 `url()` 引用
3. 将 CSS 转换为 JavaScript 模块

**示例**：
```css
/* style.css */
@import './base.css';

.container {
  background: url('./logo.png');
}
```

**转换后**：
```javascript
// 转换为 JavaScript 模块
export default [
  [module.id, ".container { background: url(...); }", ""]
];
```

---

### css-loader 配置选项

```javascript
{
  test: /\.css$/,
  use: {
    loader: 'css-loader',
    options: {
      // 1. modules: CSS Modules
      modules: true,
      // 或更详细配置
      modules: {
        localIdentName: '[path][name]__[local]--[hash:base64:5]'
      },
      
      // 2. sourceMap: 生成 Source Map
      sourceMap: true,
      
      // 3. importLoaders: @import 时应用的 loader 数量
      importLoaders: 1,
      
      // 4. url: 是否处理 url()
      url: true,
      
      // 5. import: 是否处理 @import
      import: true
    }
  }
}
```

---

### CSS Modules 示例

```javascript
// webpack.config.js
{
  test: /\.module\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true  // 启用 CSS Modules
      }
    }
  ]
}
```

```css
/* Button.module.css */
.button {
  background: blue;
  color: white;
}
```

```javascript
// Button.js
import styles from './Button.module.css';

console.log(styles.button);  // "button__3kx7j"（哈希化的类名）

// 使用
<button className={styles.button}>Click</button>
```

**效果**：
- 类名会被哈希化，避免全局污染
- `button` → `button__3kx7j`

---

### style-loader

**作用**：将 CSS 注入到 DOM 中的 `<style>` 标签

```javascript
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}
```

**工作原理**：
```javascript
// style-loader 生成的代码（简化版）
const style = document.createElement('style');
style.textContent = cssContent;
document.head.appendChild(style);
```

**特点**：
- ✅ 支持 HMR（热模块替换）
- ✅ 开发环境友好
- ⚠️ CSS 在 JS 中，增加 bundle 体积
- ⚠️ 运行时注入，会有 FOUC（闪烁）

---

### MiniCssExtractPlugin.loader

**作用**：将 CSS 提取到独立文件

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
      filename: '[name].[contenthash:8].css'
    })
  ]
};
```

**特点**：
- ✅ CSS 独立文件，可以并行加载
- ✅ 支持长期缓存
- ✅ 避免 FOUC
- ⚠️ 不支持 HMR（需要刷新页面）

---

### style-loader vs MiniCssExtractPlugin

| 特性 | style-loader | MiniCssExtractPlugin |
|------|-------------|---------------------|
| **CSS 位置** | 在 JS 中 | 独立文件 |
| **加载方式** | `<style>` 标签 | `<link>` 标签 |
| **HMR** | ✅ 支持 | ❌ 不支持 |
| **体积** | 增加 JS 体积 | CSS 独立 |
| **FOUC** | ⚠️ 可能闪烁 | ✅ 无闪烁 |
| **缓存** | 跟随 JS | 独立缓存 |
| **适用场景** | 开发环境 | 生产环境 |

**推荐配置**：
```javascript
const isDev = process.env.NODE_ENV === 'development';

{
  test: /\.css$/,
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader'
  ]
}
```

---

## 2️⃣ CSS 预处理器 Loader

### sass-loader

**作用**：编译 Sass/SCSS 文件

```bash
npm install -D sass-loader sass
```

```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader'  // 编译 Sass
  ]
}
```

**执行顺序**：
```
style.scss
    ↓ sass-loader
style.css
    ↓ css-loader
JS 模块
    ↓ style-loader
DOM
```

**配置选项**：
```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        sassOptions: {
          outputStyle: 'compressed'
        }
      }
    }
  ]
}
```

---

### less-loader

**作用**：编译 Less 文件

```bash
npm install -D less-loader less
```

```javascript
{
  test: /\.less$/,
  use: [
    'style-loader',
    'css-loader',
    'less-loader'  // 编译 Less
  ]
}
```

---

### postcss-loader

**作用**：使用 PostCSS 处理 CSS

```bash
npm install -D postcss-loader postcss autoprefixer
```

```javascript
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader'  // PostCSS 处理
  ]
}
```

**postcss.config.js**：
```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),     // 自动添加浏览器前缀
    require('cssnano')           // CSS 压缩
  ]
};
```

**效果**：
```css
/* 输入 */
.container {
  display: flex;
}

/* 输出（自动添加前缀） */
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

---

### 完整的样式处理链

```javascript
{
  test: /\.scss$/,
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2  // 2个后置 loader
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: ['autoprefixer']
        }
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ]
}
```

**执行流程**：
```
style.scss
    ↓ sass-loader (Sass → CSS)
style.css
    ↓ postcss-loader (添加前缀)
prefixed.css
    ↓ css-loader (CSS → JS)
JS module
    ↓ style-loader / MiniCssExtractPlugin
DOM / File
```

---

## 3️⃣ 静态资源 Loader

### Webpack 5: Asset Modules

Webpack 5 内置了资源模块，不再需要 `file-loader`、`url-loader`、`raw-loader`。

#### asset/resource（替代 file-loader）

**作用**：输出文件到指定目录

```javascript
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset/resource',
  generator: {
    filename: 'images/[hash][ext]'
  }
}
```

**效果**：
```javascript
import logo from './logo.png';
// logo = "/images/a1b2c3d4.png"

// 文件会被输出到 dist/images/a1b2c3d4.png
```

---

#### asset/inline（替代 url-loader）

**作用**：转换为 base64 DataURL

```javascript
{
  test: /\.svg$/,
  type: 'asset/inline'
}
```

**效果**：
```javascript
import icon from './icon.svg';
// icon = "data:image/svg+xml;base64,..."

// 不会输出文件，直接内联到 bundle
```

---

#### asset/source（替代 raw-loader）

**作用**：导出文件源码

```javascript
{
  test: /\.txt$/,
  type: 'asset/source'
}
```

**效果**：
```javascript
import text from './README.txt';
// text = "文件内容..."（字符串）
```

---

#### asset（自动选择）

**作用**：根据文件大小自动选择

```javascript
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024  // 8KB 以下转 base64
    }
  },
  generator: {
    filename: 'images/[hash][ext]'
  }
}
```

**逻辑**：
- 文件 < 8KB：转 base64（`asset/inline`）
- 文件 ≥ 8KB：输出文件（`asset/resource`）

---

### 文件名配置

```javascript
{
  test: /\.(png|jpg)$/,
  type: 'asset/resource',
  generator: {
    // 1. 基础配置
    filename: 'images/[hash][ext]'
    
    // 2. 带原文件名
    filename: 'images/[name].[hash:8][ext]'
    
    // 3. 按目录分类
    filename: (pathData) => {
      if (pathData.filename.includes('icon')) {
        return 'icons/[hash][ext]';
      }
      return 'images/[hash][ext]';
    }
  }
}
```

**模板变量**：
- `[name]`：原文件名
- `[ext]`：扩展名（含 `.`）
- `[hash]`：完整 hash
- `[hash:8]`：8 位 hash
- `[path]`：相对路径

---

## 4️⃣ JavaScript Loader

### babel-loader

**作用**：转译 JavaScript，支持最新语法

```bash
npm install -D babel-loader @babel/core @babel/preset-env
```

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      cacheDirectory: true  // 启用缓存
    }
  }
}
```

**效果**：
```javascript
// 输入（ES6+）
const add = (a, b) => a + b;
class Person {
  constructor(name) {
    this.name = name;
  }
}

// 输出（ES5）
var add = function(a, b) { return a + b; };
var Person = function Person(name) {
  this.name = name;
};
```

---

### babel-loader 配置

```javascript
// .babelrc 或 babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions']
        },
        useBuiltIns: 'usage',  // 按需引入 polyfill
        corejs: 3
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ]
};
```

---

### ts-loader

**作用**：编译 TypeScript

```bash
npm install -D ts-loader typescript
```

```javascript
{
  test: /\.ts$/,
  use: 'ts-loader',
  exclude: /node_modules/
}
```

**tsconfig.json**：
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "strict": true
  }
}
```

---

## 5️⃣ 其他常用 Loader

### eslint-loader（已废弃）

**替代方案**：使用 `eslint-webpack-plugin`

```bash
npm install -D eslint-webpack-plugin
```

```javascript
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      fix: true  // 自动修复
    })
  ]
};
```

---

### thread-loader

**作用**：多线程构建，加速编译

```bash
npm install -D thread-loader
```

```javascript
{
  test: /\.js$/,
  use: [
    'thread-loader',  // 多线程
    'babel-loader'
  ]
}
```

**注意**：
- 只在大型项目中有效
- 有启动开销，小项目反而变慢

---

## 📊 Loader 选择指南

### CSS 处理

```javascript
// 开发环境
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}

// 生产环境
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
}

// Sass
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

// PostCSS（推荐）
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader', 'postcss-loader']
}
```

---

### 图片处理

```javascript
// 推荐：自动选择
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024
    }
  }
}

// 小图标：转 base64
{
  test: /\.svg$/,
  type: 'asset/inline'
}

// 大图片：输出文件
{
  test: /\.(png|jpg)$/,
  type: 'asset/resource'
}
```

---

### JavaScript 处理

```javascript
// Babel（推荐）
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    }
  }
}

// TypeScript
{
  test: /\.ts$/,
  use: 'ts-loader'
}
```

---

## 💡 最佳实践

### 1. 合理使用缓存

```javascript
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true  // ✅ 启用缓存
    }
  }
}
```

---

### 2. 开发/生产环境区分

```javascript
const isDev = process.env.NODE_ENV === 'development';

{
  test: /\.css$/,
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader'
  ]
}
```

---

### 3. 使用 include/exclude

```javascript
{
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),  // ✅
  exclude: /node_modules/,                   // ✅
  use: 'babel-loader'
}
```

---

### 4. 图片优化

```javascript
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024  // 8KB
    }
  },
  generator: {
    filename: 'images/[name].[hash:8][ext]'
  }
}
```

---

## 📝 总结

### 核心 Loader

1. **CSS**：css-loader + style-loader / MiniCssExtractPlugin
2. **预处理器**：sass-loader / less-loader
3. **PostCSS**：postcss-loader + autoprefixer
4. **图片**：asset modules
5. **JavaScript**：babel-loader
6. **TypeScript**：ts-loader

### 推荐配置

```javascript
module.exports = {
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      
      // Sass
      {
        test: /\.scss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      
      // 图片
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 8 * 1024 }
        }
      },
      
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true }
        }
      }
    ]
  }
};
```

---

## 🎯 下一步

继续学习：
- [Loader 链式调用](./03-loader-chain.md) - 理解执行顺序
- [手写自定义 Loader](./04-custom-loader.md) - 实现自己的 Loader

然后通过 Demo 实践：
- [Demo 1: CSS Loader 基础](../demos/01-css-basic/)
- [Demo 2: 静态资源处理](../demos/02-assets/)
- [Demo 3: CSS 预处理器](../demos/03-preprocessors/)

