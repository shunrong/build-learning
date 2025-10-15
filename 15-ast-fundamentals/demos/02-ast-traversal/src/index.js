/**
 * AST 遍历实践 - 主入口
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║           AST 遍历实践 - Visitor 模式与作用域分析                 ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════════════╝\n'));

console.log(chalk.yellow('本 Demo 包含以下示例：\n'));

console.log(chalk.white('  1️⃣  收集函数声明'));
console.log(chalk.gray('     命令: npm run collect:functions'));
console.log(chalk.gray('     内容: 使用 Visitor 模式收集所有类型的函数（普通函数、箭头函数、方法等）\n'));

console.log(chalk.white('  2️⃣  收集变量声明'));
console.log(chalk.gray('     命令: npm run collect:variables'));
console.log(chalk.gray('     内容: 分析 var/let/const 声明，支持解构赋值识别\n'));

console.log(chalk.white('  3️⃣  分析引用关系'));
console.log(chalk.gray('     命令: npm run analyze:references'));
console.log(chalk.gray('     内容: 检测未使用的变量、变量遮蔽等问题\n'));

console.log(chalk.white('  4️⃣  作用域深度探索'));
console.log(chalk.gray('     命令: npm run scope:demo'));
console.log(chalk.gray('     内容: 可视化作用域链、分析作用域嵌套关系\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.yellow('推荐学习路径：\n'));
console.log(chalk.white('  1. 先运行 collect:functions，理解 Visitor 模式的基本用法'));
console.log(chalk.white('  2. 然后运行 collect:variables，学习如何处理复杂的节点结构'));
console.log(chalk.white('  3. 再运行 analyze:references，掌握 Binding 和引用分析'));
console.log(chalk.white('  4. 最后运行 scope:demo，深入理解作用域链\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.cyan('核心概念：\n'));
console.log(chalk.white('  🎯 Visitor 模式    - 通过定义访问器精确处理特定节点类型'));
console.log(chalk.white('  🛤️  Path 对象       - 节点的包装器，提供丰富的操作方法'));
console.log(chalk.white('  🔍 Scope 对象      - 作用域信息，管理变量的可见性'));
console.log(chalk.white('  🔗 Binding 对象    - 变量绑定，包含声明、引用、修改等信息\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

// 快速演示
console.log(chalk.bold.yellow('快速演示 - Visitor 模式：\n'));

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = `
function greet(name) {
  const message = 'Hello, ' + name;
  return message;
}
`;

console.log(chalk.green('示例代码:'));
console.log(chalk.white(code));

const ast = parser.parse(code);

console.log(chalk.cyan('遍历结果:\n'));

// 定义简单的 Visitor
const visitor = {
  FunctionDeclaration(path) {
    console.log(chalk.yellow('  ✓ 找到函数声明:'), chalk.white(path.node.id.name));
  },
  
  VariableDeclaration(path) {
    const varName = path.node.declarations[0].id.name;
    const varKind = path.node.kind;
    console.log(chalk.yellow(`  ✓ 找到变量声明:`), chalk.white(`${varKind} ${varName}`));
  },
  
  BinaryExpression(path) {
    const op = path.node.operator;
    console.log(chalk.yellow('  ✓ 找到二元表达式:'), chalk.white(`运算符 "${op}"`));
  },
  
  ReturnStatement(path) {
    console.log(chalk.yellow('  ✓ 找到返回语句'));
  }
};

// 遍历 AST
traverse(ast, visitor);

console.log(chalk.bold.green('\n════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.cyan('Visitor 模式的优势：\n'));
console.log(chalk.white('  ✅ 精确性    - 只处理你关心的节点类型'));
console.log(chalk.white('  ✅ 简洁性    - 无需手动递归遍历整个 AST'));
console.log(chalk.white('  ✅ 可维护性  - 每个访问器独立，职责清晰'));
console.log(chalk.white('  ✅ 性能优化  - Babel 内部已经优化了遍历逻辑\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.cyan('实际应用场景：\n'));
console.log(chalk.white('  🔧 ESLint       - 代码规范检查'));
console.log(chalk.white('  🔄 Babel        - 代码转译'));
console.log(chalk.white('  📦 Webpack      - 依赖分析'));
console.log(chalk.white('  🎨 Prettier     - 代码格式化'));
console.log(chalk.white('  🔍 代码分析工具  - 复杂度计算、死代码检测等\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.yellow('选择一个命令开始探索：\n'));
console.log(chalk.white('  npm run collect:functions   # 收集函数'));
console.log(chalk.white('  npm run collect:variables   # 收集变量'));
console.log(chalk.white('  npm run analyze:references  # 分析引用'));
console.log(chalk.white('  npm run scope:demo          # 作用域探索\n'));
