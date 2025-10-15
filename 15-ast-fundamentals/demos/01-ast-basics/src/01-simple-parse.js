/**
 * 简单的 AST 解析示例
 */

const parser = require('@babel/parser');

console.log('简单的 AST 解析示例\n');

// 示例代码
const codes = [
  '42',
  '"hello"',
  'true',
  'x',
  'x + y',
  'fn()',
  'obj.prop',
  'arr[0]'
];

codes.forEach((code) => {
  console.log(`代码: ${code}`);
  
  try {
    const ast = parser.parse(code);
    
    // 处理指令（如 "use strict" 或单独的字符串字面量）
    if (ast.program.directives && ast.program.directives.length > 0) {
      const directive = ast.program.directives[0];
      console.log(`类型: ${directive.value.type}`);
      console.log(`值: ${directive.value.value}`);
      console.log();
      return;
    }
    
    // 检查是否有语句
    if (!ast.program.body || ast.program.body.length === 0) {
      console.log('无语句节点（可能是空代码）\n');
      return;
    }
    
    const statement = ast.program.body[0];
    
    // 处理不同类型的语句
    let expression;
    if (statement.type === 'ExpressionStatement') {
      expression = statement.expression;
    } else {
      // 可能是其他类型的语句，直接使用
      expression = statement;
    }
    
    console.log(`类型: ${expression.type}`);
    
    // 打印关键信息
    if (expression.value !== undefined) {
      console.log(`值: ${expression.value}`);
    }
    if (expression.name) {
      console.log(`名称: ${expression.name}`);
    }
    if (expression.operator) {
      console.log(`操作符: ${expression.operator}`);
    }
    
    console.log();
  } catch (error) {
    console.log(`解析错误: ${error.message}\n`);
  }
});

