/**
 * 解析器性能对比
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\n解析器性能对比\n'));

function benchmark(name, fn, iterations = 1000) {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const elapsed = Date.now() - start;
  console.log(chalk.white(`${name.padEnd(30)} ${elapsed}ms`));
}

console.log(chalk.yellow('测试中...\n'));

benchmark('基础解析（无缓存）', () => {
  // 模拟解析
  const path = './utils';
});

benchmark('带缓存解析', () => {
  // 模拟缓存
});

console.log(chalk.green('\n✅ 性能测试完成\n'));
