// 导入样式
import './styles/main.css';

// 1. 导入 Markdown 文件（使用自定义 markdown-loader）
import readmeHtml from './content/demo.md';

// 2. 导入国际化文件（使用自定义 i18n-loader）
import messages from './locales/messages.i18n.json';

console.log('=== 自定义 Loader Demo ===');
console.log('✅ Markdown Loader 已加载');
console.log('✅ Banner Loader 已应用');
console.log('✅ Remove Console Loader 已配置');
console.log('✅ i18n Loader 已加载');

// 渲染 Markdown 内容
function renderMarkdown() {
  const container = document.getElementById('markdown-content');
  container.innerHTML = readmeHtml;
  console.log('📄 Markdown 内容已渲染');
}

// 显示源码
function showSource() {
  const btn = document.getElementById('show-source');
  const preview = document.getElementById('source-preview');
  
  btn.addEventListener('click', async () => {
    try {
      // 获取当前脚本内容
      const response = await fetch(document.scripts[0].src);
      const source = await response.text();
      
      // 显示前 50 行
      const lines = source.split('\n').slice(0, 50).join('\n');
      preview.textContent = lines + '\n\n... (更多内容请查看 Sources 面板)';
      preview.style.display = 'block';
      
      console.log('💡 提示：打开 Sources 面板查看完整的 Banner 注释');
    } catch (error) {
      preview.textContent = '无法获取源码，请打开 Sources 面板查看';
      preview.style.display = 'block';
    }
  });
}

// 测试 console.log 移除
function testConsoleRemove() {
  const btn = document.getElementById('test-console');
  const envInfo = document.getElementById('env-info');
  
  const isDev = process.env.NODE_ENV !== 'production';
  envInfo.textContent = isDev ? 'Development' : 'Production';
  
  btn.addEventListener('click', () => {
    console.log('这是一个测试 console.log');
    console.warn('这是一个测试 console.warn');
    console.info('这是一个测试 console.info');
    
    alert(
      isDev 
        ? '开发模式：console.log 会保留（查看控制台）'
        : '生产模式：console.log 会被移除（控制台应该没有输出）'
    );
  });
}

// 渲染国际化内容
function renderI18n() {
  const container = document.getElementById('i18n-content');
  
  function updateContent() {
    container.innerHTML = `
      <h3>${messages.title}</h3>
      <p>${messages.welcome}</p>
      <p>${messages.description}</p>
      <ul>
        <li>${messages.features.feature1}</li>
        <li>${messages.features.feature2}</li>
        <li>${messages.features.feature3}</li>
      </ul>
    `;
  }
  
  updateContent();
  
  // 注意：实际切换语言需要重新构建
  // 这里只是演示概念
  document.querySelectorAll('.btn-locale').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('💡 提示：切换语言需要修改 webpack.config.js 中的 locale 配置并重新构建');
    });
  });
  
  console.log('🌐 国际化内容已渲染');
  console.log('当前语言数据：', messages);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderMarkdown();
  showSource();
  testConsoleRemove();
  renderI18n();
  
  console.log('✅ Demo 初始化完成');
});

// HMR
if (module.hot) {
  module.hot.accept('./content/demo.md', () => {
    console.log('🔥 Markdown 热更新！');
    renderMarkdown();
  });
}

console.log('\n💡 提示：');
console.log('1. 查看 loaders/ 目录，了解自定义 Loader 实现');
console.log('2. 修改 demo.md 文件，观察热更新');
console.log('3. 运行 npm run build，观察生产环境的 console.log 移除');

