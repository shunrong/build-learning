# Transformer 基础概念

## 什么是 Transformer？

**Transformer（转换器）** 是编译器中负责 **修改 AST** 的组件，它接收一个 AST，对其进行修改、优化或转换，然后输出一个新的 AST。

### 在编译流程中的位置

```
┌─────────────────────────────────────────────────────────────┐
│                      编译器完整流程                           │
└─────────────────────────────────────────────────────────────┘

  源代码 (Source Code)
      ↓
  ┌─────────────┐
  │   Parser    │  词法分析 + 语法分析
  │ (解析器)     │
  └─────────────┘
      ↓
   AST (抽象语法树)
      ↓
  ┌─────────────┐
  │ Transformer │  ← 本阶段学习重点
  │ (转换器)     │  修改/优化/转换 AST
  └─────────────┘
      ↓
   新的 AST
      ↓
  ┌─────────────┐
  │  Generator  │  生成目标代码
  │ (生成器)     │
  └─────────────┘
      ↓
  目标代码 (Target Code)
```

### Transformer 的作用

Transformer 是构建工具链的**核心环节**，几乎所有的代码处理工作都在这个阶段完成：

| 应用场景 | 示例 | 工具 |
|---------|------|------|
| **语法降级** | ES6+ → ES5 | `@babel/preset-env` |
| **语言转换** | TypeScript → JavaScript | `@babel/preset-typescript` |
| **框架支持** | JSX → JS | `@babel/plugin-transform-react-jsx` |
| **代码优化** | 移除死代码、常量折叠 | `babel-plugin-transform-remove-console` |
| **代码注入** | 自动埋点、性能监控 | 自定义插件 |
| **国际化** | 提取文本、替换占位符 | `babel-plugin-react-intl` |

---

## 核心概念

### 1. AST 转换的三种操作

Transformer 对 AST 的操作可以归纳为三种：

#### 1.1 删除节点（Remove）

**用途**：移除不需要的代码

**示例**：移除 `console.log` 语句

```javascript
// 输入
console.log('debug');
const x = 1;

// AST 操作：删除 ExpressionStatement 节点
path.remove();

// 输出
const x = 1;
```

**实现**：
```javascript
visitor: {
  CallExpression(path) {
    // 判断是否是 console.log
    if (
      path.node.callee.type === 'MemberExpression' &&
      path.node.callee.object.name === 'console'
    ) {
      // 删除整个表达式语句
      path.parentPath.remove();
    }
  }
}
```

---

#### 1.2 修改节点（Modify）

**用途**：修改现有节点的属性

**示例**：将所有变量名改为大写

```javascript
// 输入
const userName = 'Alice';

// AST 操作：修改 Identifier 的 name 属性
path.node.name = path.node.name.toUpperCase();

// 输出
const USERNAME = 'Alice';
```

**实现**：
```javascript
visitor: {
  Identifier(path) {
    // 修改标识符名称
    path.node.name = path.node.name.toUpperCase();
  }
}
```

---

#### 1.3 替换节点（Replace）

**用途**：用新节点替换旧节点

**示例**：箭头函数 → 普通函数

```javascript
// 输入
const add = (a, b) => a + b;

// AST 操作：替换 ArrowFunctionExpression 为 FunctionExpression
path.replaceWith(
  t.functionExpression(
    null,
    params,
    blockStatement
  )
);

// 输出
const add = function(a, b) {
  return a + b;
};
```

**实现**：
```javascript
visitor: {
  ArrowFunctionExpression(path) {
    const { params, body } = path.node;
    
    // 处理表达式体：a + b → { return a + b; }
    const blockBody = t.isBlockStatement(body)
      ? body
      : t.blockStatement([t.returnStatement(body)]);
    
    // 替换为普通函数
    path.replaceWith(
      t.functionExpression(null, params, blockBody)
    );
  }
}
```

---

### 2. Visitor 模式（访问者模式）

Transformer 使用 **Visitor 模式** 遍历 AST。

#### 什么是 Visitor？

Visitor 是一个对象，包含了不同节点类型的处理函数：

