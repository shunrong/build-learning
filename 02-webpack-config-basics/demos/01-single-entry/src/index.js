// ⭐️ 单入口应用示例
import { log } from './utils.js';
import { formatDate } from './date.js';

log('🎉 应用启动', 'info');

// 显示构建信息
function displayBuildInfo() {
  const mode = process.env.NODE_ENV;
  const isDev = mode === 'development';
  
  document.getElementById('build-mode').textContent = 
    isDev ? 'development (开发模式)' : 'production (生产模式)';
  
  document.getElementById('node-env').textContent = process.env.NODE_ENV;
  document.getElementById('webpack-version').textContent = '5.x';
  document.getElementById('build-time').textContent = formatDate(new Date());
  
  log(`构建模式: ${mode}`, 'info');
  log(`开发模式: ${isDev}`, isDev ? 'success' : 'warning');
  
  if (isDev) {
    log('✅ 开发模式特性:', 'success');
    log('  - 未压缩代码', 'info');
    log('  - 完整 Source Map', 'info');
    log('  - 热模块替换 (HMR)', 'info');
    log('  - 快速构建', 'info');
  } else {
    log('✅ 生产模式特性:', 'success');
    log('  - 代码压缩混淆', 'info');
    log('  - Tree Shaking', 'info');
    log('  - Scope Hoisting', 'info');
    log('  - 文件名带 hash', 'info');
  }
}

// 动态加载模块
async function loadDynamicModule() {
  log('开始动态加载模块...', 'info');
  
  try {
    // 动态 import
    const { multiply } = await import('./math.js');
    const result = multiply(6, 7);
    
    document.getElementById('output').innerHTML = 
      `<strong>动态加载成功！</strong><br>6 × 7 = ${result}`;
    
    log('✅ 动态模块加载成功', 'success');
    log(`计算结果: 6 × 7 = ${result}`, 'success');
  } catch (error) {
    log(`❌ 加载失败: ${error.message}`, 'error');
  }
}

// 打印日志
function printLogs() {
  log('这是一条普通日志', 'info');
  log('这是一条成功日志', 'success');
  log('这是一条警告日志', 'warning');
  
  document.getElementById('output').innerHTML = 
    '<strong>日志已输出到控制台，请查看下方控制台区域</strong>';
  
  // 生产模式下，console.log 可能会被移除
  console.log('这是 console.log（生产模式可能被移除）');
}

// 触发错误
function triggerError() {
  log('尝试触发错误...', 'warning');
  
  try {
    // 故意制造一个错误
    throw new Error('这是一个测试错误');
  } catch (error) {
    log(`❌ 捕获到错误: ${error.message}`, 'error');
    log('💡 提示：打开 Sources 面板，查看 Source Map 是否正确映射到源代码', 'info');
    
    document.getElementById('output').innerHTML = 
      `<strong style="color: #e74c3c;">错误: ${error.message}</strong><br>
       <small>查看 Sources 面板测试 Source Map</small>`;
  }
}

// 事件绑定
function setupEventListeners() {
  document.getElementById('btn-add').addEventListener('click', loadDynamicModule);
  document.getElementById('btn-log').addEventListener('click', printLogs);
  document.getElementById('btn-error').addEventListener('click', triggerError);
}

// 初始化
function init() {
  log('==========================================', 'info');
  displayBuildInfo();
  log('==========================================', 'info');
  setupEventListeners();
  log('✅ 应用初始化完成', 'success');
  log('💡 试试修改代码，体验 HMR（仅开发模式）', 'info');
}

// 启动应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// HMR（热模块替换）支持
if (module.hot) {
  module.hot.accept('./utils.js', () => {
    log('🔥 检测到 utils.js 更新，热替换成功！', 'success');
  });
  
  module.hot.accept('./date.js', () => {
    log('🔥 检测到 date.js 更新，热替换成功！', 'success');
    displayBuildInfo();
  });
}

