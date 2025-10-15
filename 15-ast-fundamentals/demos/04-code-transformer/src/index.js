/**
 * Demo 04: 代码转换器
 * 
 * 完整的 Parse → Transform → Generate 流程
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

console.log('='.repeat(60));
console.log('Demo 04: 代码转换器');
console.log('='.repeat(60));
console.log();

/**
 * 通用转换函数
 */
function transform(code, visitor) {
  // 1. Parse: 解析代码成 AST
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  
  // 2. Transform: 遍历和修改 AST
  traverse(ast, visitor);
  
  // 3. Generate: 生成新代码
  const output = generate(ast, {
    comments: true
  });
  
  return output.code;
}

// 转换器 1：移除 debugger
console.log('【转换器 1】移除 debugger');
console.log('-'.repeat(60));

const code1 = `
function calculate() {
  debugger;
  const result = 1 + 2;
  debugger;
  return result;
}
`;
console.log('源代码:', code1);

const visitor1 = {
  DebuggerStatement(path) {
    path.remove();
  }
};

const output1 = transform(code1, visitor1);
console.log('\n转换后:\n', output1);
console.log();

// 转换器 2：移除所有 console.*
console.log('【转换器 2】移除所有 console.*');
console.log('-'.repeat(60));

const code2 = `
function test() {
  console.log('debug');
  console.error('error');
  console.warn('warning');
  return 42;
}
`;
console.log('源代码:', code2);

const visitor2 = {
  CallExpression(path) {
    const { callee } = path.node;
    if (
      t.isMemberExpression(callee) &&
      callee.object.name === 'console'
    ) {
      path.remove();
    }
  }
};

const output2 = transform(code2, visitor2);
console.log('\n转换后:\n', output2);
console.log();

// 转换器 3：箭头函数转普通函数
console.log('【转换器 3】箭头函数转普通函数');
console.log('-'.repeat(60));

const code3 = `
const add = (a, b) => a + b;
const multiply = (x, y) => {
  return x * y;
};
`;
console.log('源代码:', code3);

const visitor3 = {
  ArrowFunctionExpression(path) {
    const { params, body } = path.node;
    
    let functionBody;
    if (t.isExpression(body)) {
      functionBody = t.blockStatement([
        t.returnStatement(body)
      ]);
    } else {
      functionBody = body;
    }
    
    path.replaceWith(
      t.functionExpression(null, params, functionBody)
    );
  }
};

const output3 = transform(code3, visitor3);
console.log('\n转换后:\n', output3);
console.log();

// 转换器 4：const 转 var
console.log('【转换器 4】const 转 var');
console.log('-'.repeat(60));

const code4 = `
const x = 1;
const y = 2;
const z = x + y;
`;
console.log('源代码:', code4);

const visitor4 = {
  VariableDeclaration(path) {
    if (path.node.kind === 'const') {
      path.node.kind = 'var';
    }
  }
};

const output4 = transform(code4, visitor4);
console.log('\n转换后:\n', output4);
console.log();

// 组合转换器
console.log('【组合转换器】同时应用多个转换');
console.log('-'.repeat(60));

const code5 = `
const add = (a, b) => {
  console.log('adding');
  debugger;
  return a + b;
};
`;
console.log('源代码:', code5);

const combinedVisitor = {
  // 移除 debugger
  DebuggerStatement(path) {
    path.remove();
  },
  
  // 移除 console.*
  CallExpression(path) {
    const { callee } = path.node;
    if (
      t.isMemberExpression(callee) &&
      callee.object.name === 'console'
    ) {
      path.remove();
    }
  },
  
  // 箭头函数转普通函数
  ArrowFunctionExpression(path) {
    const { params, body } = path.node;
    
    let functionBody;
    if (t.isExpression(body)) {
      functionBody = t.blockStatement([
        t.returnStatement(body)
      ]);
    } else {
      functionBody = body;
    }
    
    path.replaceWith(
      t.functionExpression(null, params, functionBody)
    );
  },
  
  // const 转 var
  VariableDeclaration(path) {
    if (path.node.kind === 'const') {
      path.node.kind = 'var';
    }
  }
};

const output5 = transform(code5, combinedVisitor);
console.log('\n转换后:\n', output5);
console.log();

console.log('='.repeat(60));
console.log('提示：');
console.log('  1. 运行 `npm run transform:debugger` 移除 debugger');
console.log('  2. 运行 `npm run transform:console` 移除 console');
console.log('  3. 运行 `npm run transform:arrow` 箭头函数转普通函数');
console.log('  4. 运行 `npm run transform:const` const 转 var');
console.log('  5. 运行 `npm run transform:file input.js` 转换文件');
console.log('='.repeat(60));

