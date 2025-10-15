/**
 * 删除 debugger 语句
 * 完整的 Parse → Transform → Generate 流程
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Transformer 01】删除 debugger 语句\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
function complexCalculation(data) {
  debugger; // 调试用
  
  let result = 0;
  
  for (let i = 0; i < data.length; i++) {
    debugger; // 检查循环
    result += data[i];
  }
  
  if (result > 100) {
    debugger; // 检查结果
    console.warn('Result is too large');
  }
  
  return result;
}

debugger; // 全局调试点
const output = complexCalculation([10, 20, 30, 40, 50]);
`;

console.log(chalk.yellow('📝 原始代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// Step 1: Parse
console.log(chalk.cyan('\n🔍 Step 1: Parsing...\n'));
const ast = parser.parse(code);
console.log(chalk.green('  ✓ 代码解析完成'));

// Step 2: Transform
console.log(chalk.cyan('\n🔄 Step 2: Transforming...\n'));

let removedCount = 0;

const visitor = {
  DebuggerStatement(path) {
    console.log(chalk.yellow(`  → 找到 debugger 语句 (第 ${path.node.loc.start.line} 行)`));
    path.remove();
    removedCount++;
  }
};

traverse(ast, visitor);

console.log(chalk.green(`\n  ✓ 转换完成，删除了 ${removedCount} 个 debugger 语句`));

// Step 3: Generate
console.log(chalk.cyan('\n📦 Step 3: Generating...\n'));

const output = generator(ast, {
  retainLines: false,
  compact: false
});

console.log(chalk.green('  ✓ 代码生成完成'));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.yellow('\n✨ 转换后的代码:\n'));
console.log(chalk.white(output.code));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.bold.green('\n🎯 转换流程总结:\n'));
console.log(chalk.white('  1. Parse     → 将代码字符串解析为 AST'));
console.log(chalk.white('  2. Transform → 遍历和修改 AST'));
console.log(chalk.white('  3. Generate  → 将 AST 生成为新的代码字符串'));
console.log();

console.log(chalk.cyan('💡 实际应用场景:'));
console.log(chalk.white('  • 生产环境自动移除调试代码'));
console.log(chalk.white('  • CI/CD 流程中的代码清理'));
console.log(chalk.white('  • 代码混淆和优化'));
console.log();

