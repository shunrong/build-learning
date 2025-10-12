// 1. 导入普通 CSS
import './styles/main.css';
import './styles/layout.css';

// 2. 导入 CSS Modules
import buttonStyles from './styles/Button.module.css';
import cardStyles from './styles/Card.module.css';

console.log('=== CSS Modules 类名映射 ===');
console.log('Button styles:', buttonStyles);
console.log('Card styles:', cardStyles);

// 3. 使用 CSS Modules
function createModulesDemo() {
  const container = document.getElementById('modules-container');
  
  // 创建卡片
  const card = document.createElement('div');
  card.className = cardStyles.card;
  
  const cardHeader = document.createElement('div');
  cardHeader.className = cardStyles.header;
  cardHeader.textContent = 'CSS Modules 卡片';
  
  const cardBody = document.createElement('div');
  cardBody.className = cardStyles.body;
  cardBody.innerHTML = `
    <p>类名被哈希化，避免全局污染</p>
    <p>实际类名：<code>${cardStyles.card}</code></p>
  `;
  
  const cardFooter = document.createElement('div');
  cardFooter.className = cardStyles.footer;
  
  // 创建按钮
  const primaryBtn = document.createElement('button');
  primaryBtn.className = `${buttonStyles.button} ${buttonStyles.primary}`;
  primaryBtn.textContent = '主要按钮';
  primaryBtn.onclick = () => alert('点击了主要按钮');
  
  const secondaryBtn = document.createElement('button');
  secondaryBtn.className = `${buttonStyles.button} ${buttonStyles.secondary}`;
  secondaryBtn.textContent = '次要按钮';
  secondaryBtn.onclick = () => alert('点击了次要按钮');
  
  cardFooter.appendChild(primaryBtn);
  cardFooter.appendChild(secondaryBtn);
  
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);
  
  container.appendChild(card);
}

// 4. 初始化
createModulesDemo();

// 5. HMR 支持
if (module.hot) {
  module.hot.accept('./styles/main.css', () => {
    console.log('CSS 热更新！');
  });
  
  module.hot.accept('./styles/Button.module.css', () => {
    console.log('Button CSS Modules 热更新！');
    location.reload();
  });
}

console.log('✅ CSS Loader Demo 已加载');
console.log('💡 提示：修改 CSS 文件，观察热更新效果');

