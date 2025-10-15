/**
 * Tokenizer 测试
 */

const chalk = require('chalk');
const Tokenizer = require('./tokenizer');

console.log(chalk.bold.cyan('\n【Tokenizer 测试】\n'));

const tests = [
  {
    name: '基本数字',
    code: '42',
    expected: [{ type: 'NUMBER', value: 42 }]
  },
  {
    name: '浮点数',
    code: '3.14',
    expected: [{ type: 'NUMBER', value: 3.14 }]
  },
  {
    name: '标识符',
    code: 'myVar',
    expected: [{ type: 'IDENTIFIER', value: 'myVar' }]
  },
  {
    name: '关键字',
    code: 'const let var',
    expected: [
      { type: 'KEYWORD', value: 'const' },
      { type: 'KEYWORD', value: 'let' },
      { type: 'KEYWORD', value: 'var' }
    ]
  },
  {
    name: '字符串',
    code: '"hello world"',
    expected: [{ type: 'STRING', value: 'hello world' }]
  },
  {
    name: '操作符',
    code: '+ - * / == !=',
    expected: [
      { type: 'OPERATOR', value: '+' },
      { type: 'OPERATOR', value: '-' },
      { type: 'OPERATOR', value: '*' },
      { type: 'OPERATOR', value: '/' },
      { type: 'OPERATOR', value: '==' },
      { type: 'OPERATOR', value: '!=' }
    ]
  },
  {
    name: '变量声明',
    code: 'const x = 10;',
    expected: [
      { type: 'KEYWORD', value: 'const' },
      { type: 'IDENTIFIER', value: 'x' },
      { type: 'OPERATOR', value: '=' },
      { type: 'NUMBER', value: 10 },
      { type: 'PUNCTUATION', value: ';' }
    ]
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    const tokenizer = new Tokenizer(test.code);
    const tokens = tokenizer.tokenize();
    
    // 比较结果
    let match = true;
    if (tokens.length !== test.expected.length) {
      match = false;
    } else {
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== test.expected[i].type || 
            tokens[i].value !== test.expected[i].value) {
          match = false;
          break;
        }
      }
    }
    
    if (match) {
      console.log(chalk.green(`✓ ${test.name}`));
      passed++;
    } else {
      console.log(chalk.red(`✗ ${test.name}`));
      console.log(chalk.white('  期望:'), JSON.stringify(test.expected));
      console.log(chalk.white('  实际:'), JSON.stringify(tokens));
      failed++;
    }
  } catch (error) {
    console.log(chalk.red(`✗ ${test.name} - ${error.message}`));
    failed++;
  }
});

console.log(chalk.gray('\n' + '─'.repeat(50)));
console.log(chalk.bold.white(`\n总计: ${passed + failed} 个测试`));
console.log(chalk.green(`通过: ${passed}`));
if (failed > 0) {
  console.log(chalk.red(`失败: ${failed}`));
}
console.log();

