# React 集成完整示例

## 📝 简介

本 Demo 展示如何在 Webpack 中完整集成 React + TypeScript，包括 Fast Refresh、React Router 和代码分割。

## 🎯 涵盖内容

1. **React 18** - 最新版本
2. **TypeScript** - 完整类型支持
3. **Fast Refresh** - 组件热更新（保留状态）
4. **React Router** - 路由管理
5. **代码分割** - 懒加载页面
6. **CSS** - 组件样式

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

浏览器会自动打开，查看 React 应用。

### 3. 生产构建

```bash
npm run build
```

---

## 📂 项目结构

```
01-react-complete/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Button.css
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Counter.tsx
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── webpack.config.js
├── tsconfig.json
└── package.json
```

---

## 🔧 核心配置

### 1. Webpack 配置

```javascript
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ],
            plugins: ['react-refresh/babel']
          }
        }
      }
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin()
  ]
};
```

### 2. TypeScript 配置

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",  // React 17+ 新 JSX 转换
    "lib": ["ES2020", "DOM"],
    "strict": true
  }
}
```

---

## 🎮 功能演示

### 1. Fast Refresh（热更新）

1. 访问 `/counter` 页面
2. 点击按钮增加计数
3. 修改 `src/pages/Counter.tsx` 中的文字
4. 保存文件
5. ✅ 页面自动更新，但计数器状态保留！

### 2. React Router（路由）

- `/` - 首页
- `/about` - 关于页面
- `/counter` - 计数器页面

### 3. 代码分割（懒加载）

所有页面都使用 `React.lazy()` 懒加载，按需加载提升性能。

```tsx
const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
```

---

## ✅ 验证清单

- [ ] React 组件正常渲染
- [ ] Fast Refresh 工作正常（修改代码保留状态）
- [ ] React Router 路由切换正常
- [ ] 懒加载生效（查看 Network 面板）
- [ ] TypeScript 类型检查正常

---

## 🎯 最佳实践

1. ✅ 使用 React 17+ 新 JSX 转换（无需 `import React`）
2. ✅ 使用 Fast Refresh 提升开发体验
3. ✅ 使用 React Router 管理路由
4. ✅ 使用懒加载优化性能
5. ✅ 使用 TypeScript 确保类型安全

---

**Phase 11: React 集成 Demo 已完成！** 🎉

