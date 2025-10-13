// Source Map 实战 Demo
import { add, subtract } from './utils';
import { fetchData } from './api';

console.log('🎉 Source Map Demo 已加载');
console.log('💡 提示：打开 DevTools → Sources 面板查看源码映射');

// 正常函数
window.normalFunction = () => {
  const result = add(10, 20);
  console.log('✅ 计算结果:', result);
  console.log('📍 在 DevTools 中可以看到这行代码的源文件位置');
};

// 触发错误
window.triggerError = () => {
  console.log('⚠️  准备触发错误...');
  try {
    // 故意访问不存在的属性
    const obj = null;
    console.log(obj.property);  // 这里会报错
  } catch (error) {
    console.error('❌ 捕获到错误:');
    console.error('  错误信息:', error.message);
    console.error('  错误堆栈:', error.stack);
    console.log('');
    console.log('💡 观察堆栈中的文件位置：');
    console.log('  • 如果有 Source Map，会显示：src/index.js:行号');
    console.log('  • 如果没有 Source Map，会显示：bundle.js:行号');
  }
};

// 异步错误
window.asyncError = async () => {
  console.log('⚠️  准备触发异步错误...');
  try {
    await fetchData();
  } catch (error) {
    console.error('❌ 异步错误:');
    console.error('  错误信息:', error.message);
    console.error('  错误堆栈:', error.stack);
    console.log('');
    console.log('💡 异步错误的堆栈也能正确映射到源码位置');
  }
};

// 复杂调用栈
window.complexStack = () => {
  console.log('🔍 测试复杂调用栈...');
  
  function level1() {
    console.log('Level 1');
    level2();
  }
  
  function level2() {
    console.log('Level 2');
    level3();
  }
  
  function level3() {
    console.log('Level 3');
    debugger;  // 断点
    console.log('💡 在 debugger 处暂停，查看调用栈');
    console.log('   每层调用都能看到源码位置');
  }
  
  level1();
};

// 自动测试
console.log('');
console.log('🚀 自动运行正常函数测试：');
normalFunction();
console.log('');
console.log('💡 点击按钮测试错误处理和 Source Map 效果');

