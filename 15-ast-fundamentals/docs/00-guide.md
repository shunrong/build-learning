# Phase 15: AST 基础 - 学习指南

## 📋 本阶段概览

**学习目标**：深入理解 AST（抽象语法树）的本质、结构和操作，这是理解所有构建工具的基础。

**预计时长**：3-4 天

**核心价值**：
- 🎯 理解编译器的核心数据结构
- 🎯 理解代码如何被表示成树形结构
- 🎯 为后续学习 Parser、Transformer 等打下坚实基础
- 🎯 理解 Babel、ESLint、Prettier 等工具的工作原理

---

## 🎯 学习目标

### 理论层面
1. ✅ 深刻理解什么是 AST
2. ✅ 理解 AST 在编译器中的作用
3. ✅ 掌握 AST 的节点类型和结构
4. ✅ 理解 AST 和源代码的对应关系
5. ✅ 理解 AST 的应用场景

### 实践层面
1. ✅ 能够将代码解析成 AST
2. ✅ 能够遍历 AST
3. ✅ 能够修改 AST
4. ✅ 能够将 AST 生成代码
5. ✅ 能够使用 AST 工具进行调试

---

## 📚 文档列表

### 01. 什么是 AST (`01-what-is-ast.md`)
- AST 的定义
- AST vs CST（Concrete Syntax Tree）
- AST 在编译器中的位置
- AST 的应用场景
- 为什么需要 AST

**核心概念**：
- 抽象语法树（Abstract Syntax Tree）
- 词法分析（Lexical Analysis）
- 语法分析（Syntax Analysis）
- 编译器前端（Compiler Frontend）

### 02. AST 结构详解 (`02-ast-structure.md`)
- 节点类型（Node Types）
  - Program
  - Statement（语句）
  - Expression（表达式）
  - Declaration（声明）
  - Literal（字面量）
- 节点属性（Node Properties）
  - type
  - start/end
  - loc (location)
  - 其他特定属性
- ESTree 规范
- JavaScript AST 节点完整列表

**核心概念**：
- Statement vs Expression
- Declaration vs Expression
- ESTree Specification
- AST Node Properties

### 03. AST 遍历 (`03-ast-traversal.md`)
- 树的遍历算法
  - 深度优先遍历（DFS）
  - 广度优先遍历（BFS）
- Visitor 模式
  - enter 和 exit
  - 访问特定节点类型
- Path 对象
  - path.node
  - path.parent
  - path.scope
- Babel Traverse API
  - @babel/traverse
  - traverse(ast, visitor)

**核心概念**：
- Visitor Pattern
- Path Object
- Depth-First Search
- Breadth-First Search

### 04. AST 操作 (`04-ast-manipulation.md`)
- 查询节点
  - 查找特定类型的节点
  - 查找特定值的节点
- 修改节点
  - 替换节点（replaceWith）
  - 删除节点（remove）
  - 插入节点（insertBefore/insertAfter）
- 创建节点
  - @babel/types
  - t.identifier()
  - t.callExpression()
  - t.functionDeclaration()
- Scope 和 Binding
  - 作用域分析
  - 变量绑定
  - 变量重命名

**核心概念**：
- AST Transformation
- @babel/types
- Scope Analysis
- Variable Binding

### 05. AST 工具 (`05-ast-tools.md`)
- AST Explorer
  - 在线可视化工具
  - 支持多种 Parser
  - 实时查看 AST 结构
- Babel REPL
  - 在线转换工具
  - 查看转换结果
- VS Code 插件
  - AST Preview
  - 本地调试工具
- 调试技巧
  - console.log AST
  - JSON.stringify 格式化
  - 使用 debugger

**核心工具**：
- AST Explorer (astexplorer.net)
- Babel REPL (babeljs.io/repl)
- @babel/parser
- @babel/traverse
- @babel/types
- @babel/generator

---

## 🛠️ Demo 列表

### Demo 01: AST 基础探索 (`demos/01-ast-basics/`)

**目标**：理解如何将代码解析成 AST，查看 AST 结构

**内容**：
- 使用 `@babel/parser` 解析代码
- 打印 AST 结构
- 理解不同代码对应的 AST 结构
- 对比不同语法的 AST 差异

**涉及 API**：
- `@babel/parser.parse()`
- `JSON.stringify()`

### Demo 02: AST 遍历实践 (`demos/02-ast-traversal/`)

**目标**：掌握 AST 遍历方法，理解 Visitor 模式

**内容**：
- 使用 Visitor 模式遍历 AST
- 访问特定类型的节点
- 收集所有函数名
- 收集所有变量声明
- 分析函数调用关系

**涉及 API**：
- `@babel/traverse()`
- Visitor Pattern
- Path Object

### Demo 03: AST 操作实战 (`demos/03-ast-manipulation/`)

**目标**：掌握 AST 的增删改操作

**内容**：
- 修改节点：重命名变量
- 删除节点：移除 console.log
- 插入节点：添加注释
- 替换节点：箭头函数转普通函数

**涉及 API**：
- `path.replaceWith()`
- `path.remove()`
- `path.insertBefore()`
- `@babel/types`

### Demo 04: 代码转换器 (`demos/04-code-transformer/`)

**目标**：实现完整的代码转换流程

