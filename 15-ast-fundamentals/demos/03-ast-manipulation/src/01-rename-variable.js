/**
 * 重命名变量
 * 演示如何修改 AST 节点的属性
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 01】重命名变量\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log('Sum:', result);
`;

console.log(chalk.yellow('原始代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code);

// 定义重命名映射
const renameMap = {
  'numbers': 'arr',
  'sum': 'total',
  'result': 'finalResult'
};

console.log(chalk.cyan('\n重命名映射:'));
Object.entries(renameMap).forEach(([oldName, newName]) => {
  console.log(chalk.white(`  ${oldName} → ${newName}`));
});

// 遍历并重命名
let renameCount = 0;

const visitor = {
  Identifier(path) {
    const oldName = path.node.name;
    const newName = renameMap[oldName];
    
    if (newName) {
      // 检查是否是变量的声明或引用
      const binding = path.scope.getBinding(oldName);
      
      if (binding) {
        // 使用 Babel 的 rename 方法，会自动处理所有引用
        binding.scope.rename(oldName, newName);
        renameCount++;
      }
    }
  }
};

traverse(ast, visitor);

// 生成新代码
const output = generator(ast, {
  retainLines: false,
  compact: false
});

console.log(chalk.green(`\n✅ 成功重命名 ${renameCount} 个变量\n`));
console.log(chalk.yellow('转换后的代码:'));
console.log(chalk.white(output.code));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.green('\n💡 使用 scope.rename() 的好处:\n'));
console.log(chalk.white('  ✅ 自动处理所有引用位置'));
console.log(chalk.white('  ✅ 保持作用域正确性'));
console.log(chalk.white('  ✅ 避免变量名冲突'));
console.log();

