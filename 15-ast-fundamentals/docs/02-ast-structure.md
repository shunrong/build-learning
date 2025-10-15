# AST 结构详解

## 📖 概述

本文深入解析 JavaScript AST 的节点结构，理解不同类型的节点及其属性，掌握 ESTree 规范。

---

## 🌳 AST 的树形结构

### 1. 基本概念

AST 是一个**树形数据结构**：
- **根节点**：Program（程序）
- **子节点**：各种语句（Statement）和表达式（Expression）
- **叶子节点**：字面量（Literal）和标识符（Identifier）

### 2. 简单示例

**代码：**
```javascript
const x = 1;
```

**AST 树形结构：**
```
Program
└── body: Array[1]
    └── [0] VariableDeclaration
        ├── kind: "const"
        └── declarations: Array[1]
            └── [0] VariableDeclarator
                ├── id: Identifier
                │   └── name: "x"
                └── init: NumericLiteral
                    └── value: 1
```

---

## 📦 节点的基本属性

每个 AST 节点都是一个 **JavaScript 对象**，包含以下基本属性：

### 1. type（节点类型）

**必需属性**，标识节点的类型。

```javascript
{
  type: "VariableDeclaration",  // 节点类型
  // ... 其他属性
}
```

**常见类型：**
- `Program`：程序根节点
- `VariableDeclaration`：变量声明
- `FunctionDeclaration`：函数声明
- `Identifier`：标识符
- `NumericLiteral`：数字字面量
- ...（约 100+ 种）

### 2. loc（位置信息）

**可选属性**，记录节点在源代码中的位置。

```javascript
{
  type: "Identifier",
  name: "x",
  loc: {
    start: { line: 1, column: 6 },  // 起始位置
    end: { line: 1, column: 7 }     // 结束位置
  }
}
```

**用途：**
- 错误报告（指出错误位置）
- Source Map 生成
- 代码高亮

### 3. start / end（字符位置）

**可选属性**，记录节点在源代码字符串中的索引。

```javascript
{
  type: "Identifier",
  name: "x",
  start: 6,  // 在源代码中的起始索引
  end: 7     // 在源代码中的结束索引
}
```

**示例：**
```javascript
// 源代码："const x = 1;"
// 索引：   012345678910
//          const x = 1;
//                ^
//          start: 6, end: 7
```

### 4. 其他特定属性

每种节点类型有其特定的属性。

**示例：VariableDeclaration**
```javascript
{
  type: "VariableDeclaration",
  kind: "const",           // 特定属性：var/let/const
  declarations: [...]      // 特定属性：声明列表
}
```

---

## 🎯 核心节点类型

### 1. Program（程序根节点）

**描述**：整个程序的根节点。

**结构：**
```javascript
{
  type: "Program",
  body: [                 // 程序体，包含所有顶级语句
    // Statement 数组
  ],
  sourceType: "module"    // "script" 或 "module"
}
```

**示例：**
```javascript
// 代码
const x = 1;
console.log(x);

// AST
{
  type: "Program",
  body: [
    { type: "VariableDeclaration", ... },
    { type: "ExpressionStatement", ... }
  ],
  sourceType: "module"
}
```

---

## 📝 Statement（语句）

语句是执行操作的代码单元，**不返回值**。

### 1. VariableDeclaration（变量声明）

```javascript
const x = 1;
let y = 2;
var z = 3;
```

**AST 结构：**
```javascript
{
  type: "VariableDeclaration",
  kind: "const",        // "var" | "let" | "const"
  declarations: [       // 声明列表
    {
      type: "VariableDeclarator",
      id: {             // 变量名
        type: "Identifier",
        name: "x"
      },
      init: {           // 初始值
        type: "NumericLiteral",
        value: 1
      }
    }
  ]
}
```

### 2. FunctionDeclaration（函数声明）

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

**AST 结构：**
```javascript
{
  type: "FunctionDeclaration",
  id: {                 // 函数名
    type: "Identifier",
    name: "greet"
  },
  params: [             // 参数列表
    {
      type: "Identifier",
      name: "name"
    }
  ],
  body: {               // 函数体
    type: "BlockStatement",
    body: [
      {
        type: "ReturnStatement",
        argument: {
          type: "TemplateLiteral",
          // ...
        }
      }
    ]
  }
}
```

