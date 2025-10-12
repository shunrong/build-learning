# 代理配置详解

理解和配置 webpack-dev-server 的代理功能，解决开发环境跨域问题。

---

## 📋 目录

1. [为什么需要代理](#为什么需要代理)
2. [跨域问题](#跨域问题)
3. [基础代理配置](#基础代理配置)
4. [路径重写](#路径重写)
5. [多个代理配置](#多个代理配置)
6. [WebSocket 代理](#websocket-代理)
7. [HTTPS 代理](#https-代理)
8. [高级配置](#高级配置)

---

## 为什么需要代理？

### 😫 开发环境的跨域问题

```
开发场景：
前端：http://localhost:8080          (webpack-dev-server)
后端：http://localhost:3000/api      (后端API服务器)

浏览器同源策略：
协议://域名:端口
http://localhost:8080  ≠  http://localhost:3000
              ↑ 端口不同 = 跨域 ❌
```

---

### ❌ 直接请求会失败

```javascript
// 前端代码
fetch('http://localhost:3000/api/users')
  .then(res => res.json())
  .then(data => console.log(data));

// 浏览器报错：
// ❌ CORS policy: No 'Access-Control-Allow-Origin' header
```

---

### ✅ 使用代理解决

```javascript
// webpack.config.js
devServer: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}

// 前端代码（改为相对路径）
fetch('/api/users')  // ← 请求本域
  .then(res => res.json())
  .then(data => console.log(data));

// 实际流程：
// 浏览器 → http://localhost:8080/api/users
// 代理   → http://localhost:3000/api/users ✅
```

---

## 跨域问题

### 🎯 什么是跨域？

**同源策略**：浏览器的安全机制，限制不同源之间的资源访问。

**同源**必须满足：
- ✅ 协议相同（http vs https）
- ✅ 域名相同（example.com vs api.example.com）
- ✅ 端口相同（8080 vs 3000）

---

### 📊 跨域示例

```
当前页面：http://localhost:8080

✅ 同源（允许）
http://localhost:8080/api
http://localhost:8080/users

❌ 跨域（禁止）
http://localhost:3000/api        ← 端口不同
https://localhost:8080/api       ← 协议不同
http://127.0.0.1:8080/api        ← 域名不同
http://api.localhost:8080/api    ← 域名不同
```

---

### 🔧 解决方案对比

| 方案 | 优点 | 缺点 | 适用 |
|------|------|------|------|
| **CORS** | 标准方案 | 需要后端支持 | 生产环境 |
| **JSONP** | 兼容性好 | 只支持 GET | 老项目 |
| **代理** | 无需后端改动 | 仅开发环境 | 开发环境 ✅ |

---

## 基础代理配置

### 🚀 最简配置

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
```

**效果**：
```
浏览器请求：/api/users
实际转发：  http://localhost:3000/api/users
```

---

### 📝 完整配置

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',  // 目标服务器
      changeOrigin: true,                // 修改请求头中的 Origin
      secure: false,                     // 接受自签名证书
      pathRewrite: {                     // 路径重写
        '^/api': ''
      },
      
      // 请求拦截
      onProxyReq: (proxyReq, req, res) => {
        console.log('→ 代理请求:', req.method, req.url);
      },
      
      // 响应拦截
      onProxyRes: (proxyRes, req, res) => {
        console.log('← 代理响应:', proxyRes.statusCode);
      }
    }
  }
}
```

---

### 🎯 配置详解

#### 1. target

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000'  // 目标服务器地址
  }
}

// 请求：/api/users
// 转发：http://localhost:3000/api/users
```

---

#### 2. changeOrigin

```javascript
proxy: {
  '/api': {
    target: 'http://api.example.com',
    changeOrigin: true  // ✅ 重要！
  }
}
```

**作用**：修改请求头中的 `Host` 字段

```
不设置 changeOrigin：
Host: localhost:8080  ← 保持原样
目标服务器可能拒绝 ❌

设置 changeOrigin: true：
Host: api.example.com  ← 改为目标服务器的 host
目标服务器接受 ✅
```

---

#### 3. secure

```javascript
proxy: {
  '/api': {
    target: 'https://api.example.com',  // ← HTTPS
    secure: false  // 接受自签名证书（开发环境）
  }
}
```

---

## 路径重写

### 🎯 为什么需要路径重写？

```
场景：后端没有 /api 前缀

前端请求：/api/users
后端接口：/users  ← 没有 /api

直接代理：
/api/users → http://localhost:3000/api/users ❌ (404)

需要去掉 /api：
/api/users → http://localhost:3000/users ✅
```

---

### 📝 基础重写

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {
        '^/api': ''  // 去掉 /api 前缀
      }
    }
  }
}

// 前端：/api/users
// 转发：http://localhost:3000/users ✅
```

---

### 🔧 复杂重写

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {
        // 1. 替换前缀
        '^/api': '/v1',
        
        // 2. 正则替换
        '^/api/old': '/api/new',
        
        // 3. 移除多余部分
        '/remove-this': ''
      }
    }
  }
}

// 示例：
// /api/users         → /v1/users
// /api/old/data      → /api/new/data
// /api/remove-this/x → /api/x
```

---

### 💡 实际案例

```javascript
// 案例 1：后端API有版本前缀
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {
        '^/api': '/api/v2'  // 添加版本
      }
    }
  }
}
// /api/users → http://localhost:3000/api/v2/users

