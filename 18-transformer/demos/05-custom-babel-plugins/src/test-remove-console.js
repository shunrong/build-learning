const babel = require('@babel/core');
const chalk = require('chalk');
const removeConsolePlugin = require('../plugins/remove-console');

console.log(chalk.bold.cyan('\n测试: remove-console 插件\n'));

const code = `
  function calculate(x) {
    console.log('calculating...', x);
    const result = x * 2;
    console.warn('warning');
    console.error('This should stay');
    return result;
  }
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

const result = babel.transformSync(code, {
  plugins: [
    [removeConsolePlugin, { exclude: ['error'] }]
  ]
});

console.log(chalk.green('\n转换后:'));
console.log(chalk.white(result.code));
console.log();
