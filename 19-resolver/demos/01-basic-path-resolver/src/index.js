/**
 * 基础路径解析器
 */

const path = require('path');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║          基础路径解析器                         ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// 模拟当前文件路径
const currentFile = '/project/src/pages/Home.js';

const testCases = [
  { type: '相对路径', specifier: './Header' },
  { type: '相对路径', specifier: '../utils/format' },
  { type: '相对路径', specifier: '../../config' },
  { type: '绝对路径', specifier: '/etc/config' },
  { type: '模块路径', specifier: 'react' },
  { type: '模块路径', specifier: 'lodash/fp' }
];

function resolveBasic(specifier, fromFile) {
  const fromDir = path.dirname(fromFile);
  
  // 判断路径类型
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    // 相对路径
    return path.resolve(fromDir, specifier);
  } else if (specifier.startsWith('/')) {
    // 绝对路径
    return specifier;
  } else {
    // 模块路径（简化：返回在 node_modules 中的预期位置）
    return path.join('/project/node_modules', specifier);
  }
}

console.log(chalk.yellow('当前文件:'), chalk.white(currentFile));
console.log();

testCases.forEach(({ type, specifier }) => {
  const resolved = resolveBasic(specifier, currentFile);
  console.log(chalk.blue(`[${type}]`), chalk.white(specifier));
  console.log(chalk.green('  →'), chalk.gray(resolved));
  console.log();
});

console.log(chalk.green('✅ 基础路径解析完成\n'));
