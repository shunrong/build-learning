# 高级配置与优化

掌握 webpack-dev-server 的高级特性和优化技巧。

---

## 📋 目录

1. [历史路由支持](#历史路由支持)
2. [自定义中间件](#自定义中间件)
3. [HTTPS 配置](#https-配置)
4. [性能优化](#性能优化)
5. [错误处理](#错误处理)
6. [多页面配置](#多页面配置)

---

## 历史路由支持

### 🎯 问题场景

```
SPA（单页应用）使用 history 模式路由：

访问 /about → 浏览器刷新 → 404 ❌

原因：服务器找不到 /about.html 文件
```

---

### ✅ 解决方案

```javascript
devServer: {
  historyApiFallback: true  // ✅ 所有 404 返回 index.html
}
```

**效果**：
```
/         → index.html ✅
/about    → index.html ✅ (由前端路由处理)
/user/123 → index.html ✅ (由前端路由处理)
```

---

### 🔧 高级配置

```javascript
devServer: {
  historyApiFallback: {
    // 重写规则
    rewrites: [
      // /about 开头的返回 about.html
      {
        from: /^\/about/,
        to: '/about.html'
      },
      // /admin 开头的返回 admin.html
      {
        from: /^\/admin/,
        to: '/admin.html'
      },
      // 其他返回 index.html
      {
        from: /.*/,
        to: '/index.html'
      }
    ],
    
    // 详细日志
    verbose: true,
    
    // 禁用 dotRule（允许 .开头的路径）
    disableDotRule: true
  }
}
```

---

### 💡 实际案例

```javascript
// React Router / Vue Router
devServer: {
  historyApiFallback: true
}

// 多页面应用
devServer: {
  historyApiFallback: {
    rewrites: [
      { from: /^\/home/, to: '/home.html' },
      { from: /^\/dashboard/, to: '/dashboard.html' },
      { from: /./, to: '/index.html' }
    ]
  }
}
```

---

## 自定义中间件

### 🎯 setupMiddlewares

```javascript
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    // 在所有中间件之前
    devServer.app.get('/api/test', (req, res) => {
      res.json({ message: 'Hello from custom middleware!' });
    });
    
    // 或在特定位置插入
    middlewares.unshift({
      name: 'custom-middleware',
      middleware: (req, res, next) => {
        console.log('Request:', req.url);
        next();
      }
    });
    
    return middlewares;
  }
}
```

---

### 📝 实用示例

#### 1. Mock API

```javascript
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    // Mock 用户API
    devServer.app.get('/api/users', (req, res) => {
      res.json({
        code: 0,
        data: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]
      });
    });
    
    // Mock 登录
    devServer.app.post('/api/login', (req, res) => {
      res.json({
        code: 0,
        data: { token: 'mock-token-123' }
      });
    });
    
    return middlewares;
  }
}
```

---

#### 2. 请求日志

```javascript
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    middlewares.unshift({
      name: 'request-logger',
      middleware: (req, res, next) => {
        const start = Date.now();
        
        res.on('finish', () => {
          const duration = Date.now() - start;
          console.log(
            `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`
          );
        });
        
        next();
      }
    });
    
    return middlewares;
  }
}
```

---

#### 3. 自定义响应头

```javascript
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    devServer.app.use((req, res, next) => {
      // 添加自定义响应头
      res.setHeader('X-Powered-By', 'webpack-dev-server');
      res.setHeader('X-Dev-Mode', 'true');
      next();
    });
    
    return middlewares;
  }
}
```

---

## HTTPS 配置

### 🔒 启用 HTTPS

```javascript
devServer: {
  https: true  // ✅ 使用自签名证书
}
```

访问：`https://localhost:8080`

---

### 🔐 自定义证书

```javascript
const fs = require('fs');

devServer: {
  https: {
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt'),
    ca: fs.readFileSync('/path/to/ca.pem')
  }
}
```

---

### 💡 生成自签名证书

```bash
# 使用 mkcert (推荐)
brew install mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1

# 生成的文件
localhost+2.pem
localhost+2-key.pem
```

```javascript
devServer: {
  https: {
    key: fs.readFileSync('./localhost+2-key.pem'),
    cert: fs.readFileSync('./localhost+2.pem')
  },
  host: 'localhost'
}
```

---

## 性能优化

### ⚡ 编译优化

```javascript
devServer: {
  // 1. 关闭不需要的功能
  client: {
    logging: 'warn',  // 只显示警告和错误
    progress: false    // 关闭进度条（大项目慢）
  },
  
  // 2. 减少监听文件
  watchFiles: {
    paths: ['src/**/*.html'],  // 只监听必要的文件
    options: {
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  },
  
  // 3. 减少日志输出
  devMiddleware: {
    stats: 'errors-only'  // 只显示错误
  }
}
```

---

### 💾 缓存优化

```javascript
module.exports = {
  cache: {
    type: 'filesystem',  // ✅ 文件系统缓存
    cacheDirectory: path.resolve(__dirname, '.webpack_cache')
  },
  
  devServer: {
    // ...
  }
}
```

**效果**：
```
首次启动：10s
再次启动：2s ✅ (快5倍)
```

---

### 🚀 其他优化

```javascript
module.exports = {
  // 1. 减少编译范围
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,  // ✅ 排除 node_modules
        use: 'babel-loader'
      }
    ]
  },
  
  // 2. 使用更快的 source map
  devtool: 'eval-cheap-module-source-map',  // ✅ 快速重建
  
  // 3. 减少 resolve
  resolve: {
    extensions: ['.js', '.jsx'],  // ✅ 只列必要的
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  
  devServer: {
    hot: true,
    liveReload: false  // ✅ 只用 HMR，不用 live reload
  }
}
```

---

## 错误处理

### 🎭 错误遮罩层

```javascript
devServer: {
  client: {
    overlay: true,  // 显示所有错误和警告
    
    // 或自定义
    overlay: {
      errors: true,    // ✅ 显示错误
      warnings: false  // ❌ 不显示警告
    }
  }
}
```

**效果**：编译错误会覆盖整个页面，显示错误信息。

---

### 📝 自定义错误处理

```javascript
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    // 全局错误处理
    devServer.app.use((err, req, res, next) => {
      console.error('Server Error:', err);
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
      });
    });
    
    return middlewares;
  }
}
```

---

### 🔧 优雅的错误提示

```javascript
devServer: {
  client: {
    overlay: {
      errors: true,
      warnings: false,
      
      // 自定义样式
      runtimeErrors: (error) => {
        // 忽略特定错误
        if (error.message.includes('ResizeObserver')) {
          return false;
        }
        return true;
      }
    }
  }
}
```

---

## 多页面配置

### 🎯 配置多个入口

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    home: './src/pages/home/index.js',
    about: './src/pages/about/index.js',
    contact: './src/pages/contact/index.js'
  },
  
  output: {
    filename: '[name]/[name].js'
  },
  
  plugins: [
    // 首页
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html',
      filename: 'home.html',
      chunks: ['home']
    }),
    
    // 关于页
    new HtmlWebpackPlugin({
      template: './src/pages/about/index.html',
      filename: 'about.html',
      chunks: ['about']
    }),
    
    // 联系页
    new HtmlWebpackPlugin({
      template: './src/pages/contact/index.html',
      filename: 'contact.html',
      chunks: ['contact']
    })
  ],
  
  devServer: {
    open: ['/home.html'],  // 默认打开首页
    
    // 历史路由配置
    historyApiFallback: {
      rewrites: [
        { from: /^\/home/, to: '/home.html' },
        { from: /^\/about/, to: '/about.html' },
        { from: /^\/contact/, to: '/contact.html' }
      ]
    }
  }
};
```

---

## 📚 完整配置示例

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: isDev ? 'development' : 'production',
    
    entry: './src/index.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      clean: true
    },
    
    cache: {
      type: 'filesystem'  // 文件系统缓存
    },
    
    devServer: {
      // === 基础配置 ===
      port: 'auto',
      host: '0.0.0.0',
      open: true,
      hot: true,
      compress: true,
      
      // === 静态文件 ===
      static: {
        directory: path.join(__dirname, 'public')
      },
      
      // === 代理 ===
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      },
      
      // === 历史路由 ===
      historyApiFallback: true,
      
      // === HTTPS ===
      https: false,
      
      // === 客户端配置 ===
      client: {
        progress: true,
        overlay: {
          errors: true,
          warnings: false
        },
        logging: 'info'
      },
      
      // === 性能优化 ===
      devMiddleware: {
        stats: 'minimal'
      },
      
      // === 自定义中间件 ===
      setupMiddlewares: (middlewares, devServer) => {
        // Mock API
        devServer.app.get('/api/test', (req, res) => {
          res.json({ message: 'OK' });
        });
        
        return middlewares;
      }
    },
    
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'My App'
      })
    ]
  };
};
```

---

## 💡 最佳实践

### 1. 环境区分

```javascript
// .env.development
API_URL=http://localhost:3000
HTTPS=false

// .env.production
API_URL=https://api.example.com
HTTPS=true
```

```javascript
// webpack.config.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

devServer: {
  https: process.env.HTTPS === 'true',
  proxy: {
    '/api': {
      target: process.env.API_URL
    }
  }
}
```

---

### 2. 配置复用

```javascript
// webpack.dev.js
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    port: 8080
  }
});
```

---

### 3. 脚本管理

```json
// package.json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "dev:https": "webpack serve --mode development --https",
    "dev:open": "webpack serve --mode development --open",
    "dev:host": "webpack serve --mode development --host 0.0.0.0"
  }
}
```

---

## 📚 总结

### 核心要点

1. **历史路由**
   - historyApiFallback: true
   - 支持 SPA 路由刷新

2. **自定义中间件**
   - setupMiddlewares
   - Mock API / 日志 / 自定义逻辑

3. **HTTPS**
   - https: true（自签名）
   - 自定义证书

4. **性能优化**
   - 文件系统缓存
   - 减少监听文件
   - 快速 source map

5. **错误处理**
   - 错误遮罩层
   - 自定义错误提示

### 推荐配置

```javascript
devServer: {
  port: 'auto',
  host: '0.0.0.0',
  open: true,
  hot: true,
  compress: true,
  historyApiFallback: true,
  client: {
    progress: true,
    overlay: { errors: true, warnings: false }
  },
  proxy: {
    '/api': {
      target: process.env.API_URL,
      changeOrigin: true
    }
  }
}
```

---

**恭喜！Phase 05 文档全部完成！** 🎉

继续学习实践：[Demo 1: 基础开发服务器](../demos/01-basic-server/)

