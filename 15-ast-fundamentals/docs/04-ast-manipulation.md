# AST 操作

## 📖 概述

本文深入讲解如何操作 AST，包括查询、修改、删除、插入节点，以及使用 `@babel/types` 创建新节点。

---

## 🎯 AST 操作的核心场景

### 1. 代码转换

**箭头函数 → 普通函数：**
```javascript
// 输入
const add = (a, b) => a + b;

// 输出
const add = function(a, b) {
  return a + b;
};
```

### 2. 代码优化

**移除 debugger：**
```javascript
// 输入
function calculate() {
  debugger;  // ← 移除这个
  return 1 + 2;
}

// 输出
function calculate() {
  return 1 + 2;
}
```

### 3. 代码插桩

**自动添加日志：**
```javascript
// 输入
function handleClick() {
  // 业务逻辑
}

// 输出
function handleClick() {
  console.log('[ENTER] handleClick');  // ← 自动插入
  // 业务逻辑
  console.log('[EXIT] handleClick');   // ← 自动插入
}
```

---

## 🔍 查询节点

### 1. path.find()

向上查找满足条件的节点（包括自己）。

```javascript
Identifier(path) {
  // 查找最近的函数
  const functionParent = path.find((p) => {
    return p.isFunctionDeclaration() || p.isArrowFunctionExpression();
  });
  
  if (functionParent) {
    console.log('所属函数:', functionParent.node);
  }
}
```

### 2. path.findParent()

向上查找满足条件的父节点（不包括自己）。

```javascript
Identifier(path) {
  // 查找最近的代码块
  const blockParent = path.findParent((p) => p.isBlockStatement());
  
  if (blockParent) {
    console.log('所属代码块:', blockParent.node);
  }
}
```

### 3. path.get()

获取子节点的 Path。

```javascript
VariableDeclaration(path) {
  // 获取第一个声明
  const firstDeclarator = path.get('declarations.0');
  
  // 获取变量名
  const idPath = firstDeclarator.get('id');
  console.log('变量名:', idPath.node.name);
  
  // 获取初始值
  const initPath = firstDeclarator.get('init');
  console.log('初始值:', initPath.node);
}
```

### 4. path.getSibling()

获取兄弟节点。

```javascript
VariableDeclaration(path) {
  // 获取父节点的 body 数组
  const body = path.parent.body;
  const index = body.indexOf(path.node);
  
  // 获取下一个兄弟节点
  const nextSibling = path.getSibling(index + 1);
  console.log('下一个语句:', nextSibling.node);
}
```

---

## ✏️ 修改节点

### 1. path.replaceWith()

替换当前节点。

**示例 1：箭头函数转普通函数**

```javascript
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const visitor = {
  ArrowFunctionExpression(path) {
    const { params, body } = path.node;
    
    // 创建函数体（如果原来是表达式，转为 return 语句）
    let functionBody;
    if (t.isExpression(body)) {
      functionBody = t.blockStatement([
        t.returnStatement(body)
      ]);
    } else {
      functionBody = body;
    }
    
    // 创建普通函数表达式
    const functionExpression = t.functionExpression(
      null,           // id (匿名函数)
      params,         // 参数
      functionBody    // 函数体
    );
    
    // 替换节点
    path.replaceWith(functionExpression);
  }
};
```

**转换：**
```javascript
// 输入
const add = (a, b) => a + b;

// 输出
const add = function(a, b) {
  return a + b;
};
```

**示例 2：const 转 var**

```javascript
const visitor = {
  VariableDeclaration(path) {
    if (path.node.kind === 'const') {
      path.node.kind = 'var';  // 直接修改属性
    }
  }
};
```

**转换：**
```javascript
// 输入
const x = 1;

// 输出
var x = 1;
```

### 2. path.replaceWithMultiple()

用多个节点替换当前节点。

```javascript
ReturnStatement(path) {
  const returnValue = path.node.argument;
  
  // 替换为 console.log + return
  path.replaceWithMultiple([
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier('console'),
          t.identifier('log')
        ),
        [t.stringLiteral('returning:'), returnValue]
      )
    ),
    t.returnStatement(returnValue)
  ]);
}
```

**转换：**
```javascript
// 输入
function add(a, b) {
  return a + b;
}

// 输出
function add(a, b) {
  console.log('returning:', a + b);
  return a + b;
}
```

