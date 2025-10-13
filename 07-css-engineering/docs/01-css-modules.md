# CSS Modules 详解

## 📖 目录

1. [什么是 CSS Modules？](#什么是-css-modules)
2. [为什么需要 CSS Modules？](#为什么需要-css-modules)
3. [基本用法](#基本用法)
4. [核心特性](#核心特性)
5. [Webpack 配置](#webpack-配置)
6. [与预处理器结合](#与预处理器结合)
7. [最佳实践](#最佳实践)

---

## 什么是 CSS Modules？

**CSS Modules** 是一种 CSS 文件的模块化解决方案，它通过**自动生成唯一的类名**来实现 CSS 的**局部作用域**。

### 核心理念

```css
/* button.module.css */
.button {
  background: blue;
  color: white;
}

/* ↓ 编译后 ↓ */

.button_abc123def {
  background: blue;
  color: white;
}
```

```javascript
// 使用
import styles from './button.module.css';

// styles.button === 'button_abc123def'
<button className={styles.button}>Click</button>
```

---

## 为什么需要 CSS Modules？

### 1. 传统 CSS 的问题

#### 问题1：全局作用域污染

```css
/* componentA.css */
.title {
  color: red;
}

/* componentB.css */
.title {
  color: blue;  /* ❌ 会覆盖 componentA 的样式 */
}
```

#### 问题2：命名冲突

```css
/* header.css */
.button {
  font-size: 14px;
}

/* footer.css */
.button {
  font-size: 16px;  /* ❌ 冲突 */
}
```

#### 问题3：难以维护

```css
/* 不知道这个样式在哪里被使用 */
.legacy-style-from-2015 {
  /* 不敢删除 */
}
```

### 2. CSS Modules 的解决方案

#### ✅ 局部作用域

```css
/* Button.module.css */
.button {
  background: blue;
}
```

```javascript
import styles from './Button.module.css';
// styles.button === 'Button_button__abc123'
```

**结果**：每个组件的样式互不干扰

#### ✅ 明确的依赖关系

```javascript
// 哪里 import，哪里使用
import styles from './Button.module.css';
```

**结果**：可以安全删除未使用的 CSS

#### ✅ 组合和复用

```css
.base {
  padding: 10px;
}

.primary {
  composes: base;
  background: blue;
}
```

**结果**：样式可以组合复用

---

## 基本用法

### 1. 文件命名约定

```
button.module.css    ✅ CSS Modules
button.css           ❌ 普通 CSS（全局）
```

### 2. 定义样式

```css
/* Button.module.css */
.button {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background: #5568d3;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 3. 在 JavaScript 中使用

```javascript
// Button.jsx
import React from 'react';
import styles from './Button.module.css';

function Button({ children, disabled }) {
  return (
    <button 
      className={styles.button}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### 4. 多个类名

```javascript
// 方式1：字符串拼接
<button className={`${styles.button} ${styles.primary}`}>

// 方式2：数组 + join
<button className={[styles.button, styles.primary].join(' ')}>

// 方式3：使用 classnames 库
import classNames from 'classnames';
<button className={classNames(styles.button, styles.primary)}>

// 方式4：条件类名
<button className={classNames(styles.button, {
  [styles.disabled]: isDisabled,
  [styles.loading]: isLoading
})}>
```

---

## 核心特性

### 1. :local 和 :global

#### :local（默认）

```css
/* 默认就是 local */
.button {
  color: blue;
}

/* 等价于 */
:local(.button) {
  color: blue;
}
```

#### :global（全局样式）

```css
/* 需要全局样式时使用 */
:global(.ant-btn) {
  /* 修改 Ant Design 按钮样式 */
  border-radius: 4px;
}

/* 全局选择器 */
:global {
  body {
    margin: 0;
    padding: 0;
  }
}
```

#### 混合使用

```css
/* 局部类名 + 全局子选择器 */
.container :global(.ant-btn) {
  margin-right: 10px;
}

/* 编译后 */
.container_abc123 .ant-btn {
  margin-right: 10px;
}
```

### 2. composes（组合）

#### 基础组合

```css
/* Button.module.css */
.base {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  composes: base;
  background: #667eea;
  color: white;
}

.secondary {
  composes: base;
  background: #e0e7ff;
  color: #667eea;
}
```

```javascript
// 使用
<button className={styles.primary}>Primary</button>

// 实际输出的类名：
// "base_abc123 primary_def456"
```

#### 跨文件组合

```css
/* common.module.css */
.padding {
  padding: 10px;
}

.margin {
  margin: 10px;
}
```

```css
/* Button.module.css */
.button {
  composes: padding from './common.module.css';
  composes: margin from './common.module.css';
  background: blue;
}
```

#### 多个组合

```css
.button {
  composes: padding margin from './common.module.css';
  composes: rounded from './theme.module.css';
  background: blue;
}
```

### 3. 类名生成规则

#### 默认规则

```
[filename]_[classname]__[hash]

Button_button__abc123
Card_title__def456
```

#### 自定义规则

```javascript
// webpack.config.js
{
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]'
    }
  }
}

// 可用变量：
// [path]      - 文件路径
// [name]      - 文件名
// [local]     - 类名
// [hash]      - 哈希值
// [hash:base64:5] - 5位base64哈希
```

---

## Webpack 配置

### 1. 基础配置

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
              modules: true
            }
          }
        ]
      }
    ]
  }
};
```

### 2. 完整配置

```javascript
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
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
                  // 类名生成规则
                  localIdentName: isDev
                    ? '[path][name]__[local]--[hash:base64:5]'
                    : '[hash:base64:8]',
                  
                  // 导出类名格式
                  exportLocalsConvention: 'camelCase',
                  
                  // 哪些选择器不做局部化
                  mode: 'local'
                },
                
                // Source Map
                sourceMap: true,
                
                // import/url 处理
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        
        // 普通 CSS（全局）
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    }
  };
};
```

### 3. 配置选项详解

#### exportLocalsConvention

```javascript
{
  modules: {
    exportLocalsConvention: 'camelCase'
  }
}
```

```css
/* 定义 */
.my-button { }
```

```javascript
// 使用
import styles from './button.module.css';
styles.myButton  // ✅ 驼峰命名
styles['my-button']  // ✅ 原始命名（也可用）
```

选项：
- `'asIs'` - 原样导出
- `'camelCase'` - 驼峰命名
- `'camelCaseOnly'` - 只有驼峰命名
- `'dashes'` - 短横线命名
- `'dashesOnly'` - 只有短横线命名

---

## 与预处理器结合

### 1. 与 Sass 结合

```javascript
// webpack.config.js
{
  test: /\.module\.scss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true
      }
    },
    'sass-loader'
  ]
}
```

```scss
// Button.module.scss
$primary-color: #667eea;

