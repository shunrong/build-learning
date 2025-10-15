# 词法分析详解

## 📖 概述

本文深入讲解词法分析（Lexical Analysis）的原理、实现和优化技术。

---

## 🎯 什么是词法分析

### 1. 定义

**词法分析（Lexical Analysis）** 是编译器的第一个阶段，负责将源代码字符串**分割成有意义的词法单元（Token）**。

**核心任务：**
```
源代码字符串 → Lexer → Token 流
```

### 2. 类比理解

**类比 1：阅读文章**
```
原文："Hello, World!"

分词：
- "Hello" → 单词
- ","     → 标点
- " "     → 空格（忽略）
- "World" → 单词
- "!"     → 标点
```

**类比 2：JavaScript 代码**
```javascript
const x = 1;

词法分析：
- "const" → 关键字
- " "      → 空格（忽略）
- "x"      → 标识符
- " "      → 空格（忽略）
- "="      → 操作符
- " "      → 空格（忽略）
- "1"      → 数字
- ";"      → 标点
```

---

## 📦 Token（词法单元）

### 1. Token 的定义

**Token** 是词法分析的基本单位，代表**一个有意义的字符序列**。

**Token 的组成：**
```javascript
{
  type: 'TokenType',   // Token 类型
  value: '...',        // Token 值（Lexeme）
  start: 0,            // 起始位置
  end: 5,              // 结束位置
  loc: {               // 详细位置信息
    start: { line: 1, column: 0 },
    end: { line: 1, column: 5 }
  }
}
```

### 2. Token 类型

#### 关键字（Keyword）

**定义：** 语言保留的特殊单词。

**JavaScript 关键字：**
```javascript
// 变量声明
const, let, var

// 控制流
if, else, switch, case, default, break, continue

// 循环
for, while, do

// 函数
function, return, async, await, yield

// 类
class, extends, super, new, this

// 模块
import, export, from, as

// 其他
try, catch, finally, throw, typeof, void, delete, in, of
```

**Token 示例：**
```javascript
{ type: 'Keyword', value: 'const' }
{ type: 'Keyword', value: 'function' }
{ type: 'Keyword', value: 'return' }
```

#### 标识符（Identifier）

**定义：** 程序员定义的名称（变量名、函数名、类名等）。

**规则：**
- 以字母、`_` 或 `$` 开头
- 后续可以是字母、数字、`_` 或 `$`
- 不能是关键字

**示例：**
```javascript
myVariable
_privateVar
$jquery
user123
__proto__
```

**Token 示例：**
```javascript
{ type: 'Identifier', value: 'myVariable' }
{ type: 'Identifier', value: '_private' }
```

#### 字面量（Literal）

**数字字面量（Numeric Literal）：**
```javascript
42          // 整数
3.14        // 浮点数
0xFF        // 十六进制
0b1010      // 二进制
0o755       // 八进制
1e6         // 科学计数法
```

**Token 示例：**
```javascript
{ type: 'NumericLiteral', value: 42 }
{ type: 'NumericLiteral', value: 3.14 }
```

**字符串字面量（String Literal）：**
```javascript
"hello"
'world'
`template ${variable}`
```

**Token 示例：**
```javascript
{ type: 'StringLiteral', value: 'hello' }
{ type: 'TemplateLiteral', value: '`template ${variable}`' }
```

**布尔字面量（Boolean Literal）：**
```javascript
true
false
```

**Token 示例：**
```javascript
{ type: 'BooleanLiteral', value: true }
```

**null 字面量：**
```javascript
null
```

**Token 示例：**
```javascript
{ type: 'NullLiteral', value: null }
```

#### 操作符（Operator）

**算术操作符：**
```javascript
+, -, *, /, %, **
```

**比较操作符：**
```javascript
==, !=, ===, !==, <, >, <=, >=
```

**逻辑操作符：**
```javascript
&&, ||, !
```

**位操作符：**
```javascript
&, |, ^, ~, <<, >>, >>>
```

**赋值操作符：**
```javascript
=, +=, -=, *=, /=, %=, **=
&=, |=, ^=, <<=, >>=, >>>=
```

**其他：**
```javascript
?, :      // 三元运算符
++, --    // 自增/自减
.         // 成员访问
=>        // 箭头函数
...       // 展开/剩余
```

**Token 示例：**
```javascript
{ type: 'Operator', value: '+' }
{ type: 'Operator', value: '===' }
{ type: 'Operator', value: '=>' }
```

#### 标点符号（Punctuator）

