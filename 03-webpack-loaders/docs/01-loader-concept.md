# Loader 概念详解

## 🤔 什么是 Loader？

### 核心问题

Webpack 默认只能处理 JavaScript 和 JSON 文件，那如何处理 CSS、图片、字体等其他类型的文件呢？

**答案**：使用 Loader！

---

## 📌 Loader 的本质

### 定义

> **Loader** 是一个导出函数的 JavaScript 模块，用于将非 JavaScript 文件转换为 Webpack 能够处理的模块。

```javascript
// 一个最简单的 Loader
module.exports = function(source) {
  // source 是文件的原始内容（字符串或 Buffer）
  // 返回转换后的内容
  return transformedSource;
};
```

**类比**：
- Loader 就像一个**翻译器**
- 输入：源文件（CSS、图片等）
- 输出：JavaScript 模块
- Webpack 只认识 JavaScript，所以需要 Loader 来"翻译"

---

## 🎯 为什么需要 Loader？

### 问题演示

```javascript
// index.js
import './style.css';  // ❌ 直接 import CSS 会报错

console.log('Hello World');
```

**错误信息**：
```
Module parse failed: Unexpected token
You may need an appropriate loader to handle this file type
```

**原因**：
- Webpack 不认识 CSS 语法
- 需要 Loader 来处理 CSS 文件

---

### 解决方案

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,                      // 匹配 CSS 文件
        use: ['style-loader', 'css-loader']  // 使用这些 Loader 处理
      }
    ]
  }
};
```

**效果**：
```
style.css
    ↓ (css-loader 处理)
JavaScript 模块
    ↓ (style-loader 处理)
注入到 <style> 标签
```

---

## 🔄 Loader 的工作流程

### 完整流程

```
1. Webpack 读取文件
    ↓
2. 匹配 test 规则
    ↓
3. 应用 Loader 链
    ↓
4. 转换为 JavaScript 模块
    ↓
5. 添加到依赖图
```

### 实例解析

```javascript
// 源文件: style.css
.container {
  color: red;
}

// 1. css-loader 处理
// 输出: JavaScript 代码
export default "...CSS 内容...";

// 2. style-loader 处理
// 输出: JavaScript 代码，运行时会创建 <style> 标签
const style = document.createElement('style');
style.textContent = cssContent;
document.head.appendChild(style);
```

---

## ⚙️ Loader 的配置方式

### 方式 1：use 数组（推荐）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  // 数组形式
      }
    ]
  }
};
```

**特点**：
- 简洁明了
- 支持多个 Loader
- 从右到左执行

---

### 方式 2：use 对象（带配置项）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,     // 启用 CSS Modules
              sourceMap: true    // 生成 Source Map
            }
          }
        ]
      }
    ]
  }
};
```

**特点**：
- 可以传递配置选项
- 更灵活

---

### 方式 3：loader 字符串（单个 Loader）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: 'raw-loader'  // 单个 Loader
      }
    ]
  }
};
```

**特点**：
- 只有一个 Loader 时使用
- 简洁

---

### 方式 4：内联方式（不推荐）

```javascript
// 在 import 语句中指定 Loader
import styles from 'style-loader!css-loader!./style.css';
```

**特点**：
- ❌ 不推荐使用
- ❌ 配置不集中
- ❌ 难以维护

---

## 📊 Rule 配置详解

### 完整配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        // 1. 匹配规则
        test: /\.css$/,                    // 正则匹配
        include: /src/,                    // 包含目录
        exclude: /node_modules/,           // 排除目录
        
        // 2. Loader 配置
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { /* ... */ }
          }
        ],
        
        // 3. 其他选项
        enforce: 'pre',                    // pre | post
        issuer: /\.js$/,                   // 限制引入者
        oneOf: [ /* ... */ ]               // 只匹配一个
      }
    ]
  }
};
```

---

### test: 匹配规则

```javascript
// 1. 正则表达式
test: /\.css$/

// 2. 字符串（转为正则）
test: '.css'

// 3. 函数
test: (file) => file.endsWith('.css')

// 4. 数组（满足任一）
test: [/\.css$/, /\.scss$/]

// 5. 对象（复杂规则）
test: {
  and: [/\.css$/],
  not: [/\.module\.css$/]
}
```

---

### include / exclude

```javascript
{
  test: /\.js$/,
  include: [
    path.resolve(__dirname, 'src')  // 只处理 src 目录
  ],
  exclude: /node_modules/,          // 排除 node_modules
  use: 'babel-loader'
}
```

**最佳实践**：
- ✅ 使用 `include` 精确指定范围
- ✅ 使用 `exclude` 排除不需要的文件
- ✅ 提高构建速度

---

### enforce: 执行顺序

```javascript
// pre: 前置 Loader
{
  test: /\.js$/,
  enforce: 'pre',
  use: 'eslint-loader'  // 先执行 ESLint 检查
}

// normal: 普通 Loader（默认）
{
  test: /\.js$/,
  use: 'babel-loader'
}

