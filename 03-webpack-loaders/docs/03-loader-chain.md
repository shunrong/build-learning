# Loader 链式调用机制

## 🎯 核心问题

- Loader 为什么从右到左执行？
- 多个 Loader 如何传递数据？
- 如何调试 Loader 的执行顺序？

---

## 📌 执行顺序规则

### 基本规则

```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',    // 3. 最后执行
    'css-loader',      // 2. 然后执行
    'sass-loader'      // 1. 首先执行
  ]
}
```

**执行顺序**：从右到左，从下到上
- sass-loader → css-loader → style-loader

---

### 为什么从右到左？

#### 原因 1：函数组合（Compose）

```javascript
// Loader 链相当于函数组合
const result = styleLoader(cssLoader(sassLoader(source)));

// 数学表示：f(g(h(x)))
// 执行顺序：h → g → f
```

**示例**：
```javascript
function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

const transform = compose(
  styleLoader,
  cssLoader,
  sassLoader
);

transform(source);  // sassLoader → cssLoader → styleLoader
```

---

#### 原因 2：Unix 管道思想

```bash
# Unix 管道也是从左到右传递数据
cat file.scss | sass | autoprefixer | minify
```

Webpack 采用了类似的设计：
```
file.scss → sass-loader → css-loader → style-loader
```

---

#### 原因 3：配置的直观性

```javascript
// 配置从右到左，符合数据流向
use: [
  'style-loader',     // ↑ 最后处理
  'css-loader',       // ↑ 然后处理
  'sass-loader'       // ← 首先处理
]
```

---

## 🔄 完整执行流程

### 示例配置

```javascript
{
  test: /\.scss$/,
  use: [
    {
      loader: 'style-loader',
      options: { /* ... */ }
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2
      }
    },
    {
      loader: 'postcss-loader',
      options: {
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

---

### 执行流程详解

```
1. 读取源文件
   style.scss (Sass 语法)
       ↓

2. sass-loader 处理
   输入：Sass 代码
   输出：CSS 代码
   
   .container {
     $color: red;
     color: $color;
   }
   
   → 
   
   .container {
     color: red;
   }
       ↓

3. postcss-loader 处理
   输入：CSS 代码
   输出：添加前缀的 CSS
   
   .container {
     display: flex;
   }
   
   →
   
   .container {
     display: -webkit-box;
     display: -ms-flexbox;
     display: flex;
   }
       ↓

4. css-loader 处理
   输入：CSS 代码
   输出：JavaScript 模块
   
   .container { color: red; }
   
   →
   
   export default [
     [module.id, ".container { color: red; }", ""]
   ];
       ↓

5. style-loader 处理
   输入：JavaScript 模块
   输出：注入 DOM 的代码
   
   const style = document.createElement('style');
   style.textContent = cssContent;
   document.head.appendChild(style);
       ↓

6. 浏览器
   CSS 应用到页面
```

---

## 📊 数据传递机制

### Loader 的输入输出

```javascript
// Loader 1
module.exports = function(source) {
  console.log('Loader 1 input:', typeof source);  // string
  
  const result = transform1(source);
  
  console.log('Loader 1 output:', typeof result);  // string
  return result;  // 传给下一个 Loader
};

// Loader 2
module.exports = function(source) {
  console.log('Loader 2 input:', typeof source);  // string（上一个的输出）
  
  const result = transform2(source);
  
  return result;  // 传给下一个 Loader
};
```

---

### 数据类型

Loader 之间传递的数据类型：

1. **字符串**（最常见）
```javascript
module.exports = function(source) {
  // source 是字符串
  return transformedString;
};
```

2. **Buffer**
```javascript
module.exports = function(source) {
  // source 是 Buffer（图片等二进制文件）
  return transformedBuffer;
};
```

3. **AST**（抽象语法树）
```javascript
module.exports = function(source) {
  const ast = parse(source);
  return { ast };  // 传递 AST 给下一个 Loader
};
```

---

### 实际案例：CSS 处理链

```javascript
// sass-loader
module.exports = function(source) {
  // 输入：Sass 代码（字符串）
  const css = sass.renderSync({ data: source }).css.toString();
  // 输出：CSS 代码（字符串）
  return css;
};

