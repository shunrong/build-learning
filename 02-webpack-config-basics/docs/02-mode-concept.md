# Mode 概念详解

## 🎯 核心问题

- Mode 是什么？为什么需要它？
- development 和 production 有什么区别？
- Mode 背后做了什么优化？
- 如何自定义优化配置？

---

## 📌 什么是 Mode？

**Mode（模式）**告诉 Webpack 使用相应环境的内置优化。

```javascript
module.exports = {
  mode: 'development'  // 或 'production' 或 'none'
};
```

**核心价值**：
- ✅ 一个配置，自动应用多个优化
- ✅ 开发和生产环境的最佳实践
- ✅ 简化配置，开箱即用

---

## 🔄 三种 Mode

### 1. development（开发模式）

```javascript
module.exports = {
  mode: 'development'
};
```

**特点**：
- ✅ 快速构建
- ✅ 完整的 Source Map
- ✅ 友好的错误提示
- ❌ 文件体积大
- ❌ 代码未压缩

**适用场景**：
- 本地开发
- 调试代码
- 热更新开发

---

### 2. production（生产模式）⭐️ 默认

```javascript
module.exports = {
  mode: 'production'
};
```

**特点**：
- ✅ 代码压缩混淆
- ✅ Tree Shaking
- ✅ Scope Hoisting
- ✅ 文件体积最小
- ⚠️ 构建时间长
- ⚠️ Source Map 简化或无

**适用场景**：
- 线上部署
- 性能优化
- 代码保护

---

### 3. none（无模式）

```javascript
module.exports = {
  mode: 'none'
};
```

**特点**：
- 不启用任何默认优化
- 完全手动配置

**适用场景**：
- 自定义优化
- 学习 Webpack 原理
- 特殊需求

---

## 📊 Mode 对比详解

### 核心差异对比

| 特性 | development | production |
|------|-------------|------------|
| **process.env.NODE_ENV** | `'development'` | `'production'` |
| **代码压缩** | ❌ 不压缩 | ✅ UglifyJS/Terser |
| **Tree Shaking** | ❌ 不开启 | ✅ 移除未使用代码 |
| **Scope Hoisting** | ❌ 不开启 | ✅ 减少闭包 |
| **Source Map** | ✅ eval-cheap-module-source-map | ⚠️ 简化或无 |
| **模块名称** | ✅ 可读的路径 | ✅ 简短的 ID |
| **代码分割** | ✅ 按需加载 | ✅ 优化分割 |
| **构建速度** | ✅ 快 | ⚠️ 慢 |
| **文件大小** | ⚠️ 大 | ✅ 小 |
| **调试友好度** | ✅ 高 | ❌ 低 |

---

## 🔍 深入理解：Mode 背后的配置

### development 模式等价于：

```javascript
module.exports = {
  mode: 'development',
  
  // 等价于以下配置：
  devtool: 'eval-cheap-module-source-map',
  
  cache: true,  // 启用缓存
  
  output: {
    pathinfo: true  // 输出路径信息
  },
  
  optimization: {
    moduleIds: 'named',      // 使用可读的模块名
    chunkIds: 'named',       // 使用可读的 chunk 名
    minimize: false,         // 不压缩代码
    nodeEnv: 'development'   // 设置 process.env.NODE_ENV
  },
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};
```

---

### production 模式等价于：

```javascript
module.exports = {
  mode: 'production',
  
  // 等价于以下配置：
  devtool: false,  // 或 'source-map'
  
  performance: {
    hints: 'warning'  // 性能提示
  },
  
  output: {
    pathinfo: false  // 不输出路径信息
  },
  
  optimization: {
    moduleIds: 'deterministic',  // 确定性的模块 ID
    chunkIds: 'deterministic',    // 确定性的 chunk ID
    minimize: true,               // 压缩代码
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false,      // 移除 console
            drop_debugger: true,      // 移除 debugger
            pure_funcs: ['console.log']  // 移除特定函数
          }
        }
      })
    ],
    sideEffects: true,     // 启用 Tree Shaking
    usedExports: true,     // 标记未使用的导出
    concatenateModules: true,  // Scope Hoisting
    runtimeChunk: 'single',    // 提取 runtime
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    },
    nodeEnv: 'production'
  },
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
```