// 案例 2：测试环境路径不同
devServer: {
  proxy: {
    '/api': {
      target: 'http://test.example.com',
      pathRewrite: {
        '^/api': '/test-api'
      }
    }
  }
}
// /api/users → http://test.example.com/test-api/users
```

---

## 多个代理配置

### 🎯 不同的 API 服务器

```javascript
devServer: {
  proxy: {
    // API 服务器 1
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    },
    
    // API 服务器 2
    '/auth': {
      target: 'http://localhost:4000',
      changeOrigin: true
    },
    
    // 静态资源服务器
    '/assets': {
      target: 'http://cdn.example.com',
      changeOrigin: true,
      pathRewrite: {
        '^/assets': ''
      }
    }
  }
}
```

**效果**：
```
/api/users   → http://localhost:3000/api/users
/auth/login  → http://localhost:4000/auth/login
/assets/1.jpg → http://cdn.example.com/1.jpg
```

---

### 🔧 使用 context 匹配

```javascript
devServer: {
  proxy: [
    // 匹配多个路径
    {
      context: ['/api', '/auth', '/v1'],
      target: 'http://localhost:3000',
      changeOrigin: true
    },
    
    // 使用函数动态判断
    {
      context: (pathname) => {
        // 自定义匹配逻辑
        return pathname.match(/^\/custom/);
      },
      target: 'http://localhost:4000'
    }
  ]
}
```

---

## WebSocket 代理

### 🔌 基础配置

```javascript
devServer: {
  proxy: {
    '/socket.io': {
      target: 'http://localhost:3000',
      ws: true,  // ✅ 启用 WebSocket 代理
      changeOrigin: true
    }
  }
}
```

---

### 📝 完整配置

```javascript
devServer: {
  proxy: {
    '/ws': {
      target: 'ws://localhost:3000',  // ← WebSocket 协议
      ws: true,
      changeOrigin: true,
      
      // WebSocket 拦截
      onProxyReqWs: (proxyReq, req, socket, options, head) => {
        console.log('WebSocket 代理请求');
      },
      
      onOpen: (proxySocket) => {
        console.log('WebSocket 连接打开');
      },
      
      onClose: (res, socket, head) => {
        console.log('WebSocket 连接关闭');
      }
    }
  }
}
```

---

### 🎬 实际示例

```javascript
// 前端代码
const socket = new WebSocket('ws://localhost:8080/ws');

socket.onopen = () => {
  console.log('连接成功');
  socket.send('Hello');
};

socket.onmessage = (event) => {
  console.log('收到消息:', event.data);
};
```

**代理流程**：
```
浏览器 → ws://localhost:8080/ws
代理   → ws://localhost:3000/ws ✅
```

---

## HTTPS 代理

### 🔒 代理到 HTTPS 服务器

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'https://api.example.com',
      changeOrigin: true,
      secure: false  // ✅ 接受自签名证书（开发环境）
    }
  }
}
```

---

### 🔐 HTTPS 开发服务器

```javascript
devServer: {
  https: true,  // ✅ 启用 HTTPS
  
  // 或使用自定义证书
  https: {
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt'),
    ca: fs.readFileSync('/path/to/ca.pem')
  },
  
  proxy: {
    '/api': {
      target: 'https://api.example.com',
      changeOrigin: true,
      secure: false
    }
  }
}
```

访问：`https://localhost:8080`

---

## 高级配置

