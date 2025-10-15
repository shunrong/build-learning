/**
 * 分析变量引用关系
 * 演示如何使用 Path 和 Scope 分析变量的声明和引用
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 03】分析变量引用关系\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
const globalVar = 'I am global';

function outer() {
  const outerVar = 'I am in outer';
  let counter = 0;
  
  function inner() {
    const innerVar = 'I am in inner';
    console.log(globalVar);  // 引用全局变量
    console.log(outerVar);   // 引用外层变量
    console.log(innerVar);   // 引用本地变量
    counter++;               // 修改外层变量
  }
  
  inner();
  console.log(counter);
  return inner;
}

// 未使用的变量
const unused = 'never used';

// 被使用的变量
const used = 'I am used';
console.log(used);

// 重复声明（不同作用域）
const name = 'outer';
{
  const name = 'inner';
  console.log(name);
}
console.log(name);
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code, {
  sourceType: 'module'
});

// 分析结果
const analysis = {
  variables: [],
  unused: [],
  shadowed: []
};

// 定义 Visitor
const visitor = {
  Scope(path) {
    // 遍历当前作用域的所有绑定
    Object.keys(path.scope.bindings).forEach(name => {
      const binding = path.scope.bindings[name];
      
      // 收集变量信息
      const info = {
        name,
        kind: binding.kind, // 'var', 'let', 'const', 'param', etc.
        references: binding.referencePaths.length,
        constantViolations: binding.constantViolations.length,
        scope: getScopeName(binding.scope),
        line: binding.path.node.loc ? binding.path.node.loc.start.line : 'unknown',
        referenced: binding.referenced
      };
      
      analysis.variables.push(info);
      
      // 检查未使用的变量
      if (!binding.referenced && binding.kind !== 'param') {
        analysis.unused.push(info);
      }
      
      // 检查变量遮蔽（shadowing）
      if (binding.scope.parent) {
        const parentBinding = binding.scope.parent.getBinding(name);
        if (parentBinding) {
          analysis.shadowed.push({
            name,
            inner: info,
            outer: {
              name,
              scope: getScopeName(parentBinding.scope),
              line: parentBinding.path.node.loc ? parentBinding.path.node.loc.start.line : 'unknown'
            }
          });
        }
      }
    });
  }
};

// 获取作用域名称
function getScopeName(scope) {
  if (scope.block.type === 'Program') {
    return 'global';
  } else if (scope.block.type === 'FunctionDeclaration' || scope.block.type === 'FunctionExpression') {
    const name = scope.block.id ? scope.block.id.name : 'anonymous';
    return `function:${name}`;
  } else if (scope.block.type === 'ArrowFunctionExpression') {
    return 'function:arrow';
  } else if (scope.block.type === 'BlockStatement') {
    return 'block';
  }
  return scope.block.type;
}

// 遍历 AST
traverse(ast, visitor);

// 输出所有变量
console.log(chalk.bold.green(`\n✅ 变量声明分析 (共 ${analysis.variables.length} 个)\n`));

analysis.variables.forEach((v, i) => {
  const color = v.referenced ? chalk.green : chalk.gray;
  const status = v.referenced ? '✓' : '✗';
  
  console.log(color(`${i + 1}. ${v.name} ${status}`));
  console.log(chalk.white(`   类型: ${v.kind} | 作用域: ${v.scope} | 第 ${v.line} 行`));
  console.log(chalk.white(`   引用次数: ${v.references}`));
  
  if (v.constantViolations > 0) {
    console.log(chalk.yellow(`   ⚠️  被修改 ${v.constantViolations} 次`));
  }
  
  console.log();
});

// 输出未使用的变量
if (analysis.unused.length > 0) {
  console.log(chalk.gray('='.repeat(70)));
  console.log(chalk.bold.yellow(`\n⚠️  未使用的变量 (${analysis.unused.length} 个):\n`));
  
  analysis.unused.forEach((v, i) => {
    console.log(chalk.yellow(`  ${i + 1}. ${v.name}`));
    console.log(chalk.white(`     位置: ${v.scope} | 第 ${v.line} 行`));
    console.log(chalk.gray(`     建议: 可以考虑删除此变量`));
    console.log();
  });
}

// 输出变量遮蔽
if (analysis.shadowed.length > 0) {
  console.log(chalk.gray('='.repeat(70)));
  console.log(chalk.bold.magenta(`\n🔍 变量遮蔽 (${analysis.shadowed.length} 个):\n`));
  
  analysis.shadowed.forEach((s, i) => {
    console.log(chalk.magenta(`  ${i + 1}. 变量名: ${s.name}`));
    console.log(chalk.white(`     外层声明: ${s.outer.scope} | 第 ${s.outer.line} 行`));
    console.log(chalk.white(`     内层声明: ${s.inner.scope} | 第 ${s.inner.line} 行`));
    console.log(chalk.gray(`     说明: 内层变量遮蔽了外层同名变量`));
    console.log();
  });
}

// 统计信息
console.log(chalk.gray('='.repeat(70)));
console.log(chalk.bold.cyan('\n📊 统计摘要:\n'));

const usedCount = analysis.variables.filter(v => v.referenced).length;
const unusedRate = (analysis.unused.length / analysis.variables.length * 100).toFixed(1);

console.log(chalk.white(`  总变量数: ${analysis.variables.length}`));
console.log(chalk.white(`  已使用: ${usedCount}`));
console.log(chalk.white(`  未使用: ${analysis.unused.length} (${unusedRate}%)`));
console.log(chalk.white(`  变量遮蔽: ${analysis.shadowed.length}`));

// 按类型统计
const kindStats = {};
analysis.variables.forEach(v => {
  kindStats[v.kind] = (kindStats[v.kind] || 0) + 1;
});

console.log(chalk.white('\n  按类型分布:'));
Object.entries(kindStats).forEach(([kind, count]) => {
  console.log(chalk.white(`    ${kind}: ${count} 个`));
});

console.log(chalk.gray('\n='.repeat(70)));
console.log(chalk.green('\n💡 这就是 Scope 和 Binding 的强大之处！\n'));
console.log(chalk.white('   - Scope: 作用域信息'));
console.log(chalk.white('   - Binding: 变量绑定，包含声明、引用、修改等信息'));
console.log(chalk.white('   - 这些能力是实现 ESLint 等工具的基础'));
console.log();

