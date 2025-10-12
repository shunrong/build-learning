// 导入样式
import './styles/main.css';

// 1. asset/resource: 导入大图片（输出文件）
import largeImage1 from './assets/images/large-1.jpg';
import largeImage2 from './assets/images/large-2.jpg';

// 2. asset/source: 导入 SVG 图标（作为源代码）
import iconHome from './assets/icons/home.svg';
import iconUser from './assets/icons/user.svg';
import iconSettings from './assets/icons/settings.svg';
import iconSearch from './assets/icons/search.svg';

// 3. asset/source: 导入文本文件
import readmeText from './assets/data/readme.txt';

console.log('=== 资源路径信息 ===');
console.log('Large Image 1 (asset/resource):', largeImage1);
console.log('Large Image 2 (asset/resource):', largeImage2);
console.log('Icon Home (asset/source):', iconHome.substring(0, 50) + '...');
console.log('README Text (asset/source):', readmeText);

// 渲染大图片
function renderLargeImages() {
  const container1 = document.getElementById('large-image-1');
  const container2 = document.getElementById('large-image-2');
  
  const img1 = document.createElement('img');
  img1.src = largeImage1;
  img1.alt = 'Large Image 1';
  container1.appendChild(img1);
  
  const img2 = document.createElement('img');
  img2.src = largeImage2;
  img2.alt = 'Large Image 2';
  container2.appendChild(img2);
  
  console.log('✅ 大图片渲染完成（asset/resource）');
}

// 渲染 SVG 图标
function renderIcons() {
  const container = document.getElementById('icon-container');
  
  const icons = [
    { svg: iconHome, name: 'Home' },
    { svg: iconUser, name: 'User' },
    { svg: iconSettings, name: 'Settings' },
    { svg: iconSearch, name: 'Search' }
  ];
  
  icons.forEach(({ svg, name }) => {
    const iconItem = document.createElement('div');
    iconItem.className = 'icon-item';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'icon';
    iconDiv.innerHTML = svg;
    
    const nameP = document.createElement('p');
    nameP.textContent = name;
    
    iconItem.appendChild(iconDiv);
    iconItem.appendChild(nameP);
    container.appendChild(iconItem);
  });
  
  console.log('✅ SVG 图标渲染完成（asset/source）');
}

// 渲染文本内容
function renderText() {
  const container = document.getElementById('text-content');
  container.textContent = readmeText;
  
  console.log('✅ 文本内容渲染完成（asset/source）');
}

// 显示资源信息
function showResourceInfo() {
  const output = document.getElementById('info-output');
  
  const info = `
<div class="info-box">
  <h3>资源类型对比</h3>
  
  <h4>1. asset/resource（输出文件）</h4>
  <pre>${largeImage1}</pre>
  <p>✅ 适合：大图片、视频等</p>
  <p>📦 特点：独立文件，并行加载，可缓存</p>
  
  <h4>2. asset/inline（base64）</h4>
  <pre>${iconHome.substring(0, 80)}...</pre>
  <p>✅ 适合：小图标、小图片</p>
  <p>📦 特点：内联到 bundle，减少 HTTP 请求</p>
  
  <h4>3. asset（自动选择）</h4>
  <p>📊 阈值：8KB</p>
  <p>&lt; 8KB → asset/inline</p>
  <p>≥ 8KB → asset/resource</p>
  
  <h4>4. asset/source（源码）</h4>
  <pre>${readmeText.substring(0, 80)}...</pre>
  <p>✅ 适合：文本文件、模板</p>
  <p>📦 特点：作为字符串导入</p>
</div>
  `;
  
  output.innerHTML = info;
  console.log('📊 资源信息已显示');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderLargeImages();
  renderIcons();
  renderText();
  
  const btn = document.getElementById('show-info');
  btn.addEventListener('click', showResourceInfo);
  
  console.log('✅ Demo 初始化完成');
});

// HMR
if (module.hot) {
  module.hot.accept('./styles/main.css', () => {
    console.log('CSS 热更新！');
  });
}

