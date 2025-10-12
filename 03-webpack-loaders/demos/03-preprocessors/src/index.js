// 导入 Sass 样式
import './styles/main.scss';
import './styles/sass-features.scss';

// 导入 Less 样式
import './styles/less-features.less';

// 导入普通 CSS（经过 PostCSS 处理）
import './styles/postcss-demo.css';

console.log('=== CSS 预处理器 Demo ===');
console.log('✅ Sass/SCSS 已加载');
console.log('✅ Less 已加载');
console.log('✅ PostCSS (Autoprefixer) 已配置');

// 打印 Loader 执行顺序
console.log('\n📊 Loader 执行顺序（从右到左）：');
console.log('1. sass-loader/less-loader (编译预处理器)');
console.log('2. postcss-loader (添加浏览器前缀)');
console.log('3. css-loader (解析 CSS)');
console.log('4. style-loader (注入 DOM)');

// HMR
if (module.hot) {
  module.hot.accept('./styles/main.scss', () => {
    console.log('🔥 Sass HMR 更新！');
  });
  
  module.hot.accept('./styles/less-features.less', () => {
    console.log('🔥 Less HMR 更新！');
  });
}

console.log('\n💡 提示：');
console.log('1. 修改 .scss 或 .less 文件，观察热更新');
console.log('2. 打开开发者工具，查看自动添加的浏览器前缀');
console.log('3. 运行 npm run build，查看生产环境的 CSS 提取');

