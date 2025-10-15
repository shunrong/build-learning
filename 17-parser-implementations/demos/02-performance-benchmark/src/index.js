/**
 * Parser 性能基准测试（详细版）
 */

const chalk = require('chalk');
const babel = require('@babel/parser');
const acorn = require('acorn');
const esprima = require('esprima');
const fs = require('fs');
const path = require('path');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║        Parser 性能基准测试                      ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// 生成不同大小的测试代码
function generateCode(size) {
  const unit = `
function calculate(a, b) {
  const sum = a + b;
  const product = a * b;
  return { sum, product };
}
`;
  return unit.repeat(size);
}

const testCases = [
  { name: '小型代码 (1KB)', code: generateCode(10) },
  { name: '中型代码 (10KB)', code: generateCode(100) },
  { name: '大型代码 (50KB)', code: generateCode(500) }
];

function benchmark(parser, parserName, code, iterations) {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    try {
      parser(code);
    } catch (error) {
      return { error: error.message };
    }
    const end = process.hrtime.bigint();
    times.push(Number(end - start) / 1000000); // 转换为毫秒
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return { avg, min, max };
}

// 运行测试
testCases.forEach(({ name, code }) => {
  console.log(chalk.bold.yellow(`\n${name}`));
  console.log(chalk.gray('─'.repeat(70)));
  
  const iterations = code.length < 5000 ? 100 : code.length < 50000 ? 50 : 10;
  
  // Babel
  const babelResult = benchmark(
    (c) => babel.parse(c, { sourceType: 'module' }),
    'Babel',
    code,
    iterations
  );
  
  // Acorn
  const acornResult = benchmark(
    (c) => acorn.parse(c, { ecmaVersion: 2020 }),
    'Acorn',
    code,
    iterations
  );
  
  // Esprima
  const esprimaResult = benchmark(
    (c) => esprima.parseScript(c),
    'Esprima',
    code,
    iterations
  );
  
  // 输出结果
  console.log(chalk.cyan('Babel Parser:'));
  if (babelResult.error) {
    console.log(chalk.red(`  ✗ 错误: ${babelResult.error}`));
  } else {
    console.log(chalk.white(`  平均: ${babelResult.avg.toFixed(2)}ms`));
    console.log(chalk.white(`  最快: ${babelResult.min.toFixed(2)}ms`));
    console.log(chalk.white(`  最慢: ${babelResult.max.toFixed(2)}ms`));
  }
  
  console.log(chalk.yellow('Acorn:'));
  if (acornResult.error) {
    console.log(chalk.red(`  ✗ 错误: ${acornResult.error}`));
  } else {
    console.log(chalk.white(`  平均: ${acornResult.avg.toFixed(2)}ms`));
    console.log(chalk.white(`  最快: ${acornResult.min.toFixed(2)}ms`));
    console.log(chalk.white(`  最慢: ${acornResult.max.toFixed(2)}ms`));
  }
  
  console.log(chalk.magenta('Esprima:'));
  if (esprimaResult.error) {
    console.log(chalk.red(`  ✗ 错误: ${esprimaResult.error}`));
  } else {
    console.log(chalk.white(`  平均: ${esprimaResult.avg.toFixed(2)}ms`));
    console.log(chalk.white(`  最快: ${esprimaResult.min.toFixed(2)}ms`));
    console.log(chalk.white(`  最慢: ${esprimaResult.max.toFixed(2)}ms`));
  }
  
  // 性能对比
  if (!babelResult.error && !acornResult.error && !esprimaResult.error) {
    const fastest = Math.min(babelResult.avg, acornResult.avg, esprimaResult.avg);
    const acornSpeedup = (babelResult.avg / acornResult.avg).toFixed(2);
    console.log(chalk.green(`\n  💡 Acorn 比 Babel 快 ${acornSpeedup}x`));
  }
});

console.log(chalk.bold.green('\n\n✅ 性能测试完成\n'));
