/**
 * AST 可视化 Demo
 * 对比多个代码片段的 AST
 */

const parser = require('@babel/parser');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║                    AST 可视化对比 Demo                             ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════════════╝\n'));

// 示例代码集合
const examples = [
  {
    title: '变量声明对比',
    codes: [
      { label: 'var', code: 'var x = 1;' },
      { label: 'let', code: 'let x = 1;' },
      { label: 'const', code: 'const x = 1;' }
    ]
  },
  {
    title: '函数声明对比',
    codes: [
      { label: '普通函数', code: 'function add(a, b) { return a + b; }' },
      { label: '箭头函数', code: 'const add = (a, b) => a + b;' },
      { label: '函数表达式', code: 'const add = function(a, b) { return a + b; };' }
    ]
  },
  {
    title: '对象属性对比',
    codes: [
      { label: '普通属性', code: 'const obj = { name: "Alice" };' },
      { label: '简写属性', code: 'const name = "Alice"; const obj = { name };' },
      { label: '计算属性', code: 'const key = "name"; const obj = { [key]: "Alice" };' }
    ]
  },
  {
    title: '循环语句对比',
    codes: [
      { label: 'for', code: 'for (let i = 0; i < 10; i++) {}' },
      { label: 'for...of', code: 'for (const item of items) {}' },
      { label: 'while', code: 'while (condition) {}' }
    ]
  }
];

// 可视化函数
function visualizeNode(node, indent = 0, maxDepth = 3) {
  if (indent > maxDepth) {
    return '...';
  }
  
  if (!node || typeof node !== 'object') {
    return JSON.stringify(node);
  }
  
  if (Array.isArray(node)) {
    if (node.length === 0) return '[]';
    if (indent >= maxDepth) return '[...]';
    
    return '[\n' + node.map(item => 
      '  '.repeat(indent + 1) + visualizeNode(item, indent + 1, maxDepth)
    ).join(',\n') + '\n' + '  '.repeat(indent) + ']';
  }
  
  const prefix = '  '.repeat(indent);
  const lines = [];
  
  // 重要属性优先
  const importantKeys = ['type', 'kind', 'name', 'operator', 'value'];
  const keys = Object.keys(node);
  const sortedKeys = [
    ...importantKeys.filter(k => keys.includes(k)),
    ...keys.filter(k => !importantKeys.includes(k) && !['loc', 'start', 'end'].includes(k))
  ];
  
  for (const key of sortedKeys) {
    const value = node[key];
    
    if (key === 'type') {
      lines.push(chalk.cyan(`"${key}": "${value}"`));
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      lines.push(`"${key}": ${JSON.stringify(value)}`);
    } else if (value === null) {
      lines.push(chalk.gray(`"${key}": null`));
    } else if (typeof value === 'object') {
      if (indent < maxDepth) {
        const nested = visualizeNode(value, indent + 1, maxDepth);
        lines.push(`"${key}": ${nested}`);
      }
    }
  }
  
  if (lines.length === 0) return '{}';
  
  return '{\n' + lines.map(line => prefix + '  ' + line).join(',\n') + '\n' + prefix + '}';
}

// 运行示例
examples.forEach((example, exampleIndex) => {
  console.log(chalk.bold.yellow(`\n【示例 ${exampleIndex + 1}】${example.title}\n`));
  console.log(chalk.gray('='.repeat(70)));
  
  example.codes.forEach((item, index) => {
    console.log(chalk.bold.green(`\n${index + 1}. ${item.label}:`));
    console.log(chalk.white(`   代码: ${item.code}\n`));
    
    try {
      const ast = parser.parse(item.code);
      const statement = ast.program.body[0];
      
      console.log(chalk.cyan('   AST 节点:'));
      const visualization = visualizeNode(statement, 1, 2);
      console.log('   ' + visualization.split('\n').join('\n   '));
    } catch (error) {
      console.log(chalk.red(`   错误: ${error.message}`));
    }
    
    console.log();
  });
  
  console.log(chalk.gray('='.repeat(70)));
});

// AST 差异分析
console.log(chalk.bold.cyan('\n📊 AST 差异分析总结\n'));

console.log(chalk.yellow('1️⃣  var vs let vs const:'));
console.log(chalk.white('   节点类型相同: VariableDeclaration'));
console.log(chalk.white('   差异在于: kind 属性 ("var" | "let" | "const")'));
console.log();

console.log(chalk.yellow('2️⃣  普通函数 vs 箭头函数:'));
console.log(chalk.white('   普通函数: FunctionDeclaration'));
console.log(chalk.white('   箭头函数: ArrowFunctionExpression (嵌套在 VariableDeclarator 中)'));
console.log(chalk.white('   箭头函数有 expression 属性，表示是否简写形式'));
console.log();

console.log(chalk.yellow('3️⃣  对象属性:'));
console.log(chalk.white('   普通: ObjectProperty with key and value'));
console.log(chalk.white('   简写: ObjectProperty with shorthand: true'));
console.log(chalk.white('   计算: ObjectProperty with computed: true'));
console.log();

console.log(chalk.yellow('4️⃣  循环语句:'));
console.log(chalk.white('   for:     ForStatement'));
console.log(chalk.white('   for...of: ForOfStatement'));
console.log(chalk.white('   while:   WhileStatement'));
console.log();

console.log(chalk.gray('='.repeat(70)));
console.log(chalk.green('\n💡 通过对比 AST，可以深入理解不同语法的本质差异！\n'));
console.log(chalk.cyan('建议:'));
console.log(chalk.white('  • 访问 https://astexplorer.net/ 获得更好的可视化体验'));
console.log(chalk.white('  • 运行 npm run serve 启动 Web 版可视化工具'));
console.log(chalk.white('  • 尝试输入更复杂的代码，观察 AST 的变化'));
console.log();