### 3. IfStatement（if 语句）

```javascript
if (x > 0) {
  console.log('positive');
} else {
  console.log('negative');
}
```

**AST 结构：**
```javascript
{
  type: "IfStatement",
  test: {               // 条件表达式
    type: "BinaryExpression",
    operator: ">",
    left: { type: "Identifier", name: "x" },
    right: { type: "NumericLiteral", value: 0 }
  },
  consequent: {         // if 分支
    type: "BlockStatement",
    body: [...]
  },
  alternate: {          // else 分支
    type: "BlockStatement",
    body: [...]
  }
}
```

### 4. ForStatement（for 循环）

```javascript
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

**AST 结构：**
```javascript
{
  type: "ForStatement",
  init: {               // 初始化
    type: "VariableDeclaration",
    kind: "let",
    declarations: [...]
  },
  test: {               // 条件判断
    type: "BinaryExpression",
    operator: "<",
    left: { type: "Identifier", name: "i" },
    right: { type: "NumericLiteral", value: 10 }
  },
  update: {             // 更新表达式
    type: "UpdateExpression",
    operator: "++",
    argument: { type: "Identifier", name: "i" }
  },
  body: {               // 循环体
    type: "BlockStatement",
    body: [...]
  }
}
```

### 5. ReturnStatement（return 语句）

```javascript
return 42;
```

**AST 结构：**
```javascript
{
  type: "ReturnStatement",
  argument: {           // 返回值表达式
    type: "NumericLiteral",
    value: 42
  }
}
```

### 6. BlockStatement（代码块）

```javascript
{
  const x = 1;
  console.log(x);
}
```

**AST 结构：**
```javascript
{
  type: "BlockStatement",
  body: [               // 语句列表
    { type: "VariableDeclaration", ... },
    { type: "ExpressionStatement", ... }
  ]
}
```

### 7. ExpressionStatement（表达式语句）

将表达式包装成语句。

```javascript
console.log('hello');  // CallExpression 包装成 ExpressionStatement
```

**AST 结构：**
```javascript
{
  type: "ExpressionStatement",
  expression: {         // 内部的表达式
    type: "CallExpression",
    // ...
  }
}
```

---

## 🔢 Expression（表达式）

表达式是**计算值并返回结果**的代码单元。

### 1. Identifier（标识符）

```javascript
x
myVariable
```

**AST 结构：**
```javascript
{
  type: "Identifier",
  name: "x"
}
```

### 2. Literal（字面量）

#### NumericLiteral（数字）
```javascript
42
3.14
```

```javascript
{
  type: "NumericLiteral",
  value: 42
}
```

#### StringLiteral（字符串）
```javascript
"hello"
'world'
```

```javascript
{
  type: "StringLiteral",
  value: "hello"
}
```

#### BooleanLiteral（布尔值）
```javascript
true
false
```

```javascript
{
  type: "BooleanLiteral",
  value: true
}
```

#### NullLiteral（null）
```javascript
null
```

```javascript
{
  type: "NullLiteral"
}
```

### 3. BinaryExpression（二元表达式）

```javascript
1 + 2
x * y
a === b
```

**AST 结构：**
```javascript
{
  type: "BinaryExpression",
  operator: "+",        // 操作符
  left: {               // 左操作数
    type: "NumericLiteral",
    value: 1
  },
  right: {              // 右操作数
    type: "NumericLiteral",
    value: 2
  }
}
```

**常见操作符：**
- 算术：`+`, `-`, `*`, `/`, `%`, `**`
- 比较：`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`
- 逻辑：`&&`, `||`
- 位运算：`&`, `|`, `^`, `<<`, `>>`, `>>>`

### 4. UnaryExpression（一元表达式）

```javascript
!x
-5
typeof value
```

**AST 结构：**
```javascript
{
  type: "UnaryExpression",
  operator: "!",        // 操作符
  prefix: true,         // 前缀还是后缀
  argument: {           // 操作数
    type: "Identifier",
    name: "x"
  }
}
```

**常见操作符：**
- `!`, `+`, `-`, `~`, `typeof`, `void`, `delete`

### 5. UpdateExpression（更新表达式）

```javascript
i++
++i
j--
--j
```

**AST 结构：**
```javascript
{
  type: "UpdateExpression",
  operator: "++",       // "++" 或 "--"
  prefix: false,        // 前缀或后缀
  argument: {
    type: "Identifier",
    name: "i"
  }
}
```

### 6. CallExpression（函数调用）

```javascript
fn()
console.log('hello')
Math.max(1, 2, 3)
```

**AST 结构：**
```javascript
{
  type: "CallExpression",
  callee: {             // 被调用的函数
    type: "Identifier",
    name: "fn"
  },
  arguments: []         // 参数列表
}

