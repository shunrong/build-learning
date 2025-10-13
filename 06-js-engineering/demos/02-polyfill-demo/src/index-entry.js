// useBuiltIns: 'entry' 需要手动引入 core-js
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 然后引入业务代码
// 这些 import 会被 Babel 替换为具体的 Polyfill
console.log('✅ core-js 已全量引入');

// 复用主入口的代码
import './index.js';

