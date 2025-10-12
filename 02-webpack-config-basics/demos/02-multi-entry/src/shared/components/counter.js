// 共享组件：计数器

export function createCounter(count) {
  return `
    <div style="text-align: center; padding: 20px;">
      <h2 style="font-size: 48px; color: #2196f3; margin: 0;">
        ${count}
      </h2>
      <p style="margin-top: 10px; color: #666;">
        当前计数
      </p>
    </div>
  `;
}

export function createButton(text, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.addEventListener('click', onClick);
  return btn;
}

