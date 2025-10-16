# Phase 21: Formatter 学习指南

## 🎯 学习目标

通过本阶段的学习，你将：

1. **理解 Formatter 的核心原理**
   - 代码格式化的工作流程
   - AST 的打印（Printing）机制
   - 格式化规则的设计原则

2. **掌握 Prettier 的实现原理**
   - Prettier 的架构设计
   - 格式化算法（Layout Algorithm）
   - 断行策略（Line Breaking）

3. **学会自定义 Formatter**
   - 从零实现简单的 Formatter
   - 处理各种语法结构
   - 实现格式化规则

4. **理解与 Linter 的区别和配合**
   - Formatter vs Linter 的职责边界
   - 如何避免冲突
   - 工作流集成

---

## 📚 学习路径

### 第一步：理解 Formatter 基础（1-2小时）
- 阅读 `01-formatter-basics.md`
- 理解代码格式化的本质
- 了解 AST → Code 的过程

### 第二步：Prettier 工作原理（2-3小时）
- 阅读 `02-prettier-internals.md`
- 理解 Prettier 的架构
- 学习格式化算法

### 第三步：实现简单 Formatter（3-4小时）
- 阅读 `03-simple-formatter.md`
- 运行 Demo 01-03
- 尝试修改和扩展

### 第四步：高级格式化技术（2-3小时）
- 阅读 `04-advanced-formatting.md`
- 了解断行策略
- 学习注释处理

### 第五步：工具集成（1-2小时）
- 阅读 `05-integration.md`
- 理解 Formatter 的最佳实践
- 学习与其他工具的配合

---

## 📂 文档列表

1. **01-formatter-basics.md** - Formatter 基础概念
2. **02-prettier-internals.md** - Prettier 工作原理
3. **03-simple-formatter.md** - 实现简单 Formatter
4. **04-advanced-formatting.md** - 高级格式化技术
5. **05-integration.md** - 工具集成与最佳实践

---

## 🎨 Demo 项目列表

### Demo 01: 简单代码打印器
```
demos/01-simple-printer/
  - 从 AST 生成代码
  - 基础的缩进处理
  - 简单的换行逻辑
```

### Demo 02: 基础 Formatter
```
demos/02-basic-formatter/
  - 格式化变量声明
  - 格式化函数声明
  - 处理操作符空格
```

### Demo 03: 完整 Formatter
```
demos/03-complete-formatter/
  - 支持多种语法结构
  - 实现断行策略
  - 处理注释和空行
```

### Demo 04: Prettier 迷你版
```
demos/04-prettier-mini/
  - 模拟 Prettier 的核心算法
  - 实现 Layout Algorithm
  - 处理嵌套结构
```

### Demo 05: Formatter 性能对比
```
demos/05-formatter-benchmark/
  - 对比不同实现的性能
  - 测试大文件格式化
  - 分析性能瓶颈
```

---

## ✅ 验收标准

### 理论层面
- [ ] 能解释 Formatter 的工作原理
- [ ] 能说出 AST Printing 的核心步骤
- [ ] 能解释 Prettier 的格式化算法
- [ ] 能对比 Formatter 和 Linter 的区别

### 实践层面
- [ ] 能实现一个简单的 Formatter
- [ ] 能处理基本的语法结构格式化
- [ ] 能实现缩进和换行逻辑
- [ ] 能处理注释的保留和格式化

### 面试层面
- [ ] 能回答：Formatter 如何工作？
- [ ] 能回答：为什么需要 Formatter？
- [ ] 能回答：Prettier 的核心原理是什么？
- [ ] 能回答：如何实现自定义格式化规则？

---

## 🎯 核心概念

### 1. Code Printing
```
AST → Tokens → Formatted Code

核心步骤：
1. 遍历 AST 节点
2. 为每个节点生成代码片段
3. 应用格式化规则（缩进、空格、换行）
4. 拼接成最终代码
```

### 2. Layout Algorithm
```
Prettier 的核心算法：

1. 计算每个节点的打印宽度
2. 如果超过行宽限制 → 换行
3. 如果未超过 → 保持单行
4. 递归处理子节点
```

### 3. 格式化规则
```
常见的格式化规则：

- 缩进：2 空格 / 4 空格 / Tab
- 引号：单引号 / 双引号
- 分号：加分号 / 不加分号
- 尾逗号：加 / 不加
- 行宽：80 / 100 / 120 字符
- 换行：LF / CRLF
```

---

## 💡 学习建议

1. **对比学习**：
   - 对比 Formatter 和 Linter 的区别
   - 对比不同 Formatter 的实现方式
   - 对比格式化前后的代码

2. **实践为主**：
   - 先运行 Demo，观察效果
   - 修改格式化规则，看看变化
   - 尝试添加新的语法支持

3. **阅读源码**：
   - 阅读 Prettier 的核心源码
   - 理解格式化算法的实现
   - 学习优秀的代码结构

4. **关注细节**：
   - 注释的处理方式
   - 空行的保留策略
   - 嵌套结构的缩进

---

## 📖 扩展阅读

1. [Prettier 官方文档](https://prettier.io/docs/en/index.html)
2. [Prettier 的设计理念](https://prettier.io/docs/en/rationale.html)
3. [如何编写一个代码格式化器](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/)
4. [AST-based Code Formatting](https://hackernoon.com/how-to-build-a-code-formatter-from-scratch)
5. [Prettier's Layout Algorithm](https://github.com/prettier/prettier/blob/main/commands.md)

---

## 🚀 开始学习

准备好了吗？让我们从 `01-formatter-basics.md` 开始，深入理解代码格式化的原理！

记住：**Formatter 的目标是让代码美观统一，而不改变代码的语义**。

