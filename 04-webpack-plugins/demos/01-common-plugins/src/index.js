// 导入样式
import './styles/main.css';

console.log('=== 常用 Plugin 演示 ===');

// 1. DefinePlugin 注入的全局常量
console.log('环境变量:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  VERSION:', __VERSION__);
console.log('  BUILD_TIME:', __BUILD_TIME__);

// 2. 显示环境信息
document.getElementById('env').textContent = process.env.NODE_ENV;
document.getElementById('version').textContent = __VERSION__;
document.getElementById('build_time').textContent = __BUILD_TIME__;

// 3. 获取 CSS 文件名（生产环境）
const cssLink = document.querySelector('link[rel="stylesheet"]');
if (cssLink) {
  const cssFilename = cssLink.href.split('/').pop();
  document.getElementById('css-filename').textContent = cssFilename;
} else {
  document.getElementById('css-filename').textContent = '开发模式（style-loader 注入）';
}

// 4. 检查 public 目录文件
document.getElementById('check-public').addEventListener('click', async () => {
  const publicFiles = document.getElementById('public-files');
  
  try {
    // 尝试访问复制的文件
    const response = await fetch('/public/test.txt');
    if (response.ok) {
      const content = await response.text();
      publicFiles.innerHTML = `
        <div class="success">
          ✅ 找到 /public/test.txt
          <pre>${content}</pre>
        </div>
      `;
    }
  } catch (error) {
    publicFiles.innerHTML = `
      <div class="error">
        ❌ 未找到 public 文件，请确保运行了构建
      </div>
    `;
  }
});

// 5. 输出构建信息
console.log('\n📦 构建配置：');
console.log('  - HtmlWebpackPlugin: 自动生成 HTML');
console.log('  - MiniCssExtractPlugin:', process.env.NODE_ENV === 'production' ? '提取 CSS' : '注入 CSS');
console.log('  - CopyWebpackPlugin: 复制 public 目录');
console.log('  - DefinePlugin: 注入环境变量');
console.log('  - BundleAnalyzerPlugin: 运行 npm run analyze 查看');

// 6. HMR
if (module.hot) {
  module.hot.accept('./styles/main.css', () => {
    console.log('🔥 CSS 热更新！');
  });
}

