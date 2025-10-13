// Git Hooks 与自动化 Demo
import './styles.css';
import { createButton } from './components/button';
import { formatMessage, validateEmail } from './utils';

console.log('🎯 Git Hooks 与自动化 Demo 已加载');

// 创建应用
const app = document.getElementById('app');

// 标题
const title = document.createElement('h1');
title.textContent = '🎯 Git Hooks 与自动化 Demo';
app.appendChild(title);

// 说明
const info = document.createElement('div');
info.className = 'info-box';
info.innerHTML = `
  <h2>✅ 本 Demo 集成的工具：</h2>
  <ul>
    <li><strong>Husky</strong> - Git Hooks 管理</li>
    <li><strong>lint-staged</strong> - 暂存区文件检查</li>
    <li><strong>commitlint</strong> - 提交信息规范</li>
    <li><strong>ESLint + Prettier</strong> - 代码检查和格式化</li>
  </ul>
  <p><strong>💡 提示：</strong>尝试修改代码并提交，体验自动化检查！</p>
`;
app.appendChild(info);

// 演示区域
const section = document.createElement('div');
section.className = 'section';
section.innerHTML = '<h2>功能演示</h2>';

// 格式化消息按钮
const button1 = createButton('格式化消息', () => {
  const message = formatMessage('Hello', 'World');
  console.log('格式化后的消息:', message);
  alert(`格式化后的消息: ${message}`);
});

// 验证邮箱按钮
const button2 = createButton('验证邮箱', () => {
  const email = 'test@example.com';
  const isValid = validateEmail(email);
  console.log(`邮箱 ${email} 验证结果:`, isValid);
  alert(`邮箱 ${email} ${isValid ? '✅ 有效' : '❌ 无效'}`);
});

section.appendChild(button1);
section.appendChild(button2);
app.appendChild(section);

// Git Hooks 说明
const hooksInfo = document.createElement('div');
hooksInfo.className = 'hooks-info';
hooksInfo.innerHTML = `
  <h2>🎯 Git Hooks 工作流程</h2>
  
  <div class="hook-box">
    <h3>1️⃣ 提交代码</h3>
    <pre><code>git add .
git commit -m "feat: 添加新功能"</code></pre>
  </div>
  
  <div class="hook-box">
    <h3>2️⃣ pre-commit Hook</h3>
    <ul>
      <li>✅ lint-staged 检查暂存区文件</li>
      <li>✅ Prettier 自动格式化</li>
      <li>✅ ESLint 自动修复</li>
    </ul>
  </div>
  
  <div class="hook-box">
    <h3>3️⃣ commit-msg Hook</h3>
    <ul>
      <li>✅ commitlint 检查提交信息</li>
      <li>✅ 验证 Conventional Commits 规范</li>
    </ul>
  </div>
  
  <div class="hook-box success">
    <h3>✅ 检查通过 → 提交成功</h3>
  </div>
  
  <div class="hook-box error">
    <h3>❌ 检查失败 → 提交失败</h3>
  </div>
`;
app.appendChild(hooksInfo);

// 提交规范说明
const commitInfo = document.createElement('div');
commitInfo.className = 'commit-info';
commitInfo.innerHTML = `
  <h2>📝 Conventional Commits 规范</h2>
  
  <div class="commit-box">
    <h3>格式</h3>
    <pre><code>&lt;type&gt;: &lt;subject&gt;</code></pre>
  </div>
  
  <div class="commit-box">
    <h3>常用 Type</h3>
    <ul>
      <li><code>feat</code> - 新功能</li>
      <li><code>fix</code> - 修复 bug</li>
      <li><code>docs</code> - 文档</li>
      <li><code>style</code> - 格式</li>
      <li><code>refactor</code> - 重构</li>
      <li><code>test</code> - 测试</li>
      <li><code>chore</code> - 构建/工具</li>
    </ul>
  </div>
  
  <div class="commit-box">
    <h3>✅ 正确示例</h3>
    <pre><code>feat: 添加用户登录功能
fix: 修复按钮点击无响应
docs: 更新 README 文档
style: 格式化代码</code></pre>
  </div>
  
  <div class="commit-box error">
    <h3>❌ 错误示例</h3>
    <pre><code>添加登录功能  # 没有 type
update  # type 错误，subject 模糊
WIP  # 不符合规范</code></pre>
  </div>
`;
app.appendChild(commitInfo);

console.log('✅ 页面渲染完成');
console.log('💡 提示：修改代码后尝试提交，体验 Git Hooks 自动化检查！');

