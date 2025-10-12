# Phase 03: Loader 机制深入

## 🎯 学习目标

通过这个阶段，你将：
1. **理解 Loader 的本质和工作原理**
2. **掌握 CSS Loader 的使用和配置**
3. **学会处理图片、字体等静态资源**
4. **掌握 CSS 预处理器的集成**（Sass/Less）
5. **理解 Loader 的链式调用机制**
6. **能够手写一个简单的 Loader**

## 📚 学习路径

```
理论学习（2-3小时）
    ↓
1. 阅读 docs/01-loader-concept.md          (45分钟) - Loader 概念
2. 阅读 docs/02-common-loaders.md          (45分钟) - 常用 Loader
3. 阅读 docs/03-loader-chain.md            (30分钟) - 链式调用
4. 阅读 docs/04-custom-loader.md           (45分钟) - 手写 Loader
5. 阅读 docs/05-dev-vs-prod-css.md         (30分钟) - 开发vs生产
    ↓
实践体验（4-5小时）
    ↓
5. 运行 demos/01-css-basic/                (1小时) - CSS 基础处理
6. 运行 demos/02-assets/                   (1小时) - 静态资源处理
7. 运行 demos/03-preprocessors/            (1.5小时) - Sass/Less
8. 运行 demos/04-custom-loader/            (1.5小时) - 自定义 Loader
    ↓
深入实践（2-3小时）
    ↓
9. 修改配置，观察效果                         (1小时)
10. 实现自己的 Loader                        (2小时)
    ↓
总结反思（30分钟）
    ↓
11. 总结 Loader 的核心原理和最佳实践
```

## 📖 文档列表

### 1. [Loader 概念详解](./01-loader-concept.md)
- Loader 是什么？为什么需要它？
- Loader 的工作原理
- Loader 的配置方式
- Loader vs Plugin 的区别

### 2. [常用 Loader 详解](./02-common-loaders.md)
- CSS Loader：css-loader、style-loader、MiniCssExtractPlugin
- 样式 Loader：sass-loader、less-loader、postcss-loader
- 文件 Loader：file-loader、url-loader、asset modules
- Babel Loader：babel-loader 配置

### 3. [Loader 链式调用](./03-loader-chain.md)
- 执行顺序（从右到左，从下到上）
- 数据传递机制
- 实际案例分析
- 调试技巧

### 4. [手写自定义 Loader](./04-custom-loader.md)
- Loader 的基本结构
- Loader API 详解
- 异步 Loader
- Loader 工具函数

### 5. [开发 vs 生产：CSS 处理策略](./05-dev-vs-prod-css.md)
- style-loader vs MiniCssExtractPlugin
- 开发环境和生产环境的配置差异
- 两种方式的底层原理
- 性能对比和最佳实践

## 🎮 Demo 列表

### Demo 1: [CSS Loader 基础](../demos/01-css-basic/)
**场景**：处理 CSS 文件，理解 style-loader 和 css-loader 的作用

**核心内容**：
- ✅ css-loader：解析 CSS 文件
- ✅ style-loader：将 CSS 注入到 `<style>` 标签
- ✅ MiniCssExtractPlugin：提取 CSS 到独立文件
- ✅ CSS Modules：CSS 模块化

**运行方式**：
```bash
cd demos/01-css-basic
npm install
npm run dev      # style-loader 方式
npm run build    # 提取 CSS 文件
```

---

### Demo 2: [图片和字体处理](../demos/02-assets/)
**场景**：处理图片、字体等静态资源

**核心内容**：
- ✅ Asset Modules（Webpack 5）
- ✅ asset/resource：输出文件
- ✅ asset/inline：转 base64
- ✅ asset：自动选择
- ✅ 自定义输出路径和文件名

**运行方式**：
```bash
cd demos/02-assets
npm install
npm run build
```

---

### Demo 3: [CSS 预处理器](../demos/03-preprocessors/)
**场景**：使用 Sass/Less 编写样式

**核心内容**：
- ✅ sass-loader：处理 Sass/SCSS
- ✅ less-loader：处理 Less
- ✅ postcss-loader：PostCSS 处理
- ✅ autoprefixer：自动添加浏览器前缀
- ✅ Loader 链式调用实例

**运行方式**：
```bash
cd demos/03-preprocessors
npm install
npm run build
```

---

### Demo 4: [手写自定义 Loader](../demos/04-custom-loader/)
**场景**：实现自己的 Loader，深入理解原理

**核心内容**：
- ✅ 实现 Markdown Loader
- ✅ 实现 Banner Loader（添加文件头）
- ✅ 实现 Replace Loader（字符串替换）
- ✅ 异步 Loader 实现
- ✅ Loader 工具函数使用

**运行方式**：
```bash
cd demos/04-custom-loader
npm install
npm run build
```

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 能解释 Loader 是什么，为什么需要它
- [ ] 能说出 Loader 的执行顺序规则
- [ ] 能解释 Loader 和 Plugin 的区别
- [ ] 能画出 Loader 链式调用的流程图

### 实践层面
- [ ] 能配置 CSS 处理（style-loader/css-loader）
- [ ] 能配置图片、字体等静态资源
- [ ] 能集成 Sass/Less 预处理器
- [ ] 能手写一个简单的 Loader
- [ ] 能调试 Loader 的执行过程

### 面试攻防
能够清晰回答以下面试问题：

