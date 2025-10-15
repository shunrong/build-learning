# 什么是 AST

## 📖 概述

AST（Abstract Syntax Tree，抽象语法树）是**源代码的结构化表示**，它以树形结构表达代码的语法结构。AST 是编译器和各种代码工具的核心数据结构。

---

## 🎯 核心概念

### 1. AST 的定义

**AST** 是源代码的**抽象语法结构**的树状表示：
- **抽象**：去除了源代码中的具体细节（如空格、分号、括号等格式信息）
- **语法**：保留了代码的语法结构和语义信息
- **树**：以树形结构组织

### 2. 从代码到 AST

让我们看一个简单的例子：

**源代码：**
```javascript
const answer = 40 + 2;
```

**AST 结构（简化）：**
```
Program
└── VariableDeclaration (kind: "const")
    └── VariableDeclarator
        ├── Identifier (name: "answer")
        └── BinaryExpression (operator: "+")
            ├── NumericLiteral (value: 40)
            └── NumericLiteral (value: 2)
```

**完整 AST（JSON 格式）：**
```json
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "kind": "const",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "answer"
          },
          "init": {
            "type": "BinaryExpression",
            "operator": "+",
            "left": {
              "type": "NumericLiteral",
              "value": 40
            },
            "right": {
              "type": "NumericLiteral",
              "value": 2
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🌳 AST vs CST

### CST（Concrete Syntax Tree，具体语法树）

CST 保留了**所有**源代码细节，包括：
- 空格
- 注释
- 分号
- 括号
- 换行符

**示例：**
```javascript
const answer = 40 + 2;
```

**CST 会包含：**
- `const` 关键字
- 空格 ` `
- `answer` 标识符
- 空格 ` `
- `=` 符号
- 空格 ` `
- `40` 数字
- 空格 ` `
- `+` 操作符
- 空格 ` `
- `2` 数字
- `;` 分号

### AST（Abstract Syntax Tree，抽象语法树）

AST 只保留**语义信息**，去除格式细节：

```javascript
VariableDeclaration {
  kind: "const",
  declarations: [
    VariableDeclarator {
      id: Identifier { name: "answer" },
      init: BinaryExpression {
        operator: "+",
        left: NumericLiteral { value: 40 },
        right: NumericLiteral { value: 2 }
      }
    }
  ]
}
```

### 对比总结

| 特性 | CST | AST |
|------|-----|-----|
| **完整性** | 保留所有细节 | 只保留语义信息 |
| **大小** | 更大 | 更小 |
| **用途** | 代码格式化（Prettier） | 代码转换、分析、优化 |
| **空格** | 保留 | 忽略 |
| **注释** | 保留 | 通常忽略（可选保留） |
| **分号** | 保留 | 忽略 |

**使用场景：**
- **Prettier** 使用 CST：需要保留格式信息来重新格式化代码
- **Babel、ESLint** 使用 AST：只关心代码的语义，不关心格式

---

## 🔄 AST 在编译器中的位置

### 编译器的五个阶段

```
源代码 (Source Code)
    ↓
1. 词法分析 (Lexical Analysis / Tokenization)
    ↓
Token 流 (Token Stream)
    ↓
2. 语法分析 (Syntax Analysis / Parsing)
    ↓
AST (Abstract Syntax Tree)  ← 我们在这里！
    ↓
3. 语义分析 (Semantic Analysis)
    ↓
带类型信息的 AST
    ↓
4. 优化 (Optimization)
    ↓
优化后的 AST
    ↓
5. 代码生成 (Code Generation)
    ↓
