/**
 * 复杂代码的 AST 解析示例
 */

const parser = require('@babel/parser');

console.log('复杂代码的 AST 解析示例\n');

// 示例 1：函数声明
console.log('【示例 1】函数声明');
console.log('-'.repeat(60));

const code1 = `
function add(a, b) {
  return a + b;
}
`;

console.log('源代码:');
console.log(code1);

const ast1 = parser.parse(code1);
console.log('AST 结构（格式化）:');
console.log(JSON.stringify(ast1, null, 2));
console.log('\n');

// 示例 2：箭头函数
console.log('【示例 2】箭头函数');
console.log('-'.repeat(60));

const code2 = `const multiply = (x, y) => x * y;`;

console.log('源代码:', code2);
const ast2 = parser.parse(code2);

// 提取关键信息
const declaration = ast2.program.body[0];
const arrowFunc = declaration.declarations[0].init;

console.log('变量名:', declaration.declarations[0].id.name);
console.log('函数类型:', arrowFunc.type);
console.log('参数数量:', arrowFunc.params.length);
console.log('参数:', arrowFunc.params.map(p => p.name).join(', '));
console.log('\n');

// 示例 3：类声明
console.log('【示例 3】类声明');
console.log('-'.repeat(60));

const code3 = `
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return 'Hello, ' + this.name;
  }
}
`;

console.log('源代码:');
console.log(code3);

const ast3 = parser.parse(code3);
const classDecl = ast3.program.body[0];

console.log('类名:', classDecl.id.name);
console.log('方法数量:', classDecl.body.body.length);
console.log('方法列表:', classDecl.body.body.map(m => m.key.name).join(', '));
console.log('\n');

// 示例 4：异步函数
console.log('【示例 4】异步函数');
console.log('-'.repeat(60));

const code4 = `
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
`;

console.log('源代码:');
console.log(code4);

const ast4 = parser.parse(code4);
const asyncFunc = ast4.program.body[0];

console.log('函数名:', asyncFunc.id.name);
console.log('是否异步:', asyncFunc.async);
console.log('是否生成器:', asyncFunc.generator);
console.log('\n');

// 示例 5：对象和数组
console.log('【示例 5】对象和数组');
console.log('-'.repeat(60));

const code5 = `
const user = {
  name: 'Alice',
  age: 25,
  hobbies: ['reading', 'coding']
};
`;

console.log('源代码:');
console.log(code5);

const ast5 = parser.parse(code5);
const objExpr = ast5.program.body[0].declarations[0].init;

console.log('对象类型:', objExpr.type);
console.log('属性数量:', objExpr.properties.length);
console.log('属性名:', objExpr.properties.map(p => p.key.name).join(', '));
console.log('\n');

console.log('='.repeat(60));
console.log('提示：查看完整 AST 结构，可以运行：');
console.log('  console.log(JSON.stringify(ast, null, 2))');
console.log('='.repeat(60));

