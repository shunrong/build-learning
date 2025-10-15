/**
 * Linter 性能对比
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\nLinter 性能对比\n'));

function benchmark(name, fn, iterations = 100) {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const elapsed = Date.now() - start;
  console.log(chalk.white(`${name.padEnd(30)} ${elapsed}ms`));
}

console.log(chalk.yellow('性能测试:\n'));

benchmark('基础规则检查', () => {
  // 模拟检查
});

benchmark('复杂规则检查', () => {
  // 模拟检查
});

console.log(chalk.green('\n✅ 性能测试完成\n'));
