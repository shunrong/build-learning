# AST 遍历

## 📖 概述

本文深入讲解如何遍历 AST，理解 Visitor 模式，掌握 Babel Traverse API。

---

## 🎯 为什么需要遍历 AST

### 常见场景

1. **收集信息**：查找所有函数名、变量名
2. **代码分析**：分析依赖关系、变量引用
3. **代码转换**：修改特定节点（如移除 console.log）
4. **代码检查**：检测不符合规范的代码（ESLint）

### 示例：收集所有函数名

```javascript
// 源代码
function add(a, b) {
  return a + b;
}

function multiply(x, y) {
  return x * y;
}

// 目标：收集 ['add', 'multiply']
```

**如何实现？**
→ 遍历 AST，访问所有 `FunctionDeclaration` 节点

---

## 🌳 树的遍历算法

### 1. 深度优先遍历（DFS）

**Depth-First Search**：优先访问子节点，再访问兄弟节点。

**AST 示例：**
```
Program
├── VariableDeclaration (1)
│   └── VariableDeclarator (2)
│       ├── Identifier (3)
│       └── BinaryExpression (4)
│           ├── NumericLiteral (5)
│           └── NumericLiteral (6)
└── ExpressionStatement (7)
    └── CallExpression (8)
```

**DFS 遍历顺序：**
```
Program → VariableDeclaration → VariableDeclarator → Identifier → BinaryExpression → NumericLiteral → NumericLiteral → ExpressionStatement → CallExpression
```

**特点：**
- ✅ 符合代码的逻辑顺序
- ✅ 适合大多数 AST 操作
- ✅ Babel Traverse 默认使用 DFS

### 2. 广度优先遍历（BFS）

**Breadth-First Search**：优先访问同层节点，再访问下一层。

**BFS 遍历顺序：**
```
Program → VariableDeclaration → ExpressionStatement → VariableDeclarator → CallExpression → Identifier → BinaryExpression → NumericLiteral → NumericLiteral
```

**特点：**
- 按层级遍历
- 较少用于 AST 操作

### 3. 为什么 AST 通常使用 DFS？

1. **符合代码逻辑**：代码是嵌套的，DFS 能保持嵌套关系
2. **Scope 分析**：进入子作用域时能正确处理
3. **父子关系**：便于访问父节点

---

## 🎨 Visitor 模式

### 1. 什么是 Visitor 模式

**Visitor 模式**是一种设计模式，用于**分离数据结构和操作**。

在 AST 中：
- **数据结构**：AST 树
- **操作**：访问、修改节点

**核心思想：**
- 定义"访问器"函数（Visitor）
- 遍历 AST 时，自动调用对应的访问器

### 2. 基本示例

```javascript
const traverse = require('@babel/traverse').default;

// 定义 Visitor
const visitor = {
  // 访问所有 Identifier 节点
  Identifier(path) {
    console.log('找到标识符:', path.node.name);
  },
  
  // 访问所有 FunctionDeclaration 节点
  FunctionDeclaration(path) {
    console.log('找到函数:', path.node.id.name);
  }
};

// 遍历 AST
traverse(ast, visitor);
```

**代码：**
```javascript
function add(a, b) {
  return a + b;
}
```

**输出：**
```
找到函数: add
找到标识符: add
找到标识符: a
找到标识符: b
找到标识符: a
找到标识符: b
```

### 3. Visitor 的两个阶段：enter 和 exit

遍历每个节点时，会触发**两次**访问：
1. **enter**：进入节点时
2. **exit**：离开节点时

**示例：**
```javascript
const visitor = {
  FunctionDeclaration: {
    enter(path) {
      console.log('进入函数:', path.node.id.name);
    },
    exit(path) {
      console.log('离开函数:', path.node.id.name);
    }
  }
};
```

**代码：**
```javascript
function outer() {
  function inner() {
    return 1;
  }
  return inner();
}
```

