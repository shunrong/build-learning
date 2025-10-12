# Phase 05: 开发服务器深入

## 🎯 学习目标

通过这个阶段，你将：
1. **掌握 webpack-dev-server 的配置和使用**
2. **理解 HMR（热模块替换）的原理**
3. **学会配置代理解决跨域问题**
4. **掌握多页面开发的服务器配置**
5. **理解开发服务器的底层实现**
6. **优化开发体验**

## 📚 学习路径

```
理论学习（3-4小时）
    ↓
1. 阅读 docs/01-dev-server-basics.md       (45分钟) - 基础配置
2. 阅读 docs/02-hmr-principle.md           (60分钟) - HMR 原理
3. 阅读 docs/03-proxy-config.md            (30分钟) - 代理配置
4. 阅读 docs/04-advanced-config.md         (45分钟) - 高级配置
5. 阅读 docs/05-custom-dev-server.md ⭐    (60分钟) - 实现原理
    ↓
实践体验（4-5小时）
    ↓
6. 运行 demos/01-basic-server/             (45分钟) - 基础服务器
7. 运行 demos/02-hmr-demo/                 (1小时) - HMR 演示
8. 运行 demos/03-proxy-demo/               (1小时) - 代理配置
9. 运行 demos/04-multi-page/               (1小时) - 多页面应用
10. 运行 demos/05-custom-dev-server/ ⭐    (1-2小时) - 手写实现
    ↓
深入实践（2-3小时）
    ↓
11. 修改配置，观察效果                       (1小时)
12. 扩展自定义 Dev Server                   (1-2小时)
    ↓
总结反思（30分钟）
    ↓
13. 总结开发服务器的配置技巧和最佳实践
```

## 📖 文档列表

### 1. [开发服务器基础](./01-dev-server-basics.md)
- webpack-dev-server 是什么？
- 基础配置选项
- 静态文件服务
- 自动刷新 vs HMR
- Source Map 配置

### 2. [HMR 原理深入](./02-hmr-principle.md)
- HMR 是什么？为什么需要它？
- HMR 的工作原理
- WebSocket 通信机制
- module.hot API 详解
- CSS/JS/React HMR 实现
- HMR 失败降级策略

### 3. [代理配置详解](./03-proxy-config.md)
- 为什么需要代理？
- 基础代理配置
- 路径重写
- 多个代理配置
- WebSocket 代理
- HTTPS 代理

### 4. [高级配置与优化](./04-advanced-config.md)
- 多页面应用配置
- 历史路由支持
- 自定义中间件
- HTTPS 配置
- 性能优化
- 错误处理

### 5. [手写 Dev Server 实现原理](./05-custom-dev-server.md) ⭐
- webpack-dev-server 架构解析
- Express + Webpack 集成
- WebSocket 实时通信实现
- Live Reload 实现原理
- CSS HMR 实现详解
- 为什么 JS HMR 复杂？
- 完整实现对比与分析

## 🎮 Demo 列表

### Demo 1: [基础开发服务器](../demos/01-basic-server/)
**场景**：搭建基础的开发服务器

**核心内容**：
- ✅ 启动开发服务器
- ✅ 自动刷新
- ✅ 静态文件服务
- ✅ 端口和 Host 配置
- ✅ 压缩和缓存

**运行方式**：
```bash
cd demos/01-basic-server
npm install
npm run dev
```

---

### Demo 2: [HMR 演示](../demos/02-hmr-demo/)
**场景**：理解和使用热模块替换

**核心内容**：
- ✅ CSS HMR（自动支持）
- ✅ JS HMR（手动实现）
- ✅ React HMR（react-refresh）
- ✅ 状态保持
- ✅ HMR API 使用

**运行方式**：
```bash
cd demos/02-hmr-demo
npm install
npm run dev
```

---

### Demo 3: [代理配置](../demos/03-proxy-demo/)
**场景**：解决开发环境跨域问题

**核心内容**：
- ✅ 单个 API 代理
- ✅ 多个 API 代理
- ✅ 路径重写
- ✅ WebSocket 代理
- ✅ 请求/响应拦截

**运行方式**：
```bash
cd demos/03-proxy-demo
npm install
npm run dev
```

---

### Demo 4: [多页面应用](../demos/04-multi-page/)
**场景**：多页面应用的开发服务器配置

**核心内容**：
- ✅ 多入口配置
- ✅ 多个 HTML 页面
- ✅ 页面间跳转
- ✅ 历史路由支持
- ✅ 共享模块