**内容**：
- Parser：解析源代码
- Traverse：遍历和修改 AST
- Generate：生成新代码
- 实现多个转换器：
  - 移除所有 debugger
  - 移除所有 console.log
  - 箭头函数转普通函数
  - const 转 var

**涉及 API**：
- `@babel/parser`
- `@babel/traverse`
- `@babel/types`
- `@babel/generator`

### Demo 05: AST 可视化工具 (`demos/05-ast-visualizer/`)

**目标**：构建简单的 AST 可视化工具

**内容**：
- 使用 HTML/CSS/JS 实现
- 输入代码，展示 AST 树形结构
- 支持节点展开/折叠
- 支持高亮显示节点对应的源代码
- 可以点击节点查看详细信息

**技术栈**：
- `@babel/parser`
- 递归渲染树形结构
- CSS 样式美化

---

## 🎓 验证标准

完成本阶段学习后，你应该能够：

### 理论理解
- [ ] 能够准确解释什么是 AST
- [ ] 能够说出 AST 的主要应用场景
- [ ] 能够区分 Statement 和 Expression
- [ ] 能够理解 Visitor 模式的工作原理
- [ ] 能够理解 Scope 和 Binding 的概念

### 实践能力
- [ ] 能够使用 `@babel/parser` 解析代码
- [ ] 能够使用 `@babel/traverse` 遍历 AST
- [ ] 能够使用 `@babel/types` 创建/修改节点
- [ ] 能够使用 `@babel/generator` 生成代码
- [ ] 能够实现简单的代码转换器

### 工具使用
- [ ] 熟练使用 AST Explorer
- [ ] 能够使用 Babel REPL 调试
- [ ] 能够调试 AST 相关代码

### 综合能力
- [ ] 能够独立实现"移除 console.log"功能
- [ ] 能够独立实现"箭头函数转普通函数"功能
- [ ] 能够分析代码的依赖关系
- [ ] 能够理解 Babel 插件的基本原理

---

## 📖 学习路径

```
Day 1: 理解 AST 基础
├── 阅读：01-what-is-ast.md
├── 阅读：02-ast-structure.md
├── 实践：Demo 01 - AST 基础探索
└── 在 AST Explorer 中尝试不同代码

Day 2: 掌握 AST 遍历
├── 阅读：03-ast-traversal.md
├── 实践：Demo 02 - AST 遍历实践
└── 练习：收集所有函数名和变量名

Day 3: 掌握 AST 操作
├── 阅读：04-ast-manipulation.md
├── 实践：Demo 03 - AST 操作实战
└── 练习：实现多种代码转换

Day 4: 综合应用
├── 阅读：05-ast-tools.md
├── 实践：Demo 04 - 代码转换器
├── 实践：Demo 05 - AST 可视化工具
└── 总结：整理学习笔记
```

---

## 🎯 学习重点

### 必须掌握的概念
1. ✅ **AST 的定义和作用**
2. ✅ **Statement vs Expression**
3. ✅ **Visitor 模式**
4. ✅ **Path 对象**
5. ✅ **Babel 核心 API**

### 必须掌握的 API
1. ✅ `@babel/parser.parse()`
2. ✅ `@babel/traverse(ast, visitor)`
3. ✅ `@babel/types.*()`
4. ✅ `@babel/generator(ast)`
5. ✅ `path.replaceWith() / remove() / insertBefore()`

### 必须掌握的技能
1. ✅ 解析代码成 AST
2. ✅ 遍历 AST
3. ✅ 修改 AST
4. ✅ 生成代码
5. ✅ 调试 AST

---

## 💡 常见问题

### Q1: AST 和源代码有什么区别？
源代码是字符串，AST 是结构化的树形数据。AST 保留了代码的语义信息，但去除了格式信息（空格、注释等）。

### Q2: 为什么需要 AST？
AST 提供了程序化操作代码的能力。直接操作字符串非常困难且容易出错，而操作 AST 则简单可靠。

### Q3: Statement 和 Expression 的区别？
- Statement（语句）：执行动作，不返回值（如 `if`、`for`、`return`）
- Expression（表达式）：计算值并返回（如 `1 + 2`、`fn()`、`a`）

### Q4: Visitor 模式是什么？
Visitor 模式是一种设计模式，用于遍历树形结构。在 AST 中，我们定义访问器函数来处理特定类型的节点。

### Q5: 如何调试 AST？
1. 使用 AST Explorer 可视化查看
2. console.log(JSON.stringify(ast, null, 2))
3. 使用 debugger 断点调试

---

## 🔗 参考资源

### 官方文档
- [Babel 官方文档](https://babeljs.io/docs/en/)
- [Babel Parser](https://babeljs.io/docs/en/babel-parser)
- [Babel Traverse](https://babeljs.io/docs/en/babel-traverse)
- [Babel Types](https://babeljs.io/docs/en/babel-types)
- [ESTree Spec](https://github.com/estree/estree)

### 在线工具
- [AST Explorer](https://astexplorer.net/)
- [Babel REPL](https://babeljs.io/repl)

### 推荐阅读
- [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
- [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)

---

## 🚀 下一步

完成本阶段后，继续学习：
- **Phase 16: Parser 基础** - 深入理解词法分析和语法分析
- **Phase 17: Parser 实现对比** - 对比不同 Parser 的实现和性能
- **Phase 18: Transformer** - 深入学习代码转换

---

**准备好了吗？让我们开始 AST 之旅！** 🎉