**输出：**
```
进入函数: outer
进入函数: inner
离开函数: inner
离开函数: outer
```

**用途：**
- **enter**：进入作用域，分析变量声明
- **exit**：离开作用域，清理临时数据

### 4. 简写形式

如果只需要 `enter`，可以简写：

```javascript
const visitor = {
  // 简写：默认是 enter
  Identifier(path) {
    console.log(path.node.name);
  },
  
  // 完整形式
  FunctionDeclaration: {
    enter(path) {
      console.log(path.node.id.name);
    }
  }
};
```

---

## 🛤️ Path 对象

### 1. 什么是 Path

**Path** 是 Babel Traverse 提供的对象，包装了 AST 节点，提供了丰富的 API。

**关键区别：**
- **node**：纯粹的 AST 节点对象
- **path**：包含节点 + 上下文信息 + 操作方法

```javascript
Identifier(path) {
  // path.node：AST 节点
  console.log(path.node.name);
  
  // path：包含更多信息和方法
  console.log(path.parent);      // 父节点
  console.log(path.scope);       // 作用域
  path.remove();                 // 删除节点
}
```

### 2. Path 的核心属性

#### path.node

当前 AST 节点。

```javascript
Identifier(path) {
  // 访问节点类型
  console.log(path.node.type);  // "Identifier"
  
  // 访问节点属性
  console.log(path.node.name);  // "x"
}
```

#### path.parent

父节点。

```javascript
Identifier(path) {
  console.log(path.parent.type);  // "VariableDeclarator"
}
```

**示例：**
```javascript
const x = 1;
//    ^
// Identifier 的 parent 是 VariableDeclarator
```

#### path.parentPath

父节点的 Path 对象。

```javascript
Identifier(path) {
  console.log(path.parentPath.node.type);  // "VariableDeclarator"
}
```

#### path.scope

当前作用域对象。

```javascript
FunctionDeclaration(path) {
  // 获取作用域中的所有绑定
  console.log(path.scope.bindings);
}
```

#### path.hub

共享的状态对象，可以存储遍历过程中的数据。

```javascript
const visitor = {
  Program(path) {
    path.hub.functionCount = 0;
  },
  FunctionDeclaration(path) {
    path.hub.functionCount++;
  }
};
```

### 3. Path 的核心方法

#### 查询方法

##### path.findParent()

向上查找满足条件的父节点。

```javascript
Identifier(path) {
  // 查找最近的函数父节点
  const functionParent = path.findParent((p) => p.isFunctionDeclaration());
  
  if (functionParent) {
    console.log('所属函数:', functionParent.node.id.name);
  }
}
```

##### path.find()

向上查找满足条件的节点（包括自己）。

```javascript
Identifier(path) {
  const declaration = path.find((p) => p.isVariableDeclaration());
}
```

##### path.getFunctionParent()

获取最近的函数父节点。

```javascript
Identifier(path) {
  const fn = path.getFunctionParent();
  if (fn) {
    console.log('所属函数:', fn.node.id.name);
  }
}
```

##### path.getStatementParent()

获取最近的语句父节点。

```javascript
Identifier(path) {
  const stmt = path.getStatementParent();
  console.log('所属语句类型:', stmt.node.type);
}
```

#### 判断方法

Babel Types 提供了大量判断方法，都可以在 Path 上使用：

```javascript
Identifier(path) {
  if (path.isIdentifier()) {
    console.log('是标识符');
  }
  
  if (path.isReferencedIdentifier()) {
    console.log('是引用标识符（不是声明）');
  }
}

FunctionDeclaration(path) {
  if (path.isFunctionDeclaration()) {
    console.log('是函数声明');
  }
}
```

**常用判断：**
- `path.isIdentifier()`
- `path.isFunctionDeclaration()`
- `path.isVariableDeclaration()`
- `path.isCallExpression()`
- `path.isMemberExpression()`
- ...（100+ 种）

#### 操作方法（下一章详解）

