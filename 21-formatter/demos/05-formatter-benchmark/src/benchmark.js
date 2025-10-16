const prettier = require('prettier');
const chalk = require('chalk');

// 简单的 Formatter
class SimpleFormatter {
  format(code) {
    return code
      .replace(/\s+/g, ' ')
      .replace(/\{/g, ' {')
      .replace(/\}/g, '} ')
      .replace(/;/g, ';\n')
      .trim();
  }
}

// 生成测试代码
function generateCode(lines) {
  let code = '';
  for (let i = 0; i < lines; i++) {
    code += `const var${i}=${i}+${i+1};\n`;
  }
  return code;
}

// 性能测试
function benchmark(name, formatter, code) {
  const start = Date.now();
  formatter(code);
  const end = Date.now();
  return end - start;
}

console.log(chalk.bold.blue('\n========== Formatter 性能对比 ==========\n'));

const simple = new SimpleFormatter();
const testSizes = [100, 500, 1000];

testSizes.forEach(size => {
  console.log(chalk.yellow(`\n【测试】${size} 行代码\n`));
  
  const code = generateCode(size);
  
  // 简单 Formatter
  const simpleTime = benchmark('Simple', () => simple.format(code), code);
  console.log(chalk.green(`Simple Formatter: ${simpleTime}ms`));
  
  // Prettier
  const prettierTime = benchmark('Prettier', () => 
    prettier.format(code, { parser: 'babel' }), code
  );
  console.log(chalk.cyan(`Prettier:         ${prettierTime}ms`));
  
  console.log(chalk.gray(`差距: ${(prettierTime / simpleTime).toFixed(1)}x`));
});

console.log(chalk.bold.green('\n✅ 性能对比完成！'));
console.log(chalk.gray('\n结论：'));
console.log(chalk.gray('- Simple Formatter 更快（但功能简单）'));
console.log(chalk.gray('- Prettier 功能完整（但相对较慢）'));
console.log(chalk.gray('- 实际项目应优先选择 Prettier\n'));

