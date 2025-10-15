/**
 * 简单转换器 - 主入口
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║       简单代码转换器示例                        ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

console.log(chalk.yellow('运行以下命令查看各个示例：\n'));
console.log(chalk.white('  npm run demo1  ') + chalk.gray('- 移除 console.log'));
console.log(chalk.white('  npm run demo2  ') + chalk.gray('- 箭头函数 → 普通函数'));
console.log(chalk.white('  npm run demo3  ') + chalk.gray('- 常量折叠优化'));

console.log(chalk.green('\n✨ 开始学习代码转换吧！\n'));
