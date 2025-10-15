/**
 * const/let 转 var（兼容性转换）
 * 适用于不支持 ES6 块级作用域的旧浏览器
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Transformer 04】const/let → var\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
// const 声明
const PI = 3.14159;
const MAX_SIZE = 1000;

// let 声明
let counter = 0;
let message = 'Hello';

function processData(data) {
  const total = data.length;
  let sum = 0;
  
  for (let i = 0; i < total; i++) {
    const item = data[i];
    sum += item;
  }
  
  return sum;
}

// 块级作用域
if (true) {
  const blockConst = 'block const';
  let blockLet = 'block let';
  console.log(blockConst, blockLet);
}

// for 循环
for (let i = 0; i < 10; i++) {
  const square = i * i;
  console.log(square);
}
`;

console.log(chalk.yellow('📝 原始代码 (ES6):'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// Parse
console.log(chalk.cyan('\n🔍 Step 1: Parsing...\n'));
const ast = parser.parse(code);
console.log(chalk.green('  ✓ 解析完成'));

// Transform
console.log(chalk.cyan('\n🔄 Step 2: Transforming...\n'));

const stats = {
  const: 0,
  let: 0,
  total: 0
};

const visitor = {
  VariableDeclaration(path) {
    const kind = path.node.kind;
    
    if (kind === 'const' || kind === 'let') {
      const line = path.node.loc ? path.node.loc.start.line : '?';
      const varNames = path.node.declarations.map(d => d.id.name).join(', ');
      
      console.log(chalk.yellow(`  → 转换 ${kind} ${varNames} (第 ${line} 行)`));
      
      // 修改为 var
      path.node.kind = 'var';
      
      stats[kind]++;
      stats.total++;
    }
  }
};

traverse(ast, visitor);

console.log(chalk.green(`\n  ✓ 转换完成，共转换 ${stats.total} 个声明`));

// Generate
console.log(chalk.cyan('\n📦 Step 3: Generating...\n'));

const output = generator(ast, {
  retainLines: false,
  compact: false
});

console.log(chalk.green('  ✓ 生成完成'));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.yellow('\n✨ 转换后的代码 (ES5 兼容):\n'));
console.log(chalk.white(output.code));

// 统计报告
console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.bold.cyan('\n📊 转换统计:\n'));
console.log(chalk.white(`  const → var: ${stats.const} 个`));
console.log(chalk.white(`  let → var:   ${stats.let} 个`));
console.log(chalk.white(`  总计:        ${stats.total} 个`));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.yellow('\n⚠️  注意事项:\n'));
console.log(chalk.white('  1. const 的不可变性会丢失'));
console.log(chalk.white('  2. 块级作用域会变成函数作用域'));
console.log(chalk.white('  3. 可能导致变量提升（hoisting）问题'));
console.log(chalk.white('  4. for 循环的 let 会导致闭包问题'));

console.log(chalk.cyan('\n💡 建议:\n'));
console.log(chalk.white('  • 尽量使用现代浏览器'));
console.log(chalk.white('  • 如需兼容，使用 Babel 完整转译'));
console.log(chalk.white('  • 此转换仅用于学习演示'));
console.log();

