/**
 * 测试自定义插件
 */

const babel = require('@babel/core');
const chalk = require('chalk');

// 自定义插件：移除 debugger 语句
const removeDebuggerPlugin = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'remove-debugger',
    visitor: {
      DebuggerStatement(path) {
        console.log(chalk.gray('  移除 debugger 语句'));
        path.remove();
      }
    }
  };
};

console.log(chalk.bold.cyan('\n测试自定义插件: remove-debugger\n'));

const code = `
  function test() {
    debugger;
    const x = 1;
    debugger;
    return x;
  }
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

const result = babel.transformSync(code, {
  plugins: [removeDebuggerPlugin]
});

console.log(chalk.green('\n转换后:'));
console.log(chalk.white(result.code));
console.log();
