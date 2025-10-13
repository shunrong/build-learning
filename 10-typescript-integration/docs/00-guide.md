# Phase 10: TypeScript 集成

## 🎯 学习目标

通过这个阶段，你将：
1. **掌握 TypeScript 在 Webpack 中的配置**
2. **理解 ts-loader 和 Babel 方案的区别**
3. **掌握类型检查和编译分离**
4. **学会生成和使用声明文件**
5. **掌握 TypeScript ESLint 配置**

---

## 📚 学习路径

```
理论学习（3-4小时）
    ↓
1. 阅读 docs/01-typescript-basics.md      (60分钟) - TypeScript 基础
2. 阅读 docs/02-loader-comparison.md      (60分钟) - Loader 方案对比
3. 阅读 docs/03-type-checking.md          (45分钟) - 类型检查
4. 阅读 docs/04-declaration-files.md      (45分钟) - 声明文件
    ↓
实践体验（3-4小时）
    ↓
5. 运行 demos/01-typescript-complete/     (2-3小时)
    ↓
深入实践（2-3小时）
    ↓
6. 配置 TypeScript 项目                   (1-2小时)
7. 编写类型定义                           (1小时)
```

---

## 📖 文档列表

### 1. [TypeScript 基础](./01-typescript-basics.md)
- TypeScript 简介
- tsconfig.json 配置
- 常用编译选项
- 路径别名
- 最佳实践

### 2. [Loader 方案对比](./02-loader-comparison.md)
- ts-loader
- Babel + @babel/preset-typescript
- 方案对比和选择
- 性能优化
- 最佳实践

### 3. [类型检查](./03-type-checking.md)
- 类型检查 vs 编译
- fork-ts-checker-webpack-plugin
- 增量类型检查
- CI/CD 集成
- 最佳实践

### 4. [声明文件](./04-declaration-files.md)
- 什么是声明文件？
- 生成声明文件
- 第三方库类型
- 自定义类型声明
- 最佳实践

---

## 🎮 Demo

### [TypeScript 完整示例](../demos/01-typescript-complete/)

**涵盖内容**：
- ✅ TypeScript 基础配置（tsconfig.json）
- ✅ ts-loader 集成
- ✅ 类型检查（fork-ts-checker-webpack-plugin）
- ✅ 声明文件生成
- ✅ TypeScript ESLint
- ✅ 路径别名

**运行方式**：
```bash
cd demos/01-typescript-complete
npm install
npm run dev      # 开发模式
npm run build    # 生产构建
npm run type-check  # 类型检查
```

---

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 理解 TypeScript 编译过程
- [ ] 理解 ts-loader 和 Babel 的区别
- [ ] 理解类型检查和编译的分离
- [ ] 理解声明文件的作用
- [ ] 能够配置 TypeScript ESLint

### 实践层面
- [ ] 能配置 tsconfig.json
- [ ] 能在 Webpack 中集成 TypeScript
- [ ] 能配置类型检查
- [ ] 能生成声明文件
- [ ] 能解决类型错误

### 面试层面
1. **TypeScript 如何与 Webpack 集成？**
2. **ts-loader 和 Babel 的区别？**
3. **如何优化 TypeScript 编译速度？**
4. **什么是声明文件？**
5. **如何为第三方库添加类型？**

---

## 🎯 核心知识点

### 1. Loader 方案对比

| 方案 | 类型检查 | 编译速度 | Babel 集成 | 推荐场景 |
|------|----------|----------|------------|----------|
| **ts-loader** | ✅ 内置 | 较慢 | 需要额外配置 | 小型项目 |
| **Babel + TypeScript** | ❌ 需要插件 | 很快 | ✅ 原生 | 大型项目 ⭐️ |

### 2. tsconfig.json 关键配置

```json
{
  "compilerOptions": {
    "target": "ES2020",           // 目标 ES 版本
    "module": "ESNext",           // 模块系统
    "lib": ["ES2020", "DOM"],     // 库文件
    "jsx": "react-jsx",           // JSX 支持
    "strict": true,               // 严格模式
    "esModuleInterop": true,      // ES 模块互操作
    "skipLibCheck": true,         // 跳过库检查
    "moduleResolution": "node",   // 模块解析
    "resolveJsonModule": true,    // JSON 模块
    "declaration": true,          // 生成声明文件
    "declarationMap": true,       // 声明映射
    "sourceMap": true             // Source Map
  }
}
```

### 3. 类型检查分离

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
            transpileOnly: true  // 只编译，不检查
          }
        }
      }
    ]
  },
  plugins: [
    // 在单独的进程中进行类型检查
    new ForkTsCheckerWebpackPlugin()
  ]
};
```

---

## 💡 最佳实践

### 1. 推荐配置（Babel 方案）⭐️

```javascript
// webpack.config.js
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
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
};

// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "strict": true,
    "noEmit": true  // Babel 负责编译
  }
}
```

### 2. 路径别名

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  }
};
```

### 3. TypeScript ESLint

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ]
};
```

---

## 🔗 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [ts-loader 文档](https://github.com/TypeStrong/ts-loader)
- [Babel TypeScript 支持](https://babeljs.io/docs/en/babel-preset-typescript)
- [TypeScript ESLint](https://typescript-eslint.io/)

---

**准备好了吗？让我们开始 TypeScript 集成的学习之旅！** 🚀

