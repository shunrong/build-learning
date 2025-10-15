/**
 * ES6+ 语法特性的 AST 对比
 */

const parser = require('@babel/parser');
const chalk = require('chalk');

console.log(chalk.bold.cyan('ES6+ 语法特性的 AST 对比\n'));

/**
 * 对比函数
 */
function compareAST(title, oldCode, newCode) {
  console.log(chalk.bold.yellow(`\n【${title}】`));
  console.log(chalk.gray('='.repeat(70)));
  
  console.log(chalk.green('传统写法:'));
  console.log(chalk.white(oldCode));
  
  console.log(chalk.green('\nES6+ 写法:'));
  console.log(chalk.white(newCode));
  
  const oldAST = parser.parse(oldCode);
  const newAST = parser.parse(newCode);
  
  console.log(chalk.cyan('\nAST 差异:'));
  
  const oldNode = oldAST.program.body[0];
  const newNode = newAST.program.body[0];
  
  console.log(chalk.white(`  传统语法节点类型: ${oldNode.type}`));
  console.log(chalk.white(`  ES6+ 语法节点类型: ${newNode.type}`));
  
  // 显示更多细节
  if (oldNode.type === 'FunctionDeclaration' && newNode.type === 'VariableDeclaration') {
    const arrowFunc = newNode.declarations[0].init;
    console.log(chalk.white(`  箭头函数类型: ${arrowFunc.type}`));
    console.log(chalk.white(`  箭头函数表达式: ${arrowFunc.expression}`));
  }
  
  console.log();
}

// 对比 1：函数声明 vs 箭头函数
compareAST(
  '函数声明 vs 箭头函数',
  `function add(a, b) {
  return a + b;
}`,
  `const add = (a, b) => a + b;`
);

// 对比 2：var vs let/const
compareAST(
  'var vs let/const',
  `var count = 0;`,
  `const count = 0;`
);

// 对比 3：传统对象方法 vs 简写方法
compareAST(
  '对象方法 - 传统 vs 简写',
  `const obj = {
  greet: function() {
    return 'Hello';
  }
};`,
  `const obj = {
  greet() {
    return 'Hello';
  }
};`
);

// 对比 4：字符串拼接 vs 模板字面量
console.log(chalk.bold.yellow('\n【字符串拼接 vs 模板字面量】'));
console.log(chalk.gray('='.repeat(70)));

const code1 = `const msg = 'Hello, ' + name + '!';`;
const code2 = `const msg = \`Hello, \${name}!\`;`;

console.log(chalk.green('传统写法:'));
console.log(chalk.white(code1));

console.log(chalk.green('\n模板字面量:'));
console.log(chalk.white(code2));

const ast1 = parser.parse(code1);
const ast2 = parser.parse(code2);

const expr1 = ast1.program.body[0].declarations[0].init;
const expr2 = ast2.program.body[0].declarations[0].init;

console.log(chalk.cyan('\nAST 差异:'));
console.log(chalk.white(`  字符串拼接: ${expr1.type} (需要多个节点)`));
console.log(chalk.white(`  模板字面量: ${expr2.type} (单个节点)`));
console.log(chalk.white(`  模板元素数量: ${expr2.quasis.length}`));
console.log(chalk.white(`  插值表达式数量: ${expr2.expressions.length}`));
console.log();

// 对比 5：Promise vs async/await
compareAST(
  'Promise vs async/await',
  `function fetchData() {
  return fetch('/api')
    .then(res => res.json());
}`,
  `async function fetchData() {
  const res = await fetch('/api');
  return res.json();
}`
);

// 对比 6：解构赋值
console.log(chalk.bold.yellow('\n【解构赋值】'));
console.log(chalk.gray('='.repeat(70)));

const code3 = `const arr = [1, 2, 3];
const a = arr[0];
const b = arr[1];`;

const code4 = `const [a, b] = [1, 2, 3];`;

console.log(chalk.green('传统写法:'));
console.log(chalk.white(code3));

console.log(chalk.green('\n解构赋值:'));
console.log(chalk.white(code4));

const ast3 = parser.parse(code3);
const ast4 = parser.parse(code4);

console.log(chalk.cyan('\nAST 差异:'));
console.log(chalk.white(`  传统写法需要 ${ast3.program.body.length} 个语句`));
console.log(chalk.white(`  解构赋值只需 ${ast4.program.body.length} 个语句`));

const pattern = ast4.program.body[0].declarations[0].id;
console.log(chalk.white(`  解构模式类型: ${pattern.type}`));
console.log(chalk.white(`  解构元素数量: ${pattern.elements.length}`));
console.log();

// 对比 7：类
console.log(chalk.bold.yellow('\n【构造函数 vs 类】'));
console.log(chalk.gray('='.repeat(70)));

const code5 = `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return 'Hello, ' + this.name;
};`;

const code6 = `class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return \`Hello, \${this.name}\`;
  }
}`;

console.log(chalk.green('ES5 构造函数:'));
console.log(chalk.white(code5));

console.log(chalk.green('\nES6 类:'));
console.log(chalk.white(code6));

const ast5 = parser.parse(code5);
const ast6 = parser.parse(code6);

console.log(chalk.cyan('\nAST 差异:'));
console.log(chalk.white(`  ES5 需要 ${ast5.program.body.length} 个语句`));
console.log(chalk.white(`  ES6 只需 ${ast6.program.body.length} 个语句`));

const classDecl = ast6.program.body[0];
console.log(chalk.white(`  类声明类型: ${classDecl.type}`));
console.log(chalk.white(`  类方法数量: ${classDecl.body.body.length}`));
console.log();

console.log(chalk.bold.green('\n✅ 对比完成！'));
console.log(chalk.gray('提示：这些差异直接影响 Babel 等转译工具的工作方式。'));

