# Phase 18: Transformer 学习指南

## 📋 本阶段目标

深入理解代码转换（Transformation）的原理，掌握 Babel 插件系统，能够手写代码转换器和 Babel 插件。

### 核心能力
- ✅ 理解 Transformer 在编译流程中的位置和作用
- ✅ 掌握 Babel 插件的工作原理和 API
- ✅ 能够手写简单的代码转换器（JSX、TypeScript 类型擦除）
- ✅ 能够编写自定义 Babel 插件
- ✅ 理解常见代码转换的实现原理（箭头函数、Class、装饰器等）

### 为什么学习 Transformer？

Transformer 是构建工具链的**核心环节**：

```
源代码 → Parser (AST) → Transformer (修改AST) → Generator (目标代码)
                              ↑
                          核心环节
```

**实际应用场景**：
1. **语法降级**: ES6+ → ES5（`@babel/preset-env`）
2. **语言转换**: TypeScript → JavaScript、JSX → JS
3. **代码优化**: 移除 `console.log`、死代码消除
4. **代码注入**: 自动埋点、性能监控、国际化
5. **框架支持**: React JSX、Vue SFC、Solid.js

---

## 🗺️ 学习路径

```
1. Transformer 基础 (1天)
   ├─ 什么是 Transformer
   ├─ Transformer 在编译流程中的位置
   ├─ AST 转换的基本操作
   └─ 手写简单的转换器

2. Babel 插件系统 (1-2天)
   ├─ Babel 插件的工作原理
   ├─ Visitor 模式详解
   ├─ Plugin API 和配置
   └─ 插件执行顺序

3. 手写 Babel 插件 (2天)
   ├─ 插件基本结构
   ├─ 使用 @babel/types 创建节点
   ├─ 使用 Path API 操作 AST
   └─ 实战：编写实用插件

4. 常见代码转换 (1-2天)
   ├─ JSX 转换原理
   ├─ TypeScript 类型擦除
   ├─ Class → Function
   ├─ 箭头函数 → 普通函数
   └─ Async/Await → Promise

5. 高级转换技巧 (1天)
   ├─ 作用域处理
   ├─ 路径替换技巧
   ├─ 性能优化
   └─ 错误处理
```

---

## 📚 文档列表

| 序号 | 文档 | 说明 | 重要程度 |
|------|------|------|----------|
| 00 | `00-guide.md` | 学习指南（本文档） | ⭐️⭐️⭐️ |
| 01 | `01-transformer-basics.md` | Transformer 基础概念 | ⭐️⭐️⭐️⭐️⭐️ |
| 02 | `02-babel-plugin-system.md` | Babel 插件系统详解 | ⭐️⭐️⭐️⭐️⭐️ |
| 03 | `03-write-babel-plugin.md` | 手写 Babel 插件实战 | ⭐️⭐️⭐️⭐️⭐️ |
| 04 | `04-common-transformations.md` | 常见代码转换实现 | ⭐️⭐️⭐️⭐️ |
| 05 | `05-advanced-transformations.md` | 高级转换技巧 | ⭐️⭐️⭐️⭐️ |

### 学习建议

1. **先理解编译流程**：回顾 Phase 15-17，理解 Parser → Transformer → Generator 的完整流程
2. **动手实践为主**：每个概念都要通过代码验证
3. **对比学习**：看转换前后的 AST 差异
4. **阅读源码**：学习 `@babel/preset-env`、`@babel/plugin-transform-react-jsx` 的实现

---

## 🎯 Demo 项目列表

### Demo 01: 简单转换器
**目录**: `demos/01-simple-transformer/`

手写简单的代码转换器，理解转换的基本流程。

**核心内容**：
- 转换箭头函数为普通函数
- 移除 `console.log` 语句
- 替换变量名

**学习重点**：
- AST 遍历和修改
- 使用 `@babel/traverse` 和 `@babel/types`
- 代码生成

---

### Demo 02: Babel 插件基础
**目录**: `demos/02-babel-plugin-basics/`

理解 Babel 插件的基本结构和 API。

**核心内容**：
- 插件的基本结构（`visitor` 模式）
- 插件配置和选项
- 插件执行顺序
- 使用 `babel-plugin-tester` 测试

