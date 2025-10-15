/**
 * 示例 2: 箭头函数转换为普通函数
 */

const babel = require('@babel/core');
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【示例 2】箭头函数 → 普通函数\n'));

// 源代码
const code = `
  const add = (a, b) => a + b;
  
  const greet = name => {
    return 'Hello ' + name;
  };
  
  const multiLine = (x, y) => {
    const sum = x + y;
    return sum * 2;
  };
`;

// 定义转换插件
const arrowToFunctionPlugin = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { params, body } = path.node;
      
      // 处理表达式体：a + b → { return a + b; }
      let blockBody;
      if (t.isBlockStatement(body)) {
        blockBody = body;
      } else {
        console.log(chalk.gray('  - 转换表达式体为块体'));
        blockBody = t.blockStatement([
          t.returnStatement(body)
        ]);
      }
      
      // 替换为普通函数表达式
      path.replaceWith(
        t.functionExpression(
          null,      // 匿名函数
          params,    // 参数列表
          blockBody  // 函数体
        )
      );
    }
  }
};

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

// 执行转换
const result = babel.transformSync(code, {
  plugins: [arrowToFunctionPlugin]
});

console.log(chalk.green('\n转换后:'));
console.log(chalk.white(result.code));

console.log(chalk.blue('\n💡 学习要点:'));
console.log(chalk.white('  1. 区分表达式体和块体'));
console.log(chalk.white('  2. 使用 t.functionExpression() 创建函数'));
console.log(chalk.white('  3. 使用 path.replaceWith() 替换节点'));
console.log();
