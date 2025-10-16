# Phase 22: Minifier 学习指南

## 🎯 学习目标

通过本阶段的学习，你将：

1. **理解 Minifier 的核心原理**
   - 代码压缩的本质和目标
   - 变量混淆（Name Mangling）
   - 死代码消除（Dead Code Elimination）
   - 常量折叠（Constant Folding）

2. **掌握主流 Minifier**
   - Terser 的工作原理
   - UglifyJS 的实现
   - esbuild/SWC 的压缩策略

3. **学会自定义压缩规则**
   - 从零实现简单的 Minifier
   - 实现各种压缩优化技术
   - 权衡压缩率和性能

4. **理解压缩的权衡**
   - 可读性 vs 体积
   - 压缩速度 vs 压缩率
   - Source Map 的重要性

---

## 📚 核心概念

### 1. 代码压缩的目标

```
原始代码（可读）
  ↓
压缩后（体积小）
  ↓
目标：减小文件体积，加快加载速度
```

### 2. 主要压缩技术

#### 变量混淆
```javascript
// 压缩前
function calculateSum(firstNumber, secondNumber) {
  return firstNumber + secondNumber;
}

// 压缩后
function a(b,c){return b+c}
```

#### 删除空格和注释
```javascript
// 压缩前
function add(a, b) {
  // 求和函数
  return a + b;
}

// 压缩后
function add(a,b){return a+b}
```

#### 常量折叠
```javascript
// 压缩前
const x = 1 + 2 + 3;

// 压缩后
const x = 6;
```

#### 死代码消除
```javascript
// 压缩前
if (false) {
  console.log('never run');
}

// 压缩后
// 整段删除
```

---

## 📂 Demo 项目

### Demo 01: 简单 Minifier
```
demos/01-simple-minifier/
  - 变量重命名
  - 删除空格
  - 删除注释
  - 常量折叠
```

---

## ✅ 验收标准

### 理论层面
- [ ] 能解释 Minifier 的工作原理
- [ ] 能说出常见的压缩优化技术
- [ ] 能理解压缩的权衡（体积 vs 可读性）

### 实践层面
- [ ] 能实现一个简单的 Minifier
- [ ] 能实现变量混淆
- [ ] 能实现常量折叠和死代码消除

### 面试层面
- [ ] 能回答：Minifier 如何工作？
- [ ] 能回答：为什么需要 Source Map？
- [ ] 能回答：有哪些常见的压缩优化技术？

---

## 💡 核心要点

1. **Minifier 的本质**：减小代码体积，不改变代码行为
2. **压缩 vs 格式化**：Minifier 牺牲可读性，Formatter 提升可读性
3. **Source Map**：在生产环境调试压缩后的代码
4. **性能权衡**：压缩时间 vs 压缩率

---

## 🚀 开始学习

阅读文档，运行 Demo，理解代码压缩的核心原理！

