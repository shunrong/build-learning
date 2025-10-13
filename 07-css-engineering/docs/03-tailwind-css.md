# Tailwind CSS 实战

## 📖 什么是 Tailwind CSS？

**Tailwind CSS** 是一个原子化（Utility-First）的 CSS 框架。

### 传统方式 vs Tailwind

```html
<!-- 传统方式 -->
<button class="btn btn-primary">Click</button>

<style>
.btn {
  padding: 10px 20px;
  border-radius: 4px;
}
.btn-primary {
  background: blue;
  color: white;
}
</style>

<!-- Tailwind 方式 -->
<button class="px-5 py-2 bg-blue-500 text-white rounded">
  Click
</button>
```

---

## 核心概念

### 1. 工具类（Utility Classes）

```html
<!-- 布局 -->
<div class="flex items-center justify-center">

<!-- 间距 -->
<div class="p-4 m-2">  <!-- padding:16px; margin:8px; -->

<!-- 颜色 -->
<div class="bg-blue-500 text-white">

<!-- 尺寸 -->
<div class="w-full h-screen">

<!-- 响应式 -->
<div class="w-full md:w-1/2 lg:w-1/3">
```

### 2. 响应式设计

```html
<div class="
  w-full        <!-- 默认：全宽 -->
  md:w-1/2      <!-- ≥768px：50% -->
  lg:w-1/3      <!-- ≥1024px：33% -->
  xl:w-1/4      <!-- ≥1280px：25% -->
">
  响应式容器
</div>
```

断点：
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

### 3. 暗黑模式

```html
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">
    自动适配暗黑模式
  </h1>
</div>
```

---

## 安装和配置

### 1. 安装

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. tailwind.config.js

```javascript
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2'
      },
      spacing: {
        '128': '32rem'
      }
    }
  },
  plugins: []
};
```

### 3. CSS 入口文件

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义样式 */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
  }
}
```

---

## 生产优化（PurgeCSS）

Tailwind 3.0+ 自动优化，只需正确配置 `content`：

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}'
  ]
};
```

**效果**：
- 开发：~3MB（包含所有工具类）
- 生产：~10KB（只包含使用的类）

---

## 优缺点

### ✅ 优点
1. 快速开发，不需要写 CSS
2. 样式一致性好
3. 响应式设计简单
4. 生产体积小（PurgeCSS）
5. 可定制性强

### ❌ 缺点
1. HTML 会变得很长
2. 学习成本（记忆工具类）
3. 不适合复杂动画
4. 团队需要统一规范

---

## 🎯 推荐配置

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',  // 或 'media'
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          500: '#667eea',
          900: '#2d3748'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```

---

**下一步**：学习 [CSS 优化技巧](./04-css-optimization.md)

