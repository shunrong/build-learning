# Oxc Parser

## 📖 概述

Oxc（Oxidation Compiler）是**新一代 Rust 工具链**，目标是统一前端工具链，性能比 SWC 还快 **2-3 倍**。

---

## 🚀 Oxc 的创新

### 1. 更极致的性能

**性能数据（100 KB 代码）：**
```
Babel Parser:    100-150 MB/s
SWC Parser:      1500-2000 MB/s  (10-15x Babel)
Oxc Parser:      3000-5000 MB/s  (30-50x Babel, 2-3x SWC!)
```

**真实项目测试（React 源码 ~500 KB）：**
```
Babel:  500ms
SWC:    33ms   (15x 更快)
Oxc:    12ms   (42x 更快，2.7x SWC!)
```

### 2. 为什么 Oxc 比 SWC 还快？

**核心优化：**

#### a. 更激进的内存优化
```rust
// SWC: 使用标准的 Rc/Arc
let node = Rc::new(AstNode::new());

// Oxc: 使用自定义的 Arena 分配器
let node = arena.alloc(AstNode::new());
// → 减少分配开销，提升缓存命中率
```

#### b. 更好的数据结构
```rust
// Oxc 使用紧凑的数据结构
pub struct CompactStr {
    // 小字符串直接内联，大字符串用指针
    // 减少堆分配
}
```

#### c. SIMD 深度优化
```rust
// Oxc 在词法分析中大量使用 SIMD
// 一次处理 32 个字符
```

#### d. 减少不必要的工作
```rust
// Oxc 在不需要时跳过某些 AST 节点的构建
// 懒加载某些信息
```

---

## 🎯 Oxc 的愿景：统一工具链

### 1. 问题：工具链碎片化

**当前状态：**
```
Parser:    Babel Parser / SWC
Linter:    ESLint
Formatter: Prettier
Minifier:  Terser
Bundler:   Webpack / Rollup

→ 每个工具都要解析代码
→ 重复工作，性能浪费
```

### 2. Oxc 的解决方案

**统一工具链：**
```
Oxc
├── oxc_parser      (Parser)
├── oxc_linter      (Linter, 替代 ESLint)
├── oxc_formatter   (Formatter, 替代 Prettier)
├── oxc_minifier    (Minifier, 替代 Terser)
├── oxc_resolver    (Resolver)
└── oxc_transformer (Transformer)

→ 共享同一个 AST
→ 一次解析，多次使用
→ 极致性能
```

### 3. 与 Biome 的关系

**Biome：** 另一个统一工具链项目（Rust）

**对比：**
| 特性 | Oxc | Biome |
|------|-----|-------|
| **语言** | Rust | Rust |
| **性能** | 更快 | 快 |
| **功能** | Parser + Linter + Formatter + ... | Linter + Formatter |
| **状态** | 快速发展 | 成熟 |
| **目标** | 统一所有工具 | 替代 ESLint/Prettier |

---

## ⭐ Oxc Parser 特性

### 1. 使用示例

```javascript
const oxc = require('oxc-parser');

const code = `const x: number = 1;`;
const ast = oxc.parseSync(code, {
  sourceType: 'module',
  sourceFilename: 'test.ts'
});

console.log(ast);
```

### 2. 语法支持

**完整支持：**
- ES2024+ 所有特性
- TypeScript
- JSX
- 所有实验性特性

### 3. 错误恢复

**Oxc 的创新：更好的错误恢复**

```javascript
// 代码有错误
const code = `
  const x = 1;
  const y = ;  // 错误
  const z = 3;
`;

// Oxc 仍然能解析并生成 AST
const ast = oxc.parseSync(code, {
  allowReturnOutsideFunction: true
});

// 返回 AST + 错误列表
console.log(ast.errors);
```

---

## 📊 性能对比总结

### 综合对比

| Parser | 速度 | 内存 | 包大小 | 维护 |
|--------|------|------|--------|------|
| **Babel** | 100 MB/s | 40 MB | 2 MB | ✅ |
| **Acorn** | 200 MB/s | 20 MB | 500 KB | ✅ |
| **SWC** | 1800 MB/s | 12 MB | 20 MB | ✅ |
| **Oxc** | 4500 MB/s | 8 MB | 15 MB | ⚠️ |

### 性能提升汇总

```
Babel → Acorn:  2x 提升
Babel → SWC:    15-20x 提升
Babel → Oxc:    40-50x 提升
SWC → Oxc:      2-3x 提升
```

---

## 🎯 使用场景

### Oxc 适合

**理想场景：**
- ✅ 超大型项目（百万行代码）
- ✅ Monorepo（多个包共享工具链）
- ✅ CI/CD（极致的构建速度）
- ✅ 开发工具（IDE、Linter）

**成功案例：**
- Shopify（正在迁移）
- Discord（正在评估）

### 限制

**当前限制：**
- ⚠️ 仍在快速发展（API 可能变化）
- ⚠️ 生态系统较新
- ⚠️ 文档还在完善中

---

## 🔮 未来趋势

### 1. 工具链统一

**趋势：**
```
过去：
Parser (Babel) + Linter (ESLint) + Formatter (Prettier) + ...
→ 慢，重复工作

未来：
Oxc 或 Biome 统一工具链
→ 快，一次解析
```

### 2. Rust 成为标准

**趋势：**
- SWC、Oxc、Biome 都用 Rust
- Turbopack、Rspack 用 Rust
- Deno 用 Rust

**原因：**
- 10-100x 性能提升
- 更好的内存管理
- 多核并行

### 3. JavaScript 工具链的终局

**可能的结局：**
```
Oxc / Biome 统一工具链
↓
所有工具都基于此
↓
前端开发体验质的飞跃
```

---

## 🎓 关键要点

1. **极致性能**：40-50x Babel，2-3x SWC
2. **统一工具链**：一次解析，多次使用
3. **Rust 优势**：Arena 分配器、SIMD、零成本抽象
4. **未来趋势**：工具链统一、Rust 成为标准
5. **快速发展**：仍在完善中

---

## 🔗 下一步

- **05-parser-selection.md**：Parser 选型指南
- **Demo 02**：性能基准测试

**记住：Oxc 代表着前端工具链的未来！** 🎉