```javascript
const visitor = {
  // 访问所有 Identifier 节点
  Identifier(path) {
    console.log('Found identifier:', path.node.name);
  },
  
  // 访问所有 FunctionDeclaration 节点
  FunctionDeclaration(path) {
    console.log('Found function:', path.node.id.name);
  }
};
```

#### 遍历时机

每个节点会被访问**两次**：
1. **进入时（enter）**：从父节点往下遍历时
2. **退出时（exit）**：从子节点往上返回时

```javascript
visitor: {
  // 简写形式：默认是 enter
  FunctionDeclaration(path) {
    // 进入时执行
  },
  
  // 完整形式：指定 enter 和 exit
  FunctionDeclaration: {
    enter(path) {
      console.log('Entering function');
    },
    exit(path) {
      console.log('Exiting function');
    }
  }
}
```

**遍历顺序示例**：

```javascript
// 代码
function outer() {
  function inner() {
    return 1;
  }
}

// 遍历顺序（深度优先）
1. enter outer
2.   enter inner
3.     enter return statement
4.     exit return statement
5.   exit inner
6. exit outer
```

---

### 3. Path 对象

在 Visitor 中，我们操作的不是直接的 AST 节点，而是 **Path 对象**。

#### Path 是什么？

Path 是对 AST 节点的**包装**，提供了丰富的操作方法和上下文信息。

```javascript
path = {
  node: Node,           // 当前 AST 节点
  parent: Node,         // 父节点
  parentPath: Path,     // 父 Path
  scope: Scope,         // 作用域信息
  context: Context,     // 上下文
  // ... 以及各种操作方法
}
```

#### 常用 Path API

##### 1. 节点访问

```javascript
path.node           // 当前节点
path.parent         // 父节点
path.parentPath     // 父 Path
path.getSibling(0)  // 获取兄弟节点
path.get('body')    // 获取子节点的 Path
```

##### 2. 节点操作

```javascript
// 替换节点
path.replaceWith(newNode);
path.replaceWithMultiple([node1, node2]);

// 删除节点
path.remove();

// 插入节点
path.insertBefore(newNode);
path.insertAfter(newNode);
```

##### 3. 节点判断

```javascript
path.isIdentifier();           // 是否是 Identifier
path.isFunctionDeclaration();  // 是否是函数声明
path.isArrowFunctionExpression(); // 是否是箭头函数

// 带条件的判断
path.isIdentifier({ name: 'x' }); // 是否是名为 'x' 的标识符
```

##### 4. 作用域操作

```javascript
path.scope.hasBinding('x');     // 是否有绑定 x
path.scope.getBinding('x');     // 获取变量 x 的绑定信息
path.scope.rename('x', 'y');    // 重命名变量 x 为 y
path.scope.generateUidIdentifier('temp'); // 生成唯一标识符
```

##### 5. 遍历控制

```javascript
path.skip();      // 跳过当前节点的子节点
path.stop();      // 停止整个遍历
```

---

### 4. @babel/types 工具库

`@babel/types` 提供了创建和判断 AST 节点的工具函数。

#### 节点创建

```javascript
const t = require('@babel/types');

// 创建标识符
t.identifier('myVar');
// → { type: 'Identifier', name: 'myVar' }

// 创建数字字面量
t.numericLiteral(42);
// → { type: 'NumericLiteral', value: 42 }

// 创建函数调用
t.callExpression(
  t.identifier('console.log'),
  [t.stringLiteral('hello')]
);
// → console.log('hello')

// 创建函数声明
t.functionDeclaration(
  t.identifier('add'),               // 函数名
  [t.identifier('a'), t.identifier('b')], // 参数
  t.blockStatement([                 // 函数体
    t.returnStatement(
      t.binaryExpression('+', t.identifier('a'), t.identifier('b'))
    )
  ])
);
// → function add(a, b) { return a + b; }
```

#### 节点判断

```javascript
// 判断节点类型
t.isIdentifier(node);
t.isCallExpression(node);
t.isFunctionDeclaration(node);

// 带条件的判断
t.isIdentifier(node, { name: 'console' });
t.isMemberExpression(node, { 
  object: { name: 'console' },
  property: { name: 'log' }
});
```

#### 常用节点类型