// console.log('hello')
{
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: { type: "Identifier", name: "console" },
    property: { type: "Identifier", name: "log" }
  },
  arguments: [
    { type: "StringLiteral", value: "hello" }
  ]
}
```

### 7. MemberExpression（成员访问）

```javascript
obj.prop
arr[0]
obj['key']
```

**AST 结构：**
```javascript
// obj.prop
{
  type: "MemberExpression",
  object: {             // 对象
    type: "Identifier",
    name: "obj"
  },
  property: {           // 属性
    type: "Identifier",
    name: "prop"
  },
  computed: false       // false: 点访问, true: 括号访问
}

// arr[0]
{
  type: "MemberExpression",
  object: { type: "Identifier", name: "arr" },
  property: { type: "NumericLiteral", value: 0 },
  computed: true
}
```

### 8. AssignmentExpression（赋值表达式）

```javascript
x = 1
y += 2
z *= 3
```

**AST 结构：**
```javascript
{
  type: "AssignmentExpression",
  operator: "=",        // "=", "+=", "-=", "*=", ...
  left: {               // 左值
    type: "Identifier",
    name: "x"
  },
  right: {              // 右值
    type: "NumericLiteral",
    value: 1
  }
}
```

### 9. ConditionalExpression（三元表达式）

```javascript
x > 0 ? 'positive' : 'negative'
```

**AST 结构：**
```javascript
{
  type: "ConditionalExpression",
  test: {               // 条件
    type: "BinaryExpression",
    operator: ">",
    left: { type: "Identifier", name: "x" },
    right: { type: "NumericLiteral", value: 0 }
  },
  consequent: {         // 真值分支
    type: "StringLiteral",
    value: "positive"
  },
  alternate: {          // 假值分支
    type: "StringLiteral",
    value: "negative"
  }
}
```

### 10. ArrowFunctionExpression（箭头函数）

```javascript
const add = (a, b) => a + b;
```

**AST 结构：**
```javascript
{
  type: "ArrowFunctionExpression",
  params: [             // 参数列表
    { type: "Identifier", name: "a" },
    { type: "Identifier", name: "b" }
  ],
  body: {               // 函数体（可以是表达式或块）
    type: "BinaryExpression",
    operator: "+",
    left: { type: "Identifier", name: "a" },
    right: { type: "Identifier", name: "b" }
  },
  async: false,         // 是否是 async 函数
  generator: false      // 是否是 generator 函数
}
```

### 11. ObjectExpression（对象字面量）

```javascript
const obj = {
  name: 'Alice',
  age: 25,
  greet() {
    return 'Hello';
  }
};
```

**AST 结构：**
```javascript
{
  type: "ObjectExpression",
  properties: [         // 属性列表
    {
      type: "ObjectProperty",
      key: { type: "Identifier", name: "name" },
      value: { type: "StringLiteral", value: "Alice" },
      computed: false,
      shorthand: false
    },
    {
      type: "ObjectProperty",
      key: { type: "Identifier", name: "age" },
      value: { type: "NumericLiteral", value: 25 },
      computed: false,
      shorthand: false
    },
    {
      type: "ObjectMethod",
      kind: "method",
      key: { type: "Identifier", name: "greet" },
      params: [],
      body: {
        type: "BlockStatement",
        body: [
          {
            type: "ReturnStatement",
            argument: { type: "StringLiteral", value: "Hello" }
          }
        ]
      }
    }
  ]
}
```

### 12. ArrayExpression（数组字面量）

```javascript
const arr = [1, 2, 3];
```

**AST 结构：**
```javascript
{
  type: "ArrayExpression",
  elements: [           // 元素列表
    { type: "NumericLiteral", value: 1 },
    { type: "NumericLiteral", value: 2 },
    { type: "NumericLiteral", value: 3 }
  ]
}
```

---

## 🔑 关键概念：Statement vs Expression

### Statement（语句）

- **执行操作**，不返回值
- 不能作为值使用
- 以分号结束

**示例：**
```javascript
if (x > 0) { }         // ✅ Statement
for (let i = 0; ...) {}// ✅ Statement
return x;              // ✅ Statement

