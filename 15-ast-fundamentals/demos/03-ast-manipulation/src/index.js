/**
 * Demo 03: AST 操作实战
 * 
 * 演示如何增删改 AST 节点
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

console.log('='.repeat(60));
console.log('Demo 03: AST 操作实战');
console.log('='.repeat(60));
console.log();

// 示例 1：修改节点 - const 转 var
console.log('【示例 1】修改节点 - const 转 var');
console.log('-'.repeat(60));

const code1 = `const x = 1;\nconst y = 2;`;
console.log('源代码:\n', code1);

const ast1 = parser.parse(code1);
traverse(ast1, {
  VariableDeclaration(path) {
    if (path.node.kind === 'const') {
      path.node.kind = 'var';
    }
  }
});

const output1 = generate(ast1);
console.log('\n转换后:\n', output1.code);
console.log();

// 示例 2：删除节点 - 移除 console.log
console.log('【示例 2】删除节点 - 移除 console.log');
console.log('-'.repeat(60));

const code2 = `
function test() {
  console.log('debug');
  const x = 1;
  console.log(x);
  return x;
}
`;
console.log('源代码:', code2);

const ast2 = parser.parse(code2);
traverse(ast2, {
  CallExpression(path) {
    const { callee } = path.node;
    if (
      t.isMemberExpression(callee) &&
      callee.object.name === 'console' &&
      callee.property.name === 'log'
    ) {
      path.remove();
    }
  }
});

const output2 = generate(ast2);
console.log('\n转换后:\n', output2.code);
console.log();

// 示例 3：插入节点 - 在函数开头插入 log
console.log('【示例 3】插入节点 - 在函数开头插入 log');
console.log('-'.repeat(60));

const code3 = `
function handleClick() {
  console.log('clicked');
}
`;
console.log('源代码:', code3);

const ast3 = parser.parse(code3);
traverse(ast3, {
  FunctionDeclaration(path) {
    const functionName = path.node.id.name;
    
    // 在函数体开头插入 console.log
    path.get('body').unshiftContainer(
      'body',
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier('console'),
            t.identifier('log')
          ),
          [t.stringLiteral(`[ENTER] ${functionName}`)]
        )
      )
    );
  }
});

const output3 = generate(ast3);
console.log('\n转换后:\n', output3.code);
console.log();

// 示例 4：替换节点 - 箭头函数转普通函数
console.log('【示例 4】替换节点 - 箭头函数转普通函数');
console.log('-'.repeat(60));

const code4 = `const add = (a, b) => a + b;`;
console.log('源代码:', code4);

const ast4 = parser.parse(code4);
traverse(ast4, {
  ArrowFunctionExpression(path) {
    const { params, body } = path.node;
    
    // 如果是表达式，转为 return 语句
    let functionBody;
    if (t.isExpression(body)) {
      functionBody = t.blockStatement([
        t.returnStatement(body)
      ]);
    } else {
      functionBody = body;
    }
    
    // 创建普通函数表达式
    const functionExpression = t.functionExpression(
      null,
      params,
      functionBody
    );
    
    // 替换
    path.replaceWith(functionExpression);
  }
});

const output4 = generate(ast4);
console.log('\n转换后:\n', output4.code);
console.log();

// 示例 5：复杂操作 - 移除未使用的变量
console.log('【示例 5】复杂操作 - 移除未使用的变量');
console.log('-'.repeat(60));

const code5 = `
function test() {
  const used = 1;
  const unused = 2;
  return used;
}
`;
console.log('源代码:', code5);

const ast5 = parser.parse(code5);
traverse(ast5, {
  VariableDeclarator(path) {
    const name = path.node.id.name;
    const binding = path.scope.getBinding(name);
    
    if (binding && !binding.referenced) {
      console.log(`  → 发现未使用的变量: ${name}`);
      path.remove();
    }
  }
});

const output5 = generate(ast5);
console.log('\n转换后:\n', output5.code);
console.log();

console.log('='.repeat(60));
console.log('提示：');
console.log('  1. 运行 `npm run rename` 重命名变量');
console.log('  2. 运行 `npm run remove` 移除 console.log');
console.log('  3. 运行 `npm run insert` 插入注释');
console.log('  4. 运行 `npm run replace` 箭头函数转普通函数');
console.log('='.repeat(60));

