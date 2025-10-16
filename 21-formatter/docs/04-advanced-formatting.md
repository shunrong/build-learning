# 高级格式化技巧

## 🎯 目标

学习高级的代码格式化技巧，包括智能换行、注释处理、Source Map 等。

---

## 💡 智能换行策略

### 1. 基于宽度的换行

```javascript
class SmartFormatter {
  constructor(options = {}) {
    this.printWidth = options.printWidth || 80;
    this.currentColumn = 0;
  }
  
  // 计算表达式的宽度
  calculateWidth(node) {
    let width = 0;
    
    if (t.isIdentifier(node)) {
      width = node.name.length;
    } else if (t.isBinaryExpression(node)) {
      width = this.calculateWidth(node.left) 
            + node.operator.length + 2  // 操作符 + 两边空格
            + this.calculateWidth(node.right);
    } else if (t.isCallExpression(node)) {
      width = this.calculateWidth(node.callee) + 2;  // 函数名 + ()
      node.arguments.forEach((arg, index) => {
        if (index > 0) width += 2;  // 逗号 + 空格
        width += this.calculateWidth(arg);
      });
    }
    
    return width;
  }
  
  // 决定是否换行
  shouldBreak(node) {
    const width = this.calculateWidth(node);
    return this.currentColumn + width > this.printWidth;
  }
}
```

### 示例

```javascript
// printWidth = 40

// 短函数调用（不换行）
doSomething(a, b);

// 长函数调用（换行）
doSomething(
  veryLongArgumentName,
  anotherVeryLongArgumentName,
  yetAnotherLongArgumentName
);
```

---

## 🎨 对象和数组的智能格式化

### 1. 对象格式化策略

```javascript
formatObject(node) {
  // 策略 1: 空对象
  if (node.properties.length === 0) {
    return '{}';
  }
  
  // 策略 2: 单个短属性（同行）
  if (node.properties.length === 1) {
    const prop = node.properties[0];
    const propText = this.formatProperty(prop);
    
    if (propText.length < 20) {
      return `{ ${propText} }`;
    }
  }
  
  // 策略 3: 尝试放在同一行
  const singleLine = this.tryFormatObjectInline(node);
  if (singleLine && singleLine.length <= this.printWidth) {
    return singleLine;
  }
  
  // 策略 4: 多行格式
  return this.formatObjectMultiline(node);
}

tryFormatObjectInline(node) {
  const props = node.properties
    .map(prop => this.formatProperty(prop))
    .join(', ');
  
  return `{ ${props} }`;
}

formatObjectMultiline(node) {
  let result = '{\n';
  this.indent();
  
  node.properties.forEach((prop, index) => {
    result += this.getIndent();
    result += this.formatProperty(prop);
    
    // 最后一个属性后的逗号（trailing comma）
    if (index < node.properties.length - 1 || this.options.trailingComma) {
      result += ',';
    }
    
    result += '\n';
  });
  
  this.dedent();
  result += this.getIndent() + '}';
  
  return result;
}
```

### 2. 数组格式化策略

```javascript
formatArray(node) {
  // 空数组
  if (node.elements.length === 0) {
    return '[]';
  }
  
  // 短数组（尝试同行）
  const singleLine = this.tryFormatArrayInline(node);
  if (singleLine && singleLine.length <= this.printWidth) {
    return singleLine;
  }
  
  // 长数组（多行）
  return this.formatArrayMultiline(node);
}

tryFormatArrayInline(node) {
  const elems = node.elements
    .map(elem => this.formatExpression(elem))
    .join(', ');
  
  return `[${elems}]`;
}

formatArrayMultiline(node) {
  let result = '[\n';
  this.indent();
  
  node.elements.forEach((elem, index) => {
    result += this.getIndent();
    result += this.formatExpression(elem);
    
    if (index < node.elements.length - 1) {
      result += ',';
    }
    
    result += '\n';
  });
  
  this.dedent();
  result += this.getIndent() + ']';
  
  return result;
}
```

---

## 💬 注释处理

### 1. 注释类型

```javascript
// 1. 单行注释
// This is a comment

// 2. 多行注释
/* This is a 
   multi-line comment */

// 3. JSDoc 注释
/**
 * This is a JSDoc comment
 * @param {number} x - The first number
 */
```

