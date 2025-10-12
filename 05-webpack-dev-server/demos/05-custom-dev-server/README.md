# Demo 5: 手写简易 Webpack Dev Server

## 📖 学习目标

通过本 Demo，你将深入理解：

1. ✅ **Express 服务器**：如何搭建 HTTP 静态文件服务
2. ✅ **Webpack Compiler API**：如何编程式使用 Webpack
3. ✅ **文件监听**：使用 Chokidar 监听源文件变化
4. ✅ **WebSocket 通信**：实现服务器与客户端的实时通信
5. ✅ **Live Reload**：自动刷新页面的实现原理
6. ✅ **CSS HMR**：样式热更新的实现机制

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动自定义 Dev Server

```bash
npm run dev
```

控制台会显示：
```
════════════════════════════════════════════════
🚀 自定义 Dev Server 启动成功！
════════════════════════════════════════════════
📍 访问地址: http://localhost:8080
🔌 WebSocket: ws://localhost:8080
════════════════════════════════════════════════

功能列表：
  ✅ Express 静态文件服务
  ✅ Webpack 自动编译
  ✅ 文件监听（Chokidar）
  ✅ WebSocket 实时通信
  ✅ Live Reload（自动刷新）
  ✅ CSS HMR（样式热更新）
  ✅ 错误覆盖层
```

### 3. 构建生产版本

```bash
npm run build
```

---

## 📂 项目结构

```
05-custom-dev-server/
├── dev-server.js             # 🔥 核心：自定义开发服务器
├── webpack.config.js         # Webpack 配置
├── package.json
├── src/
│   ├── index.html
│   ├── index.js
│   └── styles.css
├── public/
│   └── test.json            # 静态文件示例
└── README.md
```

---

## 🎯 核心实现详解

### 1. Express HTTP 服务器

```javascript
const express = require('express');
const app = express();
const server = http.createServer(app);

// 中间件：注入客户端脚本
app.use((req, res, next) => {
  if (req.url === '/') {
    // 获取编译后的 HTML
    let html = compiledFiles['/index.html'];
    
    // 注入 WebSocket 客户端代码
    const clientScript = `<script>
      const ws = new WebSocket('ws://localhost:8080');
      // ... WebSocket 逻辑
    </script>`;
    
    html = html.replace('</body>', `${clientScript}</body>`);
    res.send(html);
  }
});

// 静态文件服务
app.use((req, res) => {
  const file = compiledFiles[req.url];
  if (file) {
    res.send(file);
  }
});
```

**关键点**：
- 使用中间件拦截 HTML 请求
- 动态注入客户端 WebSocket 代码
- 从内存中提供编译后的文件

---

### 2. Webpack Compiler API

```javascript
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

// 监听编译完成事件
compiler.hooks.done.tap('CustomDevServer', (stats) => {
  // 获取编译后的资源
  const { assets } = stats.compilation;
  compiledFiles = {};
  
  for (const assetName in assets) {
    compiledFiles[`/${assetName}`] = assets[assetName].source();
  }
  
  // 通知客户端
  broadcastMessage({ type: 'ok' });
});

// 启动 Watch 模式
compiler.watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  // 处理编译结果
});
```

**关键 Hooks**：
- `compiler.hooks.watchRun`：编译开始
- `compiler.hooks.done`：编译完成
- `stats.compilation.assets`：访问编译后的资源

---

### 3. WebSocket 实时通信

```javascript
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ server });
const clients = new Set();

// 客户端连接
wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.send(JSON.stringify({ 
    type: 'connected' 
  }));
});

// 广播消息
function broadcastMessage(message) {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

// 编译完成时通知
compiler.hooks.done.tap('CustomDevServer', () => {
  broadcastMessage({ type: 'ok' });
});
```

**消息类型**：
- `connected`：连接成功
- `compiling`：编译中
- `ok`：编译成功（触发刷新）
- `errors`：编译错误
- `css-update`：CSS 更新（触发 HMR）

---

### 4. 文件监听（Chokidar）

```javascript
const chokidar = require('chokidar');

// 监听 CSS 文件变化
const watcher = chokidar.watch('./src/**/*.css', {
  ignoreInitial: true
});

watcher.on('change', (filePath) => {
  console.log(`🎨 CSS 文件变化: ${filePath}`);
  
  // 读取新的 CSS 内容
  const cssContent = fs.readFileSync(filePath, 'utf-8');
  
  // 通知客户端进行 CSS HMR
  broadcastMessage({
    type: 'css-update',
    content: cssContent
  });
});
```

**为什么需要 Chokidar？**
- Webpack Watch 只监听入口依赖的文件
- CSS 文件的变化需要单独监听
- 实现细粒度的 HMR 控制

---

### 5. 客户端 Live Reload

