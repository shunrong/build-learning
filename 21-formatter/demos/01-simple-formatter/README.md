# 01 - 简单代码格式化器

## 📋 项目说明

这个 Demo 展示了代码格式化器（Formatter）的核心原理：从 AST 生成格式化后的代码。

## 🎯 学习目标

1. 理解 **AST → 格式化代码** 的流程
2. 掌握递归打印 AST 节点的方法
3. 学会应用格式化规则（缩进、空格、分号）
4. 理解格式化不改变代码语义的原则

## 🚀 运行方式

```bash
npm install
npm start
```

## 📊 演示内容

### 测试 1：变量声明
```javascript
// 格式化前
const x=1;const y=2

// 格式化后
const x = 1;
const y = 2;
```

### 测试 2：函数声明
```javascript
// 格式化前
function add(a,b){return a+b}

// 格式化后
function add(a, b) {
  return a + b;
}
```

### 测试 3：复杂表达式
```javascript
// 格式化前
const sum=arr.filter(x=>x>0).reduce((a,b)=>a+b,0)

// 格式化后
const sum = arr.filter(x => x > 0).reduce((a, b) => a + b, 0);
```

### 测试 4：if 语句
```javascript
// 格式化前
function test(x){if(x>0){console.log("positive")}else{console.log("negative")}}

// 格式化后
function test(x) {
  if (x > 0) {
    console.log('positive');
  } else {
    console.log('negative');
  }
}
```

## 🔍 核心代码解析

### 1. 主流程

```javascript
class SimpleFormatter {
  format(code) {
    const ast = parser.parse(code);  // 1. 解析
    return this.printProgram(ast.program);  // 2. 打印
  }
}
```

### 2. 递归打印

```javascript
print(node) {
  switch (node.type) {
    case 'VariableDeclaration':
      return this.printVariableDeclaration(node);
    case 'FunctionDeclaration':
      return this.printFunctionDeclaration(node);
    // ... 处理其他类型
  }
}
```

### 3. 应用格式化规则

```javascript
// 缩进
indent() {
  return this.config.indent.repeat(this.indentLevel);
}

// 分号
semi() {
  return this.config.semicolon ? ';' : '';
}

// 空格
space() {
  return this.config.space ? ' ' : '';
}
```

## 💡 核心原理

```
原始代码
  ↓
Parser（@babel/parser）
  ↓
AST
  ↓
递归遍历节点
  ↓
为每个节点生成代码片段
  ↓
应用格式化规则（缩进、空格、分号）
  ↓
拼接为最终代码
```

## 🎨 支持的语法

- ✅ 变量声明（const/let/var）
- ✅ 函数声明
- ✅ 表达式语句
- ✅ 返回语句
- ✅ if/else 语句
- ✅ 二元表达式
- ✅ 函数调用
- ✅ 箭头函数
- ✅ 成员访问

## 📚 与 Prettier 的对比

| 特性 | 本 Demo | Prettier |
|------|---------|----------|
| 支持语法 | 基础语法 | 所有 JS 语法 |
| 格式化规则 | 简单规则 | 复杂的 Layout Algorithm |
| 性能 | 适中 | 高度优化 |
| 注释处理 | ❌ 不支持 | ✅ 支持 |
| 断行策略 | 简单 | 智能断行 |

## 🔧 扩展练习

1. **添加更多语法支持**
   - 支持 class 声明
   - 支持 for/while 循环
   - 支持 try/catch

2. **优化格式化规则**
   - 实现智能断行（超过行宽自动换行）
   - 支持对象和数组的多行格式化
   - 处理注释的保留

3. **添加配置选项**
   - 支持 4 空格缩进
   - 支持双引号
   - 支持不加分号

## ⚠️ 局限性

- 不支持注释（会丢失）
- 不支持所有 ES6+ 语法
- 没有智能断行
- 性能未优化

## 🎯 关键收获

1. Formatter 本质是 **AST → Code** 的转换
2. 通过递归遍历实现
3. 格式化规则作为辅助方法应用
4. 不改变代码语义，只改变风格

