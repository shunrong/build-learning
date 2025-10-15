/**
 * Demo 05: AST 可视化工具
 * 
 * 以树形结构展示 AST
 */

const parser = require('@babel/parser');
const chalk = require('chalk');

console.log('='.repeat(60));
console.log('Demo 05: AST 可视化工具');
console.log('='.repeat(60));
console.log();

/**
 * 可视化 AST
 */
function visualizeAST(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  
  console.log(chalk.bold('源代码:'));
  console.log(chalk.gray(code));
  console.log();
  
  console.log(chalk.bold('AST 树形结构:'));
  printNode(ast, 0);
}

/**
 * 打印节点
 */
function printNode(node, indent = 0) {
  if (!node || typeof node !== 'object') return;
  
  const spaces = '  '.repeat(indent);
  const prefix = indent === 0 ? '' : '└─ ';
  
  // 打印节点类型（高亮）
  console.log(spaces + prefix + chalk.cyan.bold(node.type));
  
  // 打印关键属性
  const props = [];
  
  if (node.name) {
    props.push(chalk.yellow(`name: "${node.name}"`));
  }
  if (node.value !== undefined) {
    props.push(chalk.green(`value: ${JSON.stringify(node.value)}`));
  }
  if (node.operator) {
    props.push(chalk.magenta(`operator: "${node.operator}"`));
  }
  if (node.kind) {
    props.push(chalk.blue(`kind: "${node.kind}"`));
  }
  
  if (props.length > 0) {
    console.log(spaces + '  ' + props.join(', '));
  }
  
  // 递归打印子节点
  for (const key in node) {
    if (['type', 'loc', 'start', 'end', 'errors', 'comments', 'tokens', 'name', 'value', 'operator', 'kind'].includes(key)) {
      continue;
    }
    
    const child = node[key];
    
    if (Array.isArray(child)) {
      child.forEach((item) => {
        if (item && typeof item === 'object' && item.type) {
          printNode(item, indent + 1);
        }
      });
    } else if (child && typeof child === 'object' && child.type) {
      printNode(child, indent + 1);
    }
  }
}

// 示例 1：简单的变量声明
console.log(chalk.bold.underline('【示例 1】简单的变量声明'));
console.log();
visualizeAST(`const x = 1;`);
console.log();

// 示例 2：函数声明
console.log(chalk.bold.underline('【示例 2】函数声明'));
console.log();
visualizeAST(`
function add(a, b) {
  return a + b;
}
`);
console.log();

// 示例 3：二元表达式
console.log(chalk.bold.underline('【示例 3】二元表达式'));
console.log();
visualizeAST(`1 + 2 * 3`);
console.log();

// 示例 4：箭头函数
console.log(chalk.bold.underline('【示例 4】箭头函数'));
console.log();
visualizeAST(`const greet = (name) => 'Hello, ' + name;`);
console.log();

// 示例 5：条件语句
console.log(chalk.bold.underline('【示例 5】条件语句'));
console.log();
visualizeAST(`
if (x > 0) {
  console.log('positive');
} else {
  console.log('negative');
}
`);
console.log();

console.log('='.repeat(60));
console.log(chalk.green('提示：'));
console.log('  1. 修改代码查看不同的 AST 结构');
console.log('  2. 访问 https://astexplorer.net/ 在线查看 AST');
console.log('  3. 运行 `npm run demo` 查看更多示例');
console.log('='.repeat(60));

// 导出函数供其他脚本使用
module.exports = { visualizeAST, printNode };

