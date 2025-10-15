/**
 * 收集所有函数声明
 * 演示基本的 Visitor 模式使用
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 01】收集所有函数声明\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
// 普通函数声明
function add(a, b) {
  return a + b;
}

// 箭头函数
const multiply = (x, y) => x * y;

// 对象方法
const calculator = {
  divide(a, b) {
    return a / b;
  },
  
  subtract: function(a, b) {
    return a - b;
  }
};

// 类方法
class MathHelper {
  square(n) {
    return n * n;
  }
  
  static cube(n) {
    return n * n * n;
  }
}

// 嵌套函数
function outer() {
  function inner() {
    return 'nested';
  }
  return inner;
}

// 异步函数
async function fetchData() {
  return await Promise.resolve('data');
}

// 生成器函数
function* generator() {
  yield 1;
  yield 2;
}
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code, {
  sourceType: 'module'
});

// 收集函数信息
const functions = [];

// 定义 Visitor
const visitor = {
  // 函数声明
  FunctionDeclaration(path) {
    const node = path.node;
    functions.push({
      type: 'FunctionDeclaration',
      name: node.id.name,
      params: node.params.map(p => p.name),
      async: node.async,
      generator: node.generator,
      line: node.loc.start.line
    });
  },
  
  // 箭头函数表达式
  ArrowFunctionExpression(path) {
    // 获取变量名（如果是变量声明的一部分）
    let name = 'anonymous';
    if (path.parent.type === 'VariableDeclarator' && path.parent.id) {
      name = path.parent.id.name;
    }
    
    const node = path.node;
    functions.push({
      type: 'ArrowFunctionExpression',
      name,
      params: node.params.map(p => p.name),
      expression: node.expression,
      line: node.loc.start.line
    });
  },
  
  // 对象方法
  ObjectMethod(path) {
    const node = path.node;
    functions.push({
      type: 'ObjectMethod',
      name: node.key.name || node.key.value,
      params: node.params.map(p => p.name),
      kind: node.kind, // 'method', 'get', 'set'
      line: node.loc.start.line
    });
  },
  
  // 类方法
  ClassMethod(path) {
    const node = path.node;
    functions.push({
      type: 'ClassMethod',
      name: node.key.name || node.key.value,
      params: node.params.map(p => p.name),
      kind: node.kind, // 'constructor', 'method', 'get', 'set'
      static: node.static,
      line: node.loc.start.line
    });
  }
};

// 遍历 AST
traverse(ast, visitor);

// 输出结果
console.log(chalk.bold.green(`\n✅ 共找到 ${functions.length} 个函数\n`));

functions.forEach((fn, index) => {
  console.log(chalk.cyan(`${index + 1}. ${fn.name}`));
  console.log(chalk.white(`   类型: ${fn.type}`));
  console.log(chalk.white(`   参数: ${fn.params.join(', ') || '(无参数)'}`));
  
  if (fn.async) {
    console.log(chalk.yellow(`   异步: ✓`));
  }
  
  if (fn.generator) {
    console.log(chalk.yellow(`   生成器: ✓`));
  }
  
  if (fn.static) {
    console.log(chalk.yellow(`   静态方法: ✓`));
  }
  
  if (fn.expression !== undefined) {
    console.log(chalk.white(`   表达式形式: ${fn.expression ? '是' : '否'}`));
  }
  
  if (fn.kind && fn.kind !== 'method') {
    console.log(chalk.white(`   方法类型: ${fn.kind}`));
  }
  
  console.log(chalk.gray(`   位置: 第 ${fn.line} 行`));
  console.log();
});

// 统计信息
console.log(chalk.gray('='.repeat(70)));
console.log(chalk.bold.yellow('\n统计信息:\n'));

const stats = {
  FunctionDeclaration: 0,
  ArrowFunctionExpression: 0,
  ObjectMethod: 0,
  ClassMethod: 0
};

functions.forEach(fn => {
  stats[fn.type]++;
});

console.log(chalk.white(`  函数声明: ${stats.FunctionDeclaration}`));
console.log(chalk.white(`  箭头函数: ${stats.ArrowFunctionExpression}`));
console.log(chalk.white(`  对象方法: ${stats.ObjectMethod}`));
console.log(chalk.white(`  类方法: ${stats.ClassMethod}`));

console.log(chalk.gray('\n='.repeat(70)));
console.log(chalk.green('\n💡 这就是 Visitor 模式的威力！\n'));
console.log(chalk.white('   通过定义不同的访问器，可以精确地收集特定类型的节点。'));
console.log();