// postcss-loader
module.exports = function(source) {
  // 输入：CSS 代码（字符串）
  const result = postcss(plugins).process(source);
  // 输出：处理后的 CSS（字符串）
  return result.css;
};

// css-loader
module.exports = function(source) {
  // 输入：CSS 代码（字符串）
  const exports = processCss(source);
  // 输出：JavaScript 模块代码（字符串）
  return `export default ${JSON.stringify(exports)}`;
};

// style-loader
module.exports = function(source) {
  // 输入：JavaScript 代码（字符串）
  // 输出：注入 DOM 的代码（字符串）
  return `
    const style = document.createElement('style');
    style.textContent = ${source};
    document.head.appendChild(style);
  `;
};
```

---

## 🎣 enforce: 控制执行顺序

### 三种 enforce 类型

```javascript
// pre: 前置 Loader（最先执行）
{
  test: /\.js$/,
  enforce: 'pre',
  use: 'eslint-loader'
}

// normal: 普通 Loader（默认）
{
  test: /\.js$/,
  use: 'babel-loader'
}

// post: 后置 Loader（最后执行）
{
  test: /\.js$/,
  enforce: 'post',
  use: 'uglify-loader'
}
```

---

### 执行顺序

```
pre Loader (enforce: 'pre')
    ↓
normal Loader (默认)
    ↓
inline Loader (import 语句中)
    ↓
post Loader (enforce: 'post')
```

---

### 实际案例

```javascript
module.exports = {
  module: {
    rules: [
      // 1. 前置：代码检查
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: 'eslint-loader'
      },
      
      // 2. 普通：代码转换
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
      // 3. 后置：代码压缩（如果需要）
      {
        test: /\.js$/,
        enforce: 'post',
        use: 'uglify-loader'
      }
    ]
  }
};
```

**执行流程**：
```
source.js
    ↓ eslint-loader (检查语法)
    ↓ babel-loader (ES6 → ES5)
    ↓ uglify-loader (压缩代码)
final.js
```

---

## 🔍 Loader 配置详解

### importLoaders

**作用**：指定在 css-loader 之前应该应用几个 Loader

```javascript
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1  // @import 的 CSS 也要经过 1 个后置 Loader
      }
    },
    'postcss-loader'
  ]
}
```

**场景**：
```css
/* style.css */
@import './base.css';

.container {
  color: red;
}
```

**不配置 importLoaders**：
- `style.css` 经过：postcss-loader → css-loader
- `base.css` 只经过：css-loader ❌

**配置 importLoaders: 1**：
- `style.css` 经过：postcss-loader → css-loader
- `base.css` 也经过：postcss-loader → css-loader ✅

---

### issuer: 限制引入者

```javascript
{
  test: /\.css$/,
  issuer: /\.js$/,  // 只有从 .js 文件引入的 CSS 才应用这个规则
  use: ['style-loader', 'css-loader']
}
```

**示例**：
```javascript
// app.js
import './style.css';  // ✅ 应用规则

