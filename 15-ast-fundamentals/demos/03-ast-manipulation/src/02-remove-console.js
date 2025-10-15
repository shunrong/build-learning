/**
 * 删除 console 语句
 * 演示如何删除 AST 节点
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 02】删除 console 语句\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
function processData(data) {
  console.log('Processing data:', data);
  
  const result = data.map(item => {
    console.log('Processing item:', item);
    return item * 2;
  });
  
  console.warn('Warning: This is a test');
  console.error('Error:', new Error('test'));
  console.info('Info:', result);
  console.debug('Debug info');
  
  // 这个不应该被删除（不是 console）
  const log = (msg) => console.log(msg);
  
  return result;
}

console.log('Starting...');
const data = [1, 2, 3, 4, 5];
const output = processData(data);
console.log('Result:', output);
`;

console.log(chalk.yellow('原始代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code);

// 统计
let removedCount = 0;
const removedTypes = {
  log: 0,
  warn: 0,
  error: 0,
  info: 0,
  debug: 0,
  other: 0
};

// 遍历并删除
const visitor = {
  CallExpression(path) {
    const callee = path.node.callee;
    
    // 检查是否是 console.xxx() 调用
    if (
      callee.type === 'MemberExpression' &&
      callee.object.type === 'Identifier' &&
      callee.object.name === 'console' &&
      callee.property.type === 'Identifier'
    ) {
      const method = callee.property.name;
      
      // 记录类型
      if (removedTypes.hasOwnProperty(method)) {
        removedTypes[method]++;
      } else {
        removedTypes.other++;
      }
      
      removedCount++;
      
      // 删除整个表达式语句
      if (path.parent.type === 'ExpressionStatement') {
        path.parentPath.remove();
      } else {
        // 如果不是表达式语句，只删除调用表达式
        path.remove();
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

console.log(chalk.green(`\n✅ 成功删除 ${removedCount} 个 console 语句\n`));

console.log(chalk.cyan('删除统计:'));
Object.entries(removedTypes).forEach(([type, count]) => {
  if (count > 0) {
    console.log(chalk.white(`  console.${type}(): ${count} 个`));
  }
});

console.log(chalk.yellow('\n转换后的代码:'));
console.log(chalk.white(output.code));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.green('\n💡 删除节点的注意事项:\n'));
console.log(chalk.white('  ⚠️  区分 ExpressionStatement 和普通 Expression'));
console.log(chalk.white('  ⚠️  使用 path.remove() 而不是直接修改 AST'));
console.log(chalk.white('  ⚠️  删除后可能需要清理空行'));
console.log();

