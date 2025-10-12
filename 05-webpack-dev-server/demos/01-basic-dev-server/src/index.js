import './styles.css';

// 计数器状态
let count = 0;

// DOM 元素
const counterDisplay = document.getElementById('counter');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const fetchBtn = document.getElementById('fetchBtn');
const dataDisplay = document.getElementById('dataDisplay');

// 更新计数器显示
function updateCounter() {
  counterDisplay.textContent = count;
  console.log('🔢 计数器更新:', count);
}

// 增加计数
incrementBtn.addEventListener('click', () => {
  count++;
  updateCounter();
});

// 减少计数
decrementBtn.addEventListener('click', () => {
  count--;
  updateCounter();
});

// 加载静态文件
fetchBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/static/data.json');
    const data = await response.json();
    dataDisplay.textContent = JSON.stringify(data, null, 2);
    console.log('📦 静态文件加载成功:', data);
  } catch (error) {
    dataDisplay.textContent = `错误: ${error.message}`;
    console.error('❌ 静态文件加载失败:', error);
  }
});

// 页面加载完成
console.log('✅ 页面已加载完成');
console.log('🔧 Webpack Dev Server 运行中');
console.log('💡 提示：修改代码后观察页面变化');

// 显示开发服务器信息
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 开发环境');
  console.log('🔥 HMR 已启用');
}

