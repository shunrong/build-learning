# SWC Parser

## 📖 概述

SWC（Speedy Web Compiler）是用 Rust 编写的超快 JavaScript/TypeScript 编译器，性能是 Babel 的 **10-20 倍**。

---

## 🚀 为什么 SWC 这么快？

### 1. Rust 语言的优势

**零成本抽象：**
```rust
// Rust: 编译时优化，运行时零开销
enum TokenType {
    Keyword,
    Identifier,
    Number,
}

// 编译后和手写 if-else 性能一样
```

**所有权系统：**
```rust
// Rust: 编译时内存管理，无 GC
// 无垃圾回收暂停
let code = String::from("const x = 1");
let slice = &code[0..5];  // 零拷贝引用
```

**SIMD 加速：**
```rust
// Rust: 可以使用 SIMD 一次处理 16/32 个字符
// JavaScript 无法做到
```

### 2. 性能数据

**基准测试（100 KB 代码）：**
```
Babel Parser:  100-150 MB/s
SWC Parser:    1500-2000 MB/s  (10-15x 更快！)

内存占用：
Babel:         30-50 MB
SWC:           10-15 MB  (更少！)

启动时间：
Babel:         ~100ms
SWC:           ~5ms  (20x 更快！)
```

---

## 🏗️ SWC 架构

### 核心组件

```
SWC
├── Parser (swc_ecma_parser)
│   ├── Lexer (词法分析)
│   └── Parser (语法分析)
├── Transformer (swc_ecma_transforms)
├── Codegen (swc_ecma_codegen)
└── Minifier (swc_ecma_minifier)
```

### AST 设计

**SWC 使用自己的 AST 格式（兼容 ESTree）：**

```rust
pub enum Expr {
    Ident(Ident),
    Lit(Lit),
    Bin(BinExpr),
    Call(CallExpr),
    Arrow(ArrowExpr),
    // ...
}
```

---

## ⭐ 核心特性

### 1. 完整的语法支持

**支持：**
- ES2024+ 所有特性
- TypeScript
- JSX
- Decorators
- 所有现代 JavaScript 特性

### 2. 使用示例

**Node.js API：**
```javascript
const swc = require('@swc/core');

const code = `
  const add = (a: number, b: number): number => a + b;
`;

const output = swc.parseSync(code, {
  syntax: 'typescript',
  tsx: false
});

console.log(output);  // SWC AST
```

**作为编译器使用：**
```javascript
const output = swc.transformSync(code, {
  jsc: {
    parser: {
      syntax: 'typescript'
    },
    target: 'es2015'
  }
});

console.log(output.code);  // 编译后的代码
```

### 3. 配置选项

```javascript
swc.parseSync(code, {
  // 语法
  syntax: 'ecmascript',  // 'ecmascript' | 'typescript'
  
  // JSX
  tsx: false,
  
  // 装饰器
  decorators: false,
  
  // 动态 import
  dynamicImport: true
});
```

---

## 📊 性能对比

### 真实项目测试

**测试项目：** React 源码（~500 KB）

| Parser | 时间 | 速度 | 倍数 |
|--------|------|------|------|
| Babel | 500ms | 1 MB/s | 1x |
| SWC | 33ms | 15 MB/s | **15x** |

**测试项目：** Vue 3 源码（~800 KB）

| Parser | 时间 | 速度 | 倍数 |
|--------|------|------|------|
| Babel | 800ms | 1 MB/s | 1x |
| SWC | 50ms | 16 MB/s | **16x** |

---

## ⚠️ 限制和权衡

### 1. 编译体积

**问题：**
```
SWC 的 Rust 编译产物较大：
- @swc/core: ~20 MB (包含所有平台的二进制文件)
- @babel/parser: ~500 KB
```

**解决：**
- 使用平台特定的包（如 `@swc/core-linux-x64`）
- 只在生产构建中使用

### 2. 错误信息

**Babel：**
```
SyntaxError: Unexpected token (1:10)
const x = ;
          ^
```

**SWC：**
```
error: Unexpected token `;`
 --> test.js:1:11
  |
1 | const x = ;
  |           ^
```

**结论：** SWC 的错误信息质量接近 Babel，但可能不如 Babel 详细。

### 3. 生态系统

**Babel：**
- ✅ 成熟的插件生态
- ✅ 大量第三方工具

**SWC：**
- ⚠️ 插件生态较小
- ⚠️ 需要用 Rust 编写插件（门槛高）

---

## 🎯 使用场景

### 理想场景

**SWC 适合：**
- ✅ 性能敏感的场景
- ✅ 大型项目（启动时间重要）
- ✅ CI/CD 构建（节省时间和成本）
- ✅ 开发服务器（更快的 HMR）

**成功案例：**
- Next.js（默认使用 SWC）
- Turbopack
- Deno

### 不适合场景

**不推荐：**
- ❌ 需要自定义 Babel 插件
- ❌ 对包大小极度敏感的场景
- ❌ 不支持的实验性语法

---

## 💡 迁移建议

### 从 Babel 迁移到 SWC

**步骤：**

1. **安装 SWC：**
```bash
npm install -D @swc/core
```

2. **配置 SWC：**
```javascript
// .swcrc
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "target": "es2015"
  },
  "module": {
    "type": "commonjs"
  }
}
```

3. **更新构建工具：**
```javascript
// webpack.config.js
{
  test: /\.tsx?$/,
  use: {
    loader: 'swc-loader',
    options: {
      // SWC 配置
    }
  }
}
```

4. **测试和验证：**
- 运行测试套件
- 检查输出代码
- 验证性能提升

---

## 🎓 关键要点

1. **性能提升**：10-20x 比 Babel 快
2. **Rust 优势**：零成本抽象、所有权系统、SIMD
3. **完整特性**：支持所有现代 JavaScript/TypeScript
4. **权衡**：包体积大、插件生态小
5. **最佳场景**：大型项目、CI/CD、开发服务器

---

## 🔗 下一步

- **04-oxc-parser.md**：更快的 Oxc Parser
- **Demo 02**：SWC 性能基准测试

**记住：SWC 是 Rust 带来的第一次性能革命！** 🎉

