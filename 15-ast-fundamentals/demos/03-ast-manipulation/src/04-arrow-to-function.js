/**
 * 箭头函数转普通函数
 * 演示如何替换 AST 节点
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 04】箭头函数转普通函数\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
// 简单箭头函数
const add = (a, b) => a + b;

// 带块语句的箭头函数
const multiply = (x, y) => {
  const result = x * y;
  return result;
};

// 无参数的箭头函数
const sayHello = () => console.log('Hello');

// 单参数箭头函数（无括号）
const double = n => n * 2;

// 返回对象的箭头函数
const createPoint = (x, y) => ({ x, y });

// 数组方法中的箭头函数
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const filtered = numbers.filter(n => n > 2);

// 嵌套箭头函数
const curry = a => b => a + b;
`;

console.log(chalk.yellow('原始代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code);

// 统计
let convertCount = 0;

// 遍历并转换
const visitor = {
  ArrowFunctionExpression(path) {
    const arrowFunc = path.node;
    
    // 创建函数体
    let body;
    // 判断是否是表达式形式（没有花括号）
    if (arrowFunc.body.type !== 'BlockStatement') {
      // 表达式形式，需要包装成 return 语句
      body = t.blockStatement([
        t.returnStatement(arrowFunc.body)
      ]);
    } else {
      // 已经是块语句
      body = arrowFunc.body;
    }
    
    // 创建普通函数表达式
    const funcExpr = t.functionExpression(
      null,                // id (匿名函数)
      arrowFunc.params,    // params
      body,                // body
      arrowFunc.generator, // generator
      arrowFunc.async      // async
    );
    
    // 替换节点
    path.replaceWith(funcExpr);
    convertCount++;
  }
};

traverse(ast, visitor);

// 生成新代码
const output = generator(ast, {
  retainLines: false,
  compact: false
});

console.log(chalk.green(`\n✅ 成功转换 ${convertCount} 个箭头函数\n`));
console.log(chalk.yellow('转换后的代码:'));
console.log(chalk.white(output.code));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.green('\n💡 节点替换的关键点:\n'));
console.log(chalk.white('  1️⃣  使用 @babel/types 创建新节点'));
console.log(chalk.white('  2️⃣  区分 expression 形式和 block 形式'));
console.log(chalk.white('  3️⃣  使用 path.replaceWith() 替换节点'));
console.log(chalk.white('  4️⃣  保留 async/generator 等属性'));
console.log();

console.log(chalk.cyan('转换对比:\n'));
console.log(chalk.yellow('  箭头函数:       ') + chalk.white('const add = (a, b) => a + b;'));
console.log(chalk.green('  普通函数:       ') + chalk.white('const add = function (a, b) { return a + b; };'));
console.log();

