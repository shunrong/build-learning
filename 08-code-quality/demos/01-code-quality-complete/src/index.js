// 代码质量工程化 Demo
import './styles.css';
import { createButton } from './components/button';
import { formatDate, calculateTotal } from './utils';

console.log('🔍 代码质量工程化 Demo 已加载');

// 创建应用
const app = document.getElementById('app');

// 标题
const title = document.createElement('h1');
title.textContent = '🔍 代码质量工程化 Demo';
app.appendChild(title);

// 说明
const info = document.createElement('div');
info.className = 'info-box';
info.innerHTML = `
  <h2>✅ 本 Demo 集成的工具：</h2>
  <ul>
    <li><strong>ESLint</strong> - JavaScript 代码检查（Airbnb 规范）</li>
    <li><strong>Prettier</strong> - 代码自动格式化</li>
    <li><strong>Stylelint</strong> - CSS 代码检查</li>
  </ul>
  <p><strong>💡 提示：</strong>打开控制台查看 Lint 信息</p>
`;
app.appendChild(info);

// 演示区域
const section = document.createElement('div');
section.className = 'section';
section.innerHTML = '<h2>功能演示</h2>';

// 添加按钮
const button1 = createButton('测试按钮', () => {
  const now = new Date();
  console.log('当前时间:', formatDate(now));
});

const button2 = createButton('计算总价', () => {
  const items = [
    { name: '商品1', price: 100 },
    { name: '商品2', price: 200 },
    { name: '商品3', price: 300 },
  ];
  const total = calculateTotal(items);
  console.log('总价:', total);
});

section.appendChild(button1);
section.appendChild(button2);
app.appendChild(section);

// 代码质量检查说明
const lintInfo = document.createElement('div');
lintInfo.className = 'lint-info';
lintInfo.innerHTML = `
  <h2>🔍 代码质量检查</h2>
  <div class="lint-box">
    <h3>ESLint</h3>
    <ul>
      <li>✅ 使用 Airbnb 规范</li>
      <li>✅ 集成 Prettier</li>
      <li>✅ 开发时显示警告</li>
      <li>✅ 生产环境严格检查</li>
    </ul>
  </div>
  
  <div class="lint-box">
    <h3>Prettier</h3>
    <ul>
      <li>✅ 自动格式化代码</li>
      <li>✅ 统一代码风格</li>
      <li>✅ 与 ESLint 集成</li>
      <li>✅ 保存时自动格式化</li>
    </ul>
  </div>
  
  <div class="lint-box">
    <h3>Stylelint</h3>
    <ul>
      <li>✅ CSS 代码检查</li>
      <li>✅ 规范 CSS 风格</li>
      <li>✅ 自动修复问题</li>
      <li>✅ Webpack 集成</li>
    </ul>
  </div>
`;
app.appendChild(lintInfo);

console.log('✅ 页面渲染完成');
console.log('💡 运行命令：');
console.log('  • npm run lint - 检查所有代码');
console.log('  • npm run lint:fix - 自动修复问题');
console.log('  • npm run format - 格式化所有代码');
