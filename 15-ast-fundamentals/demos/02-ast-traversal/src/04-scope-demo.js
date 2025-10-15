/**
 * 作用域深度探索
 * 演示作用域链、变量查找、作用域嵌套等概念
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Demo 04】作用域深度探索\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
// Level 0: 全局作用域
const global1 = 'Global Variable 1';
const global2 = 'Global Variable 2';

function level1() {
  // Level 1: 函数作用域
  const func1 = 'Function Variable 1';
  let func2 = 'Function Variable 2';
  
  console.log(global1); // 访问全局变量
  
  function level2() {
    // Level 2: 嵌套函数作用域
    const nested1 = 'Nested Variable 1';
    
    console.log(global1); // 访问全局变量
    console.log(func1);   // 访问父函数变量
    
    if (true) {
      // Level 3: 块级作用域
      const block1 = 'Block Variable 1';
      let block2 = 'Block Variable 2';
      
      console.log(nested1); // 访问父块变量
      console.log(func1);   // 访问祖先函数变量
      console.log(global1); // 访问全局变量
    }
  }
  
  level2();
}

// 箭头函数作用域
const arrowFunc = () => {
  const arrow1 = 'Arrow Variable';
  console.log(global2);
};

// 类作用域
class MyClass {
  constructor() {
    this.prop1 = 'Property 1';
  }
  
  method() {
    const method1 = 'Method Variable';
    console.log(this.prop1);
  }
}
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 解析代码
const ast = parser.parse(code, {
  sourceType: 'module'
});

// 作用域分析
const scopes = [];
let scopeId = 0;

// 定义 Visitor
const visitor = {
  Scope(path) {
    const scope = path.scope;
    const id = scopeId++;
    
    // 获取作用域类型
    let type = 'unknown';
    let name = '';
    
    if (scope.block.type === 'Program') {
      type = 'Program';
      name = 'global';
    } else if (scope.block.type === 'FunctionDeclaration') {
      type = 'Function';
      name = scope.block.id ? scope.block.id.name : 'anonymous';
    } else if (scope.block.type === 'FunctionExpression') {
      type = 'FunctionExpression';
      name = scope.block.id ? scope.block.id.name : 'anonymous';
    } else if (scope.block.type === 'ArrowFunctionExpression') {
      type = 'ArrowFunction';
      name = 'arrow';
    } else if (scope.block.type === 'BlockStatement') {
      type = 'Block';
      name = 'block';
    } else if (scope.block.type === 'ClassMethod') {
      type = 'ClassMethod';
      name = scope.block.key.name;
    }
    
    // 获取变量绑定
    const bindings = Object.keys(scope.bindings).map(name => {
      const binding = scope.bindings[name];
      return {
        name,
        kind: binding.kind,
        references: binding.referencePaths.length,
        line: binding.path.node.loc ? binding.path.node.loc.start.line : 'unknown'
      };
    });
    
    // 获取父作用域 ID
    let parentId = null;
    if (scope.parent) {
      // 查找父作用域的 ID
      const parentScope = scopes.find(s => s.scope === scope.parent);
      if (parentScope) {
        parentId = parentScope.id;
      }
    }
    
    // 获取作用域层级
    let level = 0;
    let currentScope = scope;
    while (currentScope.parent) {
      level++;
      currentScope = currentScope.parent;
    }
    
    scopes.push({
      id,
      type,
      name,
      level,
      parentId,
      bindings,
      scope,
      line: scope.block.loc ? scope.block.loc.start.line : 'unknown'
    });
  }
};

// 遍历 AST
traverse(ast, visitor);

// 输出作用域树
console.log(chalk.bold.green(`\n✅ 作用域分析 (共 ${scopes.length} 个作用域)\n`));

// 按层级排序
scopes.sort((a, b) => a.level - b.level || a.id - b.id);

// 递归输出作用域树
function printScope(scopeId, indent = 0) {
  const scope = scopes.find(s => s.id === scopeId);
  if (!scope) return;
  
  const prefix = '  '.repeat(indent);
  const icon = scope.level === 0 ? '🌍' : scope.level === 1 ? '📦' : scope.level === 2 ? '📁' : '📄';
  
  console.log(chalk.cyan(`${prefix}${icon} [Level ${scope.level}] ${scope.type}: ${scope.name}`));
  console.log(chalk.white(`${prefix}   第 ${scope.line} 行`));
  
  if (scope.bindings.length > 0) {
    console.log(chalk.white(`${prefix}   变量 (${scope.bindings.length}个):`));
    scope.bindings.forEach(binding => {
      const refInfo = binding.references > 0 
        ? chalk.green(`${binding.references} 次引用`) 
        : chalk.gray('未引用');
      console.log(chalk.white(`${prefix}     - ${binding.name} (${binding.kind}) ${refInfo}`));
    });
  } else {
    console.log(chalk.gray(`${prefix}   (无本地变量)`));
  }
  
  console.log();
  
  // 递归输出子作用域
  const children = scopes.filter(s => s.parentId === scopeId);
  children.forEach(child => {
    printScope(child.id, indent + 1);
  });
}

// 从根作用域开始输出
const rootScope = scopes.find(s => s.level === 0);
if (rootScope) {
  printScope(rootScope.id);
}

// 作用域链分析
console.log(chalk.gray('='.repeat(70)));
console.log(chalk.bold.yellow('\n🔗 作用域链示例:\n'));

// 找到最深的作用域
const deepestScope = scopes.reduce((max, s) => s.level > max.level ? s : max, scopes[0]);

console.log(chalk.white(`最深的作用域: ${deepestScope.name} (Level ${deepestScope.level})`));
console.log(chalk.white('\n作用域链 (从内到外):\n'));

let current = deepestScope;
const chain = [];

while (current) {
  chain.push(current);
  current = scopes.find(s => s.id === current.parentId);
}

chain.forEach((scope, index) => {
  const arrow = index < chain.length - 1 ? ' ⬆️' : '';
  console.log(chalk.cyan(`  ${index + 1}. ${scope.name} (${scope.type})${arrow}`));
  
  if (scope.bindings.length > 0) {
    console.log(chalk.gray(`     可访问变量: ${scope.bindings.map(b => b.name).join(', ')}`));
  }
});

// 统计信息
console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.bold.cyan('\n📊 作用域统计:\n'));

const typeStats = {};
scopes.forEach(s => {
  typeStats[s.type] = (typeStats[s.type] || 0) + 1;
});

console.log(chalk.white('  按类型分布:'));
Object.entries(typeStats).forEach(([type, count]) => {
  console.log(chalk.white(`    ${type}: ${count} 个`));
});

console.log(chalk.white(`\n  最大嵌套层级: ${deepestScope.level}`));

const totalBindings = scopes.reduce((sum, s) => sum + s.bindings.length, 0);
console.log(chalk.white(`  总变量绑定: ${totalBindings}`));

console.log(chalk.gray('\n='.repeat(70)));
console.log(chalk.green('\n💡 理解作用域链是掌握 JavaScript 的关键！\n'));
console.log(chalk.white('   - 变量查找: 从当前作用域向上查找，直到找到或到达全局作用域'));
console.log(chalk.white('   - 词法作用域: 作用域在代码编写时就确定了，不是运行时'));
console.log(chalk.white('   - 闭包: 内部函数可以访问外部函数的变量'));
console.log();

