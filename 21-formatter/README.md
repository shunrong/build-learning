# Phase 21: Formatter

## 📋 本阶段概述

学习代码格式化器（Formatter）的核心原理，理解如何将 AST 转换为格式统一的代码。

## 🎯 学习目标

- 理解 Formatter 的工作原理（AST → 格式化代码）
- 掌握代码打印（Code Printing）的核心技术
- 了解 Prettier 的格式化算法
- 学会实现简单的 Formatter

## 📂 内容结构

```
21-formatter/
├── docs/                    # 📚 学习文档
│   ├── 00-guide.md         # 学习指南
│   └── 01-formatter-basics.md  # Formatter 基础
│
└── demos/                   # 💻 实战项目
    └── 01-simple-formatter/ # 简单格式化器实现
```

## ✅ 当前状态

📝 **核心内容已完成**：
- ✅ 学习指南
- ✅ Formatter 基础文档
- ✅ 简单 Formatter Demo

⏳ **待补充内容**（Phase 24-26 完成后）：
- 📝 Prettier 内部原理详解
- 📝 高级格式化技术
- 📝 工具集成最佳实践
- 💻 更多实战 Demo

## 🚀 快速开始

```bash
# 1. 阅读学习指南
cat docs/00-guide.md

# 2. 阅读基础文档
cat docs/01-formatter-basics.md

# 3. 运行 Demo
cd demos/01-simple-formatter
npm install
npm start
```

## 💡 核心要点

1. **Formatter 的本质**：AST → 格式化代码
2. **不改变语义**：只改变代码风格，不改变行为
3. **递归打印**：遍历 AST 节点，生成代码
4. **格式化规则**：缩进、空格、换行、引号、分号

## 📚 扩展阅读

- [Prettier 官方文档](https://prettier.io/)
- [如何实现代码格式化器](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/)

---

> 💡 提示：本阶段采用快速推进策略，重点掌握核心原理，详细内容后续补充。

