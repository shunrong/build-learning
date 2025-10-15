/**
 * 简单 Linter 实现
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║          简单 Linter 实现                       ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

class SimpleLinter {
  constructor() {
    this.rules = [];
    this.errors = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  lint(code) {
    this.errors = [];
    
    // 解析代码为 AST
    const ast = parser.parse(code, {
      sourceType: 'module'
    });
    
    // 遍历 AST，应用规则
    traverse(ast, {
      enter: (path) => {
        this.rules.forEach(rule => {
          rule(path, this);
        });
      }
    });
    
    return this.errors;
  }

  report(node, message) {
    this.errors.push({
      line: node.loc.start.line,
      column: node.loc.start.column,
      message
    });
  }
}

// 规则：禁止使用 var
function noVarRule(path, linter) {
  if (path.node.type === 'VariableDeclaration' && path.node.kind === 'var') {
    linter.report(path.node, '禁止使用 var，请使用 let 或 const');
  }
}

// 规则：禁止使用 console.log
function noConsoleLogRule(path, linter) {
  if (
    path.node.type === 'CallExpression' &&
    path.node.callee.type === 'MemberExpression' &&
    path.node.callee.object.name === 'console' &&
    path.node.callee.property.name === 'log'
  ) {
    linter.report(path.node, '禁止使用 console.log');
  }
}

// 测试
const code = `
var x = 1;
const y = 2;
console.log('test');
console.warn('warning');
`;

const linter = new SimpleLinter();
linter.addRule(noVarRule);
linter.addRule(noConsoleLogRule);

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

const errors = linter.lint(code);

console.log(chalk.red(`\n发现 ${errors.length} 个问题:\n`));
errors.forEach(error => {
  console.log(chalk.red(`  ${error.line}:${error.column}  ${error.message}`));
});

console.log(chalk.green('\n✅ Linter 检查完成\n'));
