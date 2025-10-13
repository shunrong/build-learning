// 按钮组件
export function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = 'demo-button';

  button.addEventListener('click', () => {
    console.log(`按钮"${text}"被点击`);
    if (onClick) {
      onClick();
    }
  });

  return button;
}

