console.log('=== 自定义 Plugin 演示 ===');
console.log('这条 console.log 在生产环境会被移除');

// 导入其他模块
import { greeting } from './utils';

console.log(greeting('Webpack'));

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 加载完成');
});

