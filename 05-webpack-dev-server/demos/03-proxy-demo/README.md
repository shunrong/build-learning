# Demo 3: 代理配置演示

## 📖 学习目标

通过本 Demo，你将掌握：

1. ✅ **基础代理配置**：解决跨域问题
2. ✅ **路径重写**：使用 `pathRewrite` 转换路径
3. ✅ **第三方 API 代理**：访问外部 API
4. ✅ **WebSocket 代理**：处理 WebSocket 连接
5. ✅ **高级代理场景**：条件代理、自定义头部

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动 Mock 服务器

```bash
npm run mock-server
```

这会在 `http://localhost:4000` 启动一个模拟的后端 API 服务器。

### 3. 启动 Dev Server（新终端）

```bash
npm run dev
```

这会启动 Webpack Dev Server，自动打开浏览器。

### 4. 测试代理功能

点击页面上的按钮，测试各种代理场景。

---

## 📂 项目结构

```
03-proxy-demo/
├── src/
│   ├── index.html          # HTML 页面
│   ├── index.js            # API 测试逻辑
│   └── styles.css          # 样式
├── mock-server.js          # Mock API 服务器
├── webpack.config.js       # Webpack 配置（含代理）
├── package.json
└── README.md
```

---

## 🎯 核心配置详解

### 1. 基础代理配置

```javascript
// webpack.config.js
devServer: {
  proxy: [
    {
      context: ['/api'],           // 拦截的路径
      target: 'http://localhost:4000',  // 目标服务器
      changeOrigin: true,          // 修改 Origin 头
      pathRewrite: {
        '^/api': ''                // 路径重写规则
      }
    }
  ]
}
```

#### 请求流程

```
浏览器请求：http://localhost:8080/api/users
              ↓
代理转发到：http://localhost:4000/users (移除了 /api)
              ↓
后端处理并返回
              ↓
Dev Server 转发响应给浏览器
```

### 2. 配置项详解

#### context

指定需要代理的路径前缀：

```javascript
// 单个路径
context: ['/api']

// 多个路径
context: ['/api', '/auth', '/upload']

// 使用通配符
context: ['/api/**', '/v1/**']
```

#### target

目标服务器地址：

```javascript
// 本地服务器
target: 'http://localhost:4000'

// 远程服务器
target: 'https://api.example.com'

// 使用 HTTPS
target: 'https://secure-api.example.com'
```

#### changeOrigin

是否修改请求头的 `Origin` 字段：

```javascript
changeOrigin: true  // 推荐：避免 CORS 问题
```

**作用**：
- `false`：Origin 保持为 `http://localhost:8080`
- `true`：Origin 修改为 `http://localhost:4000`

**为什么需要**：
某些后端会验证请求的 `Origin` 头，如果来源不匹配会拒绝请求。

#### pathRewrite

重写请求路径：

```javascript
pathRewrite: {
  '^/api': '',           // /api/users → /users
  '^/api/v1': '/v2',     // /api/v1/users → /v2/users
  '^/old': '/new'        // /old/path → /new/path
}
```

**常见场景**：
1. 移除路径前缀（如上面的 `/api`）
2. 版本号替换
3. 路径映射

---

### 3. 高级代理配置

#### 第三方 API 代理

```javascript
{
  context: ['/github'],
  target: 'https://api.github.com',
  changeOrigin: true,
  pathRewrite: {
    '^/github': ''
  },
  headers: {
    'User-Agent': 'webpack-dev-server'  // GitHub 要求
  }
}
```

#### WebSocket 代理

```javascript
{
  context: ['/socket.io'],
  target: 'http://localhost:4000',
  ws: true,              // 启用 WebSocket 代理
  changeOrigin: true
}
```

#### 条件代理

