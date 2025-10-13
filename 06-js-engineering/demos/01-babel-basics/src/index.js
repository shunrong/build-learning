// Babel 基础配置 Demo
// 本文件演示了 Babel 如何转译 ES6+ 语法

// =============================================================================
// 1. 箭头函数
// =============================================================================
const greeting = (name) => `Hello, ${name}!`;

window.testArrowFunction = () => {
  const result = greeting('Babel');
  const resultDiv = document.getElementById('arrow-result');
  resultDiv.innerHTML = `<div class="result">
    <strong>执行结果：</strong>${result}<br>
    <strong>函数类型：</strong>${typeof greeting}<br>
    <strong>说明：</strong>箭头函数被 Babel 转换为普通函数（在老浏览器中）
  </div>`;
  
  console.log('✅ 箭头函数测试：', result);
};

// =============================================================================
// 2. 类（Class）
// =============================================================================
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  introduce() {
    return `我叫 ${this.name}，今年 ${this.age} 岁`;
  }
  
  // 静态方法
  static species() {
    return 'Homo sapiens';
  }
}

window.testClass = () => {
  const person = new Person('张三', 25);
  const intro = person.introduce();
  const species = Person.species();
  
  const resultDiv = document.getElementById('class-result');
  resultDiv.innerHTML = `<div class="result">
    <strong>实例方法：</strong>${intro}<br>
    <strong>静态方法：</strong>${species}<br>
    <strong>说明：</strong>Class 被转换为构造函数 + 原型方法
  </div>`;
  
  console.log('✅ Class 测试：', intro, species);
};

// =============================================================================
// 3. 解构赋值
// =============================================================================
const testDestructuringData = {
  name: '李四',
  age: 30,
  city: '北京'
};

window.testDestructuring = () => {
  // 对象解构
  const { name, age, city = '未知' } = testDestructuringData;
  
  // 数组解构
  const numbers = [1, 2, 3, 4, 5];
  const [first, second, ...rest] = numbers;
  
  const resultDiv = document.getElementById('destructuring-result');
  resultDiv.innerHTML = `<div class="result">
    <strong>对象解构：</strong>name=${name}, age=${age}, city=${city}<br>
    <strong>数组解构：</strong>first=${first}, second=${second}, rest=[${rest}]<br>
    <strong>说明：</strong>解构被转换为普通的变量赋值
  </div>`;
  
  console.log('✅ 解构赋值测试：', { name, age }, { first, second, rest });
};

// =============================================================================
// 4. 展开运算符
// =============================================================================
window.testSpread = () => {
  // 对象展开
  const obj1 = { a: 1, b: 2 };
  const obj2 = { c: 3, d: 4 };
  const merged = { ...obj1, ...obj2, e: 5 };
  
  // 数组展开
  const arr1 = [1, 2, 3];
  const arr2 = [4, 5, 6];
  const combined = [...arr1, ...arr2];
  
  const resultDiv = document.getElementById('spread-result');
  resultDiv.innerHTML = `<div class="result">
    <strong>对象展开：</strong>${JSON.stringify(merged)}<br>
    <strong>数组展开：</strong>[${combined}]<br>
    <strong>说明：</strong>展开运算符被转换为 Object.assign 或数组方法
  </div>`;
  
  console.log('✅ 展开运算符测试：', merged, combined);
};

// =============================================================================
// 5. 可选链（Optional Chaining）和空值合并（Nullish Coalescing）
// =============================================================================
window.testOptionalChaining = () => {
  const user1 = {
    profile: {
      name: '王五'
    }
  };
  
  const user2 = {};
  
  // 可选链
  const name1 = user1?.profile?.name;
  const name2 = user2?.profile?.name;
  
  // 空值合并
  const count1 = 0;
  const count2 = null;
  const result1 = count1 ?? 10;  // 0（0 不是 null/undefined）
  const result2 = count2 ?? 10;  // 10（null 被替换）
  
  const resultDiv = document.getElementById('optional-result');
  resultDiv.innerHTML = `<div class="result">
    <strong>可选链：</strong>name1=${name1}, name2=${name2}<br>
    <strong>空值合并：</strong>result1=${result1}, result2=${result2}<br>
    <strong>说明：</strong>可选链避免了深层属性访问报错，空值合并只替换 null/undefined
  </div>`;
  
  console.log('✅ 可选链和空值合并测试：', { name1, name2, result1, result2 });
};

// =============================================================================
// 6. Async/Await
// =============================================================================
// 模拟异步数据获取
const mockFetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: '模拟数据', timestamp: Date.now() });
    }, 1000);
  });
};

window.testAsync = async () => {
  const resultDiv = document.getElementById('async-result');
  resultDiv.innerHTML = `<div class="result">⏳ 加载中...</div>`;
  
  try {
    const data = await mockFetchData();
    resultDiv.innerHTML = `<div class="result">
      <strong>异步数据：</strong>${JSON.stringify(data)}<br>
      <strong>说明：</strong>async/await 被转换为 Promise + 生成器函数
    </div>`;
    console.log('✅ Async/Await 测试：', data);
  } catch (error) {
    resultDiv.innerHTML = `<div class="result">❌ 错误：${error.message}</div>`;
    console.error('❌ Async/Await 错误：', error);
  }
};

// =============================================================================
// 7. 其他 ES6+ 特性
// =============================================================================

// 模板字符串
const templateString = `多行
字符串
支持 ${new Date().getFullYear()} 年`;

// 默认参数
const greet = (name = 'Guest', greeting = 'Hello') => {
  return `${greeting}, ${name}!`;
};

// 剩余参数
const sum = (...numbers) => {
  return numbers.reduce((total, num) => total + num, 0);
};

// for...of 循环
const iterableTest = () => {
  const arr = [10, 20, 30];
  let total = 0;
  for (const num of arr) {
    total += num;
  }
  return total;
};

// =============================================================================
// 控制台输出
// =============================================================================
console.log('🎉 Babel 基础配置 Demo 已加载');
console.log('📌 本 Demo 演示的 ES6+ 特性：');
console.log('  1. 箭头函数');
console.log('  2. Class 类');
console.log('  3. 解构赋值');
console.log('  4. 展开运算符');
console.log('  5. 可选链 & 空值合并');
console.log('  6. Async/Await');
console.log('  7. 模板字符串、默认参数、剩余参数等');
console.log('');
console.log('💡 提示：');
console.log('  • 打开 Sources 面板，查看转译后的代码');
console.log('  • 点击页面中的按钮，测试各个特性');
console.log('  • 查看 babel.config.js，了解 Babel 配置');
console.log('');
console.log('🔍 转译示例：');
console.log('源代码：', greeting.toString());
console.log('已被 Babel 转译为兼容老浏览器的代码');

// 自动测试所有功能（可选）
if (process.env.NODE_ENV === 'development') {
  console.log('');
  console.log('🚀 开发模式 - 自动运行所有测试：');
  setTimeout(() => {
    console.log('');
    testArrowFunction();
    testClass();
    testDestructuring();
    testSpread();
    testOptionalChaining();
    testAsync();
    
    console.log('');
    console.log('✅ 所有测试完成！');
    console.log('💡 你还可以手动点击按钮重新测试');
  }, 500);
}