---

## 🎯 核心优化详解

### 1. 代码压缩（Minification）

**development**：
```javascript
// 未压缩
function add(a, b) {
  console.log('Adding:', a, b);
  return a + b;
}
```

**production**：
```javascript
// 压缩后
function add(n,o){return console.log("Adding:",n,o),n+o}
```

**效果**：
- 移除空格、换行
- 缩短变量名
- 移除注释
- 代码体积减少 50-70%

---

### 2. Tree Shaking

**原理**：移除未使用的代码

```javascript
// utils.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {  // 未使用
  return a - b;
}

// app.js
import { add } from './utils.js';
console.log(add(1, 2));
```

**development**：
```javascript
// 两个函数都会被打包
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }  // 包含未使用的
```

**production**：
```javascript
// 只打包使用的函数
function add(a, b) { return a + b; }
// subtract 被移除了 ✅
```

**条件**：
- ✅ 必须使用 ES Modules（import/export）
- ✅ package.json 中 `"sideEffects": false`
- ✅ production 模式

---

### 3. Scope Hoisting（作用域提升）

**原理**：减少函数闭包，合并模块作用域

**开发模式**（多个函数包裹）：
```javascript
// module 0
(function(module, exports) {
  exports.add = function(a, b) { return a + b; };
})();

// module 1
(function(module, exports, __webpack_require__) {
  const add = __webpack_require__(0).add;
  console.log(add(1, 2));
})();
```

**生产模式**（合并作用域）：
```javascript
// 合并后
(function() {
  function add(a, b) { return a + b; }  // 直接定义
  console.log(add(1, 2));               // 直接调用
})();
```

**效果**：
- 减少函数声明
- 减少闭包数量
- 文件体积更小
- 运行速度更快

---

### 4. Source Map

**development**：
```javascript
devtool: 'eval-cheap-module-source-map'
```
- ✅ 构建速度快
- ✅ 能定位到源代码行
- ✅ 方便调试

**production**：
```javascript
devtool: false  // 或 'source-map'
```
- 选项 1：不生成 Source Map（保护源码）
- 选项 2：生成独立的 .map 文件（方便调试线上问题）

**Source Map 类型对比**：

| 类型 | 构建速度 | 重构速度 | 质量 | 适用环境 |
|------|---------|---------|------|---------|
| `eval` | ⚡️⚡️⚡️ | ⚡️⚡️⚡️ | ⭐️ | 开发 |
| `eval-cheap-source-map` | ⚡️⚡️ | ⚡️⚡️ | ⭐️⭐️ | 开发 |
| `eval-cheap-module-source-map` | ⚡️⚡️ | ⚡️⚡️ | ⭐️⭐️⭐️ | 开发（推荐）|
| `source-map` | ⚡️ | ⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 生产 |
| `hidden-source-map` | ⚡️ | ⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 生产（不暴露源码）|

---

## ⚙️ 如何切换 Mode？

### 方法 1：配置文件

```javascript
// webpack.config.js
module.exports = {
  mode: 'development'  // 或 'production'
};
```

### 方法 2：命令行参数

```bash
# 开发模式
webpack --mode development

# 生产模式
webpack --mode production
```

### 方法 3：环境变量 + 函数式配置

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    // ... 其他配置
  };
};
```

```bash
# 开发
webpack --mode development

# 生产
webpack --mode production
```

### 方法 4：分离配置文件（推荐）⭐️

```
config/
├── webpack.common.js    # 公共配置
├── webpack.dev.js       # 开发配置
└── webpack.prod.js      # 生产配置
```

```javascript
// webpack.common.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist')
  }
};

// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true
  }
});

// webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true
  }
});
```

```json
// package.json
{
  "scripts": {
    "dev": "webpack serve --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.prod.js"
  }
}
```

---

## 🎯 自定义优化配置

### 开发环境优化

```javascript
module.exports = {
  mode: 'development',
  
  // 1. 使用缓存加速构建
  cache: {
    type: 'filesystem',  // 文件系统缓存
    cacheDirectory: path.resolve(__dirname, '.webpack_cache')
  },
  
  // 2. 优化 Source Map
  devtool: 'eval-cheap-module-source-map',
  
  // 3. 优化开发服务器
  devServer: {
    hot: true,           // 热更新
    compress: true,      // gzip 压缩
    historyApiFallback: true  // SPA 路由
  },
  
  // 4. 优化模块解析
  resolve: {
    extensions: ['.js', '.jsx'],  // 自动补全扩展名
    alias: {
      '@': path.resolve(__dirname, 'src')  // 路径别名
    }
  }
};
```

### 生产环境优化

```javascript
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  
  // 1. 代码分割
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // 2. 提取 runtime
    runtimeChunk: 'single',
    
    // 3. 代码压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,    // 移除 console
            drop_debugger: true,   // 移除 debugger
            pure_funcs: ['console.log']
          },
          format: {
            comments: false        // 移除注释
          }
        },
        extractComments: false     // 不提取注释到单独文件
      }),
      new CssMinimizerPlugin()     // CSS 压缩
    ],
    
    // 4. 模块 ID 优化
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  },
  
  // 5. 性能提示
  performance: {
    maxAssetSize: 250000,        // 单个文件最大 250KB
    maxEntrypointSize: 250000,   // 入口文件最大 250KB
    hints: 'warning'             // 超过提示警告
  }
};
```

---

## 📝 最佳实践

### 1. 开发环境重点：速度

```javascript
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',  // 快速 Source Map
  cache: true,                               // 开启缓存
  optimization: {
    removeAvailableModules: false,           // 不移除可用模块
    removeEmptyChunks: false,                // 不移除空 chunk
    splitChunks: false                       // 不分割代码
  }
};
```

### 2. 生产环境重点：体积

```javascript
module.exports = {
  mode: 'production',
  devtool: 'source-map',      // 完整 Source Map（可选）
  optimization: {
    minimize: true,            // 压缩代码
    usedExports: true,         // Tree Shaking
    concatenateModules: true,  // Scope Hoisting
    splitChunks: {             // 代码分割
      chunks: 'all'
    }
  }
};
```

### 3. 根据环境动态配置

```javascript
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    cache: isDev,
    optimization: {
      minimize: !isDev
    },
    plugins: [
      isDev && new ReactRefreshPlugin(),  // 开发环境专用
      !isDev && new BundleAnalyzerPlugin()  // 生产环境专用
    ].filter(Boolean)
  };
};
```

---

## 📊 对比测试

### 构建结果对比

```bash
# development 模式
npm run build:dev

Time: 2345ms
dist/bundle.js    856 KB

# production 模式
npm run build

Time: 8932ms
dist/bundle.js    234 KB  (压缩后)
```

**对比**：
- 构建时间：开发模式快 4 倍
- 文件大小：生产模式小 73%

---

## 📝 总结

### Mode 核心要点

1. **development**
   - 快速构建，方便调试
   - 代码未压缩，体积大
   - 完整的 Source Map

2. **production**
   - 代码压缩、Tree Shaking、Scope Hoisting
   - 构建慢，体积小
   - 性能优化

3. **最佳实践**
   - 开发环境重速度
   - 生产环境重体积
   - 分离配置文件

### 面试要点

1. **Mode 的作用是什么？**
   - 自动应用环境优化
   - 简化配置

2. **development 和 production 的区别？**
   - 压缩、Tree Shaking、Source Map
   - 速度 vs 体积

3. **如何自定义优化？**
   - optimization 配置
   - 根据环境动态配置

---

## 🎯 下一步

继续学习：
- [配置文件的多种形式](./03-config-file.md) - 函数式配置、TS 配置

然后通过 Demo 实践：
- [Demo 1: 单入口应用](../demos/01-single-entry/) - 对比开发和生产模式
- [Demo 4: 输出文件命名](../demos/04-output-patterns/) - 观察优化效果

