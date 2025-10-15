# Demo 04: 代码转换器

## 📖 简介

本 Demo 演示完整的代码转换流程：Parse → Transform → Generate。

## 🎯 学习目标

- ✅ 理解完整的转换流程
- ✅ 实现多个实用的转换器
- ✅ 掌握组合多个转换器
- ✅ 能够转换文件

## 📦 安装依赖

```bash
npm install
```

## 🚀 运行示例

```bash
# 运行完整 Demo
npm start

# 移除 debugger
npm run transform:debugger

# 移除 console.log
npm run transform:console

# 箭头函数转普通函数
npm run transform:arrow

# const 转 var
npm run transform:const

# 转换文件
npm run transform:file input.js
```

## 📝 转换流程

```javascript
function transform(code, visitor) {
  // 1. Parse: 解析代码成 AST
  const ast = parser.parse(code);
  
  // 2. Transform: 遍历和修改 AST
  traverse(ast, visitor);
  
  // 3. Generate: 生成新代码
  const output = generate(ast);
  
  return output.code;
}
```

## 🛠️ 转换器示例

### 1. 移除 debugger

```javascript
const visitor = {
  DebuggerStatement(path) {
    path.remove();
  }
};
```

### 2. 移除 console.*

```javascript
const visitor = {
  CallExpression(path) {
    const { callee } = path.node;
    if (
      t.isMemberExpression(callee) &&
      callee.object.name === 'console'
    ) {
      path.remove();
    }
  }
};
```

### 3. 箭头函数转普通函数

```javascript
const visitor = {
  ArrowFunctionExpression(path) {
    // 转换逻辑
  }
};
```

## ✅ 验证学习成果

- [ ] 理解 Parse → Transform → Generate 流程
- [ ] 能够实现简单的代码转换器
- [ ] 能够组合多个转换器
- [ ] 能够转换文件

## 🔗 下一步

完成后继续学习：**Demo 05 - AST 可视化工具**