// style.css
@import './base.css';  // ❌ 不应用规则（issuer 不是 .js）
```

---

## 🐛 调试技巧

### 1. 打印日志

```javascript
// custom-logger-loader.js
module.exports = function(source) {
  console.log('='.repeat(50));
  console.log('Loader:', this.resourcePath);
  console.log('Input length:', source.length);
  console.log('Input preview:', source.substring(0, 100));
  console.log('='.repeat(50));
  
  return source;  // 不修改，只打印
};
```

```javascript
// webpack.config.js
{
  test: /\.scss$/,
  use: [
    './custom-logger-loader',  // 添加日志 Loader
    'style-loader',
    './custom-logger-loader',  // 添加日志 Loader
    'css-loader',
    './custom-logger-loader',  // 添加日志 Loader
    'sass-loader'
  ]
}
```

---

### 2. 使用 webpack stats

```bash
webpack --json > stats.json
```

查看 Loader 执行信息。

---

### 3. 使用断点调试

```javascript
// loader.js
module.exports = function(source) {
  debugger;  // 设置断点
  
  const result = transform(source);
  return result;
};
```

```bash
node --inspect-brk ./node_modules/webpack/bin/webpack.js
```

---

## 📝 常见问题

### Q1: 为什么 CSS 中的图片没有被处理？

**原因**：`importLoaders` 配置不当

```javascript
// ❌ 错误
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader', 'postcss-loader']
}

// ✅ 正确
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1  // @import 的文件也要经过 postcss-loader
      }
    },
    'postcss-loader'
  ]
}
```

---

### Q2: Loader 执行了两次？

**原因**：enforce 配置冲突

```javascript
// ❌ 错误：同一个文件匹配了两个规则
{
  test: /\.js$/,
  use: 'babel-loader'
},
{
  test: /\.js$/,
  enforce: 'pre',
  use: 'eslint-loader'
}
// babel-loader 会执行两次

// ✅ 正确：使用 oneOf 或更精确的匹配
{
  oneOf: [
    {
      test: /\.js$/,
      enforce: 'pre',
      use: 'eslint-loader'
    },
    {
      test: /\.js$/,
      use: 'babel-loader'
    }
  ]
}
```

---

### Q3: CSS Modules 不生效？

**原因**：Loader 顺序或配置问题

```javascript
// ❌ 错误：所有 CSS 都启用 Modules
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { modules: true }
    }
  ]
}

// ✅ 正确：只对 .module.css 启用
{
  test: /\.module\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { modules: true }
    }
  ]
},
{
  test: /\.css$/,
  exclude: /\.module\.css$/,
  use: ['style-loader', 'css-loader']
}
```

---

## 💡 最佳实践

### 1. 明确 Loader 职责

```javascript
// ✅ 好：每个 Loader 专注一件事
{
  test: /\.scss$/,
  use: [
    'style-loader',     // 只负责注入 DOM
    'css-loader',       // 只负责解析 CSS
    'postcss-loader',   // 只负责 PostCSS 处理
    'sass-loader'       // 只负责编译 Sass
  ]
}
```

---

### 2. 合理使用 importLoaders

```javascript
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2  // postcss + sass
      }
    },
    'postcss-loader',
    'sass-loader'
  ]
}
```

---

### 3. 性能优化

```javascript
{
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),  // ✅ 缩小范围
  exclude: /node_modules/,                   // ✅ 排除不需要的
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true  // ✅ 启用缓存
    }
  }
}
```

---

## 📊 总结

### 核心要点

1. **执行顺序**：从右到左，从下到上
2. **函数组合**：`f(g(h(x)))` 的思想
3. **enforce**：pre → normal → post
4. **数据传递**：字符串 / Buffer / AST
5. **importLoaders**：控制 @import 的处理

### 调试方法

1. 添加日志 Loader
2. 使用 `webpack --json`
3. 使用 `debugger` 断点
4. 理解每个 Loader 的输入输出

### 常见配置

```javascript
// CSS 处理链（推荐）
{
  test: /\.scss$/,
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2  // postcss + sass
      }
    },
    'postcss-loader',
    'sass-loader'
  ]
}
```

---

## 🎯 下一步

继续学习：
- [手写自定义 Loader](./04-custom-loader.md) - 实现自己的 Loader

然后通过 Demo 实践：
- [Demo 3: CSS 预处理器](../demos/03-preprocessors/) - 完整的 Loader 链
- [Demo 4: 自定义 Loader](../demos/04-custom-loader/) - 动手实现

