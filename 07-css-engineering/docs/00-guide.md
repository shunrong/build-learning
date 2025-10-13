# Phase 07: CSS 工程化

## 🎯 学习目标

通过这个阶段，你将：
1. **掌握 CSS Modules 的使用和原理**
2. **理解 PostCSS 生态和常用插件**
3. **学会配置和使用 Tailwind CSS**
4. **掌握 CSS 优化技巧**
5. **能够搭建完整的 CSS 工程化方案**

---

## 📚 学习路径

```
理论学习（3-4小时）
    ↓
1. 阅读 docs/01-css-modules.md           (45分钟) - CSS Modules
2. 阅读 docs/02-postcss.md               (60分钟) - PostCSS 生态
3. 阅读 docs/03-tailwind-css.md          (60分钟) - Tailwind CSS
4. 阅读 docs/04-css-optimization.md      (45分钟) - CSS 优化
    ↓
实践体验（4-5小时）
    ↓
5. 运行 demos/01-css-modules/            (1小时)
6. 运行 demos/02-postcss-demo/           (1-1.5小时)
7. 运行 demos/03-tailwind-demo/          (1-1.5小时)
8. 运行 demos/04-css-optimization/       (1小时)
    ↓
深入实践（2-3小时）
    ↓
9. 配置完整的 CSS 工程化方案             (1-2小时)
10. 优化 CSS 打包体积                    (1小时)
    ↓
总结反思（30分钟）
    ↓
11. 总结 CSS 工程化的最佳实践
```

---

## 📖 文档列表

### 1. [CSS Modules 详解](./01-css-modules.md)
- 什么是 CSS Modules？
- 为什么需要 CSS Modules？
- 基本用法和配置
- :local 和 :global
- 组合样式（composes）
- 与预处理器结合
- 最佳实践

### 2. [PostCSS 生态](./02-postcss.md)
- 什么是 PostCSS？
- PostCSS vs Sass/Less
- 核心插件生态
  - Autoprefixer（自动添加前缀）
  - postcss-preset-env（使用未来特性）
  - cssnano（压缩）
  - postcss-nested（嵌套语法）
- Webpack 配置
- 自定义插件
- 最佳实践

### 3. [Tailwind CSS 实战](./03-tailwind-css.md)
- 什么是 Tailwind CSS？
- 原子化 CSS 的优缺点
- 安装和配置
- 核心概念
  - 工具类
  - 响应式设计
  - 暗黑模式
  - 自定义主题
- 与 Webpack 集成
- 生产优化（PurgeCSS）
- 最佳实践

### 4. [CSS 优化技巧](./04-css-optimization.md)
- CSS 打包体积优化
  - Tree Shaking
  - PurgeCSS/UnCSS
  - 压缩
- CSS 性能优化
  - 关键 CSS
  - CSS 分割
  - 异步加载
- 开发体验优化
  - HMR 配置
  - Source Map
- 最佳实践

---

## 🎮 Demo 列表

### Demo 1: [CSS Modules 实战](../demos/01-css-modules/)
**场景**：解决 CSS 全局作用域污染问题

**核心内容**：
- ✅ CSS Modules 基础用法
- ✅ :local 和 :global
- ✅ composes 组合样式
- ✅ 与 Sass 结合使用
- ✅ TypeScript 类型支持

**运行方式**：
```bash
cd demos/01-css-modules
npm install
npm run dev
```

---

### Demo 2: [PostCSS 生态演示](../demos/02-postcss-demo/)
**场景**：使用 PostCSS 增强 CSS 开发体验

**核心内容**：
- ✅ Autoprefixer 自动前缀
- ✅ postcss-preset-env 未来特性
- ✅ postcss-nested 嵌套语法
- ✅ cssnano 压缩
- ✅ 插件配置和组合

**运行方式**：
```bash
cd demos/02-postcss-demo
npm install
npm run dev
npm run build  # 查看压缩效果
```

---

### Demo 3: [Tailwind CSS 实战](../demos/03-tailwind-demo/)
**场景**：使用 Tailwind CSS 快速构建现代 UI

**核心内容**：
- ✅ Tailwind 基础配置
- ✅ 工具类使用
- ✅ 响应式设计
- ✅ 暗黑模式
- ✅ 自定义主题
- ✅ 生产优化（PurgeCSS）

**运行方式**：
```bash
cd demos/03-tailwind-demo
npm install
npm run dev
npm run build  # 查看优化效果
```

---

### Demo 4: [CSS 优化实战](../demos/04-css-optimization/)
**场景**：全面优化 CSS 打包和性能

**核心内容**：
- ✅ PurgeCSS 删除未使用样式
- ✅ 关键 CSS 提取
- ✅ CSS 代码分割
- ✅ 压缩和 Source Map
- ✅ 性能对比

**运行方式**：
```bash
cd demos/04-css-optimization
npm install
npm run build:all  # 生成所有优化方案
npm run analyze    # 对比分析
```

