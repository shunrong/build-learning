// 首页入口文件
import '../../shared/styles.css';  // 导入样式
import { log, initPage } from '../../shared/utils.js';
import { createCounter } from '../../shared/components/counter.js';

log('🏠 首页加载完成', 'success');

// 初始化页面
initPage('首页');

// 计数器示例
let count = 0;

// 按钮事件
document.getElementById('btn-log').addEventListener('click', () => {
  log('这是来自首页的日志', 'info');
  log(`当前时间: ${new Date().toLocaleString()}`, 'info');
  document.getElementById('output').innerHTML = 
    '<strong>✅ 日志已输出到控制台</strong>';
});

document.getElementById('btn-count').addEventListener('click', () => {
  count++;
  const counterHtml = createCounter(count);
  document.getElementById('output').innerHTML = counterHtml;
  log(`计数器: ${count}`, 'success');
});

log('✅ 首页初始化完成', 'success');