.button {
  background: $primary-color;
  
  &:hover {
    background: darken($primary-color, 10%);
  }
  
  &.disabled {
    opacity: 0.5;
  }
}
```

### 2. 与 PostCSS 结合

```javascript
{
  test: /\.module\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { modules: true }
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'autoprefixer',
            'postcss-nested'
          ]
        }
      }
    }
  ]
}
```

```css
/* Button.module.css */
.button {
  /* 嵌套语法（postcss-nested） */
  & :hover {
    opacity: 0.8;
  }
  
  /* 自动添加前缀（autoprefixer） */
  display: flex;
  user-select: none;
}
```

---

## 最佳实践

### 1. 文件组织

```
components/
├── Button/
│   ├── Button.jsx
│   ├── Button.module.css    ✅ 组件样式
│   └── index.js              ✅ 导出组件
├── Card/
│   ├── Card.jsx
│   ├── Card.module.css
│   └── index.js
└── common.module.css         ✅ 公共样式
```

### 2. 命名规范

```css
/* ✅ 推荐：BEM 简化版 */
.button { }
.button-icon { }
.button-text { }

/* ❌ 不推荐：过深的嵌套 */
.button .icon .svg .path { }

/* ✅ 推荐：语义化 */
.primary { }
.secondary { }
.disabled { }

