# React Fast Refresh

## 📖 什么是 Fast Refresh？

**Fast Refresh** 是 React 的热更新方案，修改组件后保留状态刷新。

### 与传统 HMR 的区别

| 特性 | 传统 HMR | Fast Refresh |
|------|----------|--------------|
| **状态保留** | ❌ | ✅ |
| **错误恢复** | 需要刷新 | 自动恢复 |
| **体验** | 一般 | 极佳 ⭐️ |

---

## 快速开始

### 1. 安装

```bash
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

### 2. 配置

```javascript
// webpack.config.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'react-refresh/babel'  // 添加 Fast Refresh 插件
            ]
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

---

## 🎯 完整配置

```javascript
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
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
              plugins: [
                isDev && 'react-refresh/babel'
              ].filter(Boolean)
            }
          }
        }
      ]
    },
    plugins: [
      isDev && new ReactRefreshWebpackPlugin()
    ].filter(Boolean)
  };
};
```

---

**下一步**：学习 [React Router](./03-react-router.md)

