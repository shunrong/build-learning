import './index.css';
import '../../common/common.css';

console.log('📄 仪表盘页已加载');

// 计算页面加载时间
window.addEventListener('load', () => {
  const loadTime = performance.now();
  document.getElementById('load-time').textContent = Math.round(loadTime);
  console.log(`⏱️ 页面加载时间: ${Math.round(loadTime)}ms`);
});

// 当前页面标识
document.getElementById('current-page').textContent = '仪表盘 (dashboard.html)';

// 模拟数据加载
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.round(current).toLocaleString();
  }, 16);
}

// 加载统计数据
setTimeout(() => {
  animateValue(document.getElementById('totalUsers'), 0, 12847, 1000);
  animateValue(document.getElementById('pageViews'), 0, 89234, 1000);
  document.getElementById('avgTime').textContent = '4m 32s';
  document.getElementById('revenue').textContent = '¥128,456';
}, 500);

// 加载访问记录
const visits = [
  { time: '14:32:18', page: '首页', user: '张三', duration: '2m 15s' },
  { time: '14:30:45', page: '关于页', user: '李四', duration: '1m 42s' },
  { time: '14:28:33', page: '联系页', user: '王五', duration: '3m 08s' },
  { time: '14:25:12', page: '仪表盘', user: '赵六', duration: '5m 23s' },
  { time: '14:22:06', page: '首页', user: '孙七', duration: '1m 56s' }
];

setTimeout(() => {
  const tbody = document.getElementById('visitsTable');
  tbody.innerHTML = visits.map(visit => `
    <tr>
      <td>${visit.time}</td>
      <td>${visit.page}</td>
      <td>${visit.user}</td>
      <td>${visit.duration}</td>
    </tr>
  `).join('');
}, 800);

// 更新时间
function updateTime() {
  const now = new Date();
  document.getElementById('updateTime').textContent = 
    now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

updateTime();
setInterval(updateTime, 1000);

console.log('✅ 仪表盘 JavaScript 已执行');