**运行方式**：
```bash
cd demos/04-multi-page
npm install
npm run dev
```

---

### Demo 5: [手写简易 Dev Server](../demos/05-custom-dev-server/) ⭐
**场景**：从零实现开发服务器，理解底层原理

**核心内容**：
- ✅ Express HTTP 服务器搭建
- ✅ Webpack Compiler API 集成
- ✅ WebSocket 实时通信
- ✅ Live Reload 实现
- ✅ CSS HMR 实现
- ✅ 文件监听（Chokidar）
- ✅ 错误覆盖层

**亮点**：
- 🔥 **手写实现**：从头搭建，不依赖 webpack-dev-server
- 🔥 **原理透明**：每一行代码都能理解
- 🔥 **对比学习**：理解官方实现的复杂度
- 🔥 **深入 HMR**：理解为什么 JS HMR 很难

**运行方式**：
```bash
cd demos/05-custom-dev-server
npm install
npm run dev
```

**学习建议**：
1. 先运行 Demo，观察效果
2. 阅读 `dev-server.js` 核心代码（约 200 行）
3. 对比官方 webpack-dev-server
4. 尝试扩展功能（如添加代理）

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 理解开发服务器的作用
- [ ] 理解 HMR 的工作原理
- [ ] 理解代理的必要性和配置
- [ ] 理解 WebSocket 通信机制
- [ ] 能画出 HMR 的流程图

### 实践层面
- [ ] 能快速搭建开发服务器
- [ ] 能配置 HMR
- [ ] 能配置代理解决跨域
- [ ] 能配置多页面应用
- [ ] 能优化开发体验

### 面试层面
能够清晰回答以下面试问题：

1. **webpack-dev-server 的原理是什么？**
2. **HMR 是如何工作的？**
3. **为什么需要代理？如何配置？**
4. **自动刷新和 HMR 有什么区别？**
5. **如何实现 CSS 的 HMR？**
6. **如何实现 React 组件的 HMR？**
7. **开发服务器如何处理历史路由？**
8. **如何手写一个简易的 Dev Server？** ⭐
9. **为什么 JS HMR 比 CSS HMR 难实现？** ⭐
10. **WebSocket 在 Dev Server 中的作用是什么？**

## 🎯 核心知识点

### 1. webpack-dev-server 架构

```
┌─────────────────────────────────────────────┐
│           webpack-dev-server                │
├─────────────────────────────────────────────┤
│  Express Server                             │
│    ├─ webpack-dev-middleware (处理编译)      │
│    ├─ http-proxy-middleware (代理)          │
│    └─ express.static (静态文件)             │
├─────────────────────────────────────────────┤
│  WebSocket Server                           │
│    └─ 推送更新通知给浏览器                    │
├─────────────────────────────────────────────┤
│  Webpack Compiler                           │
│    └─ watch 模式编译                         │
└─────────────────────────────────────────────┘
        ↓ WebSocket
┌─────────────────────────────────────────────┐
│           浏览器                             │
├─────────────────────────────────────────────┤
│  HMR Runtime                                │
│    ├─ 监听 WebSocket 消息                    │
│    ├─ 下载更新的模块                          │
│    └─ 替换旧模块                             │
└─────────────────────────────────────────────┘
```

---

### 2. HMR 工作流程

```
1. 文件变化
   ↓
2. Webpack 重新编译
   ↓
3. 生成 update manifest (JSON)
   ↓
4. 通过 WebSocket 推送给浏览器
   {
     type: 'update',
     hash: 'abc123',
     modules: [1, 2, 3]
   }
   ↓
5. 浏览器下载更新的模块
   GET /__webpack_hmr/1.abc123.hot-update.js
   ↓
6. HMR Runtime 替换模块
   ↓
7. 执行 module.hot.accept 回调
   ↓
8. 页面更新（无刷新）✅
```

---

### 3. 基础配置

```javascript
module.exports = {
  devServer: {
    // 基础配置
    port: 'auto',              // 端口（'auto' 自动寻找）
    host: '0.0.0.0',          // 监听地址
    open: true,                // 自动打开浏览器
    hot: true,                 // 启用 HMR
    
    // 静态文件
    static: {
      directory: './public',   // 静态文件目录
      publicPath: '/static'    // 访问路径
    },
    
    // 代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    },
    
    // 历史路由
    historyApiFallback: true,
    
    // 其他
    compress: true,            // gzip 压缩
    client: {
      overlay: true,           // 错误遮罩层
      progress: true           // 编译进度
    }
  }
};
```

