// 工具函数模块

export function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  
  // 显示在页面上
  const consoleEl = document.getElementById('console');
  if (consoleEl) {
    const line = document.createElement('div');
    line.className = type;
    line.textContent = logMessage;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
}

export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

