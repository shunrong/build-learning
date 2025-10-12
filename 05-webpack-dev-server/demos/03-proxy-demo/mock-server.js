const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// 启用 CORS（演示用，实际项目中通常不需要）
app.use(cors());
app.use(express.json());

// ===== Mock API 路由 =====

// 1. 用户列表
app.get('/users', (req, res) => {
  console.log('📡 [Mock API] GET /users');
  res.json({
    success: true,
    data: [
      { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
      { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
      { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' }
    ]
  });
});

// 2. 用户详情
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📡 [Mock API] GET /users/${id}`);
  
  const users = {
    '1': { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', age: 28 },
    '2': { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', age: 25 },
    '3': { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', age: 30 }
  };
  
  const user = users[id];
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, message: '用户不存在' });
  }
});

// 3. 创建用户
app.post('/users', (req, res) => {
  console.log('📡 [Mock API] POST /users', req.body);
  
  // 模拟延迟
  setTimeout(() => {
    res.json({
      success: true,
      message: '用户创建成功',
      data: {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
      }
    });
  }, 500);
});

// 4. 文章列表
app.get('/posts', (req, res) => {
  console.log('📡 [Mock API] GET /posts');
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Webpack 入门', author: '张三', views: 1234 },
      { id: 2, title: 'React 最佳实践', author: '李四', views: 5678 },
      { id: 3, title: 'TypeScript 深入浅出', author: '王五', views: 9012 }
    ]
  });
});

// 5. 搜索
app.get('/search', (req, res) => {
  const { q } = req.query;
  console.log(`📡 [Mock API] GET /search?q=${q}`);
  
  res.json({
    success: true,
    query: q,
    results: [
      { id: 1, title: `结果包含 "${q}" 的文章 1`, relevance: 0.95 },
      { id: 2, title: `结果包含 "${q}" 的文章 2`, relevance: 0.88 },
      { id: 3, title: `结果包含 "${q}" 的文章 3`, relevance: 0.76 }
    ]
  });
});

// 6. 错误测试
app.get('/error', (req, res) => {
  console.log('📡 [Mock API] GET /error');
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: '这是一个模拟的服务器错误'
  });
});

// 7. 慢请求测试
app.get('/slow', (req, res) => {
  console.log('📡 [Mock API] GET /slow (延迟 3秒)');
  setTimeout(() => {
    res.json({
      success: true,
      message: '这个请求延迟了 3 秒',
      timestamp: new Date().toISOString()
    });
  }, 3000);
});

// 8. 需要认证的接口
app.get('/protected', (req, res) => {
  const token = req.headers.authorization;
  console.log('📡 [Mock API] GET /protected', { token });
  
  if (token === 'Bearer my-secret-token') {
    res.json({
      success: true,
      message: '认证成功',
      data: { secretInfo: '这是受保护的数据' }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: '需要认证'
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API 服务器运行在 http://localhost:${PORT}`);
  console.log('\n可用的 API 端点：');
  console.log('  GET    /users        - 用户列表');
  console.log('  GET    /users/:id    - 用户详情');
  console.log('  POST   /users        - 创建用户');
  console.log('  GET    /posts        - 文章列表');
  console.log('  GET    /search?q=x   - 搜索');
  console.log('  GET    /error        - 错误测试');
  console.log('  GET    /slow         - 慢请求测试');
  console.log('  GET    /protected    - 需要认证');
  console.log('\n💡 在另一个终端运行 `npm run dev` 启动 Webpack Dev Server\n');
});