// post: 后置 Loader
{
  test: /\.js$/,
  enforce: 'post',
  use: 'uglify-loader'  // 最后执行压缩
}
```

**执行顺序**：
```
pre → normal → post
```

---

## 🔗 Loader 的链式调用

### 概念

多个 Loader 可以链式调用，每个 Loader 的输出是下一个 Loader 的输入。

```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',    // 3. 注入到 DOM
    'css-loader',      // 2. 解析 CSS
    'sass-loader'      // 1. 编译 Sass
  ]
}
```

**执行流程**：
```
style.scss (源文件)
    ↓
sass-loader (Sass → CSS)
    ↓
css-loader (CSS → JS 模块)
    ↓
style-loader (JS → DOM)
    ↓
浏览器
```

---

### 为什么从右到左？

**原因 1：函数组合**
```javascript
// Loader 链式调用类似函数组合
compose(style, css, sass)(source)

// 等价于
style(css(sass(source)))

// 执行顺序：sass → css → style
```

**原因 2：Unix 管道**
```bash
# Unix 管道也是从右到左
cat file.txt | grep "error" | wc -l
```

**原因 3：数学函数**
```javascript
// 数学中的函数组合 f(g(x))
// 先执行 g，再执行 f
```

---

### 数据传递

```javascript
// Loader 1
module.exports = function(source) {
  const result = transform1(source);
  return result;  // 传给下一个 Loader
};

// Loader 2
module.exports = function(source) {
  // source 是上一个 Loader 的返回值
  const result = transform2(source);
  return result;  // 传给下一个 Loader
};

// Loader 3
module.exports = function(source) {
  // source 是上一个 Loader 的返回值
  const finalResult = transform3(source);
  return finalResult;  // 最终结果
};
```

---

## 🆚 Loader vs Plugin

### 核心区别

| 特性 | Loader | Plugin |
|------|--------|--------|
| **作用** | 转换文件类型 | 扩展 Webpack 功能 |
| **工作阶段** | 模块加载时 | 整个构建流程 |
| **本质** | 导出函数的模块 | 导出类的模块 |
| **配置位置** | `module.rules` | `plugins` |
| **执行时机** | 处理单个文件 | 监听生命周期钩子 |

---

### Loader 示例

```javascript
// 作用：转换文件
module.exports = function(source) {
  return transform(source);
};

// 配置
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

---

### Plugin 示例

```javascript
// 作用：扩展功能
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在输出文件前执行
      console.log('即将输出文件...');
    });
  }
}

// 配置
module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    new MyPlugin()
  ]
};
```

---

### 形象比喻

**Loader**：
- 像流水线上的**工人**
- 每个工人处理一种材料（CSS、图片等）
- 把原材料转换成标准产品（JavaScript）

**Plugin**：
- 像流水线的**管理员**
- 监控整个生产流程
- 在关键节点执行特定操作（优化、压缩、生成报告等）

---

## 📝 常见 Loader 速查

### 样式 Loader

```javascript
// CSS
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}

// Sass/SCSS
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

// Less
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}

// PostCSS
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader', 'postcss-loader']
}
```

---

### 文件 Loader

```javascript
// Webpack 5: Asset Modules
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset/resource'  // 替代 file-loader
}

{
  test: /\.svg$/,
  type: 'asset/inline'    // 替代 url-loader
}

{
  test: /\.txt$/,
  type: 'asset/source'    // 替代 raw-loader
}
```

---

### JavaScript Loader

```javascript
// Babel
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
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

### 1. 使用 include/exclude 优化性能

```javascript
{
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),  // ✅ 只处理 src
  exclude: /node_modules/,                   // ✅ 排除 node_modules
  use: 'babel-loader'
}
```

---

### 2. 合理使用缓存

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

### 3. 开发/生产环境区分

```javascript
const isDev = process.env.NODE_ENV === 'development';

{
  test: /\.css$/,
  use: [
    // 开发：style-loader（HMR）
    // 生产：提取 CSS 文件
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader'
  ]
}
```

---

### 4. 使用 oneOf 优化匹配

```javascript
{
  oneOf: [
    // 只会匹配其中一个
    {
      test: /\.module\.css$/,
      use: ['style-loader', { loader: 'css-loader', options: { modules: true } }]
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
```

---

## 📊 总结

### Loader 核心要点

1. **本质**：导出函数的 JavaScript 模块
2. **作用**：转换非 JS 文件为 Webpack 可处理的模块
3. **配置**：在 `module.rules` 中配置
4. **执行**：从右到左，从下到上
5. **链式**：多个 Loader 可以串联

### 常用配置模式

```javascript
module.exports = {
  module: {
    rules: [
      // 样式
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      
      // 图片
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource'
      },
      
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
```

---

## 🎯 下一步

继续学习：
- [常用 Loader 详解](./02-common-loaders.md) - 深入学习各种 Loader
- [Loader 链式调用](./03-loader-chain.md) - 理解执行顺序
- [手写自定义 Loader](./04-custom-loader.md) - 实现自己的 Loader

然后通过 Demo 实践：
- [Demo 1: CSS Loader 基础](../demos/01-css-basic/)
- [Demo 2: 静态资源处理](../demos/02-assets/)

