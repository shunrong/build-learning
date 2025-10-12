import './styles.css';

console.log('✅ 应用已加载');
console.log('🔍 查看网络面板观察 WebSocket 连接');

// 计数器功能
let count = 0;
const counter = document.getElementById('counter');
const incrementBtn = document.getElementById('incrementBtn');

incrementBtn?.addEventListener('click', () => {
  count++;
  counter.textContent = count;
  console.log(`🔢 计数器s更新1: ${count}`);
});

// WebSocket 状态显示
const wsStatus = document.getElementById('wsStatus');
const wsStatusText = document.getElementById('wsStatusText');

// 检测 WebSocket 连接
setTimeout(() => {
  // 等待 WebSocket 建立连接
  const checkConnection = setInterval(() => {
    // WebSocket 会在注入的脚本中创建
    if (window.WebSocket) {
      wsStatus.classList.add('connected');
      wsStatusText.textContent = '已连接';
      clearInterval(checkConnection);
    }
  }, 100);
}, 500);

// 显示加载时间
const loadTime = performance.now();
console.log(`⏱️  页面加载时间: ${Math.round(loadTime)}ms`);

// 测试数据
console.log('📊 当前环境信息:');
console.log('  - 模式: 开发模式');
console.log('  - HMR: CSS 支持，JS 降级为 Live Reload');
console.log('  - WebSocket: 实时通信');