| 类型 | 创建方法 | 说明 |
|------|---------|------|
| `Identifier` | `t.identifier('x')` | 标识符 |
| `NumericLiteral` | `t.numericLiteral(42)` | 数字 |
| `StringLiteral` | `t.stringLiteral('hello')` | 字符串 |
| `BooleanLiteral` | `t.booleanLiteral(true)` | 布尔值 |
| `CallExpression` | `t.callExpression(callee, args)` | 函数调用 |
| `MemberExpression` | `t.memberExpression(object, property)` | 成员访问 |
| `BinaryExpression` | `t.binaryExpression('+', left, right)` | 二元运算 |
| `FunctionDeclaration` | `t.functionDeclaration(id, params, body)` | 函数声明 |
| `VariableDeclaration` | `t.variableDeclaration('const', [declarator])` | 变量声明 |
| `ReturnStatement` | `t.returnStatement(argument)` | return 语句 |
| `BlockStatement` | `t.blockStatement([statements])` | 代码块 |

---

## 实战示例：手写简单转换器

### 示例 1: 移除 console.log

```javascript
const babel = require('@babel/core');
const t = require('@babel/types');

const code = `
  console.log('debug');
  const x = 1;
  console.warn('warning');
`;

// 定义转换插件
const removeConsolePlugin = {
  visitor: {
    CallExpression(path) {
      const { callee } = path.node;
      
      // 判断是否是 console.xxx 调用
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object, { name: 'console' })
      ) {
        // 删除整个表达式语句
        path.parentPath.remove();
      }
    }
  }
};

// 执行转换
const result = babel.transformSync(code, {
  plugins: [removeConsolePlugin]
});

console.log(result.code);
// 输出: const x = 1;
```

---

### 示例 2: 箭头函数转换

```javascript
const arrowToFunctionPlugin = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { params, body } = path.node;
      
      // 处理表达式体：a + b → { return a + b; }
      let blockBody;
      if (t.isBlockStatement(body)) {
        blockBody = body;
      } else {
        blockBody = t.blockStatement([
          t.returnStatement(body)
        ]);
      }
      
      // 替换为普通函数表达式
      path.replaceWith(
        t.functionExpression(
          null,      // 匿名函数
          params,    // 参数列表
          blockBody  // 函数体
        )
      );
    }
  }
};

const code = `
  const add = (a, b) => a + b;
  const greet = name => {
    return 'Hello ' + name;
  };
`;

const result = babel.transformSync(code, {
  plugins: [arrowToFunctionPlugin]
});

console.log(result.code);
// 输出:
// const add = function(a, b) {
//   return a + b;
// };
// const greet = function(name) {
//   return 'Hello ' + name;
// };
```

---

### 示例 3: 变量重命名

```javascript
const renamePlugin = {
  visitor: {
    Identifier(path) {
      // 只重命名变量声明和引用，不重命名属性名
      if (path.isReferencedIdentifier()) {
        // 将所有 'oldName' 重命名为 'newName'
        if (path.node.name === 'oldName') {
          path.node.name = 'newName';
        }
      }
    }
  }
};

const code = `
  const oldName = 1;
  console.log(oldName);
  const obj = { oldName: 2 }; // 属性名不变
`;

const result = babel.transformSync(code, {
  plugins: [renamePlugin]
});

console.log(result.code);
// 输出:
// const newName = 1;
// console.log(newName);
// const obj = { oldName: 2 }; // 属性名保持不变
```

---

## Transformer 的执行流程

### 完整流程

```
1. 解析（Parse）
   ├─ 词法分析：代码 → Tokens
   └─ 语法分析：Tokens → AST

2. 转换（Transform）
   ├─ 创建 Visitor
   ├─ 深度优先遍历 AST
   ├─ 每个节点调用对应的 Visitor 方法
   ├─ 在 Visitor 中修改/删除/替换节点
   └─ 返回新的 AST

3. 生成（Generate）
   └─ AST → 目标代码
```

### 遍历算法（深度优先）

```javascript
function traverse(node, visitor) {
  // 1. 进入节点（enter）
  if (visitor[node.type]?.enter) {
    visitor[node.type].enter(path);
  }
  
  // 2. 递归遍历子节点
  for (let key in node) {
    if (Array.isArray(node[key])) {
      node[key].forEach(child => {
        if (isNode(child)) {
          traverse(child, visitor);
        }
      });
    } else if (isNode(node[key])) {
      traverse(node[key], visitor);
    }
  }
  
  // 3. 退出节点（exit）
  if (visitor[node.type]?.exit) {
    visitor[node.type].exit(path);
  }
}
```

