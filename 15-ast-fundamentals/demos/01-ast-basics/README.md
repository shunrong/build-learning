# Demo 01: AST 基础探索

## 📖 简介

本 Demo 演示如何使用 `@babel/parser` 解析代码，查看 AST 结构。

## 🎯 学习目标

- ✅ 理解如何将代码解析成 AST
- ✅ 查看和理解 AST 的结构
- ✅ 对比不同代码的 AST 差异
- ✅ 提取 AST 节点信息

## 📦 安装依赖

```bash
npm install
```

## 🚀 运行示例

### 1. 运行完整 Demo

```bash
npm start
```

### 2. 简单解析示例

```bash
npm run parse:simple
```

### 3. 复杂解析示例

```bash
npm run parse:complex
```

### 4. 语法对比

```bash
npm run compare
```

### 5. AST 可视化

```bash
npm run visualize
```

## 📝 代码说明

### src/index.js

主入口文件，演示：
- 简单的变量声明
- 函数声明
- 二元表达式
- var vs const 对比
- 提取节点信息

### src/01-simple-parse.js

解析简单表达式：
- 字面量（数字、字符串、布尔值）
- 标识符
- 二元表达式
- 函数调用
- 成员访问
- 数组访问

### src/02-complex-parse.js

解析复杂代码：
- 函数声明
- 箭头函数
- 类声明
- 异步函数
- 对象和数组

### src/03-syntax-compare.js

对比不同语法的 AST：
- var vs let vs const
- function vs arrow function
- for vs while
- if vs switch

### src/04-visualize.js

以树形结构可视化 AST。

## 🔍 关键概念

### 1. AST 的基本结构

所有 AST 的根节点都是 `Program`：

```javascript
{
  type: "Program",
  body: [...]  // 语句数组
}
```

### 2. 节点的基本属性

每个节点都有：
- `type`：节点类型
- `loc`：位置信息（可选）
- `start/end`：字符位置（可选）

### 3. 常见节点类型

- **Literal**：字面量（`NumericLiteral`, `StringLiteral`, etc.）
- **Identifier**：标识符
- **Expression**：表达式（`BinaryExpression`, `CallExpression`, etc.）
- **Statement**：语句（`VariableDeclaration`, `FunctionDeclaration`, etc.）

## 💡 实践建议

1. **使用 AST Explorer**：访问 [astexplorer.net](https://astexplorer.net/)，输入代码，实时查看 AST
2. **对比学习**：对比不同语法的 AST 结构，加深理解
3. **手绘 AST**：尝试手绘简单代码的 AST 树形结构
4. **提取信息**：练习从 AST 中提取有用的信息

## 🔗 相关资源

- [Babel Parser 文档](https://babeljs.io/docs/en/babel-parser)
- [AST Explorer](https://astexplorer.net/)
- [ESTree 规范](https://github.com/estree/estree)

## ✅ 验证学习成果

完成本 Demo 后，你应该能够：
- [ ] 使用 `@babel/parser` 解析代码
- [ ] 理解 AST 的基本结构
- [ ] 识别常见的节点类型
- [ ] 从 AST 中提取信息
- [ ] 对比不同语法的 AST 差异

## 🎓 下一步

完成本 Demo 后，继续学习：
- **Demo 02**：AST 遍历实践
- **Demo 03**：AST 操作实战

