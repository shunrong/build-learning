import './index.css';
import '../../common/common.css';

console.log('📄 首页已加载');

// 计算页面加载时间
window.addEventListener('load', () => {
  const loadTime = performance.now();
  document.getElementById('load-time').textContent = Math.round(loadTime);
  console.log(`⏱️ 页面加载时间: ${Math.round(loadTime)}ms`);
});

// 当前页面标识
document.getElementById('current-page').textContent = '首页 (index.html)';

// 页面交互示例
console.log('✅ 首页 JavaScript 已执行');
console.log('💡 提示：点击导航栏切换到其他页面');

