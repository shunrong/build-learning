# Demo 02: 基础 Formatter

## 功能

实现一个基础的 JavaScript Formatter，支持：
- 变量声明
- 函数声明
- 对象和数组
- 箭头函数
- If 语句
- 表达式

## 运行

```bash
npm install
npm run demo
```

## 核心实现

- 使用 @babel/parser 解析 AST
- 遍历 AST 节点
- 应用格式化规则
- 管理缩进

## 学习要点

1. AST 遍历
2. 缩进管理
3. 空格添加
4. 换行处理

