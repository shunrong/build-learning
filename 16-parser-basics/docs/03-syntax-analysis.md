# 语法分析详解

## 📖 概述

本文深入讲解语法分析（Syntax Analysis）的原理，理解如何从 Token 流构建 AST。

---

## 🎯 什么是语法分析

### 定义

**语法分析（Syntax Analysis）** 是 Parser 的第二个阶段，负责**分析 Token 流的语法结构**，构建**抽象语法树（AST）**。

**核心任务：**
```
Token 流 → Parser → AST
```

### 类比理解

**句子的语法分析：**
```
Token 流：["The", "cat", "sat", "on", "the", "mat"]

语法分析：
Sentence
├── NounPhrase: "The cat"
│   ├── Det: "The"
│   └── Noun: "cat"
├── Verb: "sat"
└── PrepositionalPhrase: "on the mat"
    ├── Prep: "on"
    └── NounPhrase: "the mat"
```

**代码的语法分析：**
```
Token 流：[const, x, =, 1, ;]

语法分析：
Program
└── VariableDeclaration
    └── VariableDeclarator
        ├── Identifier("x")
        └── NumericLiteral(1)
```

---

## 📚 上下文无关文法（CFG）

### 1. 什么是文法

**文法（Grammar）** 定义了语言的**语法规则**。

**BNF 表示法（Backus-Naur Form）：**
```
Program         → Statement*
Statement       → VariableDeclaration
                | FunctionDeclaration
                | ExpressionStatement

VariableDeclaration → ('const' | 'let' | 'var') Identifier '=' Expression ';'
Expression      → Term (('+' | '-') Term)*
Term            → Factor (('*' | '/') Factor)*
Factor          → Number | Identifier | '(' Expression ')'
```

### 2. 推导（Derivation）

**推导** 是从起始符号开始，逐步应用文法规则，生成句子的过程。

**示例：推导 `1 + 2 * 3`**
```
Expression
→ Term + Term               (应用 Expression 规则)
→ Factor + Term             (应用 Term 规则)
→ Number + Term             (应用 Factor 规则)
→ 1 + Term                  (替换 Number)
→ 1 + Factor * Factor       (应用 Term 规则)
→ 1 + Number * Factor       (应用 Factor 规则)
→ 1 + 2 * Factor            (替换 Number)
→ 1 + 2 * Number            (应用 Factor 规则)
→ 1 + 2 * 3                 (替换 Number)
```

---

## 🌳 Parse Tree vs AST

### 1. Parse Tree（解析树）

**Parse Tree** 是**完整的推导过程**，包含所有文法规则。

**示例：`1 + 2`**
```
Expression
└── Term
    ├── Term
    │   └── Factor
    │       └── Number (1)
    ├── '+'
    └── Factor
        └── Number (2)
```

**特点：**
- 包含所有文法符号
- 结构复杂
- 冗余信息多

### 2. AST（抽象语法树）

**AST** 是**简化的语法树**，去除冗余信息。

**示例：`1 + 2`**
```
BinaryExpression
├── left: NumericLiteral (1)
├── operator: '+'
└── right: NumericLiteral (2)
```

**特点：**
- 只保留语义信息
- 结构简洁
- 便于后续处理

### 3. 对比

| 特性 | Parse Tree | AST |
|------|-----------|-----|
| **完整性** | 包含所有规则 | 只保留关键信息 |
| **大小** | 更大 | 更小 |
| **用途** | 理论分析 | 实际应用 |

---

## 🚀 递归下降解析

### 1. 原理

**递归下降解析** 是一种自顶向下的解析算法：
- 为每个文法规则编写一个函数
- 通过递归调用构建 AST

### 2. 示例：数学表达式

**文法规则：**
```
Expression → Term (('+' | '-') Term)*
Term       → Factor (('*' | '/') Factor)*
Factor     → Number | '(' Expression ')'
```

**递归下降实现：**
```javascript
class Parser {
  parseExpression() {
    let left = this.parseTerm();
    
    while (this.match('+') || this.match('-')) {
      const operator = this.previous();
      const right = this.parseTerm();
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    
    return left;
  }
  
  parseTerm() {
    let left = this.parseFactor();
    
    while (this.match('*') || this.match('/')) {
      const operator = this.previous();
      const right = this.parseFactor();
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    
    return left;
  }
  
  parseFactor() {
    if (this.match('NUMBER')) {
      return {
        type: 'NumericLiteral',
        value: this.previous().value
      };
    }
    
    if (this.match('(')) {
      const expr = this.parseExpression();
      this.consume(')');
      return expr;
    }
    
    throw new Error('Unexpected token');
  }
}
```

---

## ⚠️ 语法分析的挑战

### 1. 左递归

**问题：**
```
Expression → Expression '+' Term  // 左递归
```

会导致无限递归！

**解决：**
```
Expression → Term ('+' Term)*     // 改写为循环
```

### 2. 二义性

**问题：**
```
1 + 2 * 3

可能的解析：
1. (1 + 2) * 3 = 9
2. 1 + (2 * 3) = 7
```

**解决：** 明确优先级

### 3. 错误恢复

**策略：**
- Panic Mode：跳到安全点
- Error Production：添加错误规则

---

## 🎓 关键要点

1. **语法分析**：Token 流 → AST
2. **文法规则**：定义语法结构
3. **递归下降**：最常用的解析算法
4. **Parse Tree vs AST**：AST 更简洁
5. **挑战**：左递归、二义性、错误恢复

---

## 🔗 下一步

- **04-parsing-algorithms.md**：解析算法详解
- **Demo 02**：手写表达式 Parser

**记住：语法分析是构建 AST 的核心！** 🎉

