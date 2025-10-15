/**
 * Mini JS Parser - 简化版 JavaScript Parser
 * 支持: 变量声明 (const/let), 表达式, 函数声明
 */

const chalk = require('chalk');
const Tokenizer = require('../../01-tokenizer/src/tokenizer');

class MiniJSParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  current() {
    return this.tokens[this.position];
  }

  eat(type) {
    const token = this.current();
    if (!token || token.type !== type) {
      throw new Error(`Expected ${type}, got ${token ? token.type : 'EOF'}`);
    }
    this.position++;
    return token;
  }

  parseProgram() {
    const statements = [];
    
    while (this.position < this.tokens.length) {
      statements.push(this.parseStatement());
    }
    
    return {
      type: 'Program',
      body: statements
    };
  }

  parseStatement() {
    const token = this.current();
    
    if (token.type === 'KEYWORD' && ['const', 'let', 'var'].includes(token.value)) {
      return this.parseVariableDeclaration();
    }
    
    if (token.type === 'KEYWORD' && token.value === 'function') {
      return this.parseFunctionDeclaration();
    }
    
    throw new Error(`Unknown statement type: ${token.type}`);
  }

  parseVariableDeclaration() {
    const kind = this.eat('KEYWORD').value;
    const id = this.eat('IDENTIFIER');
    this.eat('OPERATOR'); // =
    const init = this.parseExpression();
    this.eat('PUNCTUATION'); // ;
    
    return {
      type: 'VariableDeclaration',
      kind,
      declarations: [{
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name: id.value },
        init
      }]
    };
  }

  parseExpression() {
    const token = this.current();
    
    if (token.type === 'NUMBER') {
      this.position++;
      return { type: 'NumericLiteral', value: token.value };
    }
    
    if (token.type === 'STRING') {
      this.position++;
      return { type: 'StringLiteral', value: token.value };
    }
    
    if (token.type === 'IDENTIFIER') {
      this.position++;
      return { type: 'Identifier', name: token.value };
    }
    
    throw new Error(`Unknown expression type: ${token.type}`);
  }

  parseFunctionDeclaration() {
    this.eat('KEYWORD'); // function
    const id = this.eat('IDENTIFIER');
    this.eat('PUNCTUATION'); // (
    this.eat('PUNCTUATION'); // )
    this.eat('PUNCTUATION'); // {
    this.eat('PUNCTUATION'); // }
    
    return {
      type: 'FunctionDeclaration',
      id: { type: 'Identifier', name: id.value },
      params: [],
      body: { type: 'BlockStatement', body: [] }
    };
  }

  parse() {
    return this.parseProgram();
  }
}

// 演示
console.log(chalk.bold.cyan('\nMini JS Parser 演示\n'));

const codes = [
  'const x = 42;',
  'let name = "Alice";',
  'function test() {}'
];

codes.forEach(code => {
  console.log(chalk.yellow('代码:'), chalk.white(code));
  
  try {
    const tokenizer = new Tokenizer(code);
    const tokens = tokenizer.tokenize();
    
    const parser = new MiniJSParser(tokens);
    const ast = parser.parse();
    
    console.log(chalk.green('AST:'), JSON.stringify(ast, null, 2));
  } catch (error) {
    console.log(chalk.red('错误:'), error.message);
  }
  console.log();
});
