# 实现简单的 Formatter

## 🎯 目标

从零实现一个简单但功能完整的 JavaScript Formatter，理解格式化的核心原理。

---

## 📋 需求分析

### 要格式化的内容

```javascript
// 输入（混乱的代码）
const x=1+2;function add(a,b){return a+b;}

// 输出（格式化后）
const x = 1 + 2;

function add(a, b) {
  return a + b;
}
```

### 核心规则

1. ✅ 操作符前后加空格（`=`, `+`, `-`）
2. ✅ 逗号后加空格
3. ✅ 函数声明换行
4. ✅ 块语句缩进
5. ✅ 语句之间空行

---

## 🏗️ 实现架构

```
源代码
  ↓
1. Parse（解析为 AST）
  ↓
AST
  ↓
2. Format（遍历 AST，生成格式化代码）
  ↓
格式化后的代码
```

---

## 💻 完整实现

### 1. 基础框架

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

class SimpleFormatter {
  constructor(options = {}) {
    this.options = {
      indent: options.indent || 2,
      lineWidth: options.lineWidth || 80,
      ...options
    };
    
    this.output = '';
    this.indentLevel = 0;
  }
  
  format(code) {
    // 1. 解析为 AST
    const ast = parser.parse(code, {
      sourceType: 'module'
    });
    
    // 2. 格式化
    this.output = '';
    this.indentLevel = 0;
    this.formatProgram(ast.program);
    
    return this.output.trim();
  }
  
  // 工具方法
  indent() {
    this.indentLevel++;
  }
  
  dedent() {
    this.indentLevel--;
  }
  
  write(str) {
    this.output += str;
  }
  
  writeLine(str = '') {
    const spaces = ' '.repeat(this.indentLevel * this.options.indent);
    this.output += spaces + str + '\n';
  }
  
  writeSpace() {
    this.output += ' ';
  }
}
```

### 2. 格式化 Program

```javascript
formatProgram(program) {
  const statements = program.body;
  
  statements.forEach((stmt, index) => {
    this.formatStatement(stmt);
    
    // 函数声明后加空行
    if (t.isFunctionDeclaration(stmt)) {
      this.writeLine();
    }
  });
}
```

### 3. 格式化语句

```javascript
formatStatement(node) {
  if (t.isVariableDeclaration(node)) {
    this.formatVariableDeclaration(node);
  } else if (t.isFunctionDeclaration(node)) {
    this.formatFunctionDeclaration(node);
  } else if (t.isReturnStatement(node)) {
    this.formatReturnStatement(node);
  } else if (t.isExpressionStatement(node)) {
    this.formatExpressionStatement(node);
  }
}
```

### 4. 格式化变量声明

```javascript
formatVariableDeclaration(node) {
  // const x = 1 + 2;
  this.write(node.kind);  // const/let/var
  this.writeSpace();
  
  node.declarations.forEach((decl, index) => {
    if (index > 0) {
      this.write(',');
      this.writeSpace();
    }
    this.formatVariableDeclarator(decl);
  });
  
  this.writeLine(';');
}

formatVariableDeclarator(node) {
  // x = 1 + 2
  this.write(node.id.name);
  
  if (node.init) {
    this.writeSpace();
    this.write('=');
    this.writeSpace();
    this.formatExpression(node.init);
  }
}
```

### 5. 格式化表达式

```javascript
formatExpression(node) {
  if (t.isNumericLiteral(node)) {
    this.write(String(node.value));
  } else if (t.isStringLiteral(node)) {
    this.write(`"${node.value}"`);
  } else if (t.isIdentifier(node)) {
    this.write(node.name);
  } else if (t.isBinaryExpression(node)) {
    this.formatBinaryExpression(node);
  } else if (t.isCallExpression(node)) {
    this.formatCallExpression(node);
  }
}

formatBinaryExpression(node) {
  // 1 + 2
  this.formatExpression(node.left);
  this.writeSpace();
  this.write(node.operator);
  this.writeSpace();
  this.formatExpression(node.right);
}

