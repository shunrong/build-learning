/**
 * AST 可视化 Web 服务器
 * 提供一个简单的 Web 界面来查看代码的 AST
 */

const http = require('http');
const querystring = require('querystring');
const parser = require('@babel/parser');

const PORT = 3000;

// HTML 转义函数
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// JSON 语法高亮
function highlightJson(json) {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match) => {
      let cls = 'json-value';
      if (/:$/.test(match)) {
        cls = 'json-key';
      }
      return `<span class="${cls}">${match}</span>`;
    })
    .replace(/\b(true|false|null)\b/g, '<span class="json-boolean">$1</span>')
    .replace(/\b(-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)\b/g, '<span class="json-number">$1</span>');
}

// HTML 模板
const htmlTemplate = (ast = null, code = '', error = null) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AST 可视化工具</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    h1 {
      color: white;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.5em;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .panels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .panel {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    
    .panel h2 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 1.5em;
    }
    
    textarea {
      width: 100%;
      height: 400px;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 5px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      resize: vertical;
      background: #f9f9f9;
    }
    
    textarea:focus {
      outline: none;
      border-color: #667eea;
      background: white;
    }
    
    .output {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 15px;
      border-radius: 5px;
      max-height: 400px;
      overflow: auto;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    }
    
    .output::-webkit-scrollbar {
      width: 8px;
    }
    
    .output::-webkit-scrollbar-track {
      background: #2d2d2d;
    }
    
    .output::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 4px;
    }
    
    /* JSON 语法高亮 */
    .json-key {
      color: #9cdcfe;
    }
    
    .json-value {
      color: #ce9178;
    }
    
    .json-boolean {
      color: #569cd6;
    }
    
    .json-number {
      color: #b5cea8;
    }
    
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
      transition: transform 0.2s;
      font-weight: bold;
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    .controls {
      text-align: center;
      margin-top: 20px;
    }
    
    .error {
      background: #fee;
      border: 2px solid #f88;
      color: #c33;
      padding: 15px;
      border-radius: 5px;
      margin-top: 10px;
    }
    
    .info {
      background: white;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .info h3 {
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .info ul {
      margin-left: 20px;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌳 AST 可视化工具</h1>
    
    <form method="POST" action="/">
      <div class="panels">
        <div class="panel">
          <h2>📝 输入代码</h2>
          <textarea name="code" placeholder="在此输入 JavaScript 代码...">${escapeHtml(code)}</textarea>
        </div>
        
        <div class="panel">
          <h2>🌲 AST 结构</h2>
          ${error ? `<div class="error">❌ ${escapeHtml(error)}</div>` : ''}
          <div class="output">${ast ? highlightJson(escapeHtml(JSON.stringify(ast, null, 2))) : '等待输入...'}</div>
        </div>
      </div>
      
      <div class="controls">
        <button type="submit">🔍 解析 AST</button>
      </div>
    </form>
    
    <div class="info">
      <h3>💡 使用说明</h3>
      <ul>
        <li>在左侧输入框中输入 JavaScript 代码</li>
        <li>点击"解析 AST"按钮</li>
        <li>右侧将显示对应的 AST 结构（JSON 格式）</li>
        <li>可以尝试不同的代码结构，观察 AST 的变化</li>
      </ul>
    </div>
  </div>
</body>
</html>
`;

// 创建服务器
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // 显示初始页面
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlTemplate());
  } else if (req.method === 'POST' && req.url === '/') {
    // 处理代码解析
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      // 解析表单数据
      const parsed = querystring.parse(body);
      const code = parsed.code || '';
      
      if (!code.trim()) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(htmlTemplate(null, code, '请输入代码'));
        return;
      }
      
      try {
        // 解析代码为 AST
        const ast = parser.parse(code, {
          sourceType: 'module'
        });
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(htmlTemplate(ast, code, null));
      } catch (error) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(htmlTemplate(null, code, error.message));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║       🌳 AST 可视化服务器已启动                    ║
╚════════════════════════════════════════════════════╝

📡 服务器地址: http://localhost:${PORT}

💡 使用方法:
   1. 在浏览器中打开上述地址
   2. 输入 JavaScript 代码
   3. 点击"解析 AST"查看结果

⌨️  按 Ctrl+C 停止服务器
  `);
});