- `path.replaceWith(node)`：替换节点
- `path.remove()`：删除节点
- `path.insertBefore(node)`：前插入
- `path.insertAfter(node)`：后插入

---

## 🔍 Scope 和 Binding

### 1. Scope（作用域）

**Scope** 对象表示一个作用域，包含该作用域中的所有变量绑定。

**示例：**
```javascript
function outer() {       // Scope 1
  const x = 1;
  
  function inner() {     // Scope 2
    const y = 2;
    console.log(x, y);
  }
}
```

**Scope 层级：**
```
Program Scope
└── outer Function Scope
    ├── x: const
    └── inner Function Scope
        └── y: const
```

### 2. Binding（绑定）

**Binding** 表示一个变量的绑定信息。

**属性：**
- `identifier`：变量名节点
- `kind`：绑定类型（`const`, `let`, `var`, `param`, ...）
- `path`：声明位置的 Path
- `referenced`：是否被引用
- `references`：引用次数
- `referencePaths`：所有引用位置的 Path 数组

**示例：**
```javascript
FunctionDeclaration(path) {
  // 获取当前作用域的所有绑定
  const bindings = path.scope.bindings;
  
  for (const name in bindings) {
    const binding = bindings[name];
    console.log('变量名:', name);
    console.log('绑定类型:', binding.kind);
    console.log('是否被引用:', binding.referenced);
    console.log('引用次数:', binding.references);
  }
}
```

### 3. Scope API

#### scope.hasBinding(name)

检查作用域中是否有某个绑定。

```javascript
FunctionDeclaration(path) {
  if (path.scope.hasBinding('x')) {
    console.log('作用域中有变量 x');
  }
}
```

#### scope.getBinding(name)

获取某个变量的绑定对象。

```javascript
Identifier(path) {
  const binding = path.scope.getBinding(path.node.name);
  if (binding) {
    console.log('变量类型:', binding.kind);
    console.log('引用次数:', binding.references);
  }
}
```

#### scope.hasOwnBinding(name)

检查当前作用域（不包括父作用域）是否有某个绑定。

```javascript
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding('x')) {
    console.log('当前作用域中有变量 x');
  }
}
```

#### scope.rename(oldName, newName)

重命名变量（包括所有引用）。

```javascript
FunctionDeclaration(path) {
  path.scope.rename('oldName', 'newName');
}
```

---

## 🛠️ Babel Traverse API

### 1. 安装和使用

```bash
npm install @babel/parser @babel/traverse @babel/types
```

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// 1. 解析代码
const code = `
  function add(a, b) {
    return a + b;
  }
`;

const ast = parser.parse(code);

// 2. 定义 Visitor
const visitor = {
  FunctionDeclaration(path) {
    console.log('函数名:', path.node.id.name);
  }
};

// 3. 遍历 AST
traverse(ast, visitor);
```

### 2. 访问多种节点类型

使用 `|` 分隔多个类型：

```javascript
const visitor = {
  // 访问 FunctionDeclaration 和 ArrowFunctionExpression
  "FunctionDeclaration|ArrowFunctionExpression"(path) {
    console.log('找到函数');
  }
};
```

### 3. 访问特定路径

访问嵌套节点：

```javascript
const visitor = {
  // 只访问 CallExpression 中的 MemberExpression
  CallExpression(path) {
    if (path.get('callee').isMemberExpression()) {
      console.log('成员表达式调用');
    }
  }
};
```

### 4. 停止遍历

```javascript
const visitor = {
  FunctionDeclaration(path) {
    // 停止遍历当前节点的子节点
    path.skip();
    
    // 完全停止遍历
    path.stop();
  }
};
```

---

## 💡 实战示例

### 示例 1：收集所有函数名

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = `
  function add(a, b) {
    return a + b;
  }
  
  const multiply = (x, y) => x * y;
  
  const obj = {
    divide(a, b) {
      return a / b;
    }
  };