```javascript
{
  context: ['/conditional'],
  target: 'http://localhost:4000',
  bypass: function(req, res, proxyOptions) {
    // 根据条件决定是否代理
    if (req.headers.accept.indexOf('html') !== -1) {
      return '/index.html';  // 返回 HTML
    }
    // 否则代理到后端
  }
}
```

#### 自定义函数代理

```javascript
{
  context: ['/api'],
  target: 'http://localhost:4000',
  
  // 请求前修改
  onProxyReq: (proxyReq, req, res) => {
    console.log('代理请求:', req.url);
    proxyReq.setHeader('X-Special-Header', 'value');
  },
  
  // 响应前修改
  onProxyRes: (proxyRes, req, res) => {
    console.log('代理响应:', proxyRes.statusCode);
  },
  
  // 错误处理
  onError: (err, req, res) => {
    console.error('代理错误:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('代理错误');
  }
}
```

---

## 🔬 实验指南

### 实验 1：基础代理

**目标**：理解基本的代理转发

1. 启动 Mock 服务器和 Dev Server
2. 点击"获取用户列表"按钮
3. 观察网络面板：
   - 请求 URL：`http://localhost:8080/api/users`
   - 实际请求到：`http://localhost:4000/users`

4. 查看 Mock 服务器终端：
```
📡 [Mock API] GET /users
```

**关键点**：
- 浏览器只知道 `/api/users`
- 代理自动转发到后端
- 没有跨域问题！

---

### 实验 2：路径重写

**目标**：理解 `pathRewrite` 的作用

1. 查看配置：
```javascript
pathRewrite: {
  '^/api': ''  // 移除 /api 前缀
}
```

2. 测试：
   - 前端请求：`/api/users/1`
   - 后端接收：`/users/1`

3. 修改配置，重启 Dev Server：
```javascript
pathRewrite: {
  '^/api': '/v2'  // 替换为 /v2
}
```

4. 现在：
   - 前端请求：`/api/users`
   - 后端接收：`/v2/users`

---

### 实验 3：第三方 API

**目标**：代理到外部 API

1. 点击"获取 GitHub 信息"按钮
2. 观察：
   - 请求：`/github/users/github`
   - 代理到：`https://api.github.com/users/github`

3. 查看响应：GitHub 用户信息

**注意**：
- `changeOrigin: true` 很重要
- 需要添加 `User-Agent` 头（GitHub 要求）
- 避免了浏览器的 CORS 限制

---

### 实验 4：错误处理

**目标**：观察代理错误的处理

1. 点击"错误处理测试"按钮
2. 观察：
   - 状态码：500
   - 响应：错误信息

3. 在配置中添加错误处理：
```javascript
{
  context: ['/api'],
  target: 'http://localhost:4000',
  onError: (err, req, res) => {
    console.error('代理错误:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: '代理失败',
      message: err.message
    }));
  }
}
```

---

### 实验 5：慢请求

**目标**：测试长时间请求

1. 点击"慢请求测试"按钮
2. 观察：
   - 显示"请求中，请稍候（预计 3 秒）..."
   - 3 秒后显示响应

3. 在 Mock 服务器终端查看：
```
📡 [Mock API] GET /slow (延迟 3秒)
```

**用途**：
- 测试加载状态
- 测试超时处理
- 模拟慢速网络

---

### 实验 6：认证请求

**目标**：代理带认证头的请求

1. 点击"认证请求测试"按钮
2. 观察代码：
```javascript
fetch('/api/protected', {
  headers: {
    'Authorization': 'Bearer my-secret-token'
  }
})
```

3. 代理会自动转发 Authorization 头
4. 后端验证 token 并返回受保护的数据

---

## 💡 常见场景

### 场景 1：前后端分离开发

**问题**：
- 前端：`http://localhost:3000`
- 后端：`http://localhost:8000`
- 浏览器阻止跨域请求

**解决**：
```javascript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:8000',
    changeOrigin: true
  }
]
```

### 场景 2：多个后端服务

**问题**：微服务架构，多个后端服务

