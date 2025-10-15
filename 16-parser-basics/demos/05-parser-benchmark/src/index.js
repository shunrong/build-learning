/**
 * Parser 性能基准测试
 */

const chalk = require('chalk');
const babel = require('@babel/parser');
const acorn = require('acorn');

console.log(chalk.bold.cyan('\nParser 性能基准测试\n'));

// 测试代码（不同大小）
const smallCode = 'const x = 1;';

// 使用块作用域避免重复声明错误
const mediumCode = Array.from({ length: 10 }, (_, i) => `
{
  function add${i}(a, b) {
    return a + b;
  }
  const result${i} = add${i}(1, 2);
  console.log(result${i});
}
`).join('\n');

const largeCode = Array.from({ length: 100 }, (_, i) => `
{
  function calc${i}(x) {
    return x * 2 + 1;
  }
  const value${i} = calc${i}(${i});
}
`).join('\n');

function benchmark(name, fn, iterations = 100) {
  const start = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  const elapsed = Date.now() - start;
  const avg = elapsed / iterations;
  
  console.log(chalk.white(`  ${name.padEnd(20)} ${elapsed}ms (avg: ${avg.toFixed(2)}ms/次)`));
}

// 小代码测试
console.log(chalk.yellow('\n【小代码】 ~15 字符'));
benchmark('Babel Parser', () => babel.parse(smallCode), 1000);
benchmark('Acorn', () => acorn.parse(smallCode, { ecmaVersion: 2020 }), 1000);

// 中等代码测试
console.log(chalk.yellow('\n【中等代码】 ~1KB'));
benchmark('Babel Parser', () => babel.parse(mediumCode), 100);
benchmark('Acorn', () => acorn.parse(mediumCode, { ecmaVersion: 2020 }), 100);

// 大代码测试
console.log(chalk.yellow('\n【大代码】 ~10KB'));
benchmark('Babel Parser', () => babel.parse(largeCode), 10);
benchmark('Acorn', () => acorn.parse(largeCode, { ecmaVersion: 2020 }), 10);

console.log(chalk.green('\n✅ 基准测试完成\n'));
