# 构建 AST

## 📖 概述

本文讲解如何从 Token 流构建 AST，以及 AST 的优化技术。

---

## 🎯 从 Token 到 AST 的过程

### 完整流程

```
Token 流
  ↓ 词法信息
Parse Tree
  ↓ 简化
AST
```

### 示例：`const x = 1 + 2;`

**Token 流：**
```javascript
[const, x, =, 1, +, 2, ;]
```

**Parse Tree（完整）：**
```
Program
└── VariableDeclaration
    ├── keyword: 'const'
    └── VariableDeclarator
        ├── id: Identifier
        │   └── name: 'x'
        ├── operator: '='
        └── init: Expression
            ├── Term
            │   └── Factor
            │       └── Number: 1
            ├── operator: '+'
            └── Term
                └── Factor
                    └── Number: 2
```

**AST（简化）：**
```
Program
└── VariableDeclaration (kind: "const")
    └── VariableDeclarator
        ├── id: Identifier (name: "x")
        └── init: BinaryExpression
            ├── left: NumericLiteral (1)
            ├── operator: "+"
            └── right: NumericLiteral (2)
```

---

## 🏗️ AST 节点的创建

### 使用工厂函数

```javascript
function createNumericLiteral(value) {
  return {
    type: 'NumericLiteral',
    value
  };
}

function createBinaryExpression(left, operator, right) {
  return {
    type: 'BinaryExpression',
    left,
    operator,
    right
  };
}

function createVariableDeclaration(kind, declarations) {
  return {
    type: 'VariableDeclaration',
    kind,
    declarations
  };
}
```

### 示例使用

```javascript
const ast = createVariableDeclaration('const', [
  createVariableDeclarator(
    createIdentifier('x'),
    createBinaryExpression(
      createNumericLiteral(1),
      '+',
      createNumericLiteral(2)
    )
  )
]);
```

---

## ⚡ AST 的优化

### 1. 常量折叠（Constant Folding）

```javascript
// 输入
1 + 2

// 未优化的 AST
BinaryExpression {
  left: NumericLiteral(1),
  operator: '+',
  right: NumericLiteral(2)
}

// 优化后的 AST
NumericLiteral(3)
```

### 2. 死代码消除（Dead Code Elimination）

```javascript
// 输入
if (false) {
  console.log('never runs');
}

// 优化：直接移除整个 if 语句
```

### 3. 节点合并

```javascript
// 合并嵌套的 BlockStatement
{
  {
    const x = 1;
  }
}

// 优化为
{
  const x = 1;
}
```

---

## 🚨 错误处理

### 1. 语法错误检测

```javascript
const x = ;  // SyntaxError: Unexpected token ';'
```

### 2. 错误恢复策略

**Panic Mode：**
- 跳过 Token 直到找到同步点（如 `;`）
- 继续解析后续代码

**Error Production：**
- 为常见错误添加文法规则
- 提供更友好的错误信息

### 3. 错误信息

```javascript
{
  message: 'Unexpected token',
  line: 1,
  column: 10,
  token: ';'
}
```

---

## 🎓 关键要点

1. **构建过程**：Token → Parse Tree → AST
2. **节点创建**：使用工厂函数
3. **优化技术**：常量折叠、死代码消除
4. **错误处理**：检测 + 恢复

---

## 🔗 下一步

- **06-parser-performance.md**：Parser 性能优化
- **Demos**：手写 Parser

**记住：AST 是代码的结构化表示！** 🎉

