/**
 * 收集所有变量声明
 * 演示如何分析不同类型的变量声明（var, let, const）
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 02】收集所有变量声明\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
// var 声明
var oldStyle = 'before ES6';
var a = 1, b = 2, c = 3;

// let 声明
let mutableValue = 100;
let x, y, z;

// const 声明
const PI = 3.14159;
const MAX_SIZE = 1000;

// 解构赋值
const { name, age } = person;
const [first, second, ...rest] = array;
let { x: posX, y: posY } = point;

// 嵌套解构
const {
  user: { email, profile: { avatar } }
} = data;

// 函数参数（也算变量声明）
function process(input, options = {}) {
  // 函数内部的 let
  let result = null;
  
  // 函数内部的 const
  const temp = input * 2;
  
  return temp;
}

// for 循环中的变量
for (let i = 0; i < 10; i++) {
  const square = i * i;
}

// for...of 循环
for (const item of items) {
  console.log(item);
}

// try-catch
try {
  doSomething();
} catch (error) {
  console.error(error);
}
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code, {
  sourceType: 'module'
});

// 收集变量信息
const variables = [];

// 定义 Visitor
const visitor = {
  VariableDeclaration(path) {
    const node = path.node;
    const kind = node.kind; // 'var', 'let', 'const'
    
    node.declarations.forEach(declarator => {
      // 提取变量名（支持解构）
      const names = extractNames(declarator.id);
      
      names.forEach(name => {
        variables.push({
          name,
          kind,
          hasInit: declarator.init !== null,
          initType: declarator.init ? declarator.init.type : null,
          isDestructuring: declarator.id.type !== 'Identifier',
          destructuringType: declarator.id.type,
          line: node.loc.start.line,
          scope: getScopeType(path)
        });
      });
    });
  }
};

// 提取变量名（支持解构）
function extractNames(node) {
  const names = [];
  
  if (node.type === 'Identifier') {
    names.push(node.name);
  } else if (node.type === 'ObjectPattern') {
    node.properties.forEach(prop => {
      if (prop.type === 'RestElement') {
        names.push(...extractNames(prop.argument));
      } else {
        names.push(...extractNames(prop.value));
      }
    });
  } else if (node.type === 'ArrayPattern') {
    node.elements.forEach(elem => {
      if (elem) {
        if (elem.type === 'RestElement') {
          names.push(...extractNames(elem.argument));
        } else {
          names.push(...extractNames(elem));
        }
      }
    });
  }
  
  return names;
}

// 获取作用域类型
function getScopeType(path) {
  const parent = path.parent;
  
  if (path.scope.block.type === 'Program') {
    return 'global';
  } else if (parent.type === 'ForStatement' || parent.type === 'ForOfStatement' || parent.type === 'ForInStatement') {
    return 'for-loop';
  } else if (path.getFunctionParent()) {
    return 'function';
  } else if (path.scope.block.type === 'BlockStatement') {
    return 'block';
  }
  
  return 'other';
}

// 遍历 AST
traverse(ast, visitor);

// 输出结果
console.log(chalk.bold.green(`\n✅ 共找到 ${variables.length} 个变量声明\n`));

// 按 kind 分组
const grouped = {
  var: [],
  let: [],
  const: []
};

variables.forEach(v => {
  grouped[v.kind].push(v);
});

// 输出 var 声明
if (grouped.var.length > 0) {
  console.log(chalk.bold.red(`\n📦 var 声明 (${grouped.var.length} 个):\n`));
  grouped.var.forEach((v, i) => {
    console.log(chalk.red(`  ${i + 1}. ${v.name}`));
    console.log(chalk.white(`     ${v.hasInit ? '有初始值' : '未初始化'} | 作用域: ${v.scope} | 第 ${v.line} 行`));
    if (v.isDestructuring) {
      console.log(chalk.gray(`     解构类型: ${v.destructuringType}`));
    }
  });
}

// 输出 let 声明
if (grouped.let.length > 0) {
  console.log(chalk.bold.yellow(`\n📦 let 声明 (${grouped.let.length} 个):\n`));
  grouped.let.forEach((v, i) => {
    console.log(chalk.yellow(`  ${i + 1}. ${v.name}`));
    console.log(chalk.white(`     ${v.hasInit ? '有初始值' : '未初始化'} | 作用域: ${v.scope} | 第 ${v.line} 行`));
    if (v.isDestructuring) {
      console.log(chalk.gray(`     解构类型: ${v.destructuringType}`));
    }
  });
}

// 输出 const 声明
if (grouped.const.length > 0) {
  console.log(chalk.bold.green(`\n📦 const 声明 (${grouped.const.length} 个):\n`));
  grouped.const.forEach((v, i) => {
    console.log(chalk.green(`  ${i + 1}. ${v.name}`));
    console.log(chalk.white(`     ${v.hasInit ? '有初始值' : '未初始化'} | 作用域: ${v.scope} | 第 ${v.line} 行`));
    if (v.isDestructuring) {
      console.log(chalk.gray(`     解构类型: ${v.destructuringType}`));
    }
  });
}

// 统计信息
console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.bold.cyan('\n📊 统计分析:\n'));

console.log(chalk.white(`  var:   ${grouped.var.length} 个 (${(grouped.var.length / variables.length * 100).toFixed(1)}%)`));
console.log(chalk.white(`  let:   ${grouped.let.length} 个 (${(grouped.let.length / variables.length * 100).toFixed(1)}%)`));
console.log(chalk.white(`  const: ${grouped.const.length} 个 (${(grouped.const.length / variables.length * 100).toFixed(1)}%)`));

const destructuringCount = variables.filter(v => v.isDestructuring).length;
console.log(chalk.white(`\n  解构赋值: ${destructuringCount} 个 (${(destructuringCount / variables.length * 100).toFixed(1)}%)`));

const scopeStats = {};
variables.forEach(v => {
  scopeStats[v.scope] = (scopeStats[v.scope] || 0) + 1;
});

console.log(chalk.white('\n  作用域分布:'));
Object.entries(scopeStats).forEach(([scope, count]) => {
  console.log(chalk.white(`    ${scope}: ${count} 个`));
});

console.log(chalk.gray('\n='.repeat(70)));
console.log(chalk.green('\n💡 通过 AST 遍历，可以轻松分析变量的使用模式！\n'));
console.log(chalk.white('   这对代码质量检查、重构工具等场景非常有用。'));
console.log();

