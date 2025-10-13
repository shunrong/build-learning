// 模块化最佳实践 Demo
// 演示 ES Module、Tree Shaking、动态 import

console.log('🎉 模块化最佳实践 Demo 已加载');

// ===== Tree Shaking 演示 =====
// 只导入使用的函数，未使用的会被 Tree Shaking 删除
import { add, multiply } from './math';  // subtract 和 divide 不会被打包

window.testTreeShaking = () => {
  const sum = add(10, 20);
  const product = multiply(5, 6);
  
  const result = document.getElementById('tree-shaking-result');
  result.innerHTML = `<div class="info">
    <strong>✅ Tree Shaking 测试</strong><br>
    add(10, 20) = ${sum}<br>
    multiply(5, 6) = ${product}<br>
    <strong>说明：</strong>subtract 和 divide 函数未使用，已被 Tree Shaking 删除
  </div>`;
  
  console.log('✅ Tree Shaking 测试:', { sum, product });
  console.log('💡 运行 npm run build，查看 dist/main.js');
  console.log('   你会发现 subtract 和 divide 函数不在打包文件中');
};

// ===== 动态 import 演示 =====
window.testDynamicImport = async () => {
  const result = document.getElementById('dynamic-result');
  result.innerHTML = `<div class="info">⏳ 加载中...</div>`;
  
  try {
    console.log('📦 开始动态加载 heavy-module...');
    
    // 动态 import - 代码分割
    const module = await import(
      /* webpackChunkName: "heavy-module" */
      './heavy-module'
    );
    
    const data = module.processData([1, 2, 3, 4, 5]);
    
    result.innerHTML = `<div class="info">
      <strong>✅ 动态加载成功</strong><br>
      处理结果: [${data}]<br>
      <strong>说明：</strong>heavy-module 被单独打包为一个 chunk，按需加载
    </div>`;
    
    console.log('✅ 动态 import 成功:', data);
    console.log('💡 查看 Network 面板，可以看到 heavy-module.chunk.js 的加载');
  } catch (error) {
    console.error('❌ 动态 import 失败:', error);
    result.innerHTML = `<div class="info">❌ 加载失败: ${error.message}</div>`;
  }
};

// 自动测试
console.log('🚀 自动运行 Tree Shaking 测试：');
testTreeShaking();

