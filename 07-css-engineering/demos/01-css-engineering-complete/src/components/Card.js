// Card 组件 - 演示 CSS Modules composes
import styles from './Card.module.css';

export function createCard(title, content, emphasized = false) {
  const card = document.createElement('div');
  card.className = emphasized ? styles.emphasizedCard : styles.card;
  
  card.innerHTML = `
    <h3 class="${styles.title}">${title}</h3>
    <p class="${styles.content}">${content}</p>
    <div class="${styles.footer}">
      <span class="${styles.badge}">${emphasized ? '强调' : '标准'}</span>
    </div>
  `;
  
  return card;
}

