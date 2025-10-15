/**
 * 插入注释
 * 演示如何在 AST 中插入新节点
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 03】插入注释\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
function add(a, b) {
  return a + b;
}

function multiply(x, y) {
  return x * y;
}

const divide = (a, b) => {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
};

class Calculator {
  subtract(a, b) {
    return a - b;
  }
  
  power(base, exponent) {
    return Math.pow(base, exponent);
  }
}
`;

console.log(chalk.yellow('原始代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code);

// 统计
let commentCount = 0;

// 遍历并插入注释
const visitor = {
  // 函数声明
  FunctionDeclaration(path) {
    const funcName = path.node.id.name;
    const params = path.node.params.map(p => p.name).join(', ');
    
    const comment = `/**\n * 函数: ${funcName}\n * 参数: (${params || '无'})\n * 自动生成的文档注释\n */`;
    
    // 添加前置注释
    path.addComment('leading', comment, true);
    commentCount++;
  },
  
  // 变量声明（箭头函数）
  VariableDeclaration(path) {
    // 检查是否是函数声明
    const declarator = path.node.declarations[0];
    if (declarator && declarator.init && 
        (declarator.init.type === 'ArrowFunctionExpression' || 
         declarator.init.type === 'FunctionExpression')) {
      
      const funcName = declarator.id.name;
      const params = declarator.init.params.map(p => p.name).join(', ');
      
      const comment = `/**\n * 函数: ${funcName}\n * 参数: (${params || '无'})\n * 自动生成的文档注释\n */`;
      
      path.addComment('leading', comment, true);
      commentCount++;
    }
  },
  
  // 类方法
  ClassMethod(path) {
    const methodName = path.node.key.name;
    const params = path.node.params.map(p => p.name).join(', ');
    const isStatic = path.node.static ? ' (静态)' : '';
    
    const comment = `/**\n * 方法: ${methodName}${isStatic}\n * 参数: (${params || '无'})\n * 自动生成的文档注释\n */`;
    
    path.addComment('leading', comment, true);
    commentCount++;
  }
};

traverse(ast, visitor);

// 生成新代码
const output = generator(ast, {
  retainLines: false,
  compact: false,
  comments: true  // 保留注释
});

console.log(chalk.green(`\n✅ 成功插入 ${commentCount} 个注释\n`));
console.log(chalk.yellow('转换后的代码:'));
console.log(chalk.white(output.code));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.green('\n💡 插入注释的技巧:\n'));
console.log(chalk.white('  ✅ 使用 path.addComment() 添加注释'));
console.log(chalk.white('  ✅ leading 表示前置注释，trailing 表示后置注释'));
console.log(chalk.white('  ✅ generator 需要设置 comments: true'));
console.log(chalk.white('  ✅ 可用于自动生成文档、添加版权信息等'));
console.log();

