/**
 * Parser 特性对比
 * 测试不同 Parser 对各种语法特性的支持
 */

const chalk = require('chalk');
const babel = require('@babel/parser');
const acorn = require('acorn');
const esprima = require('esprima');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║          Parser 特性支持对比                    ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

const testCases = [
  {
    name: 'ES6 箭头函数',
    code: 'const add = (a, b) => a + b;'
  },
  {
    name: 'ES6 Class',
    code: 'class Person { constructor(name) { this.name = name; } }'
  },
  {
    name: 'ES6 解构',
    code: 'const { name, age } = person;'
  },
  {
    name: 'ES6 模板字符串',
    code: 'const msg = `Hello ${name}`;'
  },
  {
    name: 'ES2020 Optional Chaining',
    code: 'const name = user?.profile?.name;'
  },
  {
    name: 'ES2020 Nullish Coalescing',
    code: 'const value = input ?? defaultValue;'
  },
  {
    name: 'ES2022 Class Fields',
    code: 'class Test { count = 0; }'
  },
  {
    name: 'JSX (React)',
    code: 'const element = <div>Hello</div>;'
  },
  {
    name: 'TypeScript 类型注解',
    code: 'const name: string = "Alice";'
  }
];

function testParser(parserName, parseFn) {
  console.log(chalk.bold.yellow(`\n【${parserName}】`));
  console.log(chalk.gray('─'.repeat(70)));
  
  testCases.forEach(({ name, code }) => {
    try {
      parseFn(code);
      console.log(chalk.green(`✓ ${name}`));
    } catch (error) {
      console.log(chalk.red(`✗ ${name}`));
      console.log(chalk.gray(`  ${error.message.split('\n')[0]}`));
    }
  });
}

// Babel Parser
testParser('Babel Parser', (code) => {
  babel.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
});

// Acorn
testParser('Acorn', (code) => {
  acorn.parse(code, {
    ecmaVersion: 2022,
    sourceType: 'module'
  });
});

// Esprima
testParser('Esprima', (code) => {
  esprima.parseModule(code);
});

console.log(chalk.bold.green('\n\n✅ 特性对比完成\n'));

// 总结
console.log(chalk.bold.cyan('📊 总结\n'));
console.log(chalk.white('Babel Parser:'));
console.log(chalk.green('  ✓ 支持最新 ECMAScript 语法'));
console.log(chalk.green('  ✓ 支持 JSX'));
console.log(chalk.green('  ✓ 支持 TypeScript'));
console.log(chalk.green('  ✓ 插件系统丰富\n'));

console.log(chalk.white('Acorn:'));
console.log(chalk.green('  ✓ 支持 ES2022 标准语法'));
console.log(chalk.yellow('  ~ JSX/TS 需要插件'));
console.log(chalk.green('  ✓ 性能优秀'));
console.log(chalk.green('  ✓ 体积小\n'));

console.log(chalk.white('Esprima:'));
console.log(chalk.green('  ✓ 符合 ESTree 标准'));
console.log(chalk.red('  ✗ 仅支持到 ES2021'));
console.log(chalk.red('  ✗ 不支持 JSX/TS'));
console.log(chalk.yellow('  ~ 更新较慢\n'));