### 3. path.replaceWithSourceString()

用源代码字符串替换节点（会先解析成 AST）。

```javascript
ReturnStatement(path) {
  path.replaceWithSourceString('return 42;');
}
```

---

## 🗑️ 删除节点

### 1. path.remove()

删除当前节点。

**示例：移除所有 console.log**

```javascript
const visitor = {
  CallExpression(path) {
    const { callee } = path.node;
    
    // 检查是否是 console.log
    if (
      t.isMemberExpression(callee) &&
      callee.object.name === 'console' &&
      callee.property.name === 'log'
    ) {
      path.remove();
    }
  }
};
```

**转换：**
```javascript
// 输入
function test() {
  console.log('debug');
  const x = 1;
  console.log(x);
  return x;
}

// 输出
function test() {
  const x = 1;
  return x;
}
```

**示例：移除所有 debugger**

```javascript
const visitor = {
  DebuggerStatement(path) {
    path.remove();
  }
};
```

**转换：**
```javascript
// 输入
function calculate() {
  debugger;
  return 1 + 2;
}

// 输出
function calculate() {
  return 1 + 2;
}
```

---

## ➕ 插入节点

### 1. path.insertBefore()

在当前节点前插入。

```javascript
ReturnStatement(path) {
  // 在 return 前插入 console.log
  path.insertBefore(
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier('console'),
          t.identifier('log')
        ),
        [t.stringLiteral('before return')]
      )
    )
  );
}
```

**转换：**
```javascript
// 输入
function test() {
  return 42;
}

// 输出
function test() {
  console.log('before return');
  return 42;
}
```

### 2. path.insertAfter()

在当前节点后插入。

```javascript
VariableDeclaration(path) {
  // 在变量声明后插入 console.log
  path.insertAfter(
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier('console'),
          t.identifier('log')
        ),
        [path.node.declarations[0].id]
      )
    )
  );
}
```

**转换：**
```javascript
// 输入
const x = 1;

// 输出
const x = 1;
console.log(x);
```

### 3. path.unshiftContainer() / path.pushContainer()

在数组属性的开头/结尾插入。

```javascript
FunctionDeclaration(path) {
  // 在函数体开头插入语句
  path.get('body').unshiftContainer(
    'body',
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier('console'),
          t.identifier('log')
        ),
        [t.stringLiteral('ENTER')]
      )
    )
  );
  
  // 在函数体结尾插入语句（return 之前）
  const body = path.get('body').get('body');
  const lastStatement = body[body.length - 1];
  
  if (!lastStatement.isReturnStatement()) {
    path.get('body').pushContainer(
      'body',
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier('console'),
            t.identifier('log')
          ),
          [t.stringLiteral('EXIT')]
        )
      )
    );
  }
}
```

**转换：**
```javascript
// 输入
function test() {
  const x = 1;
  const y = 2;
}

// 输出
function test() {
  console.log('ENTER');
  const x = 1;
  const y = 2;
  console.log('EXIT');
}
```

---

## 🏗️ 创建节点：@babel/types

`@babel/types` 提供了创建所有类型 AST 节点的方法。

### 1. 安装

```bash
npm install @babel/types
```

```javascript
const t = require('@babel/types');
```

### 2. 常用节点创建方法

#### 标识符和字面量

```javascript
// Identifier: x
const id = t.identifier('x');

// NumericLiteral: 42
const num = t.numericLiteral(42);

// StringLiteral: "hello"
const str = t.stringLiteral('hello');

// BooleanLiteral: true
const bool = t.booleanLiteral(true);

// NullLiteral: null
const nullLit = t.nullLiteral();
```

#### 表达式

```javascript
// BinaryExpression: a + b
const binary = t.binaryExpression(
  '+',
  t.identifier('a'),
  t.identifier('b')
);

// CallExpression: fn(1, 2)
const call = t.callExpression(
  t.identifier('fn'),
  [t.numericLiteral(1), t.numericLiteral(2)]
);

// MemberExpression: obj.prop
const member = t.memberExpression(
  t.identifier('obj'),
  t.identifier('prop')
);

// MemberExpression: obj['key']
const computed = t.memberExpression(
  t.identifier('obj'),
  t.stringLiteral('key'),
  true  // computed
);
```

#### 语句