/* ❌ 不推荐：样式化命名 */
.blue { }
.padding10 { }
```

### 3. 使用 composes 复用

```css
/* common.module.css */
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.padding {
  padding: 10px 20px;
}
```

```css
/* Button.module.css */
.button {
  composes: flexCenter from './common.module.css';
  composes: padding from './common.module.css';
  background: blue;
}
```

### 4. TypeScript 支持

#### 方式1：typescript-plugin-css-modules

```bash
npm install -D typescript-plugin-css-modules
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-plugin-css-modules"
      }
    ]
  }
}
```

#### 方式2：手动声明

```typescript
// button.module.css.d.ts
declare const styles: {
  readonly button: string;
  readonly primary: string;
  readonly disabled: string;
};
export default styles;
```

#### 方式3：全局声明

```typescript
// global.d.ts
declare module '*.module.css' {
  const styles: { [key: string]: string };
  export default styles;
}
```

### 5. 避免过度使用

```javascript
// ❌ 不推荐：简单元素也用 CSS Modules
<div className={styles.div}>
  <p className={styles.p}>text</p>
</div>

// ✅ 推荐：只在有样式冲突风险的地方使用
<div className={styles.container}>
  <p>text</p>  {/* 简单元素可以不用 */}
</div>
```

### 6. 处理第三方库

```css
/* 方式1：:global 包裹 */
:global {
  .ant-btn {
    border-radius: 4px;
  }
}

/* 方式2：全局 CSS 文件 */
/* 使用普通 .css 而不是 .module.css */
```

### 7. 性能优化

```javascript
// ✅ 生产环境使用短类名
{
  modules: {
    localIdentName: isDev
      ? '[path][name]__[local]'
      : '[hash:base64:8]'
  }
}

// ✅ 提取 CSS
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css'
  })
]
```

---

## 🎯 总结

### 核心要点

1. **CSS Modules 是什么**：通过自动生成唯一类名实现局部作用域
2. **核心特性**：:local/:global、composes、自定义类名规则
3. **使用方式**：`.module.css` 文件 + `import styles`
4. **最佳实践**：合理组织文件、使用 composes 复用、TypeScript 支持

### 快速决策

```
需要避免样式冲突？
  ├─ 是 → CSS Modules ⭐️⭐️⭐️⭐️⭐️
  └─ 否 → 普通 CSS

需要复杂的动态样式？
  ├─ 是 → CSS-in-JS ⭐️⭐⭐️⭐️
  └─ 否 → CSS Modules ⭐️⭐️⭐️⭐️⭐️

团队已有 CSS 规范？
  ├─ 是 → CSS Modules（渐进迁移）⭐️⭐️⭐️⭐️
  └─ 否 → CSS Modules ⭐️⭐️⭐️⭐️⭐️
```

### 推荐配置

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
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
                  : '[hash:base64:8]',
                exportLocalsConvention: 'camelCase'
              },
              sourceMap: true
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
};
```

### 常见面试题

1. **CSS Modules 是如何实现作用域隔离的？**
   - 答：通过自动生成唯一的类名（hash）

2. **CSS Modules 和 CSS-in-JS 的区别？**
   - 答：CSS Modules 是编译时方案（生成唯一类名），CSS-in-JS 是运行时方案（动态生成样式）

3. **composes 的作用？**
   - 答：样式组合复用，避免重复代码

4. **如何在 CSS Modules 中使用全局样式？**
   - 答：使用 `:global` 选择器

5. **CSS Modules 的优缺点？**
   - 答：优点是避免命名冲突、明确依赖；缺点是需要 import、不适合简单项目

---

**下一步**：学习 [PostCSS 生态](./02-postcss.md)，了解如何增强 CSS 开发体验。

