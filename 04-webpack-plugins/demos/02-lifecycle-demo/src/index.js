console.log('=== Webpack 生命周期演示 ===');
console.log('查看控制台输出，了解完整的编译流程');

// 模拟一些模块
import './utils';
import './module-a';
import './module-b';

document.getElementById('app').innerHTML = `
  <h2>✅ 编译成功</h2>
  <p>查看控制台输出的生命周期日志</p>
  <p>查看 <code>dist/lifecycle-log.txt</code> 文件</p>
`;