```javascript
// ExpressionStatement: fn();
const exprStmt = t.expressionStatement(
  t.callExpression(t.identifier('fn'), [])
);

// VariableDeclaration: const x = 1;
const varDecl = t.variableDeclaration(
  'const',
  [
    t.variableDeclarator(
      t.identifier('x'),
      t.numericLiteral(1)
    )
  ]
);

// ReturnStatement: return x;
const returnStmt = t.returnStatement(
  t.identifier('x')
);

// IfStatement: if (x > 0) { ... }
const ifStmt = t.ifStatement(
  t.binaryExpression('>', t.identifier('x'), t.numericLiteral(0)),
  t.blockStatement([
    // consequent body
  ]),
  t.blockStatement([
    // alternate body
  ])
);
```

#### 函数

```javascript
// FunctionDeclaration: function add(a, b) { return a + b; }
const funcDecl = t.functionDeclaration(
  t.identifier('add'),               // id
  [t.identifier('a'), t.identifier('b')],  // params
  t.blockStatement([                 // body
    t.returnStatement(
      t.binaryExpression('+', t.identifier('a'), t.identifier('b'))
    )
  ])
);

// ArrowFunctionExpression: (a, b) => a + b
const arrowFunc = t.arrowFunctionExpression(
  [t.identifier('a'), t.identifier('b')],
  t.binaryExpression('+', t.identifier('a'), t.identifier('b'))
);
```

### 3. 节点验证方法

`@babel/types` 提供了验证节点类型的方法：

```javascript
const node = t.identifier('x');

t.isIdentifier(node);           // true
t.isNumericLiteral(node);       // false
t.isNode(node);                 // true

// 验证节点并检查属性
t.isIdentifier(node, { name: 'x' });     // true
t.isIdentifier(node, { name: 'y' });     // false
```

---

## 🔄 Scope 和 Binding 操作

### 1. scope.rename()

重命名变量（包括所有引用）。

```javascript
FunctionDeclaration(path) {
  // 重命名参数 'a' 为 'x'
  path.scope.rename('a', 'x');
}
```

**转换：**
```javascript
// 输入
function add(a, b) {
  return a + b;
}

// 输出
function add(x, b) {
  return x + b;
}
```

### 2. scope.generateUidIdentifier()

生成唯一的标识符（避免命名冲突）。

```javascript
FunctionDeclaration(path) {
  // 生成唯一的变量名
  const uid = path.scope.generateUidIdentifier('temp');
  console.log(uid.name);  // '_temp', '_temp2', ...
}
```

### 3. binding.referencePaths

获取变量的所有引用位置。

```javascript
VariableDeclarator(path) {
  const name = path.node.id.name;
  const binding = path.scope.getBinding(name);
  
  if (binding) {
    console.log(`变量 ${name} 的引用位置:`);
    binding.referencePaths.forEach((refPath) => {
      console.log('  行号:', refPath.node.loc.start.line);
    });
  }
}
```

---

## 💡 实战示例

### 示例 1：移除未使用的变量

```javascript
const visitor = {
  VariableDeclarator(path) {
    const name = path.node.id.name;
    const binding = path.scope.getBinding(name);
    
    // 如果变量未被引用，删除声明
    if (binding && !binding.referenced) {
      path.remove();
    }
  }
};
```

**转换：**
```javascript
// 输入
function test() {
  const used = 1;
  const unused = 2;  // ← 未使用
  return used;
}

// 输出
function test() {
  const used = 1;
  return used;
}
```

### 示例 2：自动添加 use strict

```javascript
const visitor = {
  Program(path) {
    // 检查是否已有 'use strict'
    const firstNode = path.node.body[0];
    const hasUseStrict =
      firstNode &&
      t.isExpressionStatement(firstNode) &&
      t.isStringLiteral(firstNode.expression, { value: 'use strict' });
    
    if (!hasUseStrict) {
      // 在开头插入 'use strict'
      path.unshiftContainer(
        'body',
        t.expressionStatement(t.stringLiteral('use strict'))
      );
    }
  }
};
```

**转换：**
```javascript
// 输入
function test() {
  return 1;
}

// 输出
'use strict';

function test() {
  return 1;
}
```

### 示例 3：自动添加 try-catch

