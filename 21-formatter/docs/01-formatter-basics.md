# Formatter 基础概念

## 📖 什么是 Formatter？

**Formatter（代码格式化器）**是一个将代码按照统一的风格规则进行格式化的工具。

### 核心职责

```
输入：格式混乱的代码
  ↓
处理：应用格式化规则
  ↓
输出：格式统一的代码
```

### 示例

**格式化前**：
```javascript
const x=1;const y=2;function add(a,b){return a+b;}
```

**格式化后**：
```javascript
const x = 1;
const y = 2;

function add(a, b) {
  return a + b;
}
```

---

## 🎯 Formatter 的核心特征

### 1. 不改变语义

```javascript
// 格式化前
const sum=1+2+3

// 格式化后
const sum = 1 + 2 + 3;

// ✅ 语义完全相同
```

### 2. 统一风格

```javascript
// 团队成员 A 的风格
const name="Alice"
function greet(){console.log('Hello')}

// 团队成员 B 的风格
const name = "Bob";
function greet() {
  console.log("Hello");
}

// 格式化后：统一风格
const name = "Alice";
function greet() {
  console.log("Hello");
}
```

### 3. 自动化

```bash
# 一键格式化整个项目
prettier --write "src/**/*.{js,ts,jsx,tsx}"

# 保存时自动格式化（VSCode）
"editor.formatOnSave": true
```

---

## 🔄 Formatter 的工作流程

### 完整流程

```
原始代码
  ↓
1. 解析（Parsing）
  ↓
AST
  ↓
2. 打印（Printing）
  ↓
格式化后的代码
```

### 详细步骤

#### 步骤 1：解析代码为 AST

```javascript
// 原始代码
const x=1

// 解析为 AST
{
  type: 'VariableDeclaration',
  kind: 'const',
  declarations: [{
    type: 'VariableDeclarator',
    id: { type: 'Identifier', name: 'x' },
    init: { type: 'Literal', value: 1 }
  }]
}
```

#### 步骤 2：遍历 AST 打印代码

```javascript
function print(node) {
  switch (node.type) {
    case 'VariableDeclaration':
      return printVariableDeclaration(node);
    case 'FunctionDeclaration':
      return printFunctionDeclaration(node);
    // ... 更多类型
  }
}

function printVariableDeclaration(node) {
  const kind = node.kind;  // 'const'
  const name = node.declarations[0].id.name;  // 'x'
  const value = node.declarations[0].init.value;  // 1
  
  // 应用格式化规则
  return `${kind} ${name} = ${value};`;  // 'const x = 1;'
}
```

---

## 📐 格式化规则

### 1. 缩进（Indentation）

```javascript
// 2 空格缩进
function greet() {
  console.log('Hello');
}

// 4 空格缩进
function greet() {
    console.log('Hello');
}

// Tab 缩进
function greet() {
	console.log('Hello');
}
```

### 2. 空格（Spacing）

```javascript
// 操作符周围的空格
const sum = a + b;     // ✅ 有空格
const sum = a+b;       // ❌ 无空格

// 函数参数的空格
function greet(name) { }  // ✅ 函数名和括号之间无空格
function greet (name) { } // ❌ 有空格

// 对象属性的空格
{ name: 'Alice' }  // ✅ 冒号后有空格
{ name:'Alice' }   // ❌ 无空格
```

### 3. 换行（Line Breaking）

```javascript
// 短对象：单行
const user = { name: 'Alice', age: 30 };

// 长对象：多行
const user = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  address: '123 Main St'
};

// 链式调用：多行
const result = data
  .filter(x => x > 0)
  .map(x => x * 2)
  .reduce((a, b) => a + b, 0);
```

### 4. 引号（Quotes）

```javascript
// 单引号
const name = 'Alice';

// 双引号
const name = "Alice";

// 模板字符串
const greeting = `Hello, ${name}!`;
```

### 5. 分号（Semicolons）

```javascript
// 加分号
const x = 1;
const y = 2;

// 不加分号
const x = 1
const y = 2
```

### 6. 尾逗号（Trailing Commas）

```javascript
// ES5：不加尾逗号
const arr = [
  1,
  2,
  3
];

// ES2017+：加尾逗号
const arr = [
  1,
  2,
  3,  // ← 尾逗号
];
```

---

## 🆚 Formatter vs Linter

| 维度 | Formatter | Linter |
|------|-----------|--------|
| **目标** | 统一代码风格 | 发现代码问题 |
| **关注点** | 缩进、空格、换行 | 逻辑错误、不良实践 |
| **是否修改代码** | ✅ 一定修改 | ❌ 默认不修改 |
| **语义是否变化** | ❌ 不变 | ❌ 不变 |
| **配置复杂度** | 🟢 低（选项少） | 🔴 高（规则多） |
| **执行时机** | 保存时、提交前 | 开发时、提交前 |
| **典型工具** | Prettier | ESLint |