```javascript
// 注入到 HTML 的客户端代码
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'ok':
      console.log('✅ 编译成功！');
      // Live Reload: 刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 100);
      break;
  }
};
```

**实现原理**：
1. 文件变化 → Webpack 重新编译
2. 编译完成 → 服务器通过 WebSocket 推送 `ok` 消息
3. 客户端收到消息 → 执行 `location.reload()`

---

### 6. CSS HMR 实现

```javascript
// 服务器端：监听 CSS 变化
watcher.on('change', (filePath) => {
  const cssContent = fs.readFileSync(filePath, 'utf-8');
  broadcastMessage({
    type: 'css-update',
    content: cssContent
  });
});

// 客户端：更新 CSS
function updateCSS(newContent) {
  const styleTags = document.querySelectorAll('style');
  if (styleTags.length > 0) {
    // 替换 style-loader 注入的 <style> 标签
    styleTags[0].textContent = newContent;
    console.log('✨ CSS 已热更新（无刷新）');
  }
}
```

**为什么只支持 CSS HMR？**
- CSS 更新简单：只需替换 `<style>` 标签内容
- JS 更新复杂：需要模块替换、状态保持等
- 我们的实现对 JS 降级为 Live Reload

---

## 🔬 实验指南

### 实验 1：Live Reload

**目标**：体验自动刷新功能

1. 启动 `npm run dev`
2. 打开浏览器控制台
3. 修改 `src/index.js`：
```javascript
console.log('✅ 应用已加载 - 修改测试');
```

4. 观察：
```
服务器控制台：
  ⚙️  Webpack 编译中...
  ✅ 编译成功！耗时 XXms

浏览器控制台：
  📨 收到消息: {type: "ok"}
  🔄 重新加载页面...
  （页面自动刷新）
```

---

### 实验 2：CSS HMR

**目标**：体验样式无刷新更新

1. 点击计数器按钮，增加到 **5**
2. 修改 `src/styles.css`：
```css
.color-box {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
}
```

3. 观察：
```
服务器控制台：
  🎨 CSS 文件变化: src/styles.css

浏览器控制台：
  📨 收到消息: {type: "css-update"}
  🎨 CSS 热更新: src/styles.css
  ✨ CSS 已热更新（无刷新）
```

4. 注意：
   - ✅ 颜色立即改变
   - ✅ 计数器仍然是 **5**（状态保持）
   - ✅ 页面没有刷新

---

### 实验 3：WebSocket 通信

**目标**：理解实时通信机制

1. 打开浏览器开发者工具 → Network → WS
2. 找到 WebSocket 连接
3. 查看消息：

```
← 服务器发送：
{
  "type": "connected",
  "message": "已连接到自定义 Dev Server"
}

← 服务器发送（编译开始）：
{
  "type": "compiling"
}

← 服务器发送（编译完成）：
{
  "type": "ok",
  "time": 234,
  "hash": "abc123"
}
```

---

### 实验 4：错误覆盖层

**目标**：测试错误提示功能

1. 制造语法错误（`src/index.js`）：
```javascript
const test =  // 故意不完整
```

2. 观察：
   - 服务器显示编译错误
   - 浏览器显示错误覆盖层
   - WebSocket 推送 `errors` 消息

3. 修复错误，覆盖层自动消失

---

## 📊 与官方 webpack-dev-server 对比

| 功能 | 官方实现 | 我们的实现 | 复杂度 |
|------|----------|------------|--------|
| **HTTP 服务** | Express + webpack-dev-middleware | ✅ Express | ⭐⭐ |
| **Webpack 集成** | webpack-dev-middleware | ✅ Compiler API | ⭐⭐⭐ |
| **WebSocket** | sockjs-node 或 ws | ✅ ws | ⭐⭐ |
| **Live Reload** | ✅ 完整支持 | ✅ 完整支持 | ⭐⭐ |
| **CSS HMR** | ✅ 完整支持 | ✅ 基础支持 | ⭐⭐⭐ |
| **JS HMR** | ✅ 完整支持（module.hot API） | ❌ 降级为刷新 | ⭐⭐⭐⭐⭐ |
| **错误覆盖层** | ✅ 支持 | ✅ 支持 | ⭐⭐ |
| **代理** | http-proxy-middleware | ❌ 未实现 | ⭐⭐⭐ |
| **HTTPS** | ✅ 支持 | ❌ 未实现 | ⭐⭐ |
| **内存文件系统** | memory-fs | ✅ 简化实现 | ⭐⭐⭐⭐ |
| **History API Fallback** | connect-history-api-fallback | ❌ 未实现 | ⭐⭐ |

---

## 💡 核心技术栈

### 依赖包说明

```json
{
  "express": "HTTP 服务器框架",
  "ws": "WebSocket 通信库",
  "chokidar": "高效的文件监听库",
  "mime-types": "MIME 类型识别",
  "webpack": "模块打包工具"
}
```

