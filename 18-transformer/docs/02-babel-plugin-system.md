# Babel 插件系统详解

## Babel 插件是什么？

**Babel 插件**是一个函数，返回一个包含 `visitor` 对象的对象，用于在 Babel 编译过程中转换 AST。

### 最简单的 Babel 插件

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      Identifier(path) {
        console.log('Found identifier:', path.node.name);
      }
    }
  };
};
```

---

## Babel 编译流程

### 完整流程

```
┌──────────────────────────────────────────────────────────────┐
│                    Babel 编译流程                              │
└──────────────────────────────────────────────────────────────┘

源代码 (Input)
    ↓
┌─────────────┐
│  Parse      │  @babel/parser
│ (解析阶段)   │  词法分析 + 语法分析 → AST
└─────────────┘
    ↓
   AST
    ↓
┌─────────────┐
│ Transform   │  ← 插件在这里工作
│ (转换阶段)   │  @babel/traverse + 插件
└─────────────┘  遍历 AST，调用插件的 visitor
    ↓
  新的 AST
    ↓
┌─────────────┐
│ Generate    │  @babel/generator
│ (生成阶段)   │  AST → 目标代码 + Source Map
└─────────────┘
    ↓
目标代码 (Output)
```

### 插件的执行时机

插件在 **Transform 阶段**执行：

```javascript
// babel.transformSync() 的内部流程
function transform(code, options) {
  // 1. Parse: 解析代码为 AST
  const ast = parse(code, options);
  
  // 2. Transform: 执行插件
  const plugins = options.plugins || [];
  plugins.forEach(plugin => {
    traverse(ast, plugin.visitor);
  });
  
  // 3. Generate: 生成目标代码
  const output = generate(ast);
  
  return output;
}
```

---

## 插件的基本结构

### 标准结构

```javascript
module.exports = function(babel) {
  // babel 对象包含所有 Babel API
  const { types: t, template, traverse } = babel;
  
  return {
    // 插件名称（可选）
    name: 'my-plugin',
    
    // 插件初始化（可选）
    pre(state) {
      // 在遍历前执行一次
      this.cache = new Map();
    },
    
    // Visitor 对象（必需）
    visitor: {
      Identifier(path, state) {
        // 访问所有 Identifier 节点
      },
      
      FunctionDeclaration(path, state) {
        // 访问所有函数声明
      }
    },
    
    // 插件结束（可选）
    post(state) {
      // 在遍历后执行一次
      console.log('Plugin finished');
    }
  };
};
```

---

### 关键部分解析

#### 1. `babel` 参数

```javascript
function myPlugin(babel) {
  // babel.types - AST 节点工具
  const t = babel.types;
  
  // babel.template - 模板工具
  const template = babel.template;
  
  // babel.traverse - 遍历工具
  const traverse = babel.traverse;
  
  // babel.version - Babel 版本
  console.log(babel.version);
}
```

#### 2. `visitor` 对象

Visitor 是插件的核心，定义了如何处理不同类型的 AST 节点。

```javascript
visitor: {
  // 方式1：简写（默认是 enter）
  Identifier(path) {
    // 进入 Identifier 节点时执行
  },
  
  // 方式2：完整形式（指定 enter 和 exit）
  FunctionDeclaration: {
    enter(path) {
      // 进入函数声明时
    },
    exit(path) {
      // 退出函数声明时
    }
  },
  
  // 方式3：同时处理多种节点类型
  "FunctionDeclaration|FunctionExpression"(path) {
    // 处理函数声明和函数表达式
  }
}
```

#### 3. `path` 参数

Path 对象包含了节点及其上下文信息：

```javascript
visitor: {
  Identifier(path) {
    path.node;          // 当前 AST 节点
    path.parent;        // 父节点
    path.parentPath;    // 父 Path
    path.scope;         // 作用域信息
    path.hub;           // 根 Path
    path.context;       // 上下文
  }
}
```

#### 4. `state` 参数

State 对象包含插件选项和共享状态：

```javascript
visitor: {
  Identifier(path, state) {
    // 插件选项
    const options = state.opts;
    
    // 文件信息
    const filename = state.file.opts.filename;
    
    // 共享数据
    state.set('myData', value);
    const data = state.get('myData');
  }
}
```

---

## 插件配置和选项

### 传递选项给插件

```javascript
// .babelrc 或 babel.config.js
{
  "plugins": [
    // 无选项
    "plugin-a",
    
    // 带选项（数组形式）
    ["plugin-b", {
      "option1": true,
      "option2": "value"
    }]
  ]
}
```

### 在插件中访问选项

```javascript
module.exports = function(babel) {
  return {
    visitor: {
      Identifier(path, state) {
        // 访问插件选项
        const options = state.opts;
        
        if (options.option1) {
          // 使用选项
        }
      }
    }
  };
};
```

### 选项验证

```javascript
const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
  // 断言 Babel 版本
  api.assertVersion(7);
  
  // 设置默认选项
  const {
    loose = false,
    env = 'development'
  } = options;
  
  return {
    visitor: {
      // ...
    }
  };
});
```

---

## 插件执行顺序

### Plugin vs Preset

- **Plugin（插件）**：单个转换功能
- **Preset（预设）**：一组插件的集合

### 执行顺序规则

```
1. Plugin 从前往后执行
2. Preset 从后往前执行
3. Plugin 优先于 Preset 执行
```

**示例**：

```javascript
{
  "plugins": ["A", "B", "C"],
  "presets": ["X", "Y", "Z"]
}

