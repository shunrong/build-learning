// 关于页入口文件
import '../../shared/styles.css';  // 导入样式
import { log, initPage, getBuildInfo } from '../../shared/utils.js';

log('ℹ️ 关于页加载完成', 'success');

// 初始化页面
initPage('关于页');

// 按钮事件
document.getElementById('btn-info').addEventListener('click', () => {
  const info = getBuildInfo();
  
  const html = `
    <strong>📊 页面信息：</strong><br>
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li>页面名称: 关于页</li>
      <li>入口文件: src/pages/about/index.js</li>
      <li>构建模式: ${info.mode}</li>
      <li>Webpack 版本: ${info.version}</li>
    </ul>
  `;
  
  document.getElementById('output').innerHTML = html;
  log('显示页面信息', 'info');
});

document.getElementById('btn-shared').addEventListener('click', () => {
  log('调用共享工具模块', 'info');
  log('这些工具函数被多个页面共享', 'success');
  log('生产模式下会被提取到 common.js', 'warning');
  
  document.getElementById('output').innerHTML = 
    '<strong>✅ 共享模块调用成功</strong><br>' +
    '<small>查看控制台输出，观察共享模块的使用</small>';
});

log('✅ 关于页初始化完成', 'success');

