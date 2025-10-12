// ✅ 应用入口文件
// Webpack 从这里开始分析依赖

// 导入所需的模块
import { appName, version, log, checkBrowser } from './utils.js';
import { version as calculatorVersion } from './calculator.js';  // 重命名避免冲突
import { performCalculation } from './ui.js';

// 初始化应用
function initApp() {
  log('==========================================', 'info');
  log('🎉 应用初始化开始', 'success');
  log(`应用名称: ${appName}`, 'info');
  log(`版本号: ${version}`, 'info');
  log(`Calculator 模块版本: ${calculatorVersion}`, 'info');
  log('✅ 两个不同的 version 变量可以和平共处！', 'success');
  
  // 检查浏览器
  const browser = checkBrowser();
  log(`浏览器支持 ES6: ${browser.supportsES6}`, 'info');
  log(`浏览器支持 Modules: ${browser.supportsModules}`, 'info');
  
  log('==========================================', 'success');
  log('✅ Webpack 的优势：', 'success');
  log('1. ✅ 使用 ES Modules，代码结构清晰', 'success');
  log('2. ✅ 所有模块打包成 1 个文件（查看 Network 面板）', 'success');
  log('3. ✅ 没有全局变量污染（查看 window 对象）', 'success');
  log('4. ✅ 依赖关系自动管理，不用担心加载顺序', 'success');
  log('5. ✅ 支持代码分割、Tree Shaking、压缩等优化', 'success');
  log('6. ✅ 可以使用 npm 包和现代 JS 特性', 'success');
  log('==========================================', 'info');
  log('✅ 应用初始化完成，可以开始使用了！', 'success');
  log('💡 对比 Demo 1，是不是清爽多了？', 'success');
  log('==========================================', 'info');
  
  // 绑定事件
  setupEventListeners();
  
  // 检查全局污染
  checkGlobalPollution();
}

// 设置事件监听
function setupEventListeners() {
  document.getElementById('add-btn').addEventListener('click', () => {
    performCalculation('add');
  });
  
  document.getElementById('subtract-btn').addEventListener('click', () => {
    performCalculation('subtract');
  });
  
  document.getElementById('multiply-btn').addEventListener('click', () => {
    performCalculation('multiply');
  });
  
  document.getElementById('divide-btn').addEventListener('click', () => {
    performCalculation('divide');
  });
}

// 检查全局污染
function checkGlobalPollution() {
  log('==========================================', 'info');
  log('🔍 检查全局变量污染：', 'info');
  
  // 尝试访问我们定义的变量
  const testVars = [
    'appName', 'version', 'log', 'checkBrowser',
    'validateNumber', 'validateInputs',
    'add', 'subtract', 'multiply', 'divide',
    'performCalculation', 'initApp'
  ];
  
  let foundInGlobal = 0;
  testVars.forEach(varName => {
    if (typeof window[varName] !== 'undefined') {
      log(`  ⚠️ window.${varName} 存在`, 'warning');
      foundInGlobal++;
    }
  });
  
  if (foundInGlobal === 0) {
    log('✅ 完美！没有发现全局变量污染！', 'success');
    log('✅ 所有变量都在模块作用域内，互不干扰', 'success');
  } else {
    log(`⚠️ 发现 ${foundInGlobal} 个全局变量`, 'warning');
  }
  
  log('==========================================', 'info');
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

