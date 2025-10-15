# Acorn 与 Esprima

## 📖 概述

Acorn 和 Esprima 是两个轻量级、高性能的 JavaScript Parser。

---

## 🌰 Acorn

### 特点

**设计哲学：**
- ✅ **小而快**：核心代码 < 10KB
- ✅ **模块化**：插件系统
- ✅ **性能优先**：比 Babel Parser 快 1.5-2x
- ✅ **标准化**：严格遵循 ESTree 规范

**性能数据：**
```
Acorn:        150-200 MB/s (1.5-2x Babel)
内存占用:     15-25 MB
包大小:       ~500 KB
```

### 使用示例

```javascript
const acorn = require('acorn');

const code = 'const x = 1;';
const ast = acorn.parse(code, {
  ecmaVersion: 2024,
  sourceType: 'module'
});
```

### 插件生态

```javascript
// JSX 支持
const jsx = require('acorn-jsx');
const parser = acorn.Parser.extend(jsx());

// TypeScript（需要额外插件）
// Acorn 本身不支持 TypeScript
```

### 使用场景

**适合：**
- ✅ 性能敏感的场景
- ✅ 轻量级工具
- ✅ Rollup、ESLint 等工具

**不适合：**
- ❌ 需要 TypeScript 支持
- ❌ 需要最新的实验性语法

---

## 📜 Esprima

### 特点

**设计哲学：**
- ✅ **标准化**：严格的 ESTree 规范
- ✅ **高质量**：100% 测试覆盖
- ✅ **稳定性**：保守的特性支持
- ✅ **教学友好**：代码可读性高

**性能数据：**
```
Esprima:      120-150 MB/s
内存占用:     20-30 MB
```

### 使用示例

```javascript
const esprima = require('esprima');

const code = 'const x = 1;';
const ast = esprima.parseScript(code);

// 或者解析模块
const ast2 = esprima.parseModule('import x from "y"');
```

### 使用场景

**适合：**
- ✅ 需要严格遵循规范
- ✅ 教学和学习
- ✅ 静态分析工具

**不适合：**
- ❌ 需要最新特性
- ❌ 维护不活跃（已基本停止更新）

---

## 📊 对比总结

| 特性 | Babel Parser | Acorn | Esprima |
|------|-------------|-------|---------|
| **性能** | 100-150 MB/s | 150-200 MB/s | 120-150 MB/s |
| **包大小** | ~2 MB | ~500 KB | ~300 KB |
| **特性支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **TypeScript** | ✅ | ❌ | ❌ |
| **JSX** | ✅ | ✅(插件) | ❌ |
| **插件系统** | ✅ | ✅ | ❌ |
| **维护状态** | ✅ 活跃 | ✅ 活跃 | ⚠️ 不活跃 |
| **使用场景** | Babel 生态 | Rollup, ESLint | 教学 |

---

## 🎯 选择建议

**选择 Babel Parser：**
- 需要 TypeScript、JSX
- 需要最新的 JavaScript 特性
- 在 Babel 生态中

**选择 Acorn：**
- 性能敏感
- 只需要标准 JavaScript
- 轻量级工具

**选择 Esprima：**
- 教学用途
- 需要严格遵循规范

---

**记住：Acorn 是性能和体积的最佳平衡！** 🎉

