/**
 * 示例 1: 移除 console.log 语句
 */

const babel = require('@babel/core');
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【示例 1】移除 console.log 语句\n'));

// 源代码
const code = `
  function calculate(x) {
    console.log('calculating...', x);
    const result = x * 2;
    console.warn('result:', result);
    console.error('This should stay');
    return result;
  }
`;

// 定义转换插件
const removeConsolePlugin = {
  visitor: {
    CallExpression(path) {
      const { callee } = path.node;
      
      // 检查是否是 console.xxx 调用
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object, { name: 'console' })
      ) {
        const method = callee.property.name;
        
        // 只移除 log 和 warn，保留 error
        if (method === 'log' || method === 'warn') {
          console.log(chalk.gray(`  - 移除 console.${method}()`));
          path.parentPath.remove();
        }
      }
    }
  }
};

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

// 执行转换
const result = babel.transformSync(code, {
  plugins: [removeConsolePlugin]
});

console.log(chalk.green('\n转换后:'));
console.log(chalk.white(result.code));

console.log(chalk.blue('\n💡 学习要点:'));
console.log(chalk.white('  1. 使用 CallExpression visitor 访问函数调用'));
console.log(chalk.white('  2. 使用 t.isMemberExpression() 判断成员访问'));
console.log(chalk.white('  3. 使用 path.parentPath.remove() 删除整个语句'));
console.log();