formatCallExpression(node) {
  // add(1, 2)
  this.formatExpression(node.callee);
  this.write('(');
  
  node.arguments.forEach((arg, index) => {
    if (index > 0) {
      this.write(',');
      this.writeSpace();
    }
    this.formatExpression(arg);
  });
  
  this.write(')');
}
```

### 6. 格式化函数声明

```javascript
formatFunctionDeclaration(node) {
  // function add(a, b) {
  //   return a + b;
  // }
  
  this.write('function');
  this.writeSpace();
  this.write(node.id.name);
  this.write('(');
  
  // 参数列表
  node.params.forEach((param, index) => {
    if (index > 0) {
      this.write(',');
      this.writeSpace();
    }
    this.write(param.name);
  });
  
  this.write(')');
  this.writeSpace();
  this.write('{');
  this.writeLine();
  
  // 函数体
  this.indent();
  node.body.body.forEach(stmt => {
    this.formatStatement(stmt);
  });
  this.dedent();
  
  this.writeLine('}');
}
```

### 7. 格式化 Return 语句

```javascript
formatReturnStatement(node) {
  // return a + b;
  this.write('return');
  
  if (node.argument) {
    this.writeSpace();
    this.formatExpression(node.argument);
  }
  
  this.writeLine(';');
}
```

### 8. 格式化表达式语句

```javascript
formatExpressionStatement(node) {
  this.formatExpression(node.expression);
  this.writeLine(';');
}
```

---

## 🧪 测试

```javascript
const formatter = new SimpleFormatter();

const code = `
const x=1+2;const y=3+4;
function add(a,b){return a+b;}
const result=add(x,y);
`;

const formatted = formatter.format(code);
console.log(formatted);
```

### 输出

```javascript
const x = 1 + 2;
const y = 3 + 4;

function add(a, b) {
  return a + b;
}

const result = add(x, y);
```

---

## 🎨 扩展功能

### 1. 支持对象格式化

```javascript
formatObjectExpression(node) {
  this.write('{');
  
  if (node.properties.length === 0) {
    this.write('}');
    return;
  }
  
  // 判断是否需要换行
  const shouldBreak = this.shouldBreakObject(node);
  
  if (shouldBreak) {
    this.writeLine();
    this.indent();
    
    node.properties.forEach((prop, index) => {
      this.formatObjectProperty(prop);
      this.writeLine(',');
    });
    
    this.dedent();
    this.write('}');
  } else {
    this.writeSpace();
    node.properties.forEach((prop, index) => {
      if (index > 0) {
        this.write(',');
        this.writeSpace();
      }
      this.formatObjectProperty(prop);
    });
    this.writeSpace();
    this.write('}');
  }
}

formatObjectProperty(node) {
  this.write(node.key.name);
  this.write(':');
  this.writeSpace();
  this.formatExpression(node.value);
}

shouldBreakObject(node) {
  // 简单策略：超过 3 个属性就换行
  return node.properties.length > 3;
}
```

### 2. 支持数组格式化

```javascript
formatArrayExpression(node) {
  this.write('[');
  
  if (node.elements.length === 0) {
    this.write(']');
    return;
  }
  
  const shouldBreak = this.shouldBreakArray(node);
  
  if (shouldBreak) {
    this.writeLine();
    this.indent();
    
    node.elements.forEach((elem, index) => {
      this.formatExpression(elem);
      if (index < node.elements.length - 1) {
        this.writeLine(',');
      } else {
        this.writeLine();
      }
    });
    
    this.dedent();
    this.write(']');
  } else {
    node.elements.forEach((elem, index) => {
      if (index > 0) {
        this.write(',');
        this.writeSpace();
      }
      this.formatExpression(elem);
    });
    this.write(']');
  }
}