### 架构图

```
┌─────────────────────────────────────────────────────┐
│                  自定义 Dev Server                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────┐    ┌──────────────┐    ┌────────┐ │
│  │   Express   │───▶│   Webpack    │───▶│ Assets │ │
│  │   Server    │    │   Compiler   │    │ Memory │ │
│  └─────────────┘    └──────────────┘    └────────┘ │
│         │                   │                        │
│         │                   ▼                        │
│         │            ┌──────────────┐               │
│         │            │  Chokidar    │               │
│         │            │  File Watch  │               │
│         │            └──────────────┘               │
│         │                   │                        │
│         ▼                   ▼                        │
│  ┌──────────────────────────────────────┐          │
│  │       WebSocket Server (ws)          │          │
│  └──────────────────────────────────────┘          │
│                       │                              │
└───────────────────────┼──────────────────────────────┘
                        │
                        ▼ (WebSocket)
              ┌─────────────────────┐
              │   Browser Client    │
              │  (Injected Script)  │
              └─────────────────────┘
```

---

## 🎓 学习要点总结

### 1. Express 中间件机制

```javascript
// 核心理念：拦截请求 → 修改响应
app.use((req, res, next) => {
  // 1. 检查请求
  if (shouldIntercept(req)) {
    // 2. 修改响应
    res.send(modifiedContent);
  } else {
    // 3. 传递给下一个中间件
    next();
  }
});
```

### 2. Webpack Compiler Hooks

```javascript
// 理解 Tapable 事件系统
compiler.hooks.hookName.tap('PluginName', (args) => {
  // 在特定时机执行代码
});

// 常用 Hooks：
// - watchRun: 监听编译开始
// - compile: 创建 compilation
// - done: 编译完成
// - failed: 编译失败
```

### 3. WebSocket 双向通信

```javascript
// 服务器 → 客户端：推送消息
broadcastMessage({ type: 'ok' });

// 客户端 → 服务器：发送消息（可扩展）
ws.send(JSON.stringify({ type: 'custom' }));

// 实时性：无需轮询，即时推送
```

### 4. HMR 实现难度

| 类型 | 难度 | 原因 |
|------|------|------|
| **CSS** | ⭐⭐ | 只需替换样式表内容 |
| **图片** | ⭐⭐⭐ | 需要更新 DOM 中的引用 |
| **JS 模块** | ⭐⭐⭐⭐⭐ | 需要模块替换、状态保持、依赖更新 |

**为什么 JS HMR 难？**
1. 需要找到并替换旧模块
2. 需要保存和恢复模块状态
3. 需要处理模块间的依赖关系
4. 需要处理副作用（事件监听、定时器等）
5. 需要提供 `module.hot` API

---

## 🐛 常见问题

### 1. WebSocket 连接失败

**原因**：端口不匹配或服务器未启动

**解决**：
- 确保服务器在运行
- 检查端口号是否一致
- 查看浏览器控制台错误信息

### 2. CSS HMR 不生效

**原因**：Chokidar 未正确监听文件

**检查**：
```javascript
// 确认监听路径正确
chokidar.watch('./src/**/*.css')
```

### 3. 页面没有自动刷新

**原因**：客户端脚本未注入

**检查**：
- 查看页面源代码，确认 WebSocket 代码已注入
- 查看网络面板，确认 WebSocket 连接成功

### 4. 编译后的文件无法访问

**原因**：`compiledFiles` 对象未正确填充

**调试**：
```javascript
compiler.hooks.done.tap('Debug', (stats) => {
  console.log('Assets:', Object.keys(stats.compilation.assets));
});
```

---

## 🔗 扩展阅读

- [Express 中间件文档](https://expressjs.com/en/guide/using-middleware.html)
- [Webpack Compiler Hooks](https://webpack.js.org/api/compiler-hooks/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Chokidar 文档](https://github.com/paulmillr/chokidar)
- 本项目文档：`../docs/05-custom-dev-server.md`

---

## 🎯 总结

通过手写简易 Dev Server，你应该理解了：

1. **Dev Server 不是黑盒**：它由 HTTP 服务器、Webpack、WebSocket 等组件组成
2. **Live Reload 原理**：文件变化 → 编译 → WebSocket 通知 → 刷新页面
3. **CSS HMR 原理**：单独监听 CSS → 读取新内容 → 替换样式表
4. **为什么需要 webpack-dev-server**：实现完整的 HMR、代理、HTTPS 等需要大量工作

**关键领悟**：
- ✅ webpack-dev-server 是 Express + Webpack API 的封装
- ✅ HMR 需要服务器和客户端的配合
- ✅ CSS HMR 简单，JS HMR 复杂
- ✅ 理解原理后，可以根据需求自定义开发服务器

现在你已经掌握了 Dev Server 的底层实现！🚀

