# 配置文件的多种形式

## 🎯 核心问题

- Webpack 配置文件有哪些形式？
- 如何根据环境动态配置？
- 如何拆分和合并配置？
- 如何使用 TypeScript 编写配置？

---

## 📌 配置文件的 5 种形式

### 1. 对象形式（最基础）⭐️

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

**特点**：
- ✅ 最简单直观
- ✅ 适合简单项目
- ❌ 无法根据环境动态调整

---

### 2. 函数形式（推荐）⭐️⭐️⭐️

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  console.log('env:', env);        // 命令行传入的 --env 参数
  console.log('argv:', argv);      // 所有命令行参数
  console.log('mode:', argv.mode); // development 或 production
  
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    entry: './src/index.js',
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js'
    }
  };
};
```

**运行**：
```bash
# 传入环境变量
webpack --env production --mode production

# env 参数
webpack --env platform=web --env version=1.0.0
```

**接收参数**：
```javascript
module.exports = (env, argv) => {
  console.log(env.platform);  // 'web'
  console.log(env.version);   // '1.0.0'
  
  return {
    // ...配置
  };
};
```

**优点**：
- ✅ 可以根据环境动态配置
- ✅ 可以接收命令行参数
- ✅ 灵活性强

---

### 3. Promise 形式（异步配置）

```javascript
// webpack.config.js
module.exports = () => {
  return new Promise((resolve) => {
    // 异步操作，如读取远程配置
    setTimeout(() => {
      resolve({
        mode: 'production',
        entry: './src/index.js',
        output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'bundle.js'
        }
      });
    }, 1000);
  });
};
```

**实际案例：读取远程配置**
```javascript
const axios = require('axios');

module.exports = async () => {
  // 从服务器获取配置
  const config = await axios.get('https://api.example.com/webpack-config');
  
  return {
    mode: 'production',
    entry: config.data.entry,
    output: config.data.output
  };
};
```

---

### 4. 多配置形式（并行构建）

```javascript
// webpack.config.js
module.exports = [
  {
    // 配置 1：客户端构建
    name: 'client',
    target: 'web',
    entry: './src/client/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/client'),
      filename: 'bundle.js'
    }
  },
  {
    // 配置 2：服务端构建
    name: 'server',
    target: 'node',
    entry: './src/server/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/server'),
      filename: 'bundle.js'
    }
  }
];
```

**运行**：
```bash
# 同时构建两个配置
webpack

# 只构建指定配置
webpack --config-name client
```

**适用场景**：
- ✅ 同构应用（SSR）
- ✅ 多端构建（Web/Node/Electron）
- ✅ 库的多格式输出（UMD/ESM/CJS）

---

### 5. TypeScript 配置⭐️ 现代化

```typescript
// webpack.config.ts
import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

export default config;
```

**需要安装**：
```bash
npm install -D typescript ts-node @types/node @types/webpack
```

**优点**：
- ✅ 类型提示和检查
- ✅ IDE 智能补全
- ✅ 避免配置错误

---

## 🔧 配置拆分与合并

### 为什么需要拆分配置？

```
问题：
├── 开发环境需要 HMR、Source Map
├── 生产环境需要压缩、Tree Shaking
└── 两者有大量重复配置