// 执行顺序：
// 1. Plugin A
// 2. Plugin B
// 3. Plugin C
// 4. Preset Z  (注意：Preset 是反向执行)
// 5. Preset Y
// 6. Preset X
```

### 为什么 Preset 反向执行？

因为 Preset 通常是语法转换链，需要**从最新的语法开始转换**：

```javascript
{
  "presets": [
    "@babel/preset-env",      // ES5 转换
    "@babel/preset-typescript", // TS → JS
    "@babel/preset-react"      // JSX → JS
  ]
}

// 执行顺序：
// 1. JSX → JS      (React preset)
// 2. TS → JS       (TypeScript preset)
// 3. ES6+ → ES5    (Env preset)
```

---

## 常用 Visitor API

### 1. 节点判断

```javascript
visitor: {
  CallExpression(path) {
    // 判断节点类型
    if (path.node.callee.type === 'Identifier') {
      // ...
    }
    
    // 使用 types 工具判断
    const t = this.types;
    if (t.isIdentifier(path.node.callee)) {
      // ...
    }
    
    // 使用 Path 方法判断
    if (path.get('callee').isIdentifier()) {
      // ...
    }
    
    // 带条件判断
    if (path.get('callee').isIdentifier({ name: 'console' })) {
      // ...
    }
  }
}
```

---

### 2. 节点替换

```javascript
visitor: {
  NumericLiteral(path) {
    const { value } = path.node;
    
    // 替换为新节点
    path.replaceWith(
      t.numericLiteral(value * 2)
    );
    
    // 替换为多个节点
    path.replaceWithMultiple([
      t.expressionStatement(t.numericLiteral(value)),
      t.expressionStatement(t.stringLiteral('after'))
    ]);
    
    // 使用源字符串替换（template）
    const buildVariable = template(`
      const NAME = VALUE;
    `);
    
    path.replaceWith(
      buildVariable({
        NAME: t.identifier('x'),
        VALUE: t.numericLiteral(value)
      })
    );
  }
}
```

---

### 3. 节点插入

```javascript
visitor: {
  FunctionDeclaration(path) {
    const { id } = path.node;
    
    // 在前面插入
    path.insertBefore(
      t.expressionStatement(
        t.callExpression(
          t.identifier('console.log'),
          [t.stringLiteral(`Entering ${id.name}`)]
        )
      )
    );
    
    // 在后面插入
    path.insertAfter(
      t.expressionStatement(
        t.callExpression(
          t.identifier('console.log'),
          [t.stringLiteral(`Exiting ${id.name}`)]
        )
      )
    );
  }
}
```

---

### 4. 节点删除

```javascript
visitor: {
  CallExpression(path) {
    // 检查是否是 console.log
    if (
      path.get('callee').isMemberExpression() &&
      path.get('callee.object').isIdentifier({ name: 'console' })
    ) {
      // 删除整个语句
      path.parentPath.remove();
      
      // 或者只删除调用表达式
      path.remove();
    }
  }
}
```

---

### 5. 作用域操作

```javascript
visitor: {
  FunctionDeclaration(path) {
    const { id } = path.node;
    
    // 检查变量是否被绑定
    if (path.scope.hasBinding(id.name)) {
      console.log(`${id.name} is bound in this scope`);
    }
    
    // 获取变量绑定
    const binding = path.scope.getBinding(id.name);
    console.log('Binding:', binding);
    
    // 重命名变量
    path.scope.rename(id.name, 'newName');
    
    // 生成唯一标识符
    const uid = path.scope.generateUidIdentifier('temp');
    console.log('Unique ID:', uid.name); // _temp, _temp2, ...
  }
}
```

---

### 6. 遍历控制

```javascript
visitor: {
  FunctionDeclaration(path) {
    // 跳过子节点遍历
    path.skip();
    
    // 停止整个遍历
    path.stop();
    
    // 重新访问当前节点
    path.requeue();
  }
}
```

---

## 使用 @babel/template 简化节点创建

`@babel/template` 允许用字符串模板创建 AST 节点，比手动创建更简洁。

### 基本用法

```javascript
const template = require('@babel/template').default;