### 2. 注释附加

Babel AST 中的注释附加在节点上：

```javascript
{
  type: 'FunctionDeclaration',
  leadingComments: [  // 前面的注释
    {
      type: 'CommentLine',
      value: ' This function adds two numbers'
    }
  ],
  trailingComments: [  // 后面的注释
    {
      type: 'CommentLine',
      value: ' End of function'
    }
  ],
  // ...
}
```

### 3. 注释格式化

```javascript
formatWithComments(node) {
  let result = '';
  
  // 1. 前置注释
  if (node.leadingComments) {
    node.leadingComments.forEach(comment => {
      result += this.formatComment(comment);
      result += '\n';
    });
  }
  
  // 2. 节点本身
  result += this.formatNode(node);
  
  // 3. 后置注释
  if (node.trailingComments) {
    node.trailingComments.forEach(comment => {
      result += '  ';  // 两个空格
      result += this.formatComment(comment);
    });
  }
  
  return result;
}

formatComment(comment) {
  if (comment.type === 'CommentLine') {
    return `//${comment.value}`;
  } else if (comment.type === 'CommentBlock') {
    return `/*${comment.value}*/`;
  }
}
```

### 4. JSDoc 特殊处理

```javascript
formatJSDocComment(comment) {
  const lines = comment.value.split('\n');
  
  let result = '/**\n';
  lines.forEach(line => {
    result += ' * ' + line.trim() + '\n';
  });
  result += ' */';
  
  return result;
}
```

---

## 🔗 Source Map 支持

### 1. 为什么需要 Source Map？

```javascript
// 原始代码（格式化前）
const x=1+2;  // Line 1

// 格式化后
const x = 1 + 2;  // Line 1

// 如果在格式化后的代码中报错，如何定位到原始位置？
// → Source Map！
```

### 2. Source Map 格式

```javascript
{
  "version": 3,
  "sources": ["original.js"],
  "names": ["x"],
  "mappings": "AAAA,MAAMA,CAAC,GAAG,CAAC,GAAG,CAAC",
  "file": "formatted.js"
}
```

### 3. 生成 Source Map

```javascript
const { SourceMapGenerator } = require('source-map');

class FormatterWithSourceMap {
  constructor() {
    this.output = '';
    this.line = 1;
    this.column = 0;
    this.sourceMap = new SourceMapGenerator({
      file: 'formatted.js'
    });
  }
  
  write(str, originalLoc) {
    // 记录映射
    if (originalLoc) {
      this.sourceMap.addMapping({
        generated: {
          line: this.line,
          column: this.column
        },
        original: {
          line: originalLoc.line,
          column: originalLoc.column
        },
        source: 'original.js'
      });
    }
    
    // 写入输出
    this.output += str;
    this.column += str.length;
  }
  
  writeLine() {
    this.output += '\n';
    this.line++;
    this.column = 0;
  }
  
  format(code) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      locations: true  // 包含位置信息
    });
    
    this.formatProgram(ast.program);
    
    return {
      code: this.output,
      map: this.sourceMap.toString()
    };
  }
}
```

---

## 🎭 特殊语法处理

### 1. 模板字符串

```javascript
formatTemplateLiteral(node) {
  let result = '`';
  
  node.quasis.forEach((quasi, index) => {
    result += quasi.value.raw;
    
    if (index < node.expressions.length) {
      result += '${';
      result += this.formatExpression(node.expressions[index]);
      result += '}';
    }
  });
  
  result += '`';
  return result;
}
```

### 2. 箭头函数

```javascript
formatArrowFunction(node) {
  let result = '';
  
  // 参数
  if (node.params.length === 0) {
    result += '()';
  } else if (node.params.length === 1 && t.isIdentifier(node.params[0])) {
    // 单个参数，省略括号
    result += node.params[0].name;
  } else {
    result += '(';
    result += node.params.map(p => p.name).join(', ');
    result += ')';
  }
  
  result += ' => ';
  
  // 函数体
  if (t.isBlockStatement(node.body)) {
    result += this.formatBlockStatement(node.body);
  } else {
    // 隐式返回
    result += this.formatExpression(node.body);
  }
  
  return result;
}
```

### 3. 解构赋值

```javascript
formatObjectPattern(node) {
  let result = '{ ';
  
  node.properties.forEach((prop, index) => {
    if (index > 0) {
      result += ', ';
    }
    
    if (prop.shorthand) {
      // { x } 而不是 { x: x }
      result += prop.key.name;
    } else {
      result += prop.key.name + ': ' + prop.value.name;
    }
  });
  
  result += ' }';
  return result;
}

