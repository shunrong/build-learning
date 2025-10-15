/**
 * 自定义 ESLint 规则示例
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\n自定义 ESLint 规则\n'));

// 规则 1: no-console-log
const noConsoleLogRule = {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止使用 console.log',
      category: 'Best Practices',
      recommended: true
    },
    fixable: 'code',
    schema: []
  },
  
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        
        if (
          callee.type === 'MemberExpression' &&
          callee.object.name === 'console' &&
          callee.property.name === 'log'
        ) {
          context.report({
            node,
            message: '禁止使用 console.log',
            fix(fixer) {
              return fixer.remove(node.parent);
            }
          });
        }
      }
    };
  }
};

console.log(chalk.yellow('规则示例: no-console-log'));
console.log(chalk.white(JSON.stringify(noConsoleLogRule.meta, null, 2)));
console.log();
