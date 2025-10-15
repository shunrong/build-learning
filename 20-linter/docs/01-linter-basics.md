# Linter 基础

## 什么是 Linter？

**Linter（代码检查工具）** 是一种静态代码分析工具，用于检查代码中的潜在错误、代码风格问题和不规范的写法。

---

## Linter 的作用

1. **发现潜在错误**
   - 未使用的变量
   - 未定义的变量
   - 可能的 null/undefined 错误

2. **统一代码风格**
   - 缩进、引号、分号
   - 命名规范
   - 代码格式

3. **强制最佳实践**
   - 避免使用 eval()
   - 禁止修改原生对象
   - 推荐使用 const/let

---

## ESLint 工作原理

```
源代码 → Parser (AST) → Rules → Report
```

1. **解析**：将代码解析为 AST
2. **遍历**：遍历 AST 节点
3. **检查**：应用规则检查
4. **报告**：输出问题和建议

---

## 示例

```javascript
// 代码
var x = 1;
x = 2;

// ESLint 检查
// ✗ 'x' is never reassigned. Use 'const' instead (prefer-const)
```

**继续阅读**: `02-eslint-rules.md` 📖
