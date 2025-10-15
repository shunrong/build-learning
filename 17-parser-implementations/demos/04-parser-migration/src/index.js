/**
 * Parser 迁移指南
 * 演示如何从一个 Parser 迁移到另一个 Parser
 */

const chalk = require('chalk');
const babel = require('@babel/parser');
const acorn = require('acorn');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║          Parser 迁移示例                        ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

const code = `
const greeting = "Hello";
function greet(name) {
  return greeting + ", " + name;
}
const result = greet("World");
`;

// 场景1: Babel Parser 解析 + 遍历 + 生成
console.log(chalk.bold.yellow('【场景 1】Babel 完整工作流'));
console.log(chalk.gray('─'.repeat(70)));
console.log(chalk.white('源代码:'), chalk.cyan(code.trim()));

const babelAst = babel.parse(code, { sourceType: 'module' });
console.log(chalk.green('\n✓ Babel 解析成功'));

// 遍历 AST
let functionCount = 0;
let variableCount = 0;

traverse(babelAst, {
  FunctionDeclaration(path) {
    functionCount++;
    console.log(chalk.blue(`  找到函数: ${path.node.id.name}`));
  },
  VariableDeclaration(path) {
    variableCount++;
    path.node.declarations.forEach(decl => {
      console.log(chalk.blue(`  找到变量: ${decl.id.name}`));
    });
  }
});

console.log(chalk.white(`\n统计: ${functionCount} 个函数, ${variableCount} 个变量声明`));

// 生成代码
const output = generate(babelAst);
console.log(chalk.green('\n✓ 代码生成成功'));
console.log(chalk.gray('生成的代码:'), chalk.white(output.code.trim()));

// 场景2: Acorn 解析
console.log(chalk.bold.yellow('\n\n【场景 2】Acorn 解析'));
console.log(chalk.gray('─'.repeat(70)));

const acornAst = acorn.parse(code, {
  ecmaVersion: 2020,
  sourceType: 'module'
});

console.log(chalk.green('✓ Acorn 解析成功'));
console.log(chalk.white('AST 类型:'), acornAst.type);
console.log(chalk.white('语句数量:'), acornAst.body.length);

// 手动遍历 Acorn AST
function countNodes(node, type) {
  let count = 0;
  
  function walk(n) {
    if (n && typeof n === 'object') {
      if (n.type === type) count++;
      
      for (const key in n) {
        if (key !== 'loc' && key !== 'range') {
          const value = n[key];
          if (Array.isArray(value)) {
            value.forEach(walk);
          } else if (value && typeof value === 'object') {
            walk(value);
          }
        }
      }
    }
  }
  
  walk(node);
  return count;
}

const funcCount = countNodes(acornAst, 'FunctionDeclaration');
const varCount = countNodes(acornAst, 'VariableDeclaration');

console.log(chalk.white(`统计: ${funcCount} 个函数, ${varCount} 个变量声明`));

// 迁移建议
console.log(chalk.bold.cyan('\n\n📋 迁移建议\n'));
console.log(chalk.white('从 Babel 迁移到 Acorn:'));
console.log(chalk.yellow('  1. 检查是否需要 JSX/TypeScript 支持'));
console.log(chalk.yellow('  2. 使用 acorn-walk 替代 @babel/traverse'));
console.log(chalk.yellow('  3. 使用 escodegen 或 astring 替代 @babel/generator'));
console.log(chalk.yellow('  4. 性能提升约 2-5x\n'));

console.log(chalk.white('从 Acorn 迁移到 Babel:'));
console.log(chalk.yellow('  1. 需要支持最新语法或 JSX/TS'));
console.log(chalk.yellow('  2. 生态更丰富，插件更多'));
console.log(chalk.yellow('  3. 更好的错误提示'));
console.log(chalk.yellow('  4. 性能略低但功能更强\n'));

console.log(chalk.bold.green('✅ 迁移示例完成\n'));
