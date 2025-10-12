// 共享工具函数

export function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

export function displayInfo(pageName, info) {
  const content = document.getElementById('content');
  if (!content) return;
  
  const html = `
    <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h3>📊 页面信息</h3>
      <ul>
        <li><strong>页面名称:</strong> ${pageName}</li>
        <li><strong>描述:</strong> ${info.description}</li>
        <li><strong>特性:</strong>
          <ul>
            ${info.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </li>
        <li><strong>构建模式:</strong> ${process.env.NODE_ENV}</li>
      </ul>
    </div>
  `;
  
  content.innerHTML = html;
  log(`显示 ${pageName} 信息`);
}