// 创建表达式模板
const buildVariable = template(`
  const %%name%% = %%value%%;
`);

// 使用模板
const ast = buildVariable({
  name: t.identifier('x'),
  value: t.numericLiteral(42)
});

// 等价于手动创建：
// t.variableDeclaration('const', [
//   t.variableDeclarator(
//     t.identifier('x'),
//     t.numericLiteral(42)
//   )
// ]);
```

---

### 不同类型的模板

```javascript
const template = require('@babel/template').default;

// 1. 表达式模板
const buildExpression = template.expression(`
  console.log(%%message%%)
`);

// 2. 语句模板
const buildStatement = template.statement(`
  if (%%condition%%) { %%consequent%% }
`);

// 3. 语句列表模板
const buildStatements = template.statements(`
  const x = 1;
  const y = 2;
`);

// 4. 程序模板
const buildProgram = template.program(`
  const greeting = "Hello";
  export default greeting;
`);
```

---

### 占位符语法

```javascript
// 1. %% 语法（推荐）
const build1 = template(`const %%name%% = %%value%%`);
build1({
  name: t.identifier('x'),
  value: t.numericLiteral(1)
});

// 2. $ 语法
const build2 = template(`const $name = $value`);
build2({
  name: t.identifier('x'),
  value: t.numericLiteral(1)
});

// 3. 字符串插值（简化）
const name = 'myVar';
const build3 = template(`const ${name} = VALUE`);
build3({ VALUE: t.numericLiteral(42) });
```

---

## 插件实战示例

### 示例 1: 自动添加函数性能监控

```javascript
module.exports = function(babel) {
  const { types: t, template } = babel;
  
  // 创建监控代码模板
  const buildMonitor = template(`
    const START_TIME = Date.now();
    try {
      %%body%%
    } finally {
      const END_TIME = Date.now();
      console.log('Function %%name%% took', END_TIME - START_TIME, 'ms');
    }
  `);
  
  return {
    visitor: {
      FunctionDeclaration(path) {
        const { id, body } = path.node;
        
        // 跳过已处理的函数
        if (path.node._monitored) return;
        
        // 生成唯一的时间变量名
        const startTime = path.scope.generateUidIdentifier('start');
        const endTime = path.scope.generateUidIdentifier('end');
        
        // 替换函数体
        const newBody = buildMonitor({
          START_TIME: startTime,
          END_TIME: endTime,
          name: t.stringLiteral(id.name),
          body: body.body
        });
        
        path.get('body').replaceWith(t.blockStatement(newBody));
        
        // 标记已处理
        path.node._monitored = true;
      }
    }
  };
};
```

**效果**：

```javascript
// 输入
function calculate(x) {
  return x * 2;
}

// 输出
function calculate(x) {
  const _start = Date.now();
  try {
    return x * 2;
  } finally {
    const _end = Date.now();
    console.log('Function calculate took', _end - _start, 'ms');
  }
}
```

---

### 示例 2: 按需加载插件（类似 babel-plugin-import）

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { opts } = state;
        const { source, specifiers } = path.node;
        
        // 只处理指定库的导入
        if (source.value !== opts.libraryName) {
          return;
        }
        
        // 转换命名导入
        const imports = specifiers
          .filter(spec => t.isImportSpecifier(spec))
          .map(spec => {
            const importedName = spec.imported.name;
            const localName = spec.local.name;
            
            // 生成新的导入语句
            return t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(localName))],
              t.stringLiteral(`${opts.libraryName}/lib/${importedName}`)
            );
          });
        
        // 替换原导入
        if (imports.length > 0) {
          path.replaceWithMultiple(imports);
        }
      }
    }
  };
};
```

**配置**：

```javascript
{
  "plugins": [
    ["./import-on-demand", {
      "libraryName": "antd"
    }]
  ]
}
```

**效果**：

```javascript
// 输入
import { Button, Select } from 'antd';

// 输出
import Button from 'antd/lib/Button';
import Select from 'antd/lib/Select';
```

---

### 示例 3: 自动 i18n 文本提取

```javascript
module.exports = function(babel) {
  const { types: t, template } = babel;
  
  return {
    pre() {
      // 初始化文本收集器
      this.texts = new Set();
    },
    
    visitor: {
      StringLiteral(path, state) {
        const { value } = path.node;
        
        // 跳过 import 语句中的字符串
        if (path.findParent(p => p.isImportDeclaration())) {
          return;
        }
        
        // 收集文本
        this.texts.add(value);
        
        // 生成唯一 key
        const key = `text_${this.texts.size}`;
        
        // 替换为 i18n 函数调用
        path.replaceWith(
          t.callExpression(
            t.identifier('t'),
            [t.stringLiteral(key)]
          )
        );
        
        // 记录映射关系
        state.file.metadata[key] = value;
      }
    },
    
    post(state) {
      // 输出收集的文本
      console.log('Collected texts:', Array.from(this.texts));
    }
  };
};
```

