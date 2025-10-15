# Demo 03: AST 操作实战

## 📖 简介

本 Demo 演示如何操作 AST，包括增删改节点。

## 🎯 学习目标

- ✅ 掌握修改节点的方法
- ✅ 掌握删除节点的方法
- ✅ 掌握插入节点的方法
- ✅ 掌握替换节点的方法
- ✅ 使用 `@babel/types` 创建节点

## 📦 安装依赖

```bash
npm install
```

## 🚀 运行示例

```bash
# 运行完整 Demo
npm start

# 重命名变量
npm run rename

# 移除 console.log
npm run remove

# 插入注释
npm run insert

# 箭头函数转普通函数
npm run replace
```

## 📝 核心概念

### 修改节点

```javascript
path.node.kind = 'var';  // 直接修改属性
```

### 删除节点

```javascript
path.remove();
```

### 插入节点

```javascript
path.insertBefore(newNode);
path.insertAfter(newNode);
```

### 替换节点

```javascript
path.replaceWith(newNode);
```

### 创建节点

```javascript
const t = require('@babel/types');
const id = t.identifier('x');
const num = t.numericLiteral(42);
```

## ✅ 验证学习成果

- [ ] 能够修改 AST 节点
- [ ] 能够删除 AST 节点
- [ ] 能够插入新节点
- [ ] 能够替换节点
- [ ] 能够使用 `@babel/types` 创建节点

## 🔗 下一步

完成后继续学习：**Demo 04 - 代码转换器**