**解决**：
```javascript
proxy: [
  {
    context: ['/user-service'],
    target: 'http://localhost:8001',
    pathRewrite: { '^/user-service': '' }
  },
  {
    context: ['/order-service'],
    target: 'http://localhost:8002',
    pathRewrite: { '^/order-service': '' }
  }
]
```

### 场景 3：代理到测试环境

**问题**：需要访问测试环境的 API

**解决**：
```javascript
proxy: [
  {
    context: ['/api'],
    target: 'https://test-api.example.com',
    changeOrigin: true,
    secure: false  // 忽略 HTTPS 证书错误（测试环境常见）
  }
]
```

### 场景 4：WebSocket 支持

**问题**：需要代理 WebSocket 连接

**解决**：
```javascript
proxy: [
  {
    context: ['/ws'],
    target: 'ws://localhost:8000',
    ws: true,
    changeOrigin: true
  }
]
```

---

## 🎓 知识点总结

### 1. 为什么需要代理？

| 场景 | 问题 | 解决方案 |
|------|------|----------|
| **开发环境** | 前后端端口不同，跨域 | Dev Server 代理 |
| **测试环境** | 需要访问远程 API | 代理到测试服务器 |
| **生产环境** | 不需要（同域部署） | Nginx 反向代理 |

### 2. 代理 vs CORS

| 方式 | 优点 | 缺点 |
|------|------|------|
| **CORS** | 标准方案 | 需要后端配置 |
| **代理** | 前端控制 | 仅开发环境 |

### 3. 生产环境如何处理？

**方法 1：同域部署**
```
前端：https://example.com
后端：https://example.com/api
```

**方法 2：Nginx 反向代理**
```nginx
location /api/ {
    proxy_pass http://backend:8000/;
}
```

**方法 3：后端启用 CORS**
```javascript
// Express
app.use(cors({
  origin: 'https://frontend.example.com'
}));
```

---

## 🐛 常见问题

### 1. 代理不工作

**检查清单**：
1. ✅ `context` 路径是否匹配
2. ✅ 后端服务是否启动
3. ✅ `target` 地址是否正确
4. ✅ 是否重启了 Dev Server

**调试**：
```javascript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:4000',
    logLevel: 'debug'  // 启用详细日志
  }
]
```

### 2. 404 错误

**原因**：路径重写可能有问题

**检查**：
```javascript
// 前端请求：/api/users
// 期望后端接收：/users

pathRewrite: {
  '^/api': ''  // ✅ 正确
}

// 如果后端需要 /api 前缀，不要使用 pathRewrite
```

### 3. CORS 错误仍然存在

**原因**：可能忘记 `changeOrigin`

**解决**：
```javascript
{
  context: ['/api'],
  target: 'http://localhost:4000',
  changeOrigin: true  // ✅ 添加这个
}
```

### 4. WebSocket 连接失败

**原因**：未启用 `ws`

**解决**：
```javascript
{
  context: ['/socket.io'],
  target: 'http://localhost:4000',
  ws: true,  // ✅ 启用 WebSocket
  changeOrigin: true
}
```

### 5. HTTPS 证书错误

**问题**：代理到 HTTPS 服务时证书无效

**解决**：
```javascript
{
  context: ['/api'],
  target: 'https://test-api.example.com',
  secure: false,  // ✅ 忽略证书错误（仅开发）
  changeOrigin: true
}
```

---

## 🔗 相关资源

- [http-proxy-middleware 文档](https://github.com/chimurai/http-proxy-middleware)
- [webpack-dev-server proxy 配置](https://webpack.js.org/configuration/dev-server/#devserverproxy)
- 本项目文档：`../docs/03-proxy-config.md`

---

## 🎯 下一步

完成本 Demo 后，继续学习：

- **Demo 4**：多页面应用配置

掌握代理配置后，你可以轻松处理前后端分离开发的跨域问题！🚀