const y = if (x > 0) { }  // ❌ 不能赋值给变量
```

### Expression（表达式）

- **计算并返回值**
- 可以作为值使用
- 可以嵌套

**示例：**
```javascript
1 + 2                  // ✅ Expression，返回 3
x > 0 ? 1 : 2          // ✅ Expression，返回 1 或 2
fn()                   // ✅ Expression，返回函数结果

const y = 1 + 2;       // ✅ 可以赋值给变量
```

### 混合：ExpressionStatement

某些表达式可以单独作为语句：

```javascript
fn();                  // CallExpression 包装成 ExpressionStatement
x++;                   // UpdateExpression 包装成 ExpressionStatement
```

**AST：**
```javascript
{
  type: "ExpressionStatement",
  expression: {
    type: "CallExpression",
    // ...
  }
}
```

---

## 📜 ESTree 规范

### 1. 什么是 ESTree

**ESTree** 是 JavaScript AST 的**标准规范**，定义了所有节点类型的结构。

**官方仓库**：[github.com/estree/estree](https://github.com/estree/estree)

### 2. 主要版本

| 版本 | JavaScript 版本 | 主要新增节点 |
|------|----------------|-------------|
| **ES5** | ES5 | 基础节点 |
| **ES2015** | ES6 | ArrowFunctionExpression, ClassDeclaration, ... |
| **ES2016** | ES7 | ExponentiationOperator (`**`) |
| **ES2017** | ES8 | AsyncFunctionDeclaration, AwaitExpression |
| **ES2018** | ES9 | ObjectRestSpread, AsyncGenerator |
| **ES2019** | ES10 | OptionalCatchBinding |
| **ES2020** | ES11 | OptionalChainingExpression (`?.`), NullishCoalescingOperator (`??`) |
| **ES2021** | ES12 | LogicalAssignmentOperator (`&&=`, `||=`, `??=`) |

### 3. 核心原则

1. **类型明确**：每个节点都有明确的 `type` 属性
2. **结构化**：节点以树形结构组织
3. **完整性**：包含足够的信息来还原源代码
4. **可扩展**：支持新的 JavaScript 特性

---

## 📊 完整节点类型列表

### Statements（语句）

| 节点类型 | 描述 | 示例 |
|---------|------|------|
| `ExpressionStatement` | 表达式语句 | `fn();` |
| `BlockStatement` | 代码块 | `{ ... }` |
| `EmptyStatement` | 空语句 | `;` |
| `DebuggerStatement` | debugger 语句 | `debugger;` |
| `WithStatement` | with 语句 | `with(obj) {}` |
| `ReturnStatement` | return 语句 | `return x;` |
| `BreakStatement` | break 语句 | `break;` |
| `ContinueStatement` | continue 语句 | `continue;` |
| `IfStatement` | if 语句 | `if (x) {}` |
| `SwitchStatement` | switch 语句 | `switch(x) {}` |
| `ThrowStatement` | throw 语句 | `throw new Error();` |
| `TryStatement` | try 语句 | `try {} catch {}` |
| `WhileStatement` | while 循环 | `while(x) {}` |
| `DoWhileStatement` | do-while 循环 | `do {} while(x)` |
| `ForStatement` | for 循环 | `for(;;) {}` |
| `ForInStatement` | for-in 循环 | `for(x in obj) {}` |
| `ForOfStatement` | for-of 循环 | `for(x of arr) {}` |

### Declarations（声明）

| 节点类型 | 描述 | 示例 |
|---------|------|------|
| `FunctionDeclaration` | 函数声明 | `function fn() {}` |
| `VariableDeclaration` | 变量声明 | `const x = 1;` |
| `ClassDeclaration` | 类声明 | `class Foo {}` |

### Expressions（表达式）

| 节点类型 | 描述 | 示例 |
|---------|------|------|
| `Identifier` | 标识符 | `x` |
| `Literal` | 字面量 | `42`, `"hello"` |
| `ThisExpression` | this | `this` |
| `ArrayExpression` | 数组字面量 | `[1, 2, 3]` |
| `ObjectExpression` | 对象字面量 | `{a: 1}` |
| `FunctionExpression` | 函数表达式 | `function() {}` |
| `ArrowFunctionExpression` | 箭头函数 | `() => {}` |
| `ClassExpression` | 类表达式 | `class {}` |
| `UnaryExpression` | 一元表达式 | `!x`, `-5` |
| `UpdateExpression` | 更新表达式 | `i++` |
| `BinaryExpression` | 二元表达式 | `a + b` |
| `AssignmentExpression` | 赋值表达式 | `x = 1` |
| `LogicalExpression` | 逻辑表达式 | `a && b` |
| `MemberExpression` | 成员访问 | `obj.prop` |
| `ConditionalExpression` | 三元表达式 | `x ? a : b` |
| `CallExpression` | 函数调用 | `fn()` |
| `NewExpression` | new 表达式 | `new Foo()` |
| `SequenceExpression` | 逗号表达式 | `a, b, c` |
| `TemplateLiteral` | 模板字符串 | `` `Hello ${name}` `` |
| `TaggedTemplateExpression` | 标签模板 | ``tag`text` `` |
| `SpreadElement` | 展开元素 | `...arr` |
| `AwaitExpression` | await 表达式 | `await promise` |
| `YieldExpression` | yield 表达式 | `yield value` |

---

## 🎓 实践练习

### 练习 1：分析代码结构

尝试在 [AST Explorer](https://astexplorer.net/) 中输入以下代码，观察 AST 结构：

```javascript
const add = (a, b) => a + b;

