/**
 * Parser API 对比
 * 对比不同 Parser 的 API 使用方式
 */

const chalk = require('chalk');
const babel = require('@babel/parser');
const acorn = require('acorn');
const esprima = require('esprima');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║          Parser API 使用对比                    ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

const code = `
const greeting = "Hello";
function greet(name) {
  return greeting + ", " + name;
}
`;

// Babel Parser
console.log(chalk.bold.yellow('【1】Babel Parser'));
console.log(chalk.gray('─'.repeat(50)));
try {
  const babelAst = babel.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log(chalk.green('✓ 解析成功'));
  console.log(chalk.white('  AST 根节点:'), babelAst.type);
  console.log(chalk.white('  语句数量:'), babelAst.program.body.length);
  console.log(chalk.white('  特点: 支持最新 JS 语法、JSX、TypeScript'));
} catch (error) {
  console.log(chalk.red('✗ 解析失败:'), error.message);
}

// Acorn
console.log(chalk.bold.yellow('\n【2】Acorn'));
console.log(chalk.gray('─'.repeat(50)));
try {
  const acornAst = acorn.parse(code, {
    ecmaVersion: 2020,
    sourceType: 'module'
  });
  console.log(chalk.green('✓ 解析成功'));
  console.log(chalk.white('  AST 根节点:'), acornAst.type);
  console.log(chalk.white('  语句数量:'), acornAst.body.length);
  console.log(chalk.white('  特点: 轻量、快速、符合 ESTree 标准'));
} catch (error) {
  console.log(chalk.red('✗ 解析失败:'), error.message);
}

// Esprima
console.log(chalk.bold.yellow('\n【3】Esprima'));
console.log(chalk.gray('─'.repeat(50)));
try {
  const esprimaAst = esprima.parseScript(code);
  console.log(chalk.green('✓ 解析成功'));
  console.log(chalk.white('  AST 根节点:'), esprimaAst.type);
  console.log(chalk.white('  语句数量:'), esprimaAst.body.length);
  console.log(chalk.white('  特点: 符合标准、教学友好'));
} catch (error) {
  console.log(chalk.red('✗ 解析失败:'), error.message);
}

console.log(chalk.bold.green('\n✅ API 对比完成\n'));

// API 特性对比
console.log(chalk.bold.cyan('📊 特性对比表\n'));
const features = [
  { feature: 'ESTree 标准', babel: '✓', acorn: '✓', esprima: '✓' },
  { feature: 'JSX 支持', babel: '✓', acorn: '插件', esprima: '✗' },
  { feature: 'TypeScript', babel: '✓', acorn: '插件', esprima: '✗' },
  { feature: '性能', babel: '中', acorn: '快', esprima: '中' },
  { feature: '包大小', babel: '大', acorn: '小', esprima: '中' }
];

console.log(chalk.white('特性'.padEnd(20)) + chalk.cyan('Babel'.padEnd(10)) + chalk.yellow('Acorn'.padEnd(10)) + chalk.magenta('Esprima'));
console.log(chalk.gray('─'.repeat(50)));
features.forEach(f => {
  console.log(
    chalk.white(f.feature.padEnd(20)) +
    chalk.cyan(f.babel.padEnd(10)) +
    chalk.yellow(f.acorn.padEnd(10)) +
    chalk.magenta(f.esprima)
  );
});

console.log();
