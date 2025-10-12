// ===== Vanilla JS HMR 演示 =====

// 配置对象（可以修改这里来测试 HMR）
export const config = {
  title: '原生 JS 模块',
  description: '这个模块演示了如何使用 module.hot API',
  count: 0,
  color: '#667eea'
};

// 模块状态
let currentCount = 0;

// 渲染函数
export function render() {
  const container = document.getElementById('vanilla-demo');
  if (!container) return;
  
  container.innerHTML = `
    <div class="vanilla-container">
      <h3>${config.title}</h3>
      <p>${config.description}</p>
      <div class="vanilla-counter">
        <button id="vanilla-dec">-</button>
        <span id="vanilla-count" style="color: ${config.color}">${currentCount}</span>
        <button id="vanilla-inc">+</button>
      </div>
      <p class="vanilla-hint">💡 修改 <code>vanilla-js-demo.js</code> 中的 config，观察状态保持</p>
    </div>
  `;
  
  // 绑定事件
  document.getElementById('vanilla-dec')?.addEventListener('click', () => {
    currentCount--;
    updateCount();
  });
  
  document.getElementById('vanilla-inc')?.addEventListener('click', () => {
    currentCount++;
    updateCount();
  });
  
  console.log('🛠️ Vanilla JS 模块已渲染，当前计数:', currentCount);
}

// 更新计数显示
function updateCount() {
  const countEl = document.getElementById('vanilla-count');
  if (countEl) {
    countEl.textContent = currentCount;
    console.log('🔢 计数更新:', currentCount);
  }
}

// HMR 处理
if (module.hot) {
  console.log('🔥 Vanilla JS 模块支持 HMR');
  
  // 保存状态
  module.hot.dispose(data => {
    data.count = currentCount;
    console.log('💾 保存状态:', data.count);
  });
  
  // 接受更新
  module.hot.accept(() => {
    console.log('✅ Vanilla JS 模块已更新');
    
    // 恢复状态
    const data = module.hot.data;
    if (data && data.count !== undefined) {
      currentCount = data.count;
      console.log('♻️ 恢复状态:', currentCount);
    }
    
    // 重新渲染
    render();
  });
}

// 初始化
setTimeout(() => {
  render();
}, 100);

