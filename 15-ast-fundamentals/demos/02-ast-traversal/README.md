# Demo 02: AST 遍历实践

## 📖 简介

本 Demo 演示如何使用 Visitor 模式遍历 AST，理解 Path 对象和 Scope 概念。

## 🎯 学习目标

- ✅ 掌握 Visitor 模式
- ✅ 理解 enter 和 exit 阶段
- ✅ 使用 Path 对象操作 AST
- ✅ 理解 Scope 和 Binding

## 📦 安装依赖

```bash
npm install
```

## 🚀 运行示例

```bash
# 运行完整 Demo
npm start

# 收集所有函数名
npm run collect:functions

# 收集所有变量
npm run collect:variables

# 分析变量引用
npm run analyze:references

# 查看作用域示例
npm run scope:demo
```

## 📝 核心概念

### Visitor 模式

```javascript
const visitor = {
  Identifier(path) {
    console.log('找到标识符:', path.node.name);
  }
};

traverse(ast, visitor);
```

### Path 对象

- `path.node`: AST 节点
- `path.parent`: 父节点
- `path.scope`: 作用域
- `path.get()`, `path.find()`: 查询方法

### Scope 和 Binding

- **Scope**: 作用域对象
- **Binding**: 变量绑定信息

## ✅ 验证学习成果

- [ ] 能够使用 Visitor 模式遍历 AST
- [ ] 理解 Path 对象的作用
- [ ] 能够分析变量的作用域和引用
- [ ] 能够使用 Scope API 操作作用域

## 🔗 下一步

完成后继续学习：**Demo 03 - AST 操作实战**