---

### 4. HMR API

```javascript
// 检查是否支持 HMR
if (module.hot) {
  // 1. 接受当前模块的更新
  module.hot.accept();
  
  // 2. 接受依赖模块的更新
  module.hot.accept('./module.js', () => {
    // 更新回调
    console.log('module.js 已更新');
  });
  
  // 3. 接受多个模块的更新
  module.hot.accept(['./a.js', './b.js'], () => {
    console.log('a.js 或 b.js 已更新');
  });
  
  // 4. 销毁时的清理
  module.hot.dispose((data) => {
    // 清理副作用
    data.oldState = state;
  });
  
  // 5. 拒绝更新（降级为刷新页面）
  module.hot.decline('./legacy.js');
  
  // 6. 检查更新
  if (module.hot.status() === 'idle') {
    module.hot.check(true).then(() => {
      console.log('更新成功');
    });
  }
}
```

---

### 5. 代理配置速查

```javascript
devServer: {
  proxy: {
    // 基础代理
    '/api': 'http://localhost:3000',
    
    // 完整配置
    '/api': {
      target: 'http://localhost:3000',  // 目标服务器
      changeOrigin: true,                // 修改 Origin
      pathRewrite: {                     // 路径重写
        '^/api': ''
      },
      secure: false,                     // 接受自签名证书
      ws: true,                          // WebSocket 代理
      
      // 请求/响应拦截
      onProxyReq: (proxyReq, req, res) => {
        console.log('发送请求:', req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('收到响应:', proxyRes.statusCode);
      }
    },
    
    // 多个代理
    '/api1': 'http://server1.com',
    '/api2': 'http://server2.com'
  }
}
```

---

## 💡 学习建议

### 1. 循序渐进
- 先理解基础配置
- 再学习 HMR 原理
- 然后掌握代理配置
- 最后学习高级特性

### 2. 对比学习
- 自动刷新 vs HMR
- http-proxy vs webpack proxy
- 开发环境 vs 生产环境

### 3. 动手实践
- 每个 Demo 都要运行
- 修改配置观察效果
- 尝试实现自己的 HMR
- 配置真实项目的代理

### 4. 深入原理
- 理解 WebSocket 通信
- 理解模块热替换机制
- 阅读 webpack-dev-server 源码
- 理解中间件的工作方式

---

## 🎯 实战技巧

### 1. 快速启动

```javascript
// package.json
{
  "scripts": {
    "dev": "webpack serve --mode development --open",
    "dev:https": "webpack serve --mode development --https",
    "dev:host": "webpack serve --mode development --host 0.0.0.0"
  }
}
```

---

### 2. 开发体验优化

```javascript
devServer: {
  // 编译进度
  client: {
    progress: true
  },
  
  // 错误提示
  client: {
    overlay: {
      errors: true,
      warnings: false
    }
  },
  
  // 自动打开指定页面
  open: ['/home', '/about'],
  
  // 自定义浏览器
  open: {
    app: {
      name: 'google chrome'
    }
  }
}
```

---

### 3. 性能优化

```javascript
devServer: {
  // 关闭 host 检查（大型项目）
  allowedHosts: 'all',
  
  // 启用压缩
  compress: true,
  
  // 减少日志
  client: {
    logging: 'warn'
  }
}
```

---

## 📝 预计学习时间

- **快速模式**：5 小时（理论 + 运行 Demo）
- **标准模式**：10 小时（深入学习 + 实践 + 总结）
- **深入模式**：2-3 天（研究源码 + 实现 HMR + 扩展）

选择适合自己的节奏，重要的是理解透彻。

---

## 🎯 下一步

完成 Phase 05 后，**阶段一（Webpack 基础篇）全部完成！** 🎉

继续学习：
- **Phase 06**: JavaScript 工程化 - Babel/Polyfill/SourceMap
- **Phase 07**: CSS 工程化 - Modules/PostCSS/Tailwind

---

## 💡 常见问题预告

### Q1: 自动刷新和 HMR 有什么区别？
→ 在 `02-hmr-principle.md` 中详细对比

### Q2: 为什么 HMR 有时会失败？
→ 在 `02-hmr-principle.md` 中讲解降级策略

### Q3: 如何配置 HTTPS 开发服务器？
→ 在 `04-advanced-config.md` 中实践

### Q4: 代理为什么要设置 changeOrigin？
→ 在 `03-proxy-config.md` 中详细说明

准备好了吗？开始你的开发服务器学习之旅！🚀

