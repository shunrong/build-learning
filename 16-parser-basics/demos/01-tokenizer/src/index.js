/**
 * Tokenizer Demo - 主入口
 */

const chalk = require('chalk');
const Tokenizer = require('./tokenizer');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║              Token 生成器 - 词法分析器演示                     ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

// 示例代码
const examples = [
  {
    name: '变量声明',
    code: 'const x = 42;'
  },
  {
    name: '算术表达式',
    code: 'let sum = 10 + 20 * 3;'
  },
  {
    name: '函数声明',
    code: 'function add(a, b) { return a + b; }'
  },
  {
    name: '字符串和注释',
    code: 'const msg = "Hello"; // greeting'
  },
  {
    name: '复杂表达式',
    code: 'if (x >= 10) { console.log("big"); }'
  }
];

examples.forEach((example, index) => {
  console.log(chalk.bold.yellow(`\n【示例 ${index + 1}】${example.name}`));
  console.log(chalk.gray('─'.repeat(70)));
  console.log(chalk.white('源代码:'), chalk.cyan(example.code));
  
  try {
    const tokenizer = new Tokenizer(example.code);
    const tokens = tokenizer.tokenize();
    
    console.log(chalk.white('\nToken 流:'));
    tokens.forEach((token, i) => {
      let color = chalk.white;
      if (token.type === 'KEYWORD') color = chalk.magenta;
      else if (token.type === 'NUMBER') color = chalk.green;
      else if (token.type === 'STRING') color = chalk.yellow;
      else if (token.type === 'OPERATOR') color = chalk.red;
      else if (token.type === 'IDENTIFIER') color = chalk.blue;
      
      console.log(color(`  ${i + 1}. ${token.type.padEnd(12)} → ${JSON.stringify(token.value)}`));
    });
  } catch (error) {
    console.log(chalk.red(`\n错误: ${error.message}`));
  }
});

console.log(chalk.gray('\n' + '═'.repeat(70)));
console.log(chalk.bold.green('\n✅ Tokenizer 演示完成！\n'));
console.log(chalk.cyan('💡 Token 类型说明:'));
console.log(chalk.white('  - KEYWORD     : 关键字 (const, let, function, if, etc.)'));
console.log(chalk.white('  - IDENTIFIER  : 标识符 (变量名、函数名)'));
console.log(chalk.white('  - NUMBER      : 数字字面量'));
console.log(chalk.white('  - STRING      : 字符串字面量'));
console.log(chalk.white('  - OPERATOR    : 操作符 (+, -, *, =, ==, etc.)'));
console.log(chalk.white('  - PUNCTUATION : 标点符号 ( ) { } [ ] ; ,'));
console.log();

