import { add, multiply } from './utils';
import { createDebouncedHandler, chunkArray } from './lodash-demo';
import './styles.css';

// 只使用 add 和 multiply，其他函数应该被 Tree Shaking 移除
const result1 = add(10, 20);
const result2 = multiply(5, 6);

// 使用 lodash-es 的函数
const debouncedLog = createDebouncedHandler((msg) => {
  console.log('Debounced:', msg);
}, 300);

const chunks = chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3);

// 创建 UI
function createUI() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container">
      <header class="header">
        <h1>🌳 Tree Shaking 实战 Demo</h1>
        <p>对比启用/未启用 Tree Shaking 的体积差异</p>
      </header>

      <div class="demo-section">
        <h2>1. 工具函数 Tree Shaking</h2>
        <div class="code-block">
          <code>
// utils.js 导出了 6 个函数<br/>
export function add() { ... }        // ✅ 使用了<br/>
export function multiply() { ... }   // ✅ 使用了<br/>
export function subtract() { ... }   // ❌ 未使用 → 被移除<br/>
export function divide() { ... }     // ❌ 未使用 → 被移除<br/>
export function power() { ... }      // ❌ 未使用 → 被移除<br/>
export class Calculator { ... }      // ❌ 未使用 → 被移除
          </code>
        </div>
        <div class="result">
          <p><strong>add(10, 20) =</strong> ${result1}</p>
          <p><strong>multiply(5, 6) =</strong> ${result2}</p>
        </div>
      </div>

      <div class="demo-section">
        <h2>2. Lodash-ES Tree Shaking</h2>
        <div class="code-block">
          <code>
// ✅ 按需导入（支持 Tree Shaking）<br/>
import { debounce, throttle, chunk } from 'lodash-es';<br/>
<br/>
// ❌ 完整导入（无法 Tree Shaking）<br/>
// import _ from 'lodash';  // 打包整个 lodash (70 KB)
          </code>
        </div>
        <div class="result">
          <p><strong>chunk([1,2,3,4,5,6,7,8], 3) =</strong></p>
          <pre>${JSON.stringify(chunks, null, 2)}</pre>
          <button id="debouncedBtn" class="btn">点击测试 Debounce (300ms)</button>
          <p id="debouncedResult" class="result-text"></p>
        </div>
      </div>

      <div class="demo-section">
        <h2>3. CSS Tree Shaking (PurgeCSS)</h2>
        <div class="code-block">
          <code>
/* styles.css 包含以下样式 */<br/>
.container { ... }        // ✅ 使用了<br/>
.header { ... }           // ✅ 使用了<br/>
.unused-style { ... }     // ❌ 未使用 → 被移除<br/>
.another-unused { ... }   // ❌ 未使用 → 被移除
          </code>
        </div>
      </div>

      <div class="comparison">
        <h2>📊 体积对比</h2>
        <div class="comparison-grid">
          <div class="comparison-item">
            <h3>未启用 Tree Shaking</h3>
            <div class="size-bar" style="width: 100%;">
              <span>100%</span>
            </div>
            <ul>
              <li>Babel 转为 CommonJS</li>
              <li>所有导出都保留</li>
              <li>lodash-es 无法优化</li>
              <li>未使用的 CSS 保留</li>
            </ul>
          </div>
          <div class="comparison-item">
            <h3>启用 Tree Shaking</h3>
            <div class="size-bar optimized" style="width: 35%;">
              <span>~35%</span>
            </div>
            <ul>
              <li>保留 ES Module</li>
              <li>移除未使用的导出</li>
              <li>lodash-es 按需打包</li>
              <li>PurgeCSS 移除未使用 CSS</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="tips">
        <h3>💡 运行对比测试</h3>
        <pre><code>npm run compare</code></pre>
        <p>自动构建两个版本并对比体积差异</p>
      </div>
    </div>
  `;

  // 添加事件监听
  const btn = document.getElementById('debouncedBtn');
  const resultText = document.getElementById('debouncedResult');
  let clickCount = 0;

  btn.addEventListener('click', () => {
    clickCount++;
    resultText.textContent = `等待中... (点击了 ${clickCount} 次)`;
    debouncedLog(`第 ${clickCount} 次点击`);
    
    setTimeout(() => {
      resultText.textContent = `Debounced 已执行 (最终点击: ${clickCount} 次)`;
    }, 350);
  });
}

// 初始化
createUI();

console.log('✅ Tree Shaking Demo 加载完成');
console.log('📦 查看构建产物，对比启用/未启用 Tree Shaking 的体积差异');

