# 解析算法

## 📖 概述

本文对比不同的解析算法，理解它们的优劣和适用场景。

---

## 🎯 解析算法分类

### 自顶向下 vs 自底向上

```
自顶向下（Top-Down）
- 从根节点开始
- 逐步展开到叶子
- 示例：递归下降、LL

自底向上（Bottom-Up）
- 从叶子开始
- 逐步归约到根节点
- 示例：LR、LALR
```

---

## 🔄 递归下降解析（Recursive Descent）

### 原理

为每个文法规则编写一个函数，通过递归调用构建 AST。

### 优点

- ✅ 实现简单
- ✅ 易于理解和调试
- ✅ 错误恢复容易
- ✅ 完全可控

### 缺点

- ❌ 不能处理左递归
- ❌ 可能需要回溯

### 使用场景

- Babel Parser
- Acorn
- Esprima
- 大多数手写 Parser

---

## 📊 LL(k) Parser

### 定义

- **LL**：Left-to-right, Leftmost derivation
- **k**：lookahead 数量

### 特点

- 自顶向下
- 需要 k 个 lookahead
- 不能处理左递归

### 示例：LL(1)

```javascript
// LL(1) 文法
Statement → 'if' Expression Block
          | 'return' Expression
          | Expression

// 只需要 1 个 lookahead 就能决定使用哪个规则
```

---

## 🔧 LR(k) Parser

### 定义

- **LR**：Left-to-right, Rightmost derivation
- **k**：lookahead 数量

### 特点

- 自底向上
- 能处理更复杂的文法
- 能处理左递归
- 通常由工具生成

### 变体

- **SLR**：Simple LR
- **LALR**：Look-Ahead LR（最常用）
- **CLR**：Canonical LR

### 使用场景

- Yacc / Bison（C/C++）
- 编译器生成器

---

## 📈 算法对比

| 算法 | 类型 | 左递归 | 实现难度 | 性能 | 使用场景 |
|------|------|--------|---------|------|---------|
| **递归下降** | 自顶向下 | ❌ | 简单 | 中等 | 手写 Parser |
| **LL(k)** | 自顶向下 | ❌ | 简单 | 中等 | 简单语言 |
| **LR(k)** | 自底向上 | ✅ | 复杂 | 快 | 生成式 Parser |

---

## 🚀 JavaScript Parser 使用的算法

### Babel Parser

- **算法**：递归下降
- **优点**：灵活、易于扩展
- **缺点**：性能一般

### SWC Parser

- **算法**：递归下降
- **语言**：Rust
- **优点**：10-20x 更快
- **原因**：Rust 性能优势

### Oxc Parser

- **算法**：递归下降
- **语言**：Rust
- **优点**：2-3x SWC
- **原因**：极致优化

---

## 🎓 关键要点

1. **递归下降**：最常用于 JavaScript Parser
2. **LL vs LR**：自顶向下 vs 自底向上
3. **左递归**：递归下降的主要限制
4. **Rust 优势**：性能提升 10-100x

---

## 🔗 下一步

- **05-build-ast.md**：构建 AST 的过程
- **Demo 02-04**：手写 Parser

**记住：选择合适的算法很重要！** 🎉