1. **Loader 是什么？为什么需要 Loader？**
2. **style-loader 和 css-loader 有什么区别？**
3. **Loader 的执行顺序是什么？为什么是这样？**
4. **如何实现一个自定义 Loader？**
5. **Loader 和 Plugin 有什么区别？**
6. **Asset Modules 是什么？和 file-loader 有什么区别？**

## 🎯 核心知识点

### 1. Loader 的本质

```javascript
// Loader 本质上是一个函数
module.exports = function(source) {
  // source 是文件的内容
  // 返回转换后的内容
  return transformedSource;
};
```

**核心概念**：
- Loader 是一个**导出函数**的 JavaScript 模块
- 接收源文件内容（source）
- 返回转换后的内容
- 支持链式调用

---

### 2. Loader 的配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,              // 匹配规则
        use: [                        // Loader 数组
          'style-loader',             // 3. 注入到 DOM
          'css-loader',               // 2. 解析 CSS
          'postcss-loader'            // 1. PostCSS 处理
        ]
      }
    ]
  }
};
```

**执行顺序**：从右到左，从下到上
- postcss-loader → css-loader → style-loader

---

### 3. 常用 Loader 速查

| Loader | 作用 | 配置 |
|--------|------|------|
| **css-loader** | 解析 CSS 文件 | `use: ['style-loader', 'css-loader']` |
| **style-loader** | 将 CSS 注入 DOM | 同上 |
| **sass-loader** | 编译 Sass/SCSS | `use: ['style-loader', 'css-loader', 'sass-loader']` |
| **less-loader** | 编译 Less | `use: ['style-loader', 'css-loader', 'less-loader']` |
| **postcss-loader** | PostCSS 处理 | `use: ['css-loader', 'postcss-loader']` |
| **babel-loader** | 转译 JavaScript | `use: 'babel-loader'` |
| **ts-loader** | 编译 TypeScript | `use: 'ts-loader'` |

**Asset Modules（Webpack 5）**：
| Type | 作用 | 替代 |
|------|------|------|
| **asset/resource** | 输出文件 | file-loader |
| **asset/inline** | 转 base64 | url-loader |
| **asset/source** | 导出源码 | raw-loader |
| **asset** | 自动选择 | - |

---

### 4. CSS 处理流程

```
style.css
    ↓
postcss-loader (添加前缀、压缩等)
    ↓
sass-loader/less-loader (如果是 Sass/Less)
    ↓
css-loader (解析 @import、url())
    ↓
style-loader (注入到 <style> 标签)
或
MiniCssExtractPlugin.loader (提取到独立文件)
    ↓
浏览器
```

---

### 5. 静态资源处理

```javascript
// Webpack 5: Asset Modules
module.exports = {
  module: {
    rules: [
      // 图片：输出文件
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      },
      
      // 小图标：转 base64
      {
        test: /\.svg$/,
        type: 'asset/inline'
      },
      
      // 自动选择
      {
        test: /\.(png|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024  // 8KB 以下转 base64
          }
        }
      }
    ]
  }
};
```

---

## 💡 学习建议

### 1. 循序渐进
- 先理解 Loader 的概念和必要性
- 再学习常用 Loader 的使用
- 然后理解链式调用机制
- 最后尝试手写 Loader

### 2. 对比学习
- 对比 style-loader 和 MiniCssExtractPlugin
- 对比 file-loader 和 Asset Modules
- 对比不同预处理器的配置

### 3. 动手实践
- 每个 Demo 都要亲自运行
- 尝试修改 Loader 配置
- 观察输出结果的变化
- 理解每个 Loader 的作用

### 4. 深入原理
- 阅读 Loader 源码（从简单的开始）
- 理解 Loader 的 API
- 实现自己的 Loader
- 调试 Loader 的执行过程

---

## 🎯 实战技巧

### 1. CSS 模块化

```javascript
// CSS Modules
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

### 2. 性能优化

```javascript
// 图片优化
{
  test: /\.(png|jpg)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024  // 小于 8KB 转 base64
    }
  },
  generator: {
    filename: 'images/[hash:8][ext]'
  }
}
```

### 3. 开发体验

```javascript
// 开发环境：style-loader（HMR）
// 生产环境：提取 CSS 文件
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

## 📝 预计学习时间

- **快速模式**：6 小时（理论 + 运行 Demo）
- **标准模式**：12 小时（深入学习 + 实践 + 总结）
- **深入模式**：3 天（研究源码 + 手写 Loader + 扩展）

选择适合自己的节奏，重要的是理解透彻。

---

## 🎯 下一步

完成 Phase 03 后，继续学习：
- **Phase 04**: Plugin 机制深入 - 扩展 Webpack 功能
- **Phase 05**: 开发服务器 - webpack-dev-server 深入

---

## 💡 常见问题预告

### Q1: 为什么 Loader 要从右到左执行？
→ 在 `03-loader-chain.md` 中详细解答

### Q2: style-loader 和 MiniCssExtractPlugin 有什么区别？
→ 在 `01-css-basic` Demo 中对比演示

### Q3: 什么时候用 asset/resource，什么时候用 asset/inline？
→ 在 `02-assets` Demo 中详细说明

### Q4: 如何调试 Loader？
→ 在 `04-custom-loader` Demo 中实践

准备好了吗？开始你的 Loader 学习之旅！🚀

