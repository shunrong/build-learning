import './index.css';
import '../../common/common.css';

console.log('📄 关于页已加载');

// 计算页面加载时间
window.addEventListener('load', () => {
  const loadTime = performance.now();
  document.getElementById('load-time').textContent = Math.round(loadTime);
  console.log(`⏱️ 页面加载时间: ${Math.round(loadTime)}ms`);
});

// 当前页面标识
document.getElementById('current-page').textContent = '关于页 (about.html)';

console.log('✅ 关于页 JavaScript 已执行');