**学习重点**：
- Visitor 对象
- Plugin API（`pre`、`post`、`visitor`）
- Path API（`path.node`、`path.scope`、`path.replaceWith`）
- 插件配置传递

---

### Demo 03: JSX 转换器
**目录**: `demos/03-jsx-transformer/`

手写一个简化版的 JSX 转换器，理解 JSX → JS 的转换原理。

**核心内容**：
- 解析 JSX 语法（`@babel/parser` 的 `jsx` 插件）
- JSXElement → `React.createElement()` 调用
- JSXAttribute 处理
- JSXText 和 JSXExpression 处理
- 自闭合标签和子元素

**学习重点**：
- JSX AST 节点类型（`JSXElement`、`JSXOpeningElement`、`JSXClosingElement`）
- 动态属性和扩展运算符
- Fragment 语法
- 对比官方 `@babel/plugin-transform-react-jsx`

**示例转换**：
```jsx
// 输入
<div className="container">
  <h1>Hello {name}</h1>
  <Button onClick={handleClick} />
</div>

// 输出
React.createElement('div', { className: 'container' },
  React.createElement('h1', null, 'Hello ', name),
  React.createElement(Button, { onClick: handleClick })
);
```

---

### Demo 04: TypeScript 类型擦除
**目录**: `demos/04-typescript-transformer/`

手写 TypeScript 类型擦除转换器，理解 TS → JS 的转换。

**核心内容**：
- 移除类型注解（`: string`、`: number`）
- 移除接口声明（`interface`）
- 移除类型别名（`type`）
- 处理泛型
- 保留运行时代码（`enum`、装饰器）

**学习重点**：
- TypeScript AST 节点（`TSTypeAnnotation`、`TSInterfaceDeclaration`）
- 区分类型代码和运行时代码
- `@babel/preset-typescript` 的实现原理

**示例转换**：
```typescript
// 输入
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return `Hello ${user.name}`;
}

// 输出
function greet(user) {
  return `Hello ${user.name}`;
}
```

---

### Demo 05: 自定义 Babel 插件集合
**目录**: `demos/05-custom-babel-plugins/`

编写一系列实用的自定义 Babel 插件。

**包含插件**：

1. **babel-plugin-remove-console**
   - 移除所有 `console.*` 调用
   - 支持配置保留特定方法（如 `console.error`）

2. **babel-plugin-auto-track**
   - 自动为函数注入埋点代码
   - 记录函数调用、参数、返回值

3. **babel-plugin-import-on-demand**
   - 实现按需加载（类似 `babel-plugin-import`）
   - `import { Button } from 'antd'` → `import Button from 'antd/lib/button'`

4. **babel-plugin-react-css-modules**
   - 自动处理 CSS Modules
   - `<div styleName="container">` → `<div className={styles.container}>`

5. **babel-plugin-add-module-exports**
   - 兼容 CommonJS 和 ES Module
   - 添加 `module.exports = exports.default`

**学习重点**：
- 实际项目中的插件需求
- 插件配置和选项处理
- 错误处理和边界情况
- 插件测试

---

## ✅ 学习验证标准

完成本阶段后，你应该能够：

### 理论知识
- [ ] 解释 Transformer 在编译流程中的作用
- [ ] 说明 Babel 插件的工作原理和执行顺序
- [ ] 理解 Visitor 模式和 Path API
- [ ] 知道常见代码转换的实现原理（JSX、TS、ES6+）

### 实践能力
- [ ] 能够手写简单的代码转换器
- [ ] 能够编写自定义 Babel 插件
- [ ] 能够调试和测试 Babel 插件
- [ ] 能够阅读和理解 Babel 官方插件源码

### 项目应用
- [ ] 能够为项目编写自定义转换插件
- [ ] 能够优化构建性能（去除冗余转换）
- [ ] 能够解决 Babel 配置问题
- [ ] 能够实现代码自动化改造工具

---

## 🔗 相关资源

