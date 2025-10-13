# 类型检查

## 📖 类型检查 vs 编译

### 区别

```
编译（Transpile）
  - 将 TypeScript 转换为 JavaScript
  - 去除类型注解
  - 不检查类型错误

类型检查（Type Check）
  - 检查类型是否正确
  - 发现类型错误
  - 不生成代码
```

### 为什么分离？

```
同步类型检查（ts-loader 默认）
  ✅ 准确
  ❌ 慢，阻塞构建
  
异步类型检查（fork-ts-checker-webpack-plugin）
  ✅ 快，不阻塞构建
  ✅ 开发体验好
  ❌ 需要额外配置
```

---

## fork-ts-checker-webpack-plugin

### 安装

```bash
npm install -D fork-ts-checker-webpack-plugin
```

### 基础配置

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
    new ForkTsCheckerWebpackPlugin()  // 在单独进程中检查
  ]
};
```

### 高级配置

```javascript
new ForkTsCheckerWebpackPlugin({
  // TypeScript 配置
  typescript: {
    configFile: 'tsconfig.json',
    mode: 'write-references',  // 或 'write-tsbuildinfo'
    diagnosticOptions: {
      semantic: true,
      syntactic: true
    }
  },
  
  // ESLint 支持
  eslint: {
    enabled: true,
    files: './src/**/*.{ts,tsx,js,jsx}'
  },
  
  // 日志
  logger: {
    infrastructure: 'console',
    issues: 'console'
  },
  
  // 开发服务器
  devServer: true
})
```

---

## 工作流程

```
1. webpack 开始构建
    ↓
2. ts-loader 编译（transpileOnly: true）
    ├─ 只去除类型
    ├─ 不检查类型
    └─ 速度很快 ✅
    ↓
3. 同时，fork-ts-checker 在单独进程中检查
    ├─ 不阻塞构建
    ├─ 完成后显示错误
    └─ 体验好 ✅
    ↓
4. 构建完成（快速）
5. 类型检查完成（稍后）
```

---

## 增量类型检查

### 配置

**tsconfig.json**：
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

**.gitignore**：
```
.tsbuildinfo
```

### 效果

```
首次类型检查：10 秒
增量类型检查：2 秒 ✅（快 5 倍）
```

---

## package.json 脚本

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

**使用**：
```bash
# 开发（后台自动检查）
npm run dev

# 手动检查
npm run type-check

# 持续检查
npm run type-check:watch
```

---

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check  # 类型检查
      - run: npm run build       # 构建
```

---

## 🎯 最佳实践

### 1. 开发环境

```javascript
// webpack.config.js (development)
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true  // 快速编译
          }
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      devServer: true  // 集成 dev server
    })
  ]
};
```

### 2. 生产环境

```javascript
// webpack.config.js (production)
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'  // 完整检查
      }
    ]
  }
};
```

或在构建前单独检查：

```json
{
  "scripts": {
    "prebuild": "npm run type-check",
    "build": "webpack --mode production"
  }
}
```

### 3. 完整配置（推荐）⭐️

```javascript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: isDev  // 开发环境快速编译
            }
          }
        }
      ]
    },
    plugins: [
      isDev && new ForkTsCheckerWebpackPlugin()
    ].filter(Boolean)
  };
};
```

---

**下一步**：学习 [声明文件](./04-declaration-files.md)

