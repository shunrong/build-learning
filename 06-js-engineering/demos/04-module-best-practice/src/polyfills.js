// Polyfills 文件
// 这个文件被标记为有副作用（在 package.json 的 sideEffects 中）

console.log('💉 Polyfills 已注入');

// 模拟 Polyfill
if (!window.customAPI) {
  window.customAPI = {
    version: '1.0.0'
  };
}