解决方案：
├── webpack.common.js    # 公共配置
├── webpack.dev.js       # 开发配置
└── webpack.prod.js      # 生产配置
```

---

### 方案 1：使用 webpack-merge（推荐）⭐️

```bash
npm install -D webpack-merge
```

#### webpack.common.js（公共配置）
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

#### webpack.dev.js（开发配置）
```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  
  devtool: 'eval-cheap-module-source-map',
  
  devServer: {
    static: './dist',
    hot: true,
    port: 8080,
    open: true
  },
  
  output: {
    filename: '[name].js'
  }
});
```

#### webpack.prod.js（生产配置）
```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  
  devtool: 'source-map',
  
  output: {
    filename: '[name].[contenthash:8].js'
  },
  
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all'
    }
  }
});
```

#### package.json
```json
{
  "scripts": {
    "dev": "webpack serve --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  }
}
```

---

### 方案 2：使用函数动态配置

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  // 公共配置
  const config = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js'
    }
  };
  
  // 开发环境配置
  if (isDev) {
    config.devtool = 'eval-cheap-module-source-map';
    config.devServer = {
      hot: true,
      port: 8080
    };
  }
  
  // 生产环境配置
  if (!isDev) {
    config.devtool = 'source-map';
    config.optimization = {
      minimize: true,
      splitChunks: {
        chunks: 'all'
      }
    };
  }
  
  return config;
};
```

---

## 🎯 高级配置技巧

### 1. 根据环境加载不同插件

```javascript
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return merge(common, {
    mode: argv.mode,
    
    plugins: [
      // 公共插件
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode)
      }),
      
      // 条件插件
      isDev && new webpack.HotModuleReplacementPlugin(),
      !isDev && new BundleAnalyzerPlugin()
    ].filter(Boolean)  // 过滤掉 false 值
  });
};
```

---

### 2. 多环境配置

```javascript
// webpack.config.js
module.exports = (env) => {
  // 定义不同环境的配置
  const configs = {
    development: {
      apiUrl: 'http://localhost:3000',
      enableDebug: true
    },
    staging: {
      apiUrl: 'https://staging.example.com',
      enableDebug: true
    },
    production: {
      apiUrl: 'https://api.example.com',
      enableDebug: false
    }
  };
  
  const currentEnv = env.environment || 'development';
  const envConfig = configs[currentEnv];
  
  return {
    mode: currentEnv === 'production' ? 'production' : 'development',
    
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(envConfig.apiUrl),
        'process.env.ENABLE_DEBUG': JSON.stringify(envConfig.enableDebug)
      })
    ]
  };
};
```

```bash
# 使用
webpack --env environment=staging
webpack --env environment=production
```

---

### 3. 配置校验

```javascript
// webpack.config.js
const { validate } = require('schema-utils');
const schema = require('./webpack.config.schema.json');

module.exports = (env, argv) => {
  const config = {
    mode: argv.mode,
    entry: './src/index.js',
    // ... 其他配置
  };
  
  // 校验配置
  validate(schema, config, {
    name: 'Webpack Config',
    baseDataPath: 'configuration'
  });
  
  return config;
};
```

---

## 📝 最佳实践

### 1. 目录结构

```
project/
├── config/
│   ├── webpack.common.js     # 公共配置
│   ├── webpack.dev.js        # 开发配置
│   ├── webpack.prod.js       # 生产配置
│   └── paths.js              # 路径配置
├── src/
├── package.json
└── .gitignore
```

#### paths.js
```javascript
const path = require('path');

module.exports = {
  root: path.resolve(__dirname, '..'),
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
  public: path.resolve(__dirname, '../public')
};
```

---

### 2. 环境变量管理

```javascript
// .env.development
API_URL=http://localhost:3000
ENABLE_MOCK=true

// .env.production
API_URL=https://api.example.com
ENABLE_MOCK=false
```

```javascript
// webpack.config.js
const dotenv = require('dotenv');
const webpack = require('webpack');

module.exports = (env, argv) => {
  // 根据模式加载对应的 .env 文件
  const envFile = argv.mode === 'production' 
    ? '.env.production' 
    : '.env.development';
  
  const envVars = dotenv.config({ path: envFile }).parsed;
  
  return {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(envVars)
      })
    ]
  };
};
```

---

### 3. 配置复用

```javascript
// config/modules.js
module.exports = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
};

// webpack.common.js
const moduleRules = require('./config/modules.js');

module.exports = {
  module: moduleRules
};
```

---

## 📊 配置方式对比

| 方式 | 复杂度 | 灵活性 | 适用场景 |
|------|-------|--------|---------|
| **对象** | ⭐️ | ⭐️⭐️ | 简单项目 |
| **函数** | ⭐️⭐️ | ⭐️⭐️⭐️⭐️ | 需要动态配置 |
| **Promise** | ⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️ | 异步加载配置 |
| **多配置** | ⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️⭐️ | 多端构建、SSR |
| **TypeScript** | ⭐️⭐️ | ⭐️⭐️⭐️⭐️ | 大型项目、团队 |
| **拆分配置** | ⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️⭐️ | 生产级项目（推荐）|

---

## 📝 总结

### 核心要点

1. **基础配置**：对象形式，简单直观
2. **动态配置**：函数形式，根据环境调整
3. **配置拆分**：webpack-merge，分离关注点
4. **类型安全**：TypeScript，避免错误

### 推荐方案

**小型项目**：
```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  return {
    // ... 根据 isDev 动态配置
  };
};
```

**中大型项目**：
```
config/
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js

使用 webpack-merge 合并配置
```

**企业级项目**：
```
使用 TypeScript + 配置拆分 + 环境变量
```

---

## 🎯 下一步

继续实践：
- [Demo 1: 单入口应用](../demos/01-single-entry/) - 对比开发和生产模式
- [Demo 2: 多入口应用](../demos/02-multi-entry/) - 实践配置拆分

完成 Phase 02 后，进入：
- **Phase 03**: Loader 机制深入
- **Phase 04**: Plugin 机制深入

