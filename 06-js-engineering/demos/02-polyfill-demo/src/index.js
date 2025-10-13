// Polyfill 方案对比 Demo
// 本文件使用了多种 ES6+ API，需要 Polyfill 支持

console.log('🎉 Polyfill Demo 已加载');
console.log('📌 本 Demo 使用的 ES6+ API：');
console.log('  - Promise');
console.log('  - Array: includes, find, findIndex, flat');
console.log('  - Object: assign, entries, values');
console.log('  - String: includes, padStart, repeat');
console.log('  - Map, Set');
console.log('');

// =============================================================================
// 1. Promise 测试
// =============================================================================
window.testPromise = () => {
  const resultDiv = document.getElementById('promise-result');
  resultDiv.innerHTML = '<div class="result">⏳ 测试中...</div>';
  
  // 测试 Promise
  Promise.resolve(42)
    .then(value => {
      console.log('✅ Promise 测试成功:', value);
      return value * 2;
    })
    .then(doubled => {
      resultDiv.innerHTML = `<div class="result">
        <strong>✅ Promise 可用</strong><br>
        原始值: 42<br>
        翻倍后: ${doubled}<br>
        说明: Promise 需要 Polyfill 才能在 IE 11 中运行
      </div>`;
    })
    .catch(error => {
      console.error('❌ Promise 测试失败:', error);
      resultDiv.innerHTML = `<div class="result">
        <strong>❌ Promise 不可用</strong><br>
        错误: ${error.message}<br>
        原因: 当前配置未引入 Promise Polyfill
      </div>`;
    });
};

// =============================================================================
// 2. Array 方法测试
// =============================================================================
window.testArrayMethods = () => {
  const resultDiv = document.getElementById('array-result');
  
  try {
    // Array.includes
    const hasTwo = [1, 2, 3].includes(2);
    
    // Array.find
    const found = [1, 2, 3, 4, 5].find(x => x > 3);
    
    // Array.findIndex
    const foundIndex = [1, 2, 3, 4, 5].findIndex(x => x > 3);
    
    // Array.flat
    const flattened = [1, [2, [3, 4]]].flat(2);
    
    console.log('✅ Array 方法测试成功');
    
    resultDiv.innerHTML = `<div class="result">
      <strong>✅ Array 方法可用</strong><br>
      includes(2): ${hasTwo}<br>
      find(x > 3): ${found}<br>
      findIndex(x > 3): ${foundIndex}<br>
      flat(2): [${flattened}]<br>
      说明: 这些方法需要 Polyfill
    </div>`;
  } catch (error) {
    console.error('❌ Array 方法测试失败:', error);
    resultDiv.innerHTML = `<div class="result">
      <strong>❌ Array 方法不可用</strong><br>
      错误: ${error.message}<br>
      原因: 当前配置未引入 Array Polyfill
    </div>`;
  }
};

// =============================================================================
// 3. Object 方法测试
// =============================================================================
window.testObjectMethods = () => {
  const resultDiv = document.getElementById('object-result');
  
  try {
    // Object.assign
    const merged = Object.assign({}, { a: 1 }, { b: 2 });
    
    // Object.entries
    const entries = Object.entries({ x: 1, y: 2 });
    
    // Object.values
    const values = Object.values({ x: 1, y: 2 });
    
    console.log('✅ Object 方法测试成功');
    
    resultDiv.innerHTML = `<div class="result">
      <strong>✅ Object 方法可用</strong><br>
      Object.assign: ${JSON.stringify(merged)}<br>
      Object.entries: ${JSON.stringify(entries)}<br>
      Object.values: [${values}]<br>
      说明: 这些方法需要 Polyfill
    </div>`;
  } catch (error) {
    console.error('❌ Object 方法测试失败:', error);
    resultDiv.innerHTML = `<div class="result">
      <strong>❌ Object 方法不可用</strong><br>
      错误: ${error.message}<br>
      原因: 当前配置未引入 Object Polyfill
    </div>`;
  }
};

// =============================================================================
// 4. String 方法测试
// =============================================================================
window.testStringMethods = () => {
  const resultDiv = document.getElementById('string-result');
  
  try {
    // String.includes
    const hasHello = 'Hello World'.includes('Hello');
    
    // String.padStart
    const padded = '5'.padStart(3, '0');
    
    // String.repeat
    const repeated = 'abc'.repeat(3);
    
    console.log('✅ String 方法测试成功');
    
    resultDiv.innerHTML = `<div class="result">
      <strong>✅ String 方法可用</strong><br>
      includes('Hello'): ${hasHello}<br>
      padStart(3, '0'): "${padded}"<br>
      repeat(3): "${repeated}"<br>
      说明: 这些方法需要 Polyfill
    </div>`;
  } catch (error) {
    console.error('❌ String 方法测试失败:', error);
    resultDiv.innerHTML = `<div class="result">
      <strong>❌ String 方法不可用</strong><br>
      错误: ${error.message}<br>
      原因: 当前配置未引入 String Polyfill
    </div>`;
  }
};

// =============================================================================
// 5. Map/Set 测试
// =============================================================================
window.testMapSet = () => {
  const resultDiv = document.getElementById('mapset-result');
  
  try {
    // Map
    const map = new Map();
    map.set('key1', 'value1');
    map.set('key2', 'value2');
    
    // Set
    const set = new Set([1, 2, 3, 2, 1]);
    
    console.log('✅ Map/Set 测试成功');
    
    resultDiv.innerHTML = `<div class="result">
      <strong>✅ Map/Set 可用</strong><br>
      Map size: ${map.size}<br>
      Map has 'key1': ${map.has('key1')}<br>
      Set size: ${set.size}<br>
      Set values: [${Array.from(set)}]<br>
      说明: Map 和 Set 需要 Polyfill
    </div>`;
  } catch (error) {
    console.error('❌ Map/Set 测试失败:', error);
    resultDiv.innerHTML = `<div class="result">
      <strong>❌ Map/Set 不可用</strong><br>
      错误: ${error.message}<br>
      原因: 当前配置未引入 Map/Set Polyfill
    </div>`;
  }
};

// =============================================================================
// 自动运行测试
// =============================================================================
console.log('🚀 自动运行所有测试...');
console.log('');

setTimeout(() => {
  testPromise();
  testArrayMethods();
  testObjectMethods();
  testStringMethods();
  testMapSet();
  
  console.log('');
  console.log('✅ 所有测试完成！');
  console.log('💡 如果某些测试失败，说明当前 Polyfill 配置不完整');
}, 500);

