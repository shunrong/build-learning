// Button 组件 - 演示 CSS Modules
import styles from './Button.module.css';

export function createButton(text, variant = 'primary') {
  const button = document.createElement('button');
  button.textContent = text;
  
  // CSS Modules 类名
  const classList = [styles.button];
  
  if (variant === 'primary') {
    classList.push(styles.primary);
  } else if (variant === 'secondary') {
    classList.push(styles.secondary);
  } else if (variant === 'disabled') {
    classList.push(styles.disabled);
    button.disabled = true;
  }
  
  button.className = classList.join(' ');
  
  button.addEventListener('click', () => {
    if (!button.disabled) {
      console.log(`${text} 被点击`);
      console.log('实际 className:', button.className);
      console.log('CSS Modules 生成的类名:', styles);
    }
  });
  
  return button;
}

