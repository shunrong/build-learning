# Demo 05: Parser 性能基准测试

对比不同 Parser（Babel Parser vs Acorn）的性能表现。

## 运行

\`\`\`bash
npm install
npm start
\`\`\`

## 测试说明

### 测试场景

1. **小代码** (~15 字符): `const x = 1;`
2. **中等代码** (~1KB): 10 个函数块
3. **大代码** (~10KB): 100 个函数块

### 技术要点

为了避免重复声明错误（Babel Parser 的严格检查），使用了以下技巧：

- **块作用域 `{}`**：每个代码块用 `{}` 包裹，形成独立作用域
- **唯一变量名**：使用 `Array.from` 生成带索引的唯一变量名（如 `add0`, `add1`）

### 性能对比

通过测试可以发现：

- **小代码**: Babel Parser 和 Acorn 性能接近
- **中等代码**: Acorn 开始展现性能优势
- **大代码**: Acorn 比 Babel Parser 快约 1.5-2x

### 原因分析

- **Babel Parser**: 功能丰富，支持更多语法（JSX、TS），但解析开销更大
- **Acorn**: 轻量级，专注于 ES 标准，解析速度更快