### 示例对比

```javascript
// 原始代码
const x=1;if(x>0){console.log('yes')}

// Formatter 的关注点
const x = 1;              // ← 加空格
if (x > 0) {              // ← 加空格和换行
  console.log('yes');     // ← 缩进
}

// Linter 的关注点
const x = 1;
if (x > 0) {
  console.log('yes');     // ⚠️ ESLint: Unexpected console statement
}
```

---

## 🛠️ 主流 Formatter 工具

### 1. Prettier（最流行）

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

**特点**：
- ✅ 配置选项少（Opinionated）
- ✅ 支持多种语言（JS、TS、CSS、HTML、JSON...）
- ✅ 社区广泛采用
- ✅ 与编辑器深度集成

### 2. Black（Python）

```python
# 格式化前
x=1
def greet(name):print(f'Hello, {name}')

# 格式化后
x = 1

def greet(name):
    print(f'Hello, {name}')
```

### 3. gofmt（Go）

```go
// 格式化前
func add(a,b int)int{return a+b}

// 格式化后
func add(a, b int) int {
    return a + b
}
```

### 4. Rustfmt（Rust）

```rust
// 格式化前
fn add(a:i32,b:i32)->i32{a+b}

// 格式化后
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

---

## 💡 为什么需要 Formatter？

### 1. 统一团队代码风格

```javascript
// 没有 Formatter：每个人的风格不同

// 成员 A 的代码
const sum=arr.reduce((a,b)=>a+b,0)

// 成员 B 的代码
const sum = arr.reduce((a, b) => a + b, 0);

// 成员 C 的代码
const sum = arr.reduce(
  (a, b) => a + b,
  0
);

// 有 Formatter：统一风格
const sum = arr.reduce((a, b) => a + b, 0);
```

### 2. 减少 Code Review 的时间

```javascript
// Code Review 前：需要讨论格式问题
❌ "这里缺少空格"
❌ "应该换行"
❌ "缩进不对"

// Code Review 后：只关注逻辑
✅ "这个算法有性能问题"
✅ "应该处理边界情况"
✅ "可以提取为公共函数"
```

### 3. 提高代码可读性

```javascript
// 格式混乱：难以阅读
const user={name:'Alice',age:30};function greet(){if(user.age>18){console.log('Adult')}else{console.log('Child')}}

// 格式清晰：易于阅读
const user = { name: 'Alice', age: 30 };

function greet() {
  if (user.age > 18) {
    console.log('Adult');
  } else {
    console.log('Child');
  }
}
```

### 4. 自动化格式化，节省时间

```bash
# 手动格式化：耗时、易错
# - 逐行调整空格
# - 手动添加换行
# - 检查缩进

# 自动格式化：一键搞定
prettier --write src/**/*.js
```

---

## 🎨 Formatter 的设计原则

### 1. Opinionated（强制风格）

Prettier 的理念：**不提供过多选项，强制统一风格**

```
有意见的（Opinionated）：
- 提供少量配置选项
- 大部分风格已内置
- 减少团队争论

无意见的（Un-opinionated）：
- 提供大量配置选项
- 风格由用户决定
- 可能导致团队分歧
```

### 2. Idempotent（幂等性）

```javascript
// 格式化一次
const code1 = format('const x=1');
// 'const x = 1;'

// 再格式化一次
const code2 = format(code1);
// 'const x = 1;'

// code1 === code2 ✅ 幂等
```

### 3. Preserve Semantics（保留语义）

```javascript
// 格式化前
const sum=1+2*3  // 7

// 格式化后
const sum = 1 + 2 * 3;  // ✅ 仍然是 7

// ❌ 错误的格式化
const sum = (1 + 2) * 3;  // ❌ 变成 9，语义改变
```

---

## 📊 Formatter 的性能考虑

### 1. 解析速度

```
小文件（< 1KB）：几毫秒
中等文件（10KB）：几十毫秒
大文件（100KB）：几百毫秒
```

### 2. 格式化速度

```
Prettier：
- 纯 JavaScript 实现
- 适中的性能

Rust-based Formatter（如 dprint）：
- Rust 实现
- 10-100x 性能提升
```

### 3. 性能优化策略

```javascript
// 策略 1：增量格式化
只格式化修改的文件，而不是整个项目

// 策略 2：并行处理
同时格式化多个文件

// 策略 3：缓存结果
缓存已格式化的文件
```

---

## 🚀 下一步

现在你已经理解了 Formatter 的基础概念，接下来：

1. 阅读 `02-prettier-internals.md` 了解 Prettier 的工作原理
2. 学习 `03-simple-formatter.md` 实现一个简单的 Formatter
3. 运行 Demo 项目，观察格式化的实际效果

记住：**Formatter 的目标是美化代码，而不改变代码的行为**！