**效果**：

```javascript
// 输入
const msg = "Hello World";
console.log("Debug message");

// 输出
const msg = t("text_1");
console.log(t("text_2"));

// 同时生成映射：
// {
//   "text_1": "Hello World",
//   "text_2": "Debug message"
// }
```

---

## 插件测试

### 使用 babel-plugin-tester

```javascript
const pluginTester = require('babel-plugin-tester');
const myPlugin = require('./my-plugin');

pluginTester({
  plugin: myPlugin,
  pluginName: 'my-plugin',
  tests: [
    {
      title: '移除 console.log',
      code: `
        console.log('test');
        const x = 1;
      `,
      output: `
        const x = 1;
      `
    },
    {
      title: '保留其他 console 方法',
      code: `
        console.warn('warning');
      `,
      output: `
        console.warn('warning');
      `
    }
  ]
});
```

---

### 手动测试

```javascript
const babel = require('@babel/core');
const myPlugin = require('./my-plugin');

const code = `
  const x = 1;
  console.log(x);
`;

const result = babel.transformSync(code, {
  plugins: [myPlugin]
});

console.log(result.code);
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

### 2. 打印节点路径

```javascript
visitor: {
  enter(path) {
    console.log('Visiting:', path.type, path.node.type);
  }
}
```

---

### 3. 使用 debugger

```javascript
visitor: {
  Identifier(path) {
    if (path.node.name === 'target') {
      debugger; // 在此处断点
    }
  }
}
```

---

### 4. 使用 VSCode 调试

在 `.vscode/launch.json` 中配置：

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Babel Plugin",
  "program": "${workspaceFolder}/test.js",
  "skipFiles": ["<node_internals>/**"]
}
```

---

## 最佳实践

### 1. 插件应该是纯函数

```javascript
// ❌ 不好：有副作用
let counter = 0;

module.exports = function() {
  return {
    visitor: {
      Identifier() {
        counter++; // 副作用：修改外部变量
      }
    }
  };
};

// ✅ 更好：使用 state
module.exports = function() {
  return {
    pre() {
      this.counter = 0;
    },
    visitor: {
      Identifier() {
        this.counter++;
      }
    }
  };
};
```

---

### 2. 避免在 visitor 中创建新的 visitor

```javascript
// ❌ 不好：性能差
visitor: {
  FunctionDeclaration(path) {
    path.traverse({
      Identifier(innerPath) {
        // ...
      }
    });
  }
}

// ✅ 更好：在顶层处理
visitor: {
  Identifier(path) {
    if (path.getFunctionParent()) {
      // ...
    }
  }
}
```

---

### 3. 使用 path.skip() 优化性能

```javascript
visitor: {
  CallExpression(path) {
    const callee = path.get('callee');
    
    if (!callee.isIdentifier({ name: 'myFunc' })) {
      path.skip(); // 跳过不相关的节点
      return;
    }
    
    // 处理 myFunc 调用
  }
}
```

---

### 4. 正确处理作用域

```javascript
visitor: {
  VariableDeclaration(path) {
    const binding = path.scope.getBinding('x');
    
    if (binding) {
      // 检查是否被引用
      if (!binding.referenced) {
        // 未使用的变量，可以删除
        path.remove();
      }
    }
  }
}
```

---

## 总结

### 核心要点

1. **Babel 插件是函数**
   - 返回包含 `visitor` 对象的对象
   - 在 Transform 阶段执行

2. **插件执行顺序**
   - Plugin 从前往后
   - Preset 从后往前
   - Plugin 优先于 Preset

3. **Visitor 模式**
   - 定义不同节点的处理函数
   - 支持 enter 和 exit
   - 接收 path 和 state 参数

4. **常用 API**
   - Path: `replaceWith()`, `remove()`, `insertBefore()`, `skip()`
   - Types: `t.identifier()`, `t.callExpression()`, `t.isXxx()`
   - Template: 用字符串创建 AST

5. **最佳实践**
   - 插件应该是纯函数
   - 避免嵌套 traverse
   - 使用 skip() 优化性能
   - 正确处理作用域

---

### 下一步

掌握了 Babel 插件系统后，接下来学习：
- **手写 Babel 插件**：编写实用的自定义插件
- **常见代码转换**：学习 JSX、TypeScript 等转换的实现
- **高级转换技巧**：作用域处理、性能优化

**继续阅读**: `03-write-babel-plugin.md` 📖

