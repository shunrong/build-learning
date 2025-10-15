/**
 * 示例 3: 常量折叠优化
 */

const babel = require('@babel/core');
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【示例 3】常量折叠优化\n'));

// 源代码
const code = `
  const a = 1 + 2;
  const b = 10 * 5 - 3;
  const c = (4 + 6) / 2;
  const d = 'Hello' + ' ' + 'World';
`;

// 定义转换插件
const constantFoldingPlugin = {
  visitor: {
    BinaryExpression(path) {
      const { left, right, operator } = path.node;
      
      // 只处理数字常量
      if (t.isNumericLiteral(left) && t.isNumericLiteral(right)) {
        let result;
        
        switch (operator) {
          case '+':
            result = left.value + right.value;
            break;
          case '-':
            result = left.value - right.value;
            break;
          case '*':
            result = left.value * right.value;
            break;
          case '/':
            result = left.value / right.value;
            break;
        }
        
        if (result !== undefined) {
          console.log(chalk.gray(`  - 折叠: ${left.value} ${operator} ${right.value} = ${result}`));
          path.replaceWith(t.numericLiteral(result));
        }
      }
      
      // 处理字符串拼接
      if (t.isStringLiteral(left) && t.isStringLiteral(right) && operator === '+') {
        const result = left.value + right.value;
        console.log(chalk.gray(`  - 折叠字符串: "${left.value}" + "${right.value}" = "${result}"`));
        path.replaceWith(t.stringLiteral(result));
      }
    }
  }
};

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

// 执行转换
const result = babel.transformSync(code, {
  plugins: [constantFoldingPlugin]
});

console.log(chalk.green('\n转换后:'));
console.log(chalk.white(result.code));

console.log(chalk.blue('\n💡 学习要点:'));
console.log(chalk.white('  1. 使用 BinaryExpression visitor 访问二元运算'));
console.log(chalk.white('  2. 判断操作数类型（NumericLiteral/StringLiteral）'));
console.log(chalk.white('  3. 计算结果并替换节点'));
console.log(chalk.white('  4. 常量折叠可以减小 bundle 体积'));
console.log();
