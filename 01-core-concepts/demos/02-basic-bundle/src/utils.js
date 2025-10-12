// ✅ 使用 ES Modules 导出
// 所有变量都在模块作用域内，不会污染全局

export const appName = "Calculator App";
export const version = "1.0.0";

// 日志函数
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
    
    // 自动滚动到底部
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
}

// 检查浏览器
export function checkBrowser() {
  return {
    supportsES6: typeof Symbol !== 'undefined',
    supportsModules: 'noModule' in document.createElement('script')
  };
}

log('✅ utils 模块加载完成', 'success');
log('✅ 导出: appName, version, log, checkBrowser', 'success');

