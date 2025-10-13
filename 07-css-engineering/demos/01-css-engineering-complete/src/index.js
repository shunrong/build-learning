// CSS 工程化完整示例
import './styles/global.css';
import { createButton } from './components/Button';
import { createCard } from './components/Card';

console.log('🎨 CSS 工程化 Demo 已加载');

// 创建应用
const app = document.getElementById('app');

// 添加标题
const title = document.createElement('h1');
title.textContent = '🎨 CSS 工程化完整示例';
title.className = 'app-title';
app.appendChild(title);

// 添加说明
const info = document.createElement('div');
info.className = 'info-box';
info.innerHTML = `
  <h2>✅ 本 Demo 演示的技术：</h2>
  <ul>
    <li><strong>CSS Modules</strong> - 局部作用域，避免样式冲突</li>
    <li><strong>PostCSS</strong> - Autoprefixer、嵌套语法、未来特性</li>
    <li><strong>Sass</strong> - 变量、嵌套、混入</li>
    <li><strong>CSS 优化</strong> - 提取、压缩、PurgeCSS</li>
  </ul>
  <p><strong>💡 提示：</strong>打开 DevTools → Sources 查看编译后的 CSS</p>
`;
app.appendChild(info);

// 演示 CSS Modules
const modulesSection = document.createElement('div');
modulesSection.className = 'section';
modulesSection.innerHTML = '<h2>1️⃣ CSS Modules 演示</h2>';

const button1 = createButton('Primary Button', 'primary');
const button2 = createButton('Secondary Button', 'secondary');
const button3 = createButton('Disabled Button', 'disabled');

modulesSection.appendChild(button1);
modulesSection.appendChild(button2);
modulesSection.appendChild(button3);
app.appendChild(modulesSection);

// 演示 CSS Modules 组合
const cardsSection = document.createElement('div');
cardsSection.className = 'section';
cardsSection.innerHTML = '<h2>2️⃣ CSS Modules composes 演示</h2>';

const card1 = createCard('标准卡片', '这是使用 CSS Modules composes 的卡片组件');
const card2 = createCard('强调卡片', '使用 composes 复用基础样式', true);

cardsSection.appendChild(card1);
cardsSection.appendChild(card2);
app.appendChild(cardsSection);

// 演示 PostCSS
const postcssSection = document.createElement('div');
postcssSection.className = 'section';
postcssSection.innerHTML = `
  <h2>3️⃣ PostCSS 特性演示</h2>
  <div class="postcss-demo">
    <div class="nested-box">
      <p>嵌套语法 (postcss-nested)</p>
    </div>
    <div class="prefixed-box">
      <p>自动前缀 (Autoprefixer)</p>
    </div>
  </div>
`;
app.appendChild(postcssSection);

console.log('✅ 页面渲染完成');
console.log('💡 打开 DevTools 查看：');
console.log('  • Network 面板 - 查看 CSS 文件');
console.log('  • Sources 面板 - 查看编译后的代码');
console.log('  • Elements 面板 - 查看生成的类名');

