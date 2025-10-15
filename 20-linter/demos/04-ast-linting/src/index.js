/**
 * 基于 AST 的代码检查
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n基于 AST 的代码检查\n'));

// 检查未使用的变量
function checkUnusedVariables(code) {
  const ast = parser.parse(code, { sourceType: 'module' });
  const declared = new Set();
  const used = new Set();
  
  traverse(ast, {
    VariableDeclarator(path) {
      if (path.node.id.type === 'Identifier') {
        declared.add(path.node.id.name);
      }
    },
    Identifier(path) {
      if (path.isReferencedIdentifier()) {
        used.add(path.node.name);
      }
    }
  });
  
  const unused = [...declared].filter(name => !used.has(name));
  return unused;
}

const code = `
const x = 1;
const y = 2;
const z = 3;
console.log(x, y);
`;

console.log(chalk.yellow('检查代码:'));
console.log(chalk.white(code));

const unused = checkUnusedVariables(code);
console.log(chalk.red(`\n未使用的变量: ${unused.join(', ')}`));
console.log();