formatArrayPattern(node) {
  let result = '[ ';
  
  node.elements.forEach((elem, index) => {
    if (index > 0) {
      result += ', ';
    }
    
    if (elem) {
      result += elem.name;
    } else {
      // 跳过的元素
      result += ' ';
    }
  });
  
  result += ' ]';
  return result;
}
```

---

## 🚀 性能优化技巧

### 1. 避免重复计算

```javascript
class OptimizedFormatter {
  constructor() {
    this.widthCache = new Map();
  }
  
  calculateWidth(node) {
    // 使用缓存
    if (this.widthCache.has(node)) {
      return this.widthCache.get(node);
    }
    
    const width = this.doCalculateWidth(node);
    this.widthCache.set(node, width);
    return width;
  }
}
```

### 2. 批量写入

```javascript
class BufferedFormatter {
  constructor() {
    this.buffer = [];
  }
  
  write(str) {
    this.buffer.push(str);
  }
  
  flush() {
    const result = this.buffer.join('');
    this.buffer = [];
    return result;
  }
}
```

### 3. 并行格式化

```javascript
async function formatFiles(files) {
  const formatter = new Formatter();
  
  // 并行处理多个文件
  const results = await Promise.all(
    files.map(file => 
      fs.readFile(file).then(code => 
        formatter.format(code)
      )
    )
  );
  
  return results;
}
```

---

## 📊 格式化质量指标

### 1. 一致性

```javascript
// ✅ 好：所有对象都使用相同风格
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// ❌ 差：对象风格不一致
const obj1 = {a:1,b:2};
const obj2 = { c: 3, d: 4 };
```

### 2. 可读性

```javascript
// ✅ 好：清晰的层次结构
function complexFunction() {
  if (condition) {
    doSomething();
  } else {
    doAnotherThing();
  }
}

// ❌ 差：难以阅读
function complexFunction(){if(condition){doSomething();}else{doAnotherThing();}}
```

### 3. 稳定性（幂等性）

```javascript
const code = 'const x=1';

format(code) === format(format(code))
// ✅ 必须为 true
```

---

## 💡 最佳实践

### 1. 配置化

```javascript
class ConfigurableFormatter {
  constructor(options = {}) {
    this.options = {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      bracketSpacing: true,
      arrowParens: 'always',
      ...options
    };
  }
}
```

### 2. 错误处理

```javascript
format(code) {
  try {
    const ast = parser.parse(code);
    return this.formatProgram(ast.program);
  } catch (error) {
    console.error('Parse error:', error.message);
    // 返回原始代码
    return code;
  }
}
```

### 3. 增量格式化

```javascript
formatRange(code, start, end) {
  // 只格式化指定范围
  const ast = parser.parse(code, {
    locations: true
  });
  
  // 找到范围内的节点
  const nodesInRange = this.findNodesInRange(ast, start, end);
  
  // 只格式化这些节点
  return this.formatNodes(nodesInRange);
}
```

---

## 🎯 实践建议

1. **智能换行**：
   - 基于宽度计算
   - 提供多种策略

2. **注释保留**：
   - 正确附加注释
   - 保持注释位置

3. **Source Map**：
   - 对调试至关重要
   - 记录每个映射

4. **性能优化**：
   - 使用缓存
   - 批量处理
   - 并行格式化

---

## 📚 扩展阅读

- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Source Map Specification](https://sourcemaps.info/spec.html)
- [ESLint Formatter](https://eslint.org/docs/latest/developer-guide/working-with-custom-formatters)

---

## 🎓 核心收获

1. 智能换行需要宽度计算
2. 注释处理很复杂但必须做
3. Source Map 对调试至关重要
4. 特殊语法需要特殊处理
5. 性能优化永无止境

**高级格式化技巧让你的 Formatter 更接近 Prettier！**