```javascript
;    // 分号
,    // 逗号
(    // 左括号
)    // 右括号
{    // 左花括号
}    // 右花括号
[    // 左方括号
]    // 右方括号
:    // 冒号
```

**Token 示例：**
```javascript
{ type: 'Punctuator', value: ';' }
{ type: 'Punctuator', value: '{' }
```

### 3. Lexeme（词素）

**Lexeme** 是 Token 对应的**源代码字符串**。

**示例：**
```javascript
const x = 42;

Token                         Lexeme
--------------------------------------
Keyword 'const'          →    "const"
Identifier 'x'           →    "x"
Operator '='             →    "="
NumericLiteral 42        →    "42"
Punctuator ';'           →    ";"
```

---

## 🔧 Lexer（词法分析器）的实现

### 1. 基本流程

```
1. 读取字符
   ↓
2. 识别 Token
   ↓
3. 生成 Token 对象
   ↓
4. 跳过空格和注释
   ↓
5. 继续下一个 Token
   ↓
6. 直到文件结束
```

### 2. 伪代码实现

```javascript
class Lexer {
  constructor(code) {
    this.code = code;
    this.position = 0;
    this.tokens = [];
  }
  
  tokenize() {
    while (this.position < this.code.length) {
      // 跳过空格
      if (this.isWhitespace()) {
        this.skipWhitespace();
        continue;
      }
      
      // 跳过注释
      if (this.isComment()) {
        this.skipComment();
        continue;
      }
      
      // 识别 Token
      if (this.isNumber()) {
        this.tokens.push(this.readNumber());
      } else if (this.isIdentifierStart()) {
        this.tokens.push(this.readIdentifierOrKeyword());
      } else if (this.isStringStart()) {
        this.tokens.push(this.readString());
      } else if (this.isOperator()) {
        this.tokens.push(this.readOperator());
      } else if (this.isPunctuator()) {
        this.tokens.push(this.readPunctuator());
      } else {
        throw new Error(`Unexpected character: ${this.code[this.position]}`);
      }
    }
    
    return this.tokens;
  }
  
  readNumber() {
    let value = '';
    while (this.isDigit(this.code[this.position])) {
      value += this.code[this.position++];
    }
    return {
      type: 'NumericLiteral',
      value: Number(value)
    };
  }
  
  readIdentifierOrKeyword() {
    let value = '';
    while (this.isIdentifierPart(this.code[this.position])) {
      value += this.code[this.position++];
    }
    
    // 检查是否是关键字
    const type = this.isKeyword(value) ? 'Keyword' : 'Identifier';
    
    return { type, value };
  }
  
  // ... 其他方法
}
```

### 3. 实际示例

```javascript
const code = 'const x = 1;';
const lexer = new Lexer(code);
const tokens = lexer.tokenize();

console.log(tokens);
// [
//   { type: 'Keyword', value: 'const' },
//   { type: 'Identifier', value: 'x' },
//   { type: 'Operator', value: '=' },
//   { type: 'NumericLiteral', value: 1 },
//   { type: 'Punctuator', value: ';' }
// ]
```

---

## 🎨 正则表达式在词法分析中的应用

### 1. 识别 Token 类型

```javascript
// 数字
const numberRegex = /^\d+(\.\d+)?/;

// 标识符
const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*/;

// 字符串
const stringRegex = /^"([^"\\]|\\.)*"/;

// 空格
const whitespaceRegex = /^\s+/;
```

### 2. 使用正则表达式的 Lexer

```javascript
class RegexLexer {
  constructor(code) {
    this.code = code;
    this.position = 0;
  }
  
  tokenize() {
    const tokens = [];
    
    while (this.position < this.code.length) {
      const remaining = this.code.slice(this.position);
      
      // 尝试匹配各种 Token
      let matched = false;
      
      // 数字
      let match = remaining.match(/^(\d+(\.\d+)?)/);
      if (match) {
        tokens.push({
          type: 'NumericLiteral',
          value: Number(match[0])
        });
        this.position += match[0].length;
        matched = true;
        continue;
      }
      
      // 标识符或关键字
      match = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (match) {
        const value = match[0];
        const type = this.isKeyword(value) ? 'Keyword' : 'Identifier';
        tokens.push({ type, value });
        this.position += match[0].length;
        matched = true;
        continue;
      }
      
      // 操作符
      match = remaining.match(/^(===|!==|==|!=|<=|>=|=>|&&|\|\||<<|>>|[+\-*/%<>=!&|^~?:])/);
      if (match) {
        tokens.push({
          type: 'Operator',
          value: match[0]
        });
        this.position += match[0].length;
        matched = true;
        continue;
      }
      
      // 标点符号
      match = remaining.match(/^([;,(){}[\]])/);
      if (match) {
        tokens.push({
          type: 'Punctuator',
          value: match[0]
        });
        this.position += match[0].length;
        matched = true;
        continue;
      }
      
      // 空格（跳过）
      match = remaining.match(/^\s+/);
      if (match) {
        this.position += match[0].length;
        matched = true;
        continue;
      }
      
      if (!matched) {
        throw new Error(`Unexpected character at position ${this.position}`);
      }
    }
    
    return tokens;
  }
  
  isKeyword(word) {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else'];
    return keywords.includes(word);
  }
}
```

