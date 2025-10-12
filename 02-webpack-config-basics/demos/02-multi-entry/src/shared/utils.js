// ⭐️ 共享工具模块
// 这个模块被多个页面引用，在生产模式下会被提取到 common.js

export function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  
  const colors = {
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336'
  };
  
  console.log(`%c${logMessage}`, `color: ${colors[type] || colors.info}`);
}

export function initPage(pageName) {
  // 设置页面名称
  const pageNameEl = document.getElementById('page-name');
  if (pageNameEl) {
    pageNameEl.textContent = pageName;
  }
  
  log(`页面: ${pageName}`, 'info');
  log(`构建模式: ${process.env.NODE_ENV}`, 'info');
}

export function getBuildInfo() {
  return {
    mode: process.env.NODE_ENV || 'development',
    version: '5.x',
    timestamp: Date.now()
  };
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function formatDate(date) {
  return date.toLocaleString('zh-CN');
}

