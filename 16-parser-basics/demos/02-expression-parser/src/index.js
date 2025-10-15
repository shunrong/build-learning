/**
 * 表达式 Parser - 数学表达式解析器
 * 支持: +, -, *, /, ()
 */

const chalk = require('chalk');

class ExpressionParser {
  constructor(input) {
    this.input = input.replace(/\s+/g, ''); // 移除空格
    this.position = 0;
  }

  // 解析表达式 (处理 + -)
  parseExpression() {
    let left = this.parseTerm();
    
    while (this.position < this.input.length) {
      const op = this.input[this.position];
      if (op !== '+' && op !== '-') break;
      
      this.position++;
      const right = this.parseTerm();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    
    return left;
  }

  // 解析项 (处理 * /)
  parseTerm() {
    let left = this.parseFactor();
    
    while (this.position < this.input.length) {
      const op = this.input[this.position];
      if (op !== '*' && op !== '/') break;
      
      this.position++;
      const right = this.parseFactor();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    
    return left;
  }

  // 解析因子 (数字或括号表达式)
  parseFactor() {
    // 括号
    if (this.input[this.position] === '(') {
      this.position++;
      const expr = this.parseExpression();
      this.position++; // 跳过 )
      return expr;
    }
    
    // 数字
    let numStr = '';
    while (this.position < this.input.length && /\d/.test(this.input[this.position])) {
      numStr += this.input[this.position++];
    }
    
    return { type: 'NumericLiteral', value: parseInt(numStr) };
  }

  parse() {
    return this.parseExpression();
  }
}

// 计算 AST
function evaluate(ast) {
  if (ast.type === 'NumericLiteral') {
    return ast.value;
  }
  
  if (ast.type === 'BinaryExpression') {
    const left = evaluate(ast.left);
    const right = evaluate(ast.right);
    
    switch (ast.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
    }
  }
}

// 演示
console.log(chalk.bold.cyan('\n表达式 Parser 演示\n'));

const expressions = [
  '1 + 2',
  '10 - 5 + 3',
  '2 * 3 + 4',
  '(1 + 2) * 3',
  '10 / 2 + 3 * 4'
];

expressions.forEach(expr => {
  console.log(chalk.yellow('表达式:'), chalk.white(expr));
  const parser = new ExpressionParser(expr);
  const ast = parser.parse();
  const result = evaluate(ast);
  console.log(chalk.cyan('AST:'), JSON.stringify(ast, null, 2));
  console.log(chalk.green('结果:'), chalk.bold(result));
  console.log();
});