---

## 🤖 状态机模型

### 1. 什么是状态机

**有限状态机（Finite Automata）** 是词法分析的理论基础。

**组成：**
- **状态（State）**：Lexer 所处的状态
- **转移（Transition）**：从一个状态到另一个状态
- **输入（Input）**：当前字符
- **输出（Output）**：Token

### 2. 示例：识别数字

**状态图：**
```
         digit
   START -----> INTEGER
    |             |
    |             | '.'
    |             ↓
    |           DECIMAL
    |             |
    |             | digit
    |             ↓
    └----------> END
```

**代码实现：**
```javascript
function readNumber(code, position) {
  let state = 'START';
  let value = '';
  
  while (position < code.length) {
    const char = code[position];
    
    if (state === 'START') {
      if (isDigit(char)) {
        value += char;
        state = 'INTEGER';
        position++;
      } else {
        break;
      }
    } else if (state === 'INTEGER') {
      if (isDigit(char)) {
        value += char;
        position++;
      } else if (char === '.') {
        value += char;
        state = 'DECIMAL';
        position++;
      } else {
        state = 'END';
        break;
      }
    } else if (state === 'DECIMAL') {
      if (isDigit(char)) {
        value += char;
        position++;
      } else {
        state = 'END';
        break;
      }
    }
  }
  
  return {
    type: 'NumericLiteral',
    value: Number(value),
    position
  };
}

function isDigit(char) {
  return char >= '0' && char <= '9';
}
```

### 3. 示例：识别字符串

**状态图：**
```
         '"'
   START ---> IN_STRING
               |     |
               | char|
               |     ↓
               |   ESCAPE
               |     |
               | char|
               ↓     ↓
              END <--
               |
              '"'
```

---

## ⚡ 词法分析的优化

### 1. 减少字符串操作

**问题：** JavaScript 字符串操作慢

**优化：**
```javascript
// ❌ 慢：频繁创建新字符串
while (position < code.length) {
  const remaining = code.slice(position);
  // ...
}

// ✅ 快：直接访问字符
while (position < code.length) {
  const char = code[position];
  // ...
}
```

### 2. 使用查找表

**问题：** 多次调用 `isKeyword()`、`isOperator()` 慢

**优化：**
```javascript
// 预先构建查找表
const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', // ...
]);

const OPERATORS = new Set([
  '+', '-', '*', '/', '=', '==', '===', // ...
]);

// 快速查找
if (KEYWORDS.has(word)) {
  type = 'Keyword';
}
```

### 3. 减少回溯

**问题：** 回溯会降低性能

**优化：**
- 使用 lookahead 预判
- 优化文法规则
- 使用确定性状态机

### 4. 使用 Buffer

**问题：** 频繁的数组 push 慢

**优化：**
```javascript
// 预分配数组
const tokens = new Array(estimatedTokenCount);
let index = 0;

// 使用索引赋值
tokens[index++] = token;
```

---

## 🎓 关键要点总结

1. **词法分析的任务**：
   - 将源代码字符串分割成 Token 流
   - Token 是有意义的字符序列

2. **Token 类型**：
   - Keyword（关键字）
   - Identifier（标识符）
   - Literal（字面量）
   - Operator（操作符）
   - Punctuator（标点符号）

3. **实现方法**：
   - 手写状态机
   - 正则表达式
   - 有限自动机

4. **优化技术**：
   - 减少字符串操作
   - 使用查找表
   - 减少回溯
   - Buffer 优化

---

## 🔗 下一步

理解了词法分析后，接下来学习：
- **03-syntax-analysis.md**：语法分析详解
- **Demo 01**：手写 Tokenizer

**记住：词法分析是 Parser 的第一步！** 🎉

