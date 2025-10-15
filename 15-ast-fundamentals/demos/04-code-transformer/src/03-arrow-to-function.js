/**
 * 箭头函数转普通函数（兼容性转换）
 * 适用于不支持箭头函数的旧浏览器
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Transformer 03】箭头函数 → 普通函数\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
// 各种箭头函数场景
const utils = {
  // 简单箭头函数
  add: (a, b) => a + b,
  
  // 带块的箭头函数
  multiply: (x, y) => {
    return x * y;
  },
  
  // 数组操作
  processArray: (arr) => {
    return arr
      .filter(n => n > 0)
      .map(n => n * 2)
      .reduce((sum, n) => sum + n, 0);
  }
};

// 异步箭头函数
const fetchUser = async (id) => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};

// 高阶函数
const createMultiplier = (factor) => (value) => value * factor;

// 类中的箭头函数（类字段）
class Counter {
  count = 0;
  
  increment = () => {
    this.count++;
  };
  
  decrement = () => {
    this.count--;
  };
}
`;

console.log(chalk.yellow('📝 原始代码 (ES6+):'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// Parse
console.log(chalk.cyan('\n🔍 Step 1: Parsing...\n'));
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['classProperties']  // 支持类字段
});
console.log(chalk.green('  ✓ 解析完成'));

// Transform
console.log(chalk.cyan('\n🔄 Step 2: Transforming...\n'));

let convertCount = 0;
const convertTypes = {
  expression: 0,   // 表达式形式
  block: 0,        // 块语句形式
  async: 0,        // 异步函数
  nested: 0        // 嵌套函数
};

const visitor = {
  ArrowFunctionExpression(path) {
    const arrowFunc = path.node;
    const line = arrowFunc.loc ? arrowFunc.loc.start.line : '?';
    
    // 统计类型
    if (arrowFunc.async) convertTypes.async++;
    if (arrowFunc.body.type !== 'BlockStatement') {
      convertTypes.expression++;
    } else {
      convertTypes.block++;
    }
    
    // 检查是否嵌套
    if (path.findParent(p => p.isArrowFunctionExpression())) {
      convertTypes.nested++;
    }
    
    console.log(chalk.yellow(`  → 转换箭头函数 (第 ${line} 行)`));
    
    // 创建函数体
    let body;
    // 判断是否是表达式形式（没有花括号）
    if (arrowFunc.body.type !== 'BlockStatement') {
      // 表达式形式：value => value * 2
      // 转换为：function(value) { return value * 2; }
      body = t.blockStatement([
        t.returnStatement(arrowFunc.body)
      ]);
    } else {
      // 块语句形式：已经有 {}
      body = arrowFunc.body;
    }
    
    // 创建普通函数表达式
    const funcExpr = t.functionExpression(
      null,                // id (匿名)
      arrowFunc.params,    // 参数
      body,                // 函数体
      arrowFunc.generator, // 是否生成器
      arrowFunc.async      // 是否异步
    );
    
    // 替换
    path.replaceWith(funcExpr);
    convertCount++;
  }
};

traverse(ast, visitor);

console.log(chalk.green(`\n  ✓ 转换完成，共转换 ${convertCount} 个箭头函数`));

// Generate
console.log(chalk.cyan('\n📦 Step 3: Generating...\n'));

const output = generator(ast, {
  retainLines: false,
  compact: false
});

console.log(chalk.green('  ✓ 生成完成'));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.yellow('\n✨ 转换后的代码 (ES5 兼容):\n'));
console.log(chalk.white(output.code));

// 统计报告
console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.bold.cyan('\n📊 转换统计:\n'));
console.log(chalk.white(`  总转换数: ${convertCount}`));
console.log(chalk.white(`  表达式形式: ${convertTypes.expression}`));
console.log(chalk.white(`  块语句形式: ${convertTypes.block}`));
console.log(chalk.white(`  异步函数: ${convertTypes.async}`));
console.log(chalk.white(`  嵌套函数: ${convertTypes.nested}`));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.green('\n💡 兼容性说明:\n'));
console.log(chalk.white('  ✅ IE 11+     - 不支持箭头函数'));
console.log(chalk.white('  ✅ Safari 9+  - 不支持箭头函数'));
console.log(chalk.white('  ✅ Chrome 45+ - 开始支持箭头函数'));
console.log(chalk.white('  \n  通过此转换，可以让代码在旧浏览器中运行'));
console.log();