---

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 理解 CSS Modules 的作用域隔离原理
- [ ] 理解 PostCSS 的插件机制
- [ ] 理解原子化 CSS 的优缺点
- [ ] 掌握 CSS 优化的各种技巧
- [ ] 能够设计完整的 CSS 工程化方案

### 实践层面
- [ ] 能配置 CSS Modules
- [ ] 能配置 PostCSS 插件链
- [ ] 能集成 Tailwind CSS
- [ ] 能优化 CSS 打包体积
- [ ] 能处理 CSS 兼容性问题

### 面试层面
能够清晰回答以下面试问题：

1. **CSS Modules 是如何实现作用域隔离的？**
2. **PostCSS 和 Sass/Less 有什么区别？**
3. **Autoprefixer 的工作原理是什么？**
4. **如何优化 CSS 打包体积？**
5. **Tailwind CSS 的优缺点是什么？**
6. **什么是关键 CSS？如何提取？**
7. **CSS-in-JS 和 CSS Modules 的区别？**
8. **如何实现 CSS 代码分割？**
9. **PurgeCSS 的工作原理？**
10. **如何配置 CSS 的 Source Map？**

---

## 🎯 核心知识点

### 1. CSS Modules 工作原理

```css
/* button.module.css */
.button {
  background: blue;
}

/* 编译后 */
.button_abc123 {
  background: blue;
}
```

```javascript
// 使用
import styles from './button.module.css';
// styles.button === 'button_abc123'
```

### 2. PostCSS 插件流程

```
CSS 源码
    ↓
PostCSS Parser（解析为 AST）
    ↓
Plugin 1（处理 AST）
    ↓
Plugin 2（处理 AST）
    ↓
Plugin N（处理 AST）
    ↓
PostCSS Stringifier（生成 CSS）
    ↓
最终 CSS
```

### 3. Tailwind CSS 工作流

```
1. 编写 HTML（使用工具类）
   <div class="flex items-center justify-center">

2. Tailwind 扫描文件，生成对应 CSS
   .flex { display: flex; }
   .items-center { align-items: center; }
   .justify-center { justify-content: center; }

3. PurgeCSS 删除未使用的样式

4. 压缩输出
```

### 4. CSS 优化技巧对比

| 技巧 | 效果 | 适用场景 | 推荐度 |
|------|------|----------|--------|
| **CSS Modules** | 避免命名冲突 | 组件化开发 | ⭐⭐⭐⭐⭐ |
| **PostCSS Autoprefixer** | 自动添加前缀 | 所有项目 | ⭐⭐⭐⭐⭐ |
| **PurgeCSS** | 删除未使用样式 | Tailwind/Bootstrap | ⭐⭐⭐⭐⭐ |
| **cssnano** | 压缩 CSS | 生产环境 | ⭐⭐⭐⭐⭐ |
| **关键 CSS** | 首屏优化 | 大型网站 | ⭐⭐⭐⭐ |
| **代码分割** | 按需加载 | 多页面应用 | ⭐⭐⭐⭐ |

---

## 💡 最佳实践

### 1. CSS Modules 配置

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          }
        ]
      }
    ]
  }
};
```

### 2. PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
```

### 3. Tailwind CSS 配置

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#667eea'
      }
    }
  },
  plugins: []
};
```

### 4. CSS 优化配置

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    }),
    new PurgeCSSPlugin({
      paths: glob.sync('./src/**/*', { nodir: true })
    })
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
};
```

---

## 🔗 相关资源

- [CSS Modules 官方文档](https://github.com/css-modules/css-modules)
- [PostCSS 官方文档](https://postcss.org/)
- [Autoprefixer 文档](https://github.com/postcss/autoprefixer)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [PurgeCSS 文档](https://purgecss.com/)

---

## 🎓 学习建议

1. **先理解问题，再学习方案**
   - CSS 全局作用域的问题
   - CSS 兼容性的问题
   - CSS 体积的问题

2. **对比学习**
   - CSS Modules vs CSS-in-JS
   - PostCSS vs Sass/Less
   - Tailwind vs Bootstrap

3. **关注性能**
   - 打包体积
   - 首屏加载时间
   - 开发体验

4. **面向生产**
   - 考虑浏览器兼容性
   - 考虑团队协作
   - 考虑维护成本

---

## 🔧 完整工程化方案

```javascript
// 推荐的 CSS 工程化配置
module.exports = {
  module: {
    rules: [
      // CSS Modules
      {
        test: /\.module\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDev
                  ? '[name]__[local]--[hash:base64:5]'
                  : '[hash:base64:8]'
              },
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-import',
                  'postcss-nested',
                  'autoprefixer',
                  !isDev && 'cssnano'
                ].filter(Boolean)
              }
            }
          }
        ]
      },
      
      // 全局 CSS
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
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
      }
    ]
  },
  
  plugins: [
    !isDev && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    !isDev && new PurgeCSSPlugin({
      paths: glob.sync('./src/**/*', { nodir: true })
    })
  ].filter(Boolean),
  
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
};
```

---

**准备好了吗？让我们开始 CSS 工程化的学习之旅！** 🎨