目标代码 (Target Code)
```

### 详细流程

#### 1. 词法分析（Lexical Analysis）

将源代码字符串**分割成 Token**：

```javascript
const answer = 40 + 2;
```

**生成 Token 流：**
```javascript
[
  { type: "Keyword", value: "const" },
  { type: "Identifier", value: "answer" },
  { type: "Punctuator", value: "=" },
  { type: "Numeric", value: "40" },
  { type: "Punctuator", value: "+" },
  { type: "Numeric", value: "2" },
  { type: "Punctuator", value: ";" }
]
```

#### 2. 语法分析（Syntax Analysis）

将 Token 流**组织成 AST**：

```javascript
Program
└── VariableDeclaration
    └── VariableDeclarator
        ├── Identifier (answer)
        └── BinaryExpression (+)
            ├── NumericLiteral (40)
            └── NumericLiteral (2)
```

#### 3. 转换（Transformation）

**修改 AST** 以实现代码转换：

例如：将 `const` 转换为 `var`：

```javascript
Program
└── VariableDeclaration (kind: "var")  ← 修改了这里
    └── VariableDeclarator
        ├── Identifier (answer)
        └── BinaryExpression (+)
            ├── NumericLiteral (40)
            └── NumericLiteral (2)
```

#### 4. 代码生成（Code Generation）

将 AST **生成回代码**：

```javascript
var answer = 40 + 2;
```

---

## 🎯 为什么需要 AST

### 1. 程序化操作代码

**问题**：如何将所有 `const` 替换为 `var`？

**方法 1：字符串替换（❌ 不可靠）**
```javascript
code = code.replace(/const/g, 'var');
```

**问题：**
```javascript
const constValue = 'constant';  // 原代码
var varValue = 'varriable';     // 错误：constValue 被破坏
```

**方法 2：AST 操作（✅ 可靠）**
```javascript
traverse(ast, {
  VariableDeclaration(path) {
    if (path.node.kind === 'const') {
      path.node.kind = 'var';
    }
  }
});
```

**结果：**
```javascript
var constValue = 'constant';  // 正确：只修改关键字
```

### 2. 代码分析

使用 AST 可以轻松分析代码：

**收集所有函数名：**
```javascript
const functionNames = [];
traverse(ast, {
  FunctionDeclaration(path) {
    functionNames.push(path.node.id.name);
  }
});
```

**分析变量依赖：**
```javascript
traverse(ast, {
  Identifier(path) {
    console.log('使用了变量:', path.node.name);
  }
});
```

### 3. 代码转换

**箭头函数 → 普通函数：**
```javascript
// 输入
const add = (a, b) => a + b;

// AST 转换
traverse(ast, {
  ArrowFunctionExpression(path) {
    path.replaceWith(
      t.functionExpression(
        null,
        path.node.params,
        t.blockStatement([
          t.returnStatement(path.node.body)
        ])
      )
    );
  }
});

// 输出
const add = function(a, b) {
  return a + b;
};
```

### 4. 代码优化

**移除未使用的代码（Tree Shaking）：**
```javascript
// 输入
export function used() { return 1; }
export function unused() { return 2; }

// 分析 AST，发现 unused 从未被导入
// 移除 unused 函数

// 输出
export function used() { return 1; }
```

---

## 🛠️ AST 的应用场景

### 1. 编译器（Compiler）

**Babel**：将 ES6+ 代码转换为 ES5
```javascript
// 输入（ES6）
const arrow = () => {};

// 输出（ES5）
var arrow = function() {};
```

**TypeScript Compiler**：将 TypeScript 转换为 JavaScript
```typescript
// 输入（TypeScript）
const message: string = 'hello';

// 输出（JavaScript）
const message = 'hello';
```

### 2. 代码检查工具（Linter）

**ESLint**：检查代码规范
```javascript
// 检测未使用的变量
const unused = 1;  // ❌ 'unused' is assigned a value but never used

// 检测 console.log
console.log('test');  // ❌ Unexpected console statement
```

**工作原理：**
```javascript
// ESLint 规则示例
module.exports = {
  create(context) {
    return {
      // 访问所有变量声明
      VariableDeclarator(node) {
        // 检查是否未使用
        if (isUnused(node)) {
          context.report({
            node,
            message: 'Variable is unused'
          });
        }
      }
    };
  }
};
```

### 3. 代码格式化工具（Formatter）

**Prettier**：格式化代码
```javascript
// 输入（格式混乱）
const  obj={a:1,b:2,c:3}

