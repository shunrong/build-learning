/**
 * 手写简易 Webpack Dev Server
 * 
 * 功能：
 * 1. 基于 Express 的静态文件服务
 * 2. Webpack 编译集成
 * 3. 文件监听（Chokidar）
 * 4. WebSocket 通信（实时通知）
 * 5. Live Reload（自动刷新）
 * 6. CSS HMR（样式热更新）
 */

const express = require('express');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { WebSocketServer } = require('ws');
const chokidar = require('chokidar');
const mime = require('mime-types');

// 加载 Webpack 配置
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

// 创建 Express 应用
const app = express();
const server = http.createServer(app);
let PORT = 8080;  // 初始端口

// 存储编译后的文件（内存文件系统模拟）
let compiledFiles = {};
let isCompiling = false;
let compilation = null;

// ===== 1. Webpack 编译监听 =====
console.log('📦 开始监听 Webpack 编译...\n');

compiler.hooks.watchRun.tap('CustomDevServer', () => {
  isCompiling = true;
  console.log('⚙️  Webpack 编译中...');
  broadcastMessage({ type: 'compiling' });
});

compiler.hooks.done.tap('CustomDevServer', (stats) => {
  isCompiling = false;
  compilation = stats.compilation;
  
  // 获取编译后的文件
  // 方法：从 outputFileSystem 读取（Webpack 5 推荐方式）
  const outputPath = compiler.options.output.path;
  const outputFileSystem = compiler.outputFileSystem;
  
  compiledFiles = {};
  
  try {
    // 读取输出目录中的所有文件
    function readDirectory(dirPath, baseUrl = '') {
      const files = outputFileSystem.readdirSync(dirPath);
      
      files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = outputFileSystem.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 递归读取子目录
          readDirectory(fullPath, `${baseUrl}/${file}`);
        } else {
          // 读取文件内容
          const content = outputFileSystem.readFileSync(fullPath);
          const url = `${baseUrl}/${file}`;
          compiledFiles[url] = content;
        }
      });
    }
    
    // 从输出目录读取
    readDirectory(outputPath);
    
    console.log('📦 编译后的文件:', Object.keys(compiledFiles));
  } catch (error) {
    console.error('❌ 读取编译文件失败:', error.message);
  }
  
  if (stats.hasErrors()) {
    const errors = stats.compilation.errors.map(err => err.message);
    console.error('❌ 编译失败:', errors[0]);
    broadcastMessage({ 
      type: 'errors', 
      data: errors 
    });
  } else {
    const time = stats.endTime - stats.startTime;
    console.log(`✅ 编译成功！耗时 ${time}ms\n`);
    broadcastMessage({ 
      type: 'ok',
      time,
      hash: stats.hash
    });
  }
});

// 启动 Webpack watch 模式
const watching = compiler.watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  if (err) {
    console.error('❌ Webpack 编译错误:', err);
  }
});

// ===== 2. WebSocket 服务器（实时通信） =====
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 客户端已连接');
  clients.add(ws);
  
  // 发送初始连接消息
  ws.send(JSON.stringify({ 
    type: 'connected',
    message: '已连接到自定义 Dev Server' 
  }));
  
  ws.on('close', () => {
    console.log('🔌 客户端已断开');
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket 错误:', error.message);
    clients.delete(ws);
  });
});

// 广播消息给所有客户端
function broadcastMessage(message) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(data);
    }
  });
}

// ===== 3. 文件监听（CSS HMR） =====
console.log('👀 开始监听源文件变化...\n');

const watcher = chokidar.watch('./src/**/*.css', {
  ignoreInitial: true,
  persistent: true
});

watcher.on('change', (filePath) => {
  console.log(`🎨 CSS 文件变化: ${filePath}`);
  
  // 读取更新的 CSS 内容
  const cssContent = fs.readFileSync(filePath, 'utf-8');
  
  // 通知客户端进行 CSS HMR
  broadcastMessage({
    type: 'css-update',
    path: filePath,
    content: cssContent
  });
});

