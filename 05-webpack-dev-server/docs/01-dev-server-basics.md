# 开发服务器基础

理解 webpack-dev-server 的基础概念和配置，提升开发体验。

---

## 📋 目录

1. [什么是 webpack-dev-server](#什么是-webpack-dev-server)
2. [为什么需要开发服务器](#为什么需要开发服务器)
3. [基础配置](#基础配置)
4. [静态文件服务](#静态文件服务)
5. [自动刷新 vs HMR](#自动刷新-vs-hmr)
6. [常用配置选项](#常用配置选项)

---

## 什么是 webpack-dev-server？

### 🎯 简单理解

**webpack-dev-server 是一个基于 Express 的开发服务器**，提供：
- ✅ 实时重新加载（Live Reload）
- ✅ 热模块替换（HMR）
- ✅ 代理 API 请求
- ✅ 静态文件服务
- ✅ 历史路由支持

### 📊 架构图

```
┌──────────────────────────────────────────────┐
│        webpack-dev-server                    │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────┐     │
│  │     Express Server (HTTP 服务)     │     │
│  │  ├─ webpack-dev-middleware        │     │
│  │  ├─ http-proxy-middleware         │     │
│  │  └─ express.static                │     │
│  └────────────────────────────────────┘     │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │    WebSocket Server (实时通信)     │     │
│  │  └─ 推送编译状态和更新通知          │     │
│  └────────────────────────────────────┘     │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │    Webpack Compiler (编译器)       │     │
│  │  └─ watch 模式监听文件变化          │     │
│  └────────────────────────────────────┘     │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 为什么需要开发服务器？

### ❌ 没有开发服务器的痛点

```bash
# 传统开发流程
1. 修改代码
2. 运行 npm run build  ← 需要手动执行
3. 刷新浏览器          ← 需要手动刷新
4. 重复 1-3...
```

**问题**：
- ❌ 效率低（每次都要手动构建和刷新）
- ❌ 反馈慢（构建需要时间）
- ❌ 体验差（无法保持状态）
- ❌ 调试难（需要模拟服务器环境）

---

### ✅ 使用开发服务器的优势

```bash
# 使用 webpack-dev-server
1. 启动开发服务器: npm run dev
2. 修改代码
3. 自动编译 + 自动刷新（或 HMR）✨
4. 重复 2...
```

**优势**：
- ✅ 自动编译（监听文件变化）
- ✅ 自动刷新（或热更新）
- ✅ 内存构建（不写磁盘，更快）
- ✅ 代理支持（解决跨域）
- ✅ HTTPS 支持
- ✅ 历史路由支持

---

## 基础配置

### 🚀 快速开始

#### 1. 安装

```bash
npm install webpack-dev-server --save-dev
```

#### 2. 配置

```javascript
// webpack.config.js
module.exports = {
  // ...其他配置
  
  devServer: {
    port: 8080,        // 端口
    open: true,        // 自动打开浏览器
    hot: true          // 启用 HMR
  }
};
```

#### 3. 添加脚本

```json
// package.json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

#### 4. 启动

```bash
npm run dev
```

---

### 📁 内存中的构建

**关键概念**：webpack-dev-server 不会将文件写入磁盘。

```
传统 webpack 构建：
源文件 → 编译 → 写入 dist/ → 浏览器访问
              ↑ 慢（磁盘 I/O）

webpack-dev-server：
源文件 → 编译 → 内存中 → 浏览器访问
              ↑ 快（内存访问）
```

**验证**：
```bash
# 启动开发服务器
npm run dev

# 检查 dist 目录
ls dist/  # 空的！文件在内存中
```

---

## 静态文件服务

### 🎯 配置静态文件目录

```javascript
module.exports = {
  devServer: {
    // 单个静态文件目录
    static: './public',
    
    // 或完整配置
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/static',  // 访问路径
      watch: true             // 监听变化
    },
    
    // 多个静态文件目录
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/static'
      },
      {
        directory: path.join(__dirname, 'assets'),
        publicPath: '/assets'
      }
    ]
  }
};
```

### 📝 示例

```
项目结构：
project/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   └── index.js
└── webpack.config.js
```

配置后访问：
```
http://localhost:8080/favicon.ico       ✅
http://localhost:8080/static/robots.txt ✅ (如果设置了 publicPath)
```

---

## 自动刷新 vs HMR

### 🔄 自动刷新（Live Reload）

**工作方式**：文件变化 → 重新编译 → **刷新整个页面**

```javascript
devServer: {
  hot: false,  // 关闭 HMR，使用自动刷新
  liveReload: true
}
```

**效果**：
```
修改 style.css
    ↓
重新编译
    ↓
刷新页面  ← 整个页面重新加载
    ↓
状态丢失 ❌ (表单数据、滚动位置等)
```

---

### 🔥 HMR（Hot Module Replacement）

**工作方式**：文件变化 → 重新编译 → **只替换变化的模块**

```javascript
devServer: {
  hot: true  // 启用 HMR ✅
}
```

**效果**：
```
修改 style.css
    ↓
重新编译
    ↓
替换 CSS 模块  ← 只更新样式
    ↓
状态保持 ✅ (表单数据、滚动位置保持)
```

---

### 📊 对比

| 特性 | 自动刷新 | HMR |
|------|---------|-----|
| **刷新方式** | 整个页面 | 只替换模块 |
| **速度** | 较慢 | 快 |
| **状态** | 丢失 | 保持 |
| **配置** | 简单 | 需要额外配置 |
| **适用** | 简单项目 | 复杂项目 |

**结论**：**优先使用 HMR**，开发体验更好！

---

## 常用配置选项

### 1. 端口和主机

```javascript
devServer: {
  // 端口配置
  port: 8080,          // 固定端口
  port: 'auto',        // 自动寻找可用端口 ✅ 推荐
  
  // 主机配置
  host: 'localhost',   // 仅本机访问
  host: '0.0.0.0',     // 允许外部访问 ✅ 推荐
  
  // 自动打开浏览器
  open: true,
  open: '/home',       // 打开指定页面
  open: {
    app: {
      name: 'google chrome'  // 指定浏览器
    }
  }
}
```

---

### 2. 压缩和缓存

```javascript
devServer: {
  // Gzip 压缩
  compress: true,  // ✅ 推荐开启
  
  // 响应头
  headers: {
    'X-Custom-Header': 'value',
    'Cache-Control': 'no-cache'
  }
}
```

---

### 3. 客户端配置

```javascript
devServer: {
  client: {
    // 编译进度
    progress: true,
    
    // 错误遮罩层
    overlay: true,           // 显示所有错误和警告
    overlay: {
      errors: true,          // 只显示错误
      warnings: false
    },
    
    // 日志级别
    logging: 'info',  // 'log' | 'info' | 'warn' | 'error' | 'none'
    
    // WebSocket 配置
    webSocketURL: 'auto://0.0.0.0:0/ws'
  }
}
```

---

### 4. 开发中间件配置

```javascript
devServer: {
  devMiddleware: {
    // 输出到磁盘（调试用）
    writeToDisk: false,
    
    // 公共路径
    publicPath: '/',
    
    // 索引文件
    index: 'index.html',
    
    // 服务器端渲染
    serverSideRender: false,
    
    // 统计信息
    stats: 'minimal'
  }
}
```

---

### 5. 监听配置

```javascript
devServer: {
  watchFiles: [
    'src/**/*.html',   // 监听 HTML 文件
    'public/**/*'      // 监听 public 目录
  ],
  
  // 或详细配置
  watchFiles: {
    paths: ['src/**/*.html'],
    options: {
      usePolling: false,  // 使用轮询（慢）
      interval: 1000      // 轮询间隔
    }
  }
}
```

---

## 📝 完整配置示例

### 基础开发配置

```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  
  devServer: {
    // === 基础配置 ===
    port: 'auto',              // 自动寻找端口
    host: '0.0.0.0',          // 允许外部访问
    open: true,                // 自动打开浏览器
    hot: true,                 // 启用 HMR
    
    // === 静态文件 ===
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/static',
      watch: true
    },
    
    // === 客户端配置 ===
    client: {
      progress: true,          // 显示编译进度
      overlay: {
        errors: true,
        warnings: false
      },
      logging: 'info'
    },
    
    // === 压缩 ===
    compress: true,
    
    // === 监听文件 ===
    watchFiles: ['src/**/*.html'],
    
    // === 响应头 ===
    headers: {
      'X-Custom-Header': 'webpack-dev-server'
    }
  },
  
  devtool: 'eval-source-map'
};
```

---

### 生产环境对比

```javascript
// 开发环境
module.exports = {
  mode: 'development',
  devServer: {
    hot: true,
    compress: false,  // 开发时可以不压缩
    client: {
      overlay: true   // 显示错误
    }
  },
  devtool: 'eval-source-map'  // 快速的 source map
};

// 生产环境
module.exports = {
  mode: 'production',
  // 不需要 devServer
  devtool: 'source-map'  // 完整的 source map
};
```

---

## 💡 实用技巧

### 1. 环境检测

```javascript
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
  
  devServer: isDev ? {
    port: 'auto',
    hot: true,
    open: true
  } : undefined,  // 生产环境不需要
  
  devtool: isDev ? 'eval-source-map' : 'source-map'
};
```

---

### 2. 多种启动方式

```json
// package.json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "dev:open": "webpack serve --mode development --open",
    "dev:https": "webpack serve --mode development --https",
    "dev:host": "webpack serve --mode development --host 0.0.0.0",
    "dev:port": "webpack serve --mode development --port 3000"
  }
}
```

---

### 3. 命令行参数优先

```bash
# 命令行参数会覆盖配置文件
webpack serve --port 3000 --open --hot
```

---

## 🐛 常见问题

### 问题 1：端口被占用

```bash
❌ Error: listen EADDRINUSE: address already in use :::8080
```

**解决方案**：
```javascript
devServer: {
  port: 'auto'  // ✅ 自动寻找可用端口
}
```

或手动杀死进程：
```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

### 问题 2：外部设备无法访问

```javascript
// ❌ 只能本机访问
devServer: {
  host: 'localhost'
}

// ✅ 允许外部访问
devServer: {
  host: '0.0.0.0'
}
```

访问方式：
```
本机：  http://localhost:8080
外部：  http://192.168.1.100:8080  (查看本机 IP)
```

---

### 问题 3：修改 HTML 不刷新

```javascript
// ✅ 添加 HTML 文件监听
devServer: {
  watchFiles: ['src/**/*.html']
}
```

---

### 问题 4：静态文件 404

```javascript
// 检查配置
devServer: {
  static: {
    directory: path.join(__dirname, 'public'),  // 确保路径正确
    publicPath: '/static'                        // 确保访问路径正确
  }
}
```

访问：`http://localhost:8080/static/your-file.txt`

---

## 📚 总结

### 核心要点

1. **webpack-dev-server 的作用**
   - 提供开发服务器
   - 自动编译和刷新
   - 内存中构建（更快）

2. **HMR vs 自动刷新**
   - HMR：只替换模块，保持状态 ✅
   - 自动刷新：刷新页面，丢失状态

3. **基础配置**
   - port: 'auto'
   - host: '0.0.0.0'
   - hot: true
   - compress: true

4. **静态文件**
   - 使用 static 配置
   - 支持多个目录
   - 可自定义访问路径

### 推荐配置

```javascript
devServer: {
  port: 'auto',
  host: '0.0.0.0',
  open: true,
  hot: true,
  compress: true,
  client: {
    progress: true,
    overlay: { errors: true, warnings: false }
  }
}
```

---

下一步，继续学习：[HMR 原理深入](./02-hmr-principle.md)