// 输出（格式规范）
const obj = {
  a: 1,
  b: 2,
  c: 3
};
```

### 4. 打包工具（Bundler）

**Webpack**：分析模块依赖
```javascript
// a.js
import { b } from './b.js';

// 通过 AST 分析 import 语句
// 构建依赖图：a.js → b.js
```

### 5. 代码转换工具（Transformer）

**自动埋点**：
```javascript
// 输入
function handleClick() {
  // 业务逻辑
}

// AST 转换，自动插入埋点代码
function handleClick() {
  __tracker__.track('handleClick');  // ← 自动插入
  // 业务逻辑
}
```

**国际化（i18n）**：
```javascript
// 输入
const message = '你好';

// AST 转换
const message = t('hello');  // ← 自动替换
```

### 6. 代码压缩工具（Minifier）

**Terser**：压缩 JavaScript
```javascript
// 输入
function calculateSum(firstNumber, secondNumber) {
  const result = firstNumber + secondNumber;
  return result;
}

// 输出（通过 AST 分析和优化）
function calculateSum(a,b){return a+b}
```

**优化策略：**
- 变量名压缩（`firstNumber` → `a`）
- 移除空格和换行
- 内联简单表达式
- 移除未使用的代码

---

## 📊 对比：字符串操作 vs AST 操作

### 场景：移除所有 `console.log`

#### 方法 1：正则表达式（❌ 不可靠）

```javascript
code = code.replace(/console\.log\(.*?\);?/g, '');
```

**问题：**
```javascript
// 原代码
const message = 'console.log("test")';  // 字符串中的 console.log
console.log('real log');

// 错误结果
const message = '';  // ❌ 字符串被误删除
```

#### 方法 2：AST 操作（✅ 可靠）

```javascript
traverse(ast, {
  CallExpression(path) {
    const { callee } = path.node;
    if (
      callee.type === 'MemberExpression' &&
      callee.object.name === 'console' &&
      callee.property.name === 'log'
    ) {
      path.remove();
    }
  }
});
```

**正确结果：**
```javascript
const message = 'console.log("test")';  // ✅ 字符串保留
// console.log('real log'); 已移除
```

---

## 🎓 关键要点总结

### 1. AST 的本质
- AST 是源代码的**结构化表示**
- 以**树形结构**组织代码的语法信息
- 保留**语义**，忽略**格式**

### 2. AST vs CST
- **AST**：抽象，只保留语义（Babel, ESLint）
- **CST**：具体，保留所有细节（Prettier）

### 3. AST 在编译器中的位置
```
源代码 → 词法分析 → Token流 → 语法分析 → AST → 转换 → 代码生成 → 目标代码
```

### 4. 为什么需要 AST
- ✅ 程序化操作代码
- ✅ 可靠的代码转换
- ✅ 精确的代码分析
- ✅ 智能的代码优化

### 5. AST 的应用
- 编译器（Babel, TypeScript）
- 代码检查（ESLint）
- 代码格式化（Prettier）
- 打包工具（Webpack, Rollup）
- 代码转换（自动埋点、国际化）
- 代码压缩（Terser）

---

## 🔗 延伸阅读

### 在线体验

访问 [AST Explorer](https://astexplorer.net/)，输入以下代码查看 AST：

```javascript
const answer = 40 + 2;

function greet(name) {
  return `Hello, ${name}!`;
}

const arrow = () => {};
```

**观察：**
1. `const` 声明是什么节点类型？
2. 函数声明包含哪些子节点？
3. 箭头函数和普通函数的 AST 有什么区别？

### 下一步

理解了"什么是 AST"后，接下来学习：
- **02-ast-structure.md**：深入了解 AST 的节点类型和结构
- **03-ast-traversal.md**：学习如何遍历 AST
- **04-ast-manipulation.md**：学习如何操作 AST

---

**记住：AST 是理解所有编译工具的基础！** 🎉