function greet(name) {
  if (!name) {
    name = 'Guest';
  }
  return `Hello, ${name}!`;
}

const result = add(1, 2);
console.log(greet(result));
```

**思考：**
1. `add` 和 `greet` 的节点类型分别是什么？
2. `if` 语句包含哪些子节点？
3. 模板字符串的 AST 结构是怎样的？

### 练习 2：手绘 AST

尝试为以下代码手绘 AST 树形结构：

```javascript
const x = 1 + 2;
```

**答案：**
```
Program
└── body: [
    VariableDeclaration (kind: "const")
    └── declarations: [
        VariableDeclarator
        ├── id: Identifier (name: "x")
        └── init: BinaryExpression (operator: "+")
            ├── left: NumericLiteral (value: 1)
            └── right: NumericLiteral (value: 2)
    ]
]
```

---

## 🎯 关键要点总结

1. **AST 是树形结构**：根节点是 `Program`，包含各种子节点
2. **节点基本属性**：`type`（必需）、`loc`、`start/end`（可选）
3. **Statement vs Expression**：
   - Statement：执行操作，不返回值
   - Expression：计算值并返回
4. **ESTree 规范**：定义了所有节点类型的标准结构
5. **100+ 节点类型**：涵盖 JavaScript 的所有语法结构

---

## 🔗 下一步

理解了 AST 结构后，接下来学习：
- **03-ast-traversal.md**：如何遍历 AST
- **04-ast-manipulation.md**：如何操作 AST

**记住：熟悉 AST 结构是操作 AST 的基础！** 🎉

