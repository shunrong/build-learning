import './styles.css';

// ===== API 请求函数 =====

async function fetchAPI(url, options = {}) {
  const startTime = Date.now();
  
  try {
    console.log(`📤 请求: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    console.log(`✅ 响应: ${response.status} (${duration}ms)`, data);
    
    return {
      ok: response.ok,
      status: response.status,
      data,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ 错误: ${error.message} (${duration}ms)`);
    
    return {
      ok: false,
      error: error.message,
      duration
    };
  }
}

// ===== 显示结果 =====

function displayResult(elementId, result) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let output = '';
  
  if (result.ok) {
    output = `✅ 成功 (${result.status}) - ${result.duration}ms\n\n`;
    output += JSON.stringify(result.data, null, 2);
    element.className = 'result result-success';
  } else if (result.error) {
    output = `❌ 错误 - ${result.duration}ms\n\n`;
    output += result.error;
    element.className = 'result result-error';
  } else {
    output = `⚠️ 失败 (${result.status}) - ${result.duration}ms\n\n`;
    output += JSON.stringify(result.data, null, 2);
    element.className = 'result result-warning';
  }
  
  element.textContent = output;
}

// ===== 事件监听器 =====

// 1. 获取用户列表
document.getElementById('btn-users')?.addEventListener('click', async () => {
  const result = await fetchAPI('/api/users');
  displayResult('result-users', result);
});

// 2. 获取用户详情
document.getElementById('btn-user')?.addEventListener('click', async () => {
  const result = await fetchAPI('/api/users/1');
  displayResult('result-user', result);
});

// 3. 创建用户
document.getElementById('btn-create')?.addEventListener('click', async () => {
  const result = await fetchAPI('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      name: '赵六',
      email: 'zhaoliu@example.com',
      role: 'user'
    })
  });
  displayResult('result-create', result);
});

// 4. GitHub API
document.getElementById('btn-github')?.addEventListener('click', async () => {
  const result = await fetchAPI('/github/users/github');
  displayResult('result-github', result);
});

// 5. 搜索
document.getElementById('btn-search')?.addEventListener('click', async () => {
  const result = await fetchAPI('/api/search?q=webpack');
  displayResult('result-search', result);
});

// 6. 错误测试
document.getElementById('btn-error')?.addEventListener('click', async () => {
  const result = await fetchAPI('/api/error');
  displayResult('result-error', result);
});

// 7. 慢请求测试
document.getElementById('btn-slow')?.addEventListener('click', async () => {
  const resultEl = document.getElementById('result-slow');
  resultEl.textContent = '⏳ 请求中，请稍候（预计 3 秒）...';
  resultEl.className = 'result';
  
  const result = await fetchAPI('/api/slow');
  displayResult('result-slow', result);
});

// 8. 认证请求
document.getElementById('btn-protected')?.addEventListener('click', async () => {
  const result = await fetchAPI('/api/protected', {
    headers: {
      'Authorization': 'Bearer my-secret-token'
    }
  });
  displayResult('result-protected', result);
});

// ===== 页面加载 =====

console.log('✅ 代理演示页面已加载');
console.log('💡 提示：');
console.log('  1. 确保 Mock 服务器已启动 (npm run mock-server)');
console.log('  2. 点击按钮测试各种代理场景');
console.log('  3. 查看 Mock 服务器终端的日志');
console.log('  4. 观察浏览器网络面板的请求');