### 官方文档
- [Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)
- [Babel 插件 API](https://babeljs.io/docs/en/babel-core)
- [@babel/types API](https://babeljs.io/docs/en/babel-types)
- [@babel/template](https://babeljs.io/docs/en/babel-template)

### 工具
- [AST Explorer](https://astexplorer.net/) - 在线查看 AST
- [babel-plugin-tester](https://github.com/babel-utils/babel-plugin-tester) - 测试工具

### 优秀插件源码
- [@babel/plugin-transform-react-jsx](https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-react-jsx)
- [@babel/plugin-transform-typescript](https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-typescript)
- [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

---

## 💡 学习技巧

### 1. 使用 AST Explorer 对比
在编写转换器前，先在 AST Explorer 中查看：
- 转换前的 AST 结构
- 转换后的 AST 结构
- 需要修改哪些节点

### 2. 从简单到复杂
按照以下顺序学习：
1. 节点删除（最简单）
2. 节点修改（中等）
3. 节点创建和替换（复杂）
4. 作用域处理（最复杂）

### 3. 善用 @babel/template
对于复杂的节点创建，使用 `@babel/template` 更简洁：

```javascript
// 不使用 template（繁琐）
const node = t.callExpression(
  t.memberExpression(
    t.identifier('console'),
    t.identifier('log')
  ),
  [t.stringLiteral('hello')]
);

// 使用 template（简洁）
const buildConsoleLog = template(`console.log(%%message%%)`);
const node = buildConsoleLog({ message: t.stringLiteral('hello') });
```

### 4. 测试驱动开发
为每个插件编写测试用例：
- 基本功能测试
- 边界情况测试
- 错误处理测试

---

## 🎯 面试准备

### 高频面试题

1. **Babel 的工作流程是什么？Transformer 在哪个阶段？**
   - Parse → Transform → Generate
   - Transformer 在中间阶段，负责 AST 转换

2. **如何编写一个 Babel 插件？**
   - 返回一个包含 `visitor` 对象的函数
   - Visitor 使用访问者模式遍历 AST
   - 使用 Path API 操作节点

3. **Babel 插件的执行顺序是什么？**
   - Plugin 从前往后执行
   - Preset 从后往前执行
   - Plugin 优先于 Preset

4. **JSX 是如何转换为 JS 的？**
   - `<div>hello</div>` → `React.createElement('div', null, 'hello')`
   - 属性转换为对象
   - 子元素作为参数传递

5. **TypeScript 类型擦除是如何实现的？**
   - 移除类型注解节点（`TSTypeAnnotation`）
   - 移除纯类型声明（`interface`、`type`）
   - 保留运行时代码（`enum`、装饰器）

6. **如何处理作用域冲突？**
   - 使用 `path.scope.generateUidIdentifier()` 生成唯一标识符
   - 使用 `path.scope.rename()` 重命名变量

---

## 📅 学习时间规划

| 天数 | 内容 | 目标 |
|------|------|------|
| Day 1 | Transformer 基础 + Babel 插件系统 | 理解概念和原理 |
| Day 2 | 手写简单转换器 + Babel 插件基础 | Demo 01-02 完成 |
| Day 3 | JSX 转换器 | Demo 03 完成 |
| Day 4 | TypeScript 类型擦除 + 自定义插件 | Demo 04-05 完成 |
| Day 5 | 总结回顾 + 面试准备 | 完成本阶段 ✅ |

**预计总时长**: 4-5 天

---

## 🚀 开始学习

建议按照以下顺序学习：

1. 📖 阅读 `01-transformer-basics.md`（30分钟）
2. 📖 阅读 `02-babel-plugin-system.md`（1小时）
3. 💻 完成 `demos/01-simple-transformer/`（1-2小时）
4. 💻 完成 `demos/02-babel-plugin-basics/`（1-2小时）
5. 📖 阅读 `03-write-babel-plugin.md`（1小时）
6. 💻 完成 `demos/03-jsx-transformer/`（2-3小时）
7. 📖 阅读 `04-common-transformations.md`（1小时）
8. 💻 完成 `demos/04-typescript-transformer/`（2-3小时）
9. 📖 阅读 `05-advanced-transformations.md`（1小时）
10. 💻 完成 `demos/05-custom-babel-plugins/`（3-4小时）

**总计**: 约 15-20 小时（分 4-5 天完成）

---

**准备好了吗？让我们开始深入 Transformer 的世界！** 🚀

