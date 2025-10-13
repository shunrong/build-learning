# Loader 方案对比

## 📖 两种方案

在 Webpack 中集成 TypeScript 有两种主流方案：

1. **ts-loader**
2. **Babel + @babel/preset-typescript**

---

## 方案 1：ts-loader

### 安装

```bash
npm install -D typescript ts-loader
```

### 配置

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
```

### 特点

✅ **优点**：
- 完整的 TypeScript 编译器
- 内置类型检查
- 生成声明文件
- 配置简单

❌ **缺点**：
- 编译速度较慢
- 类型检查阻塞构建
- 无法使用 Babel 插件

---

## 方案 2：Babel + TypeScript

### 安装

```bash
npm install -D @babel/core @babel/preset-env @babel/preset-typescript babel-loader
npm install -D fork-ts-checker-webpack-plugin  # 类型检查插件
```

### 配置

```javascript
// webpack.config.js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()  // 在单独进程中检查
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "strict": true,
    "noEmit": true  // Babel 负责编译，TypeScript 只做检查
  }
}
```

### 特点

✅ **优点**：
- 编译速度很快
- 类型检查不阻塞构建（异步）
- 可以使用 Babel 插件
- 与现有 Babel 配置集成

❌ **缺点**：
- 不支持某些 TypeScript 特性（const enum、namespace）
- 需要额外配置类型检查

---

## 对比总结

| 特性 | ts-loader | Babel + TypeScript |
|------|-----------|-------------------|
| **编译速度** | 较慢 ⭐️⭐️ | 很快 ⭐️⭐️⭐️⭐️⭐️ |
| **类型检查** | 同步（阻塞） | 异步（不阻塞） |
| **Babel 集成** | 需要额外配置 | 原生支持 ⭐️ |
| **声明文件** | ✅ | 需要 tsc 单独生成 |
| **配置复杂度** | 简单 ⭐️⭐️⭐️⭐️ | 稍复杂 ⭐️⭐️⭐️ |
| **TypeScript 特性** | 完整支持 ⭐️⭐️⭐️⭐️⭐️ | 部分不支持 ⭐️⭐️⭐️⭐️ |
| **推荐场景** | 小型项目 | 大型项目 ⭐️ |

---

## 方案选择建议

### 选择 ts-loader

✅ **适用场景**：
- 小型项目
- 需要完整的 TypeScript 特性
- 不需要 Babel 插件
- 编译速度不是瓶颈

### 选择 Babel + TypeScript ⭐️（推荐）

✅ **适用场景**：
- 大型项目
- 需要快速编译
- 需要使用 Babel 插件
- 已有 Babel 配置

---

## 性能优化

### ts-loader 优化

#### 1. transpileOnly（只编译，不检查）

```javascript
{
  loader: 'ts-loader',
  options: {
    transpileOnly: true  // 加速编译
  }
}
```

配合 `fork-ts-checker-webpack-plugin` 异步检查：

```javascript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
};
```

#### 2. 使用缓存

```bash
npm install -D cache-loader
```

```javascript
{
  test: /\.tsx?$/,
  use: [
    'cache-loader',  // 添加缓存
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }
  ]
}
```

---

## 🎯 推荐配置

### 小型项目（ts-loader）

```javascript
// webpack.config.js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true  // 加速
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()  // 异步检查
  ]
};
```

### 大型项目（Babel）⭐️

```javascript
// webpack.config.js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
};
```

---

**下一步**：学习 [类型检查](./03-type-checking.md)

