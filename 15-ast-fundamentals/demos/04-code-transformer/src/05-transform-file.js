/**
 * 文件转换器
 * 读取文件、转换、输出到新文件
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Transformer 05】文件转换器\n'));
console.log(chalk.gray('='.repeat(70)));

// 获取输入文件路径
const inputFile = process.argv[2] || 'input.js';
const outputFile = inputFile.replace('.js', '.transformed.js');

console.log(chalk.cyan('配置:'));
console.log(chalk.white(`  输入文件: ${inputFile}`));
console.log(chalk.white(`  输出文件: ${outputFile}`));
console.log();

// 检查文件是否存在
if (!fs.existsSync(inputFile)) {
  console.log(chalk.yellow('⚠️  输入文件不存在，使用默认示例代码\n'));
  
  // 创建示例文件
  const sampleCode = `// 示例代码 - 将被转换
const greeting = (name) => {
  console.log(\`Hello, \${name}!\`);
  debugger;
  return \`Welcome, \${name}\`;
};

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

console.log('Numbers:', numbers);
console.log('Doubled:', doubled);

debugger;
greeting('World');
`;
  
  fs.writeFileSync(inputFile, sampleCode, 'utf-8');
  console.log(chalk.green(`✓ 已创建示例文件: ${inputFile}\n`));
}

// 读取文件
console.log(chalk.cyan('📖 Reading file...\n'));
const code = fs.readFileSync(inputFile, 'utf-8');

console.log(chalk.yellow('原始代码:'));
console.log(chalk.gray('-'.repeat(70)));
console.log(chalk.white(code));
console.log(chalk.gray('-'.repeat(70)));

// Parse
console.log(chalk.cyan('\n🔍 Parsing...\n'));
const ast = parser.parse(code, {
  sourceType: 'module'
});
console.log(chalk.green('  ✓ 解析完成'));

// Transform (应用多个转换)
console.log(chalk.cyan('\n🔄 Transforming...\n'));

const stats = {
  removedDebugger: 0,
  removedConsole: 0,
  convertedArrow: 0,
  convertedConst: 0
};

const visitor = {
  // 1. 删除 debugger
  DebuggerStatement(path) {
    console.log(chalk.yellow('  × 删除 debugger'));
    path.remove();
    stats.removedDebugger++;
  },
  
  // 2. 删除 console.log (保留 error 和 warn)
  CallExpression(path) {
    const { callee } = path.node;
    
    if (
      callee.type === 'MemberExpression' &&
      callee.object.type === 'Identifier' &&
      callee.object.name === 'console' &&
      callee.property.type === 'Identifier'
    ) {
      const method = callee.property.name;
      
      if (!['error', 'warn'].includes(method)) {
        console.log(chalk.yellow(`  × 删除 console.${method}()`));
        
        if (path.parent.type === 'ExpressionStatement') {
          path.parentPath.remove();
        } else {
          path.remove();
        }
        
        stats.removedConsole++;
      }
    }
  },
  
  // 3. 箭头函数 → 普通函数
  ArrowFunctionExpression(path) {
    console.log(chalk.cyan('  → 转换箭头函数'));
    
    const arrowFunc = path.node;
    
    let body;
    // 判断是否是表达式形式（没有花括号）
    if (arrowFunc.body.type !== 'BlockStatement') {
      body = t.blockStatement([
        t.returnStatement(arrowFunc.body)
      ]);
    } else {
      body = arrowFunc.body;
    }
    
    const funcExpr = t.functionExpression(
      null,
      arrowFunc.params,
      body,
      arrowFunc.generator,
      arrowFunc.async
    );
    
    path.replaceWith(funcExpr);
    stats.convertedArrow++;
  },
  
  // 4. const/let → var
  VariableDeclaration(path) {
    const kind = path.node.kind;
    
    if (kind === 'const' || kind === 'let') {
      console.log(chalk.cyan(`  → 转换 ${kind} → var`));
      path.node.kind = 'var';
      stats.convertedConst++;
    }
  }
};

traverse(ast, visitor);

console.log(chalk.green('\n  ✓ 转换完成'));

// Generate
console.log(chalk.cyan('\n📦 Generating...\n'));

const output = generator(ast, {
  retainLines: false,
  compact: false,
  comments: true
});

console.log(chalk.green('  ✓ 生成完成'));

// 写入文件
console.log(chalk.cyan('\n💾 Writing to file...\n'));
fs.writeFileSync(outputFile, output.code, 'utf-8');
console.log(chalk.green(`  ✓ 已保存到: ${outputFile}`));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.yellow('\n✨ 转换后的代码:\n'));
console.log(chalk.gray('-'.repeat(70)));
console.log(chalk.white(output.code));
console.log(chalk.gray('-'.repeat(70)));

// 统计报告
console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.bold.cyan('\n📊 转换统计:\n'));
console.log(chalk.white(`  删除 debugger:     ${stats.removedDebugger} 个`));
console.log(chalk.white(`  删除 console:      ${stats.removedConsole} 个`));
console.log(chalk.white(`  转换箭头函数:      ${stats.convertedArrow} 个`));
console.log(chalk.white(`  转换 const/let:    ${stats.convertedConst} 个`));

const total = Object.values(stats).reduce((sum, n) => sum + n, 0);
console.log(chalk.white(`\n  总计:              ${total} 个转换`));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.green('\n✅ 文件转换完成！\n'));
console.log(chalk.cyan('使用方法:'));
console.log(chalk.white('  node src/05-transform-file.js <input-file>'));
console.log(chalk.white('  示例: node src/05-transform-file.js mycode.js'));
console.log();