```javascript
const visitor = {
  FunctionDeclaration(path) {
    const body = path.node.body.body;
    
    // 如果函数体不是 try-catch，包裹它
    if (body.length > 0 && !t.isTryStatement(body[0])) {
      const tryStatement = t.tryStatement(
        t.blockStatement(body),      // try body
        t.catchClause(
          t.identifier('error'),     // catch (error)
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(
                  t.identifier('console'),
                  t.identifier('error')
                ),
                [t.identifier('error')]
              )
            )
          ])
        )
      );
      
      path.get('body').replaceWith(
        t.blockStatement([tryStatement])
      );
    }
  }
};
```

**转换：**
```javascript
// 输入
function test() {
  const x = 1;
  return x;
}

// 输出
function test() {
  try {
    const x = 1;
    return x;
  } catch (error) {
    console.error(error);
  }
}
```

### 示例 4：国际化转换

```javascript
const visitor = {
  StringLiteral(path) {
    const { value } = path.node;
    
    // 如果是中文字符串，转换为 t() 调用
    if (/[\u4e00-\u9fa5]/.test(value)) {
      path.replaceWith(
        t.callExpression(
          t.identifier('t'),
          [t.stringLiteral(value)]
        )
      );
    }
  }
};
```

**转换：**
```javascript
// 输入
const message = '你好，世界';

// 输出
const message = t('你好，世界');
```

### 示例 5：自动埋点

```javascript
const visitor = {
  FunctionDeclaration(path) {
    const functionName = path.node.id.name;
    
    // 在函数开头插入埋点代码
    path.get('body').unshiftContainer(
      'body',
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier('__tracker__'),
            t.identifier('track')
          ),
          [
            t.stringLiteral(functionName),
            t.objectExpression([
              t.objectProperty(
                t.identifier('timestamp'),
                t.callExpression(
                  t.memberExpression(
                    t.identifier('Date'),
                    t.identifier('now')
                  ),
                  []
                )
              )
            ])
          ]
        )
      )
    );
  }
};
```

**转换：**
```javascript
// 输入
function handleClick() {
  console.log('clicked');
}

// 输出
function handleClick() {
  __tracker__.track('handleClick', { timestamp: Date.now() });
  console.log('clicked');
}
```

---

## ⚠️ 注意事项

### 1. 修改后需要更新引用

某些操作会使 Path 失效，需要重新获取：

```javascript
VariableDeclaration(path) {
  // 修改节点
  path.node.kind = 'var';
  
  // 如果需要继续操作，可能需要重新获取
  // path = path.parentPath.get('...');
}
```

### 2. 避免无限循环

插入节点时要小心，避免创建无限循环：

```javascript
// ❌ 错误：会无限插入
FunctionDeclaration(path) {
  path.insertBefore(
    t.functionDeclaration(
      t.identifier('fn'),
      [],
      t.blockStatement([])
    )
  );
}

// ✅ 正确：添加条件判断
FunctionDeclaration(path) {
  if (!path.node.__processed) {
    path.node.__processed = true;
    path.insertBefore(
      t.functionDeclaration(
        t.identifier('fn'),
        [],
        t.blockStatement([])
      )
    );
  }
}
```

### 3. 保持 AST 的有效性

确保修改后的 AST 是有效的 JavaScript：

```javascript
// ❌ 错误：return 在函数外
Program(path) {
  path.pushContainer(
    'body',
    t.returnStatement(t.numericLiteral(42))  // 不能在顶层 return
  );
}
```

---

## 🎓 关键要点总结

1. **查询节点**：
   - `path.find()`, `path.findParent()`
   - `path.get()`, `path.getSibling()`

2. **修改节点**：
   - `path.replaceWith()`
   - `path.replaceWithMultiple()`
   - 直接修改属性：`path.node.kind = 'var'`

3. **删除节点**：
   - `path.remove()`

4. **插入节点**：
   - `path.insertBefore()`, `path.insertAfter()`
   - `path.unshiftContainer()`, `path.pushContainer()`

5. **创建节点**：
   - 使用 `@babel/types`：`t.identifier()`, `t.functionDeclaration()`, ...
   - 100+ 种节点类型

6. **Scope 操作**：
   - `scope.rename()`
   - `scope.generateUidIdentifier()`
   - `binding.referencePaths`

---

## 🔗 下一步

理解了 AST 操作后，接下来学习：
- **05-ast-tools.md**：AST 工具和调试技巧
- **Demo 实践**：动手实现各种代码转换

**记住：熟练操作 AST 是构建工具开发的核心能力！** 🎉

