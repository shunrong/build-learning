/**
 * 自定义 Babel 插件集合 - 主入口
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║        自定义 Babel 插件集合                    ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

console.log(chalk.yellow('📦 包含的插件:\n'));

console.log(chalk.white('1. ') + chalk.bold('remove-console'));
console.log(chalk.gray('   移除代码中的 console 语句（可配置排除项）'));
console.log(chalk.gray('   npm run demo:console\n'));

console.log(chalk.white('2. ') + chalk.bold('auto-track'));
console.log(chalk.gray('   自动为函数添加埋点代码'));
console.log(chalk.gray('   npm run demo:track\n'));

console.log(chalk.white('3. ') + chalk.bold('import-on-demand'));
console.log(chalk.gray('   实现按需加载（类似 babel-plugin-import）'));
console.log(chalk.gray('   npm run demo:import\n'));

console.log(chalk.green('\n✨ 运行上面的命令查看各个插件的演示！\n'));
