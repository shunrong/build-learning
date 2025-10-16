const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const chalk = require('chalk');

class SimpleMinifier {
  minify(code) {
    const ast = parser.parse(code, { sourceType: 'module' });
    
    // 1. 移除注释（已在 parse 时处理）
    // 2. 变量名混淆
    const varMap = new Map();
    let varCounter = 0;
    
    traverse(ast, {
      Identifier(path) {
        if (path.isReferencedIdentifier()) {
          const name = path.node.name;
          if (!varMap.has(name) && path.scope.hasBinding(name)) {
            varMap.set(name, `v${varCounter++}`);
          }
          if (varMap.has(name)) {
            path.node.name = varMap.get(name);
          }
        }
      }
    });
    
    // 3. 生成代码（移除空白）
    const output = generate(ast, {
      compact: true,    // 紧凑模式
      comments: false,  // 移除注释
      minified: true    // 压缩
    });
    
    return output.code;
  }
}

// 演示
console.log(chalk.bold.blue('\n========== Simple Minifier 演示 ==========\n'));

const minifier = new SimpleMinifier();

const code1 = `
  function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += items[i].price;
    }
    return total;
  }
`;

console.log(chalk.yellow('【示例 1】函数压缩\n'));
console.log(chalk.gray('原始代码:'));
console.log(code1);
console.log(chalk.green('压缩后:'));
console.log(minifier.minify(code1));

const code2 = `
  const x = 1 + 2;
  const y = x * 3;
  const z = y + 10;
`;

console.log(chalk.yellow('\n【示例 2】变量压缩\n'));
console.log(chalk.gray('原始代码:'), code2.trim());
console.log(chalk.green('压缩后:'));
console.log(minifier.minify(code2));

console.log(chalk.bold.green('\n✅ 压缩演示完成！'));
console.log(chalk.gray('\n核心技术：'));
console.log(chalk.gray('1. 变量名混淆'));
console.log(chalk.gray('2. 移除注释'));
console.log(chalk.gray('3. 移除空白符\n'));

