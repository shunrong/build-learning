// ⚠️ 问题1：全局变量污染
// 所有变量都会挂载到 window 对象上

// 通用工具函数
var appName = "Calculator App";  // 全局变量
var version = "1.0.0";            // 全局变量

// 日志函数
function log(message, type) {
  var timestamp = new Date().toLocaleTimeString();
  var logMessage = '[' + timestamp + '] ' + message;
  
  console.log(logMessage);
  
  // 同时显示在页面上
  var consoleEl = document.getElementById('console');
  if (consoleEl) {
    var className = type || 'info';
    var line = document.createElement('div');
    line.className = className;
    line.textContent = logMessage;
    consoleEl.appendChild(line);
    
    // 自动滚动到底部
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
}

// 检查浏览器特性
function checkBrowser() {
  return {
    supportsES6: typeof Symbol !== 'undefined',
    supportsModules: 'noModule' in document.createElement('script')
  };
}

// ⚠️ 问题：所有这些都是全局变量，很容易被覆盖
log('✅ utils.js 加载完成', 'info');
log('⚠️ 定义了全局变量: appName, version, log, checkBrowser', 'warning');