shouldBreakArray(node) {
  return node.elements.length > 5;
}
```

### 3. 支持 If 语句

```javascript
formatIfStatement(node) {
  this.write('if');
  this.writeSpace();
  this.write('(');
  this.formatExpression(node.test);
  this.write(')');
  this.writeSpace();
  
  // Consequent
  if (t.isBlockStatement(node.consequent)) {
    this.formatBlockStatement(node.consequent);
  } else {
    this.writeLine();
    this.indent();
    this.formatStatement(node.consequent);
    this.dedent();
  }
  
  // Alternate (else)
  if (node.alternate) {
    this.writeSpace();
    this.write('else');
    this.writeSpace();
    
    if (t.isBlockStatement(node.alternate)) {
      this.formatBlockStatement(node.alternate);
    } else if (t.isIfStatement(node.alternate)) {
      // else if
      this.formatIfStatement(node.alternate);
    } else {
      this.writeLine();
      this.indent();
      this.formatStatement(node.alternate);
      this.dedent();
    }
  }
}

formatBlockStatement(node) {
  this.write('{');
  this.writeLine();
  
  this.indent();
  node.body.forEach(stmt => {
    this.formatStatement(stmt);
  });
  this.dedent();
  
  this.writeLine('}');
}
```

---

## 📊 对比：简单 vs Prettier

| 特性 | 简单 Formatter | Prettier |
|------|---------------|----------|
| **换行策略** | 固定规则 | 智能 Layout |
| **行宽检测** | ❌ 不支持 | ✅ 支持 |
| **IR 层** | ❌ 无 | ✅ 有 |
| **代码行数** | ~200 行 | ~50000 行 |
| **支持语言** | 仅 JS | 10+ 种 |

---

## 💡 核心要点

### 1. 遍历 AST

```javascript
// 使用类型判断处理不同节点
if (t.isFunctionDeclaration(node)) {
  // ...
} else if (t.isVariableDeclaration(node)) {
  // ...
}
```

### 2. 管理缩进

```javascript
// 进入块语句
this.indent();

// 格式化内容
// ...

// 退出块语句
this.dedent();
```

### 3. 添加空格

```javascript
// 操作符前后
this.writeSpace();
this.write('=');
this.writeSpace();

// 逗号后
this.write(',');
this.writeSpace();
```

### 4. 换行策略

```javascript
// 简单策略：固定规则
if (node.properties.length > 3) {
  // 换行
} else {
  // 不换行
}

// Prettier 策略：智能判断
if (calculateWidth(node) > printWidth) {
  // 换行
}
```

---

## 🚀 性能优化

### 1. 字符串拼接

```javascript
// ❌ 慢（每次创建新字符串）
output = output + str;

// ✅ 快（数组 join）
const parts = [];
parts.push(str);
output = parts.join('');
```

### 2. 缓存节点类型

```javascript
// ❌ 每次都检测
function formatNode(node) {
  if (t.isFunctionDeclaration(node)) { }
  else if (t.isVariableDeclaration(node)) { }
}

// ✅ 使用 Map
const formatters = new Map([
  ['FunctionDeclaration', formatFunction],
  ['VariableDeclaration', formatVariable]
]);

function formatNode(node) {
  const formatter = formatters.get(node.type);
  if (formatter) {
    formatter(node);
  }
}
```

---

## 🎯 实践建议

1. **从简单开始**：
   - 先支持基本语句
   - 逐步增加复杂语法

2. **测试驱动**：
   - 每添加一个功能就测试
   - 保证语义不变

3. **参考 Prettier**：
   - 学习其换行策略
   - 理解其设计思想

4. **性能优化**：
   - 避免不必要的字符串拼接
   - 使用缓存

---

## 📚 扩展阅读

- [Babel Types API](https://babeljs.io/docs/en/babel-types)
- [AST Explorer](https://astexplorer.net/)
- [Prettier Playground](https://prettier.io/playground/)

---

## 🎓 核心收获

1. Formatter = AST 遍历 + 规则应用
2. 缩进管理是关键
3. 换行策略影响可读性
4. 性能优化很重要
5. Prettier 的智能换行很复杂

**通过实现简单的 Formatter，你已经理解了格式化的核心原理！**

