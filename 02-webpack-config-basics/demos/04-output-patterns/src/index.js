// 主应用入口
import './styles.css';

console.log('📦 Main bundle 加载完成');

// 按钮点击事件
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn');
  const output = document.getElementById('output');
  
  if (btn && output) {
    btn.addEventListener('click', () => {
      output.innerHTML = `
        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 4px;">
          <strong>✅ 按钮被点击了！</strong><br>
          <small>时间: ${new Date().toLocaleTimeString()}</small>
        </div>
      `;
      
      console.log('按钮被点击');
    });
  }
});

// 这是主应用的代码
// 修改这里的代码，重新构建，观察 hash 变化
export function main() {
  console.log('主应用初始化');
}

main();

