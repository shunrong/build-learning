/**
 * JSON Parser - 手写 JSON 解析器
 */

const chalk = require('chalk');

class JSONParser {
  constructor(input) {
    this.input = input;
    this.position = 0;
  }

  skipWhitespace() {
    while (/\s/.test(this.input[this.position])) {
      this.position++;
    }
  }

  parseValue() {
    this.skipWhitespace();
    const char = this.input[this.position];
    
    if (char === '{') return this.parseObject();
    if (char === '[') return this.parseArray();
    if (char === '"') return this.parseString();
    if (char === 't' || char === 'f') return this.parseBoolean();
    if (char === 'n') return this.parseNull();
    if (char === '-' || /\d/.test(char)) return this.parseNumber();
    
    throw new Error(`Unexpected character: ${char}`);
  }

  parseObject() {
    const obj = {};
    this.position++; // skip {
    this.skipWhitespace();
    
    if (this.input[this.position] === '}') {
      this.position++;
      return obj;
    }
    
    while (true) {
      this.skipWhitespace();
      const key = this.parseString();
      this.skipWhitespace();
      this.position++; // skip :
      const value = this.parseValue();
      obj[key] = value;
      
      this.skipWhitespace();
      if (this.input[this.position] === '}') {
        this.position++;
        break;
      }
      this.position++; // skip ,
    }
    
    return obj;
  }

  parseArray() {
    const arr = [];
    this.position++; // skip [
    this.skipWhitespace();
    
    if (this.input[this.position] === ']') {
      this.position++;
      return arr;
    }
    
    while (true) {
      arr.push(this.parseValue());
      this.skipWhitespace();
      
      if (this.input[this.position] === ']') {
        this.position++;
        break;
      }
      this.position++; // skip ,
    }
    
    return arr;
  }

  parseString() {
    this.position++; // skip "
    let str = '';
    
    while (this.input[this.position] !== '"') {
      str += this.input[this.position++];
    }
    
    this.position++; // skip "
    return str;
  }

  parseNumber() {
    let numStr = '';
    
    if (this.input[this.position] === '-') {
      numStr += this.input[this.position++];
    }
    
    while (/\d/.test(this.input[this.position])) {
      numStr += this.input[this.position++];
    }
    
    if (this.input[this.position] === '.') {
      numStr += this.input[this.position++];
      while (/\d/.test(this.input[this.position])) {
        numStr += this.input[this.position++];
      }
    }
    
    return parseFloat(numStr);
  }

  parseBoolean() {
    if (this.input.substr(this.position, 4) === 'true') {
      this.position += 4;
      return true;
    }
    this.position += 5;
    return false;
  }

  parseNull() {
    this.position += 4;
    return null;
  }

  parse() {
    return this.parseValue();
  }
}

// 演示
console.log(chalk.bold.cyan('\nJSON Parser 演示\n'));

const jsons = [
  '{"name": "Alice", "age": 25}',
  '[1, 2, 3, 4, 5]',
  '{"user": {"name": "Bob", "active": true}}',
  '{"items": [1, 2, 3], "total": 3.14}'
];

jsons.forEach(json => {
  console.log(chalk.yellow('JSON:'), chalk.white(json));
  const parser = new JSONParser(json);
  const result = parser.parse();
  console.log(chalk.green('解析结果:'), result);
  console.log();
});
