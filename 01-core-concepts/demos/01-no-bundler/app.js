// 应用入口

// 初始化应用
function initApp() {
  log('==========================================', 'info');
  log('🎉 应用初始化开始', 'info');
  log('应用名称: ' + appName, 'info');
  log('版本号: ' + version + ' (⚠️ 已被 calculator.js 覆盖！)', 'error');
  
  // 检查浏览器
  var browser = checkBrowser();
  log('浏览器支持 ES6: ' + browser.supportsES6, 'info');
  log('浏览器支持 Modules: ' + browser.supportsModules, 'info');
  
  // 列出所有全局变量（演示全局污染）
  log('==========================================', 'warning');
  log('⚠️ 全局变量污染检查（window 对象上的自定义变量）：', 'warning');
  
  var globalVars = [
    'appName', 'version', 'log', 'checkBrowser',
    'validateNumber', 'validateDivision', 'validateInputs',
    'Calculator',
    'getInputs', 'displayResult', 'displayError', 'performCalculation',
    'handleAdd', 'handleSubtract', 'handleMultiply', 'handleDivide',
    'initApp'
  ];
  
  globalVars.forEach(function(varName) {
    if (typeof window[varName] !== 'undefined') {
      log('  - window.' + varName + ' = ' + typeof window[varName], 'warning');
    }
  });
  
  log('==========================================', 'warning');
  log('⚠️ 问题总结：', 'warning');
  log('1. 所有变量都在全局作用域，容易冲突', 'warning');
  log('2. 依赖关系不明确，必须手动管理加载顺序', 'warning');
  log('3. 5 个 JS 文件 = 5 个 HTTP 请求（打开 Network 查看）', 'warning');
  log('4. 无法使用现代的 import/export 语法', 'warning');
  log('5. 无法使用 npm 生态的包', 'warning');
  log('6. 代码没有压缩和优化', 'warning');
  log('==========================================', 'info');
  log('✅ 应用初始化完成，可以开始使用计算器了！', 'info');
  log('💡 试试打开浏览器的 Network 面板，看看加载了多少文件', 'info');
  log('==========================================', 'info');
}

log('✅ app.js 加载完成', 'info');