---

## 常见转换场景

### 1. 语法降级（Downleveling）

将新语法转换为旧语法，以兼容老版本浏览器。

**示例**：
```javascript
// ES6+ 语法
const [a, b] = [1, 2];
const obj = { x, y };
class MyClass extends Base {}

// 转换为 ES5
var _slicedToArray = ...;
var _createClass = ...;

var ref = [1, 2];
var a = ref[0];
var b = ref[1];

var obj = { x: x, y: y };

var MyClass = function(_Base) {
  _inherits(MyClass, _Base);
  // ...
}
```

---

### 2. 代码优化（Optimization）

**常量折叠**：
```javascript
// 输入
const x = 1 + 2;

// 优化后
const x = 3;
```

**死代码消除**：
```javascript
// 输入
if (false) {
  console.log('never');
}

// 优化后
// （整个 if 块被移除）
```

---

### 3. 代码注入（Injection）

**自动埋点**：
```javascript
// 输入
function login(user) {
  // 业务逻辑
}

// 转换后（自动注入埋点代码）
function login(user) {
  track('function_call', 'login', user);
  // 业务逻辑
}
```

---

## 性能优化建议

### 1. 避免不必要的遍历

```javascript
// ❌ 不好：每个节点都会被访问
visitor: {
  Program(path) {
    path.traverse({
      Identifier(innerPath) {
        // ...
      }
    });
  }
}

// ✅ 更好：直接在顶层 visitor 中处理
visitor: {
  Identifier(path) {
    // ...
  }
}
```

---

### 2. 使用 path.skip() 跳过子节点

```javascript
visitor: {
  FunctionDeclaration(path) {
    // 处理完后跳过子节点
    doSomething();
    path.skip();
  }
}
```

---

### 3. 缓存节点查询结果

```javascript
// ❌ 不好：重复查询
visitor: {
  CallExpression(path) {
    if (path.get('callee').isIdentifier({ name: 'foo' })) {
      // path.get('callee') 被调用多次
      const callee = path.get('callee');
      // ...
    }
  }
}

// ✅ 更好：缓存查询结果
visitor: {
  CallExpression(path) {
    const callee = path.get('callee');
    if (callee.isIdentifier({ name: 'foo' })) {
      // 使用缓存的 callee
    }
  }
}
```

---

## 调试技巧

### 1. 打印 AST 结构

```javascript
visitor: {
  Program(path) {
    console.log(JSON.stringify(path.node, null, 2));
  }
}
```

---

### 2. 打印节点类型

```javascript
visitor: {
  enter(path) {
    console.log('Visiting:', path.node.type);
  }
}
```

---

### 3. 使用 AST Explorer

在 [AST Explorer](https://astexplorer.net/) 中：
1. 选择 Parser: `@babel/parser`
2. 选择 Transform: `babelv7`
3. 在线编写和调试插件

---

## 总结

### 核心要点

1. **Transformer 是编译器的核心**
   - 位于 Parse 和 Generate 之间
   - 负责 AST 的修改、优化、转换

2. **三种基本操作**
   - 删除节点（Remove）
   - 修改节点（Modify）
   - 替换节点（Replace）

3. **Visitor 模式**
   - 用于遍历 AST
   - 支持 enter 和 exit 两个时机
   - 深度优先遍历

4. **Path 对象**
   - AST 节点的包装
   - 提供丰富的操作 API
   - 包含作用域信息

5. **@babel/types 工具库**
   - 创建节点：`t.identifier()`、`t.callExpression()` 等
   - 判断节点：`t.isIdentifier()`、`t.isCallExpression()` 等

---

### 下一步

掌握了 Transformer 的基础概念后，接下来学习：
- **Babel 插件系统**：深入理解 Babel 插件的工作原理
- **手写 Babel 插件**：编写实用的自定义插件
- **常见代码转换**：学习 JSX、TypeScript 等转换的实现原理

**继续阅读**: `02-babel-plugin-system.md` 📖