`;

const ast = parser.parse(code);
const functionNames = [];

traverse(ast, {
  // 函数声明
  FunctionDeclaration(path) {
    functionNames.push(path.node.id.name);
  },
  
  // 箭头函数（通过变量声明）
  VariableDeclarator(path) {
    if (path.get('init').isArrowFunctionExpression()) {
      functionNames.push(path.node.id.name);
    }
  },
  
  // 对象方法
  ObjectMethod(path) {
    functionNames.push(path.node.key.name);
  }
});

console.log(functionNames);  // ['add', 'multiply', 'divide']
```

### 示例 2：收集所有变量声明

```javascript
const code = `
  const x = 1;
  let y = 2;
  var z = 3;
  
  function fn() {
    const a = 4;
    let b = 5;
  }
`;

const ast = parser.parse(code);
const variables = [];

traverse(ast, {
  VariableDeclarator(path) {
    variables.push({
      name: path.node.id.name,
      kind: path.parent.kind,  // const/let/var
      scope: path.scope.uid    // 作用域 ID
    });
  }
});

console.log(variables);
// [
//   { name: 'x', kind: 'const', scope: 0 },
//   { name: 'y', kind: 'let', scope: 0 },
//   { name: 'z', kind: 'var', scope: 0 },
//   { name: 'a', kind: 'const', scope: 1 },
//   { name: 'b', kind: 'let', scope: 1 }
// ]
```

### 示例 3：查找所有 `console.log` 调用

```javascript
const code = `
  console.log('hello');
  console.error('error');
  console.log('world');
  
  const fn = () => {
    console.log('nested');
  };
`;

const ast = parser.parse(code);
const consoleLogs = [];

traverse(ast, {
  CallExpression(path) {
    const { callee } = path.node;
    
    // 检查是否是 console.log
    if (
      callee.type === 'MemberExpression' &&
      callee.object.name === 'console' &&
      callee.property.name === 'log'
    ) {
      // 获取第一个参数（字符串）
      const firstArg = path.node.arguments[0];
      if (firstArg.type === 'StringLiteral') {
        consoleLogs.push(firstArg.value);
      }
    }
  }
});

console.log(consoleLogs);  // ['hello', 'world', 'nested']
```

### 示例 4：分析变量引用

```javascript
const code = `
  function example() {
    const x = 1;
    const y = 2;
    const z = 3;
    
    console.log(x);
    console.log(x + y);
    // z 未使用
  }
`;

const ast = parser.parse(code);

traverse(ast, {
  FunctionDeclaration(path) {
    const bindings = path.scope.bindings;
    
    for (const name in bindings) {
      const binding = bindings[name];
      console.log(`变量 ${name}:`);
      console.log(`  类型: ${binding.kind}`);
      console.log(`  是否被引用: ${binding.referenced}`);
      console.log(`  引用次数: ${binding.references}`);
    }
  }
});

// 输出：
// 变量 x:
//   类型: const
//   是否被引用: true
//   引用次数: 2
// 变量 y:
//   类型: const
//   是否被引用: true
//   引用次数: 1
// 变量 z:
//   类型: const
//   是否被引用: false
//   引用次数: 0
```

---

## 🎓 关键要点总结

1. **遍历算法**：AST 通常使用深度优先遍历（DFS）
2. **Visitor 模式**：分离数据结构和操作，定义访问器函数
3. **enter/exit**：每个节点触发两次访问
4. **Path 对象**：包装 AST 节点，提供丰富的 API
   - `path.node`：AST 节点
   - `path.parent`：父节点
   - `path.scope`：作用域
5. **Scope 和 Binding**：管理变量作用域和绑定信息
6. **Babel Traverse**：强大的 AST 遍历工具

---

## 🔗 下一步

理解了 AST 遍历后，接下来学习：
- **04-ast-manipulation.md**：如何操作 AST（增删改）

**记住：遍历是操作 AST 的基础！** 🎉