// ===== 4. 中间件：注入客户端脚本 =====
app.use((req, res, next) => {
  // 拦截 HTML 请求，注入 WebSocket 客户端代码
  if (req.url === '/' || req.url === '/index.html') {
    const htmlBuffer = compiledFiles['/index.html'];
    
    if (htmlBuffer) {
      // Buffer 转字符串
      let html = Buffer.isBuffer(htmlBuffer) 
        ? htmlBuffer.toString('utf-8') 
        : htmlBuffer;
      
      // 注入客户端脚本
      const clientScript = `
        <script>
          console.log('🔌 连接到自定义 Dev Server');
          
          // 建立 WebSocket 连接（使用当前页面的 host）
          const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
          const ws = new WebSocket(wsProtocol + '//' + location.host);
          
          ws.onopen = () => {
            console.log('✅ WebSocket 已连接');
          };
          
          ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('📨 收到消息:', message);
            
            switch (message.type) {
              case 'connected':
                console.log('💚 ' + message.message);
                break;
                
              case 'compiling':
                console.log('⚙️  正在编译...');
                break;
                
              case 'ok':
                console.log(\`✅ 编译成功！耗时 \${message.time}ms\`);
                console.log('🔄 重新加载页面...');
                // Live Reload: 刷新页面
                setTimeout(() => {
                  window.location.reload();
                }, 100);
                break;
                
              case 'errors':
                console.error('❌ 编译错误:', message.data);
                showErrorOverlay(message.data);
                break;
                
              case 'css-update':
                console.log('🎨 CSS 热更新:', message.path);
                updateCSS(message.content);
                break;
            }
          };
          
          ws.onerror = (error) => {
            console.error('❌ WebSocket 错误:', error);
          };
          
          ws.onclose = () => {
            console.log('🔌 WebSocket 已断开');
          };
          
          // CSS 热更新函数
          function updateCSS(newContent) {
            // 查找所有 <style> 标签
            const styleTags = document.querySelectorAll('style');
            
            if (styleTags.length > 0) {
              // 更新第一个 style 标签（style-loader 注入的）
              styleTags[0].textContent = newContent;
              console.log('✨ CSS 已热更新（无刷新）');
            } else {
              // 如果没有 style 标签，创建一个
              const style = document.createElement('style');
              style.textContent = newContent;
              document.head.appendChild(style);
              console.log('✨ CSS 已添加');
            }
          }
          
          // 错误覆盖层
          function showErrorOverlay(errors) {
            // 移除旧的覆盖层
            const oldOverlay = document.getElementById('webpack-error-overlay');
            if (oldOverlay) {
              oldOverlay.remove();
            }
            
            // 创建新的覆盖层
            const overlay = document.createElement('div');
            overlay.id = 'webpack-error-overlay';
            overlay.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.85);
              color: #ff6b6b;
              font-family: monospace;
              font-size: 14px;
              padding: 20px;
              overflow: auto;
              z-index: 9999;
            \`;
            
            overlay.innerHTML = \`
              <div style="max-width: 800px; margin: 0 auto;">
                <h2 style="color: #ff6b6b; margin-bottom: 20px;">
                  ❌ 编译失败
                </h2>
                <pre style="background: #282c34; padding: 20px; border-radius: 8px; overflow-x: auto;">
\${errors.join('\\n\\n')}
                </pre>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="margin-top: 20px; padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                  关闭
                </button>
              </div>
            \`;
            
            document.body.appendChild(overlay);
          }
        </script>
      `;
      
      // 在 </body> 前插入
      html = html.replace('</body>', `${clientScript}</body>`);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
      return;
    }
  }
  
  next();
});

// ===== 5. 静态文件服务 =====
app.use((req, res, next) => {
  // 从编译后的文件中查找
  const file = compiledFiles[req.url];
  
  if (file) {
    const mimeType = mime.lookup(req.url) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    
    // 如果是 Buffer，直接发送；如果是字符串，也可以发送
    if (Buffer.isBuffer(file)) {
      res.send(file);
    } else {
      res.send(Buffer.from(file));
    }
  } else {
    next();
  }
});

// 提供 public 目录的静态文件
app.use('/static', express.static(path.join(__dirname, 'public')));

// 404 处理
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head><title>404 Not Found</title></head>
      <body>
        <h1>404 - 页面未找到</h1>
        <p>请求的资源 <code>${req.url}</code> 不存在</p>
        <a href="/">返回首页</a>
      </body>
    </html>
  `);
});

// ===== 6. 启动服务器 =====
function startServer(port) {
  server.listen(port, () => {
    PORT = port;  // 更新实际使用的端口
    console.log('════════════════════════════════════════════════');
    console.log('🚀 自定义 Dev Server 启动成功！');
    console.log('════════════════════════════════════════════════');
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    console.log('════════════════════════════════════════════════');
    console.log('\n功能列表：');
    console.log('  ✅ Express 静态文件服务');
    console.log('  ✅ Webpack 自动编译');
    console.log('  ✅ 文件监听（Chokidar）');
    console.log('  ✅ WebSocket 实时通信');
    console.log('  ✅ Live Reload（自动刷新）');
    console.log('  ✅ CSS HMR（样式热更新）');
    console.log('  ✅ 错误覆盖层');
    console.log('\n按 Ctrl+C 停止服务器\n');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  端口 ${port} 被占用，尝试端口 ${port + 1}...`);
      startServer(port + 1);  // 递归尝试下一个端口
    } else {
      console.error('❌ 服务器启动失败:', err);
      process.exit(1);
    }
  });
}

// 启动服务器
startServer(PORT);

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n⏹️  正在关闭服务器...');
  
  watcher.close();
  watching.close(() => {
    console.log('✅ Webpack 监听已停止');
  });
  
  server.close(() => {
    console.log('✅ HTTP 服务器已关闭');
    process.exit(0);
  });
});

