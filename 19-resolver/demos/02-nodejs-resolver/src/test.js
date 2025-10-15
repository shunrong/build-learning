/**
 * Node.js Resolver 测试
 */

const path = require('path');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n测试 Node.js require.resolve()\n'));

// 测试模块解析
const tests = [
  { name: '第三方模块', spec: 'chalk' },
  { name: '相对路径', spec: './index' },
  { name: '绝对路径', spec: path.resolve(__dirname, 'index.js') }
];

tests.forEach(({ name, spec }) => {
  console.log(chalk.yellow(`${name}:`), chalk.white(spec));
  try {
    const resolved = require.resolve(spec);
    console.log(chalk.green('  →'), chalk.gray(resolved));
  } catch (e) {
    console.log(chalk.red('  → 未找到'));
  }
  console.log();
});