### 1. 请求/响应拦截

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      
      // 修改请求
      onProxyReq: (proxyReq, req, res) => {
        // 添加自定义请求头
        proxyReq.setHeader('X-Custom-Header', 'value');
        
        // 添加认证token
        const token = getToken();
        proxyReq.setHeader('Authorization', `Bearer ${token}`);
        
        // 打印日志
        console.log(`→ ${req.method} ${req.url}`);
      },
      
      // 修改响应
      onProxyRes: (proxyRes, req, res) => {
        // 修改响应头
        proxyRes.headers['x-proxy'] = 'webpack-dev-server';
        
        // 打印日志
        console.log(`← ${proxyRes.statusCode} ${req.url}`);
      }
    }
  }
}
```

---

### 2. 条件代理

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      
      // 根据请求决定是否代理
      bypass: (req, res, proxyOptions) => {
        // 不代理 HTML 请求
        if (req.headers.accept.indexOf('html') !== -1) {
          return '/index.html';
        }
        
        // 不代理特定路径
        if (req.url.includes('/no-proxy')) {
          return false;  // 不代理，返回 404
        }
        
        // 其他请求正常代理
        return null;
      }
    }
  }
}
```

---

### 3. 路由函数

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      
      // 动态修改目标
      router: (req) => {
        // 根据请求动态选择目标服务器
        if (req.headers.host === 'dev.example.com') {
          return 'http://dev-api.example.com';
        }
        if (req.headers.host === 'test.example.com') {
          return 'http://test-api.example.com';
        }
        return 'http://localhost:3000';
      }
    }
  }
}
```

---

### 4. 响应体修改

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    devServer.app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
        
        // 修改响应体
        onProxyRes: (proxyRes, req, res) => {
          let body = [];
          
          proxyRes.on('data', (chunk) => {
            body.push(chunk);
          });
          
          proxyRes.on('end', () => {
            body = Buffer.concat(body).toString();
            
            // 修改响应
            const modifiedBody = body.replace('old', 'new');
            
            res.end(modifiedBody);
          });
        }
      })
    );
    
    return middlewares;
  }
}
```

---

## 📝 实战案例

### 案例 1：前后端分离项目

```javascript
// 开发环境配置
module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      // 代理所有 API 请求
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  // 去掉 /api 前缀
        }
      }
    }
  }
};

// 前端代码
const API_BASE = '/api';

fetch(`${API_BASE}/users`)  // → http://localhost:3000/users
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 案例 2：微服务架构

```javascript
devServer: {
  proxy: {
    // 用户服务
    '/api/users': {
      target: 'http://localhost:3001',
      changeOrigin: true
    },
    
    // 订单服务
    '/api/orders': {
      target: 'http://localhost:3002',
      changeOrigin: true
    },
    
    // 支付服务
    '/api/payments': {
      target: 'http://localhost:3003',
      changeOrigin: true
    }
  }
}
```

---

### 案例 3：Mock + 真实 API

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      
      // 部分接口使用 mock
      bypass: (req, res, proxyOptions) => {
        // Mock 登录接口
        if (req.url === '/api/login') {
          res.json({
            code: 0,
            data: { token: 'mock-token-123' }
          });
          return false;  // 不代理
        }
        
        // 其他接口走真实 API
        return null;
      }
    }
  }
}
```

---

## 🐛 常见问题

### 问题 1：代理不生效

```javascript
// ❌ 错误：使用了绝对路径
fetch('http://localhost:3000/api/users')

// ✅ 正确：使用相对路径
fetch('/api/users')
```

---

### 问题 2：404 Not Found

```javascript
// 检查路径重写
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {
        '^/api': ''  // ← 确认是否需要去掉前缀
      },
      
      // 打印日志调试
      onProxyReq: (proxyReq, req) => {
        console.log('代理到:', proxyReq.path);
      }
    }
  }
}
```

---

### 问题 3：CORS 仍然报错

```javascript
// 确保设置了 changeOrigin
devServer: {
  proxy: {
    '/api': {
      target: 'http://api.example.com',
      changeOrigin: true  // ✅ 必须设置
    }
  }
}
```

---

## 📚 总结

### 核心要点

1. **为什么需要代理**
   - 解决开发环境跨域问题
   - 无需后端配置 CORS

2. **基础配置**
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:3000',
       changeOrigin: true
     }
   }
   ```

3. **路径重写**
   ```javascript
   pathRewrite: {
     '^/api': ''  // 去掉前缀
   }
   ```

4. **注意事项**
   - 使用相对路径（不要写完整URL）
   - 设置 changeOrigin: true
   - 正确配置 pathRewrite

### 最佳实践

```javascript
devServer: {
  proxy: {
    '/api': {
      target: process.env.API_URL || 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': ''
      },
      onProxyReq: (proxyReq, req) => {
        console.log(`→ ${req.method} ${req.url}`);
      }
    }
  }
}
```

---

下一步，继续学习：[高级配置与优化](./04-advanced-config.md)

