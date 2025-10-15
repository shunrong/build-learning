/**
 * 简单的 JavaScript Tokenizer
 * 词法分析器：将源代码转换为 Token 流
 */

class Tokenizer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.current = this.input[0];
  }

  // 前进一个字符
  advance() {
    this.position++;
    this.current = this.position < this.input.length ? this.input[this.position] : null;
  }

  // 跳过空白字符
  skipWhitespace() {
    while (this.current && /\s/.test(this.current)) {
      this.advance();
    }
  }

  // 跳过单行注释
  skipComment() {
    if (this.current === '/' && this.peek() === '/') {
      while (this.current && this.current !== '\n') {
        this.advance();
      }
      this.advance(); // 跳过换行符
    }
  }

  // 查看下一个字符（不移动位置）
  peek() {
    const peekPos = this.position + 1;
    return peekPos < this.input.length ? this.input[peekPos] : null;
  }

  // 读取数字
  readNumber() {
    let numStr = '';
    while (this.current && /\d/.test(this.current)) {
      numStr += this.current;
      this.advance();
    }
    
    // 处理小数
    if (this.current === '.') {
      numStr += this.current;
      this.advance();
      while (this.current && /\d/.test(this.current)) {
        numStr += this.current;
        this.advance();
      }
    }
    
    return {
      type: 'NUMBER',
      value: parseFloat(numStr)
    };
  }

  // 读取标识符或关键字
  readIdentifier() {
    let str = '';
    while (this.current && /[a-zA-Z0-9_$]/.test(this.current)) {
      str += this.current;
      this.advance();
    }
    
    // 关键字列表
    const keywords = [
      'const', 'let', 'var', 'function', 'return', 
      'if', 'else', 'for', 'while', 'true', 'false'
    ];
    
    const type = keywords.includes(str) ? 'KEYWORD' : 'IDENTIFIER';
    
    return {
      type,
      value: str
    };
  }

  // 读取字符串
  readString() {
    const quote = this.current; // ' 或 "
    this.advance(); // 跳过开始引号
    
    let str = '';
    while (this.current && this.current !== quote) {
      if (this.current === '\\') {
        this.advance();
        // 处理转义字符
        switch (this.current) {
          case 'n': str += '\n'; break;
          case 't': str += '\t'; break;
          case 'r': str += '\r'; break;
          default: str += this.current;
        }
      } else {
        str += this.current;
      }
      this.advance();
    }
    
    this.advance(); // 跳过结束引号
    
    return {
      type: 'STRING',
      value: str
    };
  }

  // 读取操作符
  readOperator() {
    let op = this.current;
    this.advance();
    
    // 处理双字符操作符
    if (this.current && '=<>!+-'.includes(op) && this.current === '=') {
      op += this.current;
      this.advance();
    }
    
    return {
      type: 'OPERATOR',
      value: op
    };
  }

  // 主 tokenize 方法
  tokenize() {
    const tokens = [];
    
    while (this.current !== null) {
      // 跳过空白
      if (/\s/.test(this.current)) {
        this.skipWhitespace();
        continue;
      }
      
      // 跳过注释
      if (this.current === '/' && this.peek() === '/') {
        this.skipComment();
        continue;
      }
      
      // 数字
      if (/\d/.test(this.current)) {
        tokens.push(this.readNumber());
        continue;
      }
      
      // 标识符或关键字
      if (/[a-zA-Z_$]/.test(this.current)) {
        tokens.push(this.readIdentifier());
        continue;
      }
      
      // 字符串
      if (this.current === '"' || this.current === "'") {
        tokens.push(this.readString());
        continue;
      }
      
      // 操作符
      if ('+-*/%=<>!'.includes(this.current)) {
        tokens.push(this.readOperator());
        continue;
      }
      
      // 标点符号
      if ('(){}[];,'.includes(this.current)) {
        tokens.push({
          type: 'PUNCTUATION',
          value: this.current
        });
        this.advance();
        continue;
      }
      
      // 未知字符
      throw new Error(`Unknown character: ${this.current} at position ${this.position}`);
    }
    
    return tokens;
  }
}

module.exports = Tokenizer;

