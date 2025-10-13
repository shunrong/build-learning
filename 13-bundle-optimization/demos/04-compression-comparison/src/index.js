import { range, shuffle, sortBy, chunk } from 'lodash-es';
import './styles.css';

// 这些 console.log 在高级压缩中会被移除
console.log('=== 压缩方案对比 Demo ===');
console.info('本 Demo 演示不同压缩策略的效果');
console.debug('调试信息：初始化应用');

// 一些会被压缩的代码
function createApplication() {
  const app = document.getElementById('app');
  
  // 生成大量数据用于测试压缩效果
  const data = range(1, 201).map(i => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 1000),
    category: ['电子', '图书', '服装', '食品', '家居'][i % 5],
    description: `这是第 ${i} 个商品的详细描述，包含一些重复的文本用于测试压缩效果。压缩算法会识别这些重复模式。`,
    tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      author: 'System',
      version: '1.0.0'
    }
  }));

  console.log('数据生成完成:', data.length, '条记录');

  // 使用 lodash-es 处理数据
  const shuffled = shuffle([...data]);
  const sorted = sortBy(data, 'value');
  const chunked = chunk(data, 20);

  console.log('数据处理完成');
  console.log('- 随机排序:', shuffled.length);
  console.log('- 按值排序:', sorted.length);
  console.log('- 分组:', chunked.length, '组');

  // 渲染 UI
  renderUI(app, data, chunked);
}

function renderUI(container, data, chunkedData) {
  const html = `
    <div class="container">
      <header class="header">
        <h1>🗜️ 压缩方案对比 Demo</h1>
        <p>对比 5 种不同的压缩策略效果</p>
      </header>

      <div class="compression-levels">
        <div class="level-card">
          <h3>1. 未压缩</h3>
          <p class="description">原始代码，包含空格、注释、完整变量名</p>
          <ul>
            <li>保留所有格式</li>
            <li>保留所有注释</li>
            <li>保留所有 console.log</li>
            <li>可读性最好</li>
          </ul>
        </div>

        <div class="level-card">
          <h3>2. 基础压缩</h3>
          <p class="description">使用默认的 Terser 和 CSS Minifier</p>
          <ul>
            <li>移除空格和换行</li>
            <li>移除注释</li>
            <li>保留 console.log</li>
            <li>基础变量名混淆</li>
          </ul>
        </div>

        <div class="level-card">
          <h3>3. 高级压缩</h3>
          <p class="description">深度优化的压缩配置</p>
          <ul>
            <li>移除 console.log/info/debug</li>
            <li>深度变量名混淆</li>
            <li>多次传递优化 (passes: 2)</li>
            <li>内联函数</li>
          </ul>
        </div>

        <div class="level-card">
          <h3>4. Gzip 压缩</h3>
          <p class="description">高级压缩 + Gzip</p>
          <ul>
            <li>所有高级压缩优化</li>
            <li>生成 .gz 文件</li>
            <li>典型压缩率: 70-80%</li>
            <li>浏览器自动解压</li>
          </ul>
        </div>

        <div class="level-card">
          <h3>5. Brotli 压缩</h3>
          <p class="description">高级压缩 + Gzip + Brotli</p>
          <ul>
            <li>所有高级压缩优化</li>
            <li>生成 .gz 和 .br 文件</li>
            <li>Brotli 比 Gzip 再减少 15-20%</li>
            <li>现代浏览器支持</li>
          </ul>
        </div>
      </div>

      <div class="data-section">
        <h2>📊 测试数据（${data.length} 条记录）</h2>
        <div class="data-grid">
          ${chunkedData[0].map(item => `
            <div class="data-item">
              <h4>${item.name}</h4>
              <p class="category">${item.category}</p>
              <p class="value">¥${item.value}</p>
              <p class="description">${item.description}</p>
              <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <p class="more">显示前 20 项，共 ${data.length} 项</p>
      </div>

      <div class="tips">
        <h3>💡 运行对比测试</h3>
        <pre><code>npm run compare</code></pre>
        <p>自动构建所有版本并对比体积差异</p>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// 一些额外的函数用于增加代码量
function unusedFunction() {
  // 这个函数未被调用，在高级压缩中会被移除
  console.log('This function is never called');
  return 'unused';
}

function helperFunction(value) {
  // 这个函数会被内联
  return value * 2;
}

function anotherHelperFunction(a, b) {
  // 这个函数也会被内联
  return a + b;
}

// 一些重复的字符串常量（用于测试 Gzip/Brotli 压缩效果）
const REPEATED_TEXT = '这是一段重复的文本用于测试压缩效果。Gzip 和 Brotli 能够很好地压缩重复内容。';
const MORE_REPEATED_TEXT = '这是一段重复的文本用于测试压缩效果。Gzip 和 Brotli 能够很好地压缩重复内容。';
const EVEN_MORE_REPEATED_TEXT = '这是一段重复的文本用于测试压缩效果。Gzip 和 Brotli 能够很好地压缩重复内容。';

console.log(REPEATED_TEXT);
console.log(MORE_REPEATED_TEXT);
console.log(EVEN_MORE_REPEATED_TEXT);

// 初始化应用
createApplication();

console.log('✅ 应用初始化完成');
console.info('查看不同压缩版本的体积差异');

