/**
 * AST 可视化工具
 * 以树形结构展示 AST
 */

const parser = require('@babel/parser');
const chalk = require('chalk');

/**
 * 树形可视化
 */
function visualizeNode(node, depth = 0, prefix = '', isLast = true) {
  if (!node || typeof node !== 'object') {
    return;
  }
  
  const indent = '  '.repeat(depth);
  const connector = isLast ? '└─ ' : '├─ ';
  const linePrefix = depth > 0 ? prefix + connector : '';
  
  // 显示节点类型
  let display = chalk.bold.cyan(node.type);
  
  // 添加关键信息
  const info = [];
  
  if (node.name) {
    info.push(chalk.yellow(`name: "${node.name}"`));
  }
  
  if (node.value !== undefined && node.value !== null) {
    const value = typeof node.value === 'string' 
      ? `"${node.value}"` 
      : node.value;
    info.push(chalk.green(`value: ${value}`));
  }
  
  if (node.operator) {
    info.push(chalk.magenta(`op: "${node.operator}"`));
  }
  
  if (node.kind) {
    info.push(chalk.blue(`kind: "${node.kind}"`));
  }
  
  if (info.length > 0) {
    display += chalk.gray(` { ${info.join(', ')} }`);
  }
  
  console.log(linePrefix + display);
  
  // 递归处理子节点
  const childPrefix = depth > 0 
    ? prefix + (isLast ? '   ' : '│  ')
    : '';
  
  // 需要展示的属性
  const relevantKeys = [
    'program', 'body', 'expression', 'declarations', 'init',
    'left', 'right', 'test', 'consequent', 'alternate',
    'callee', 'arguments', 'object', 'property',
    'params', 'id', 'elements', 'properties', 'key', 'value',
    'superClass', 'decorators', 'block', 'handler', 'finalizer'
  ];
  
  for (const key of relevantKeys) {
    if (!(key in node)) continue;
    
    const value = node[key];
    
    if (Array.isArray(value)) {
      if (value.length > 0) {
        console.log(childPrefix + chalk.gray(`├─ ${key}:`));
        value.forEach((child, index) => {
          const isLastChild = index === value.length - 1;
          visualizeNode(child, depth + 2, childPrefix + '│  ', isLastChild);
        });
      }
    } else if (value && typeof value === 'object' && value.type) {
      console.log(childPrefix + chalk.gray(`├─ ${key}:`));
      visualizeNode(value, depth + 2, childPrefix + '│  ', true);
    }
  }
}

/**
 * 可视化代码的 AST
 */
function visualizeAST(code, title = '代码') {
  console.log('\n' + chalk.bold.green('='.repeat(70)));
  console.log(chalk.bold.white(`【${title}】`));
  console.log(chalk.bold.green('='.repeat(70)));
  
  console.log(chalk.yellow('\n源代码:'));
  console.log(chalk.white(code));
  
  console.log(chalk.yellow('\nAST 树形结构:'));
  console.log(chalk.gray('-'.repeat(70)));
  
  try {
    const ast = parser.parse(code);
    visualizeNode(ast);
  } catch (error) {
    console.log(chalk.red('解析错误:', error.message));
  }
  
  console.log(chalk.gray('-'.repeat(70)));
}

// 示例 1：简单表达式
visualizeAST('42', '数字字面量');

visualizeAST('"hello"', '字符串字面量');

visualizeAST('true', '布尔字面量');

// 示例 2：标识符和运算
visualizeAST('x', '标识符');

visualizeAST('x + y', '二元运算');

visualizeAST('a + b * c', '运算符优先级');

visualizeAST('x > 0 ? "positive" : "negative"', '条件表达式');

// 示例 3：函数调用
visualizeAST('console.log("Hello")', '函数调用');

visualizeAST('Math.max(1, 2, 3)', '成员表达式 + 调用');

// 示例 4：变量声明
visualizeAST('const x = 10;', '变量声明');

visualizeAST('let arr = [1, 2, 3];', '数组字面量');

visualizeAST('const obj = { name: "Alice", age: 25 };', '对象字面量');

// 示例 5：函数
visualizeAST(`function add(a, b) {
  return a + b;
}`, '函数声明');

visualizeAST('const multiply = (x, y) => x * y;', '箭头函数');

// 示例 6：控制流
visualizeAST(`if (x > 0) {
  console.log("positive");
} else {
  console.log("negative");
}`, 'if-else 语句');

visualizeAST(`for (let i = 0; i < 10; i++) {
  console.log(i);
}`, 'for 循环');

// 示例 7：模板字面量
visualizeAST('`Hello, ${name}!`', '模板字面量');

// 示例 8：解构
visualizeAST('const { x, y } = point;', '对象解构');

visualizeAST('const [first, second] = arr;', '数组解构');

// 示例 9：类
visualizeAST(`class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return "Hello";
  }
}`, '类声明');

// 示例 10：异步
visualizeAST(`async function fetchData() {
  const res = await fetch('/api');
  return res.json();
}`, '异步函数');

console.log('\n' + chalk.bold.green('✅ 可视化完成！\n'));
console.log(chalk.gray('提示：'));
console.log(chalk.gray('  - 可以在 https://astexplorer.net/ 查看更详细的 AST'));
console.log(chalk.gray('  - 树形结构帮助理解代码的层次关系'));
console.log(chalk.gray('  - 不同颜色代表不同类型的信息\n'));

