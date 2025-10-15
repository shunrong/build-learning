/**
 * AST 基础探索 - 主入口
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║             AST 基础探索 - Abstract Syntax Tree                   ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════════════╝\n'));

console.log(chalk.yellow('本 Demo 包含以下示例：\n'));

console.log(chalk.white('  1️⃣  简单解析示例'));
console.log(chalk.gray('     命令: npm run parse:simple'));
console.log(chalk.gray('     内容: 解析各种简单的 JavaScript 表达式，查看 AST 节点类型\n'));

console.log(chalk.white('  2️⃣  复杂代码解析'));
console.log(chalk.gray('     命令: npm run parse:complex'));
console.log(chalk.gray('     内容: 解析函数、类、异步代码等复杂结构\n'));

console.log(chalk.white('  3️⃣  语法对比'));
console.log(chalk.gray('     命令: npm run compare'));
console.log(chalk.gray('     内容: 对比 ES5 vs ES6+ 语法的 AST 差异\n'));

console.log(chalk.white('  4️⃣  AST 可视化'));
console.log(chalk.gray('     命令: npm run visualize'));
console.log(chalk.gray('     内容: 以树形结构展示 AST，更直观理解代码结构\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.yellow('推荐学习路径：\n'));
console.log(chalk.white('  1. 先运行 parse:simple，了解基本的 AST 节点类型'));
console.log(chalk.white('  2. 然后运行 visualize，通过树形结构直观理解'));
console.log(chalk.white('  3. 再运行 parse:complex，学习复杂代码的 AST'));
console.log(chalk.white('  4. 最后运行 compare，理解不同语法的 AST 差异\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.cyan('配合在线工具学习：'));
console.log(chalk.white('  🌐 AST Explorer: https://astexplorer.net/'));
console.log(chalk.gray('     在浏览器中实时查看任意代码的 AST 结构\n'));

console.log(chalk.cyan('关键概念：'));
console.log(chalk.white('  📦 Program       - AST 的根节点'));
console.log(chalk.white('  📝 Statement     - 语句节点（如 if, for, return）'));
console.log(chalk.white('  🔢 Expression    - 表达式节点（如 1 + 2, fn()）'));
console.log(chalk.white('  🏷️  Identifier    - 标识符（变量名、函数名）'));
console.log(chalk.white('  💎 Literal       - 字面量（数字、字符串、布尔值）\n'));

console.log(chalk.bold.green('════════════════════════════════════════════════════════════════════\n'));

// 快速演示
console.log(chalk.bold.yellow('快速演示：\n'));

const parser = require('@babel/parser');

const code = 'const x = 42;';
console.log(chalk.green('代码:'), chalk.white(code));

const ast = parser.parse(code);
const statement = ast.program.body[0];
const declaration = statement.declarations[0];

console.log(chalk.cyan('\nAST 结构解析:'));
console.log(chalk.white('  ├─ Program                    (根节点)'));
console.log(chalk.white('  │  └─ body: [...]             (语句列表)'));
console.log(chalk.white('  │     └─ VariableDeclaration  (变量声明)'));
console.log(chalk.white(`  │        ├─ kind: "${statement.kind}"        (声明类型)`));
console.log(chalk.white('  │        └─ declarations: [...]'));
console.log(chalk.white('  │           └─ VariableDeclarator'));
console.log(chalk.white(`  │              ├─ id: Identifier { name: "${declaration.id.name}" }`));
console.log(chalk.white(`  │              └─ init: NumericLiteral { value: ${declaration.init.value} }`));

console.log(chalk.bold.green('\n════════════════════════════════════════════════════════════════════\n'));

console.log(chalk.yellow('开始探索吧！选择一个命令运行：\n'));
console.log(chalk.white('  npm run parse:simple   # 简单示例'));
console.log(chalk.white('  npm run parse:complex  # 复杂示例'));
console.log(chalk.white('  npm run compare        # 语法对比'));
console.log(chalk.white('  npm run visualize      # 可视化（推荐！）\n'));
