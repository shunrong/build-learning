# Demo 05: AST 可视化工具

## 📖 简介

本 Demo 演示如何以树形结构可视化 AST，帮助直观理解 AST 结构。

## 🎯 学习目标

- ✅ 可视化 AST 树形结构
- ✅ 理解不同代码的 AST 差异
- ✅ 使用彩色输出美化展示

## 📦 安装依赖

```bash
npm install
```

## 🚀 运行示例

```bash
# 运行可视化工具
npm start

# 运行更多示例
npm run demo
```

## 📝 输出示例

```
Program
└─ VariableDeclaration kind: "const"
  └─ VariableDeclarator
    └─ Identifier name: "x"
    └─ NumericLiteral value: 1
```

## 🎨 特性

- ✅ 彩色输出（使用 chalk）
- ✅ 树形结构展示
- ✅ 高亮关键属性
- ✅ 支持多种代码类型

## 💡 使用建议

1. 输入不同的代码查看 AST 变化
2. 对比相似代码的 AST 差异
3. 结合 AST Explorer 在线工具学习

## ✅ 验证学习成果

- [ ] 能够可视化 AST 结构
- [ ] 理解不同代码的 AST 差异
- [ ] 能够快速识别节点类型

## 🔗 相关资源

- [AST Explorer](https://astexplorer.net/)
- [Babel 文档](https://babeljs.io/docs/)

## 🎉 恭喜！

完成 Phase 15 所有 Demo！接下来学习：**Phase 16 - Parser 基础**

