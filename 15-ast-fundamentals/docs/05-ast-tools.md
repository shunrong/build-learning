# AST 工具

## 📖 概述

本文介绍 AST 相关的工具和调试技巧，帮助你更高效地理解和操作 AST。

---

## 🌐 在线工具

### 1. AST Explorer ⭐️⭐️⭐️⭐️⭐️

**网址**：[astexplorer.net](https://astexplorer.net/)

**最强大的 AST 可视化工具**，支持多种语言和 Parser。

#### 功能特性

1. **实时解析**：输入代码，实时显示 AST
2. **多种 Parser**：
   - JavaScript: @babel/parser, acorn, espree, esprima, etc.
   - TypeScript: @typescript-eslint/parser
   - CSS: postcss
   - HTML: htmlparser2
   - 等等...
3. **Transform 测试**：支持测试 Babel 插件、ESLint 规则等
4. **节点高亮**：
   - 点击代码 → 高亮对应的 AST 节点
   - 点击 AST 节点 → 高亮对应的代码
5. **分享**：可以保存并分享链接

#### 使用技巧

**1. 选择 Parser**

左上角选择 Parser，推荐使用 `@babel/parser`：
- ✅ 支持最新的 JavaScript 特性
- ✅ 支持 JSX、TypeScript、Flow
- ✅ 与 Babel 生态一致

**2. 查看节点详情**

点击 AST 树中的节点，右侧会显示完整的节点信息：
```json
{
  "type": "Identifier",
  "start": 6,
  "end": 7,
  "loc": {
    "start": { "line": 1, "column": 6 },
    "end": { "line": 1, "column": 7 }
  },
  "name": "x"
}
```

**3. 测试 Transform**

- 切换到 "Transform" 面板
- 编写 Babel 插件代码
- 实时查看转换结果

**示例：移除 console.log**

```javascript
// Transform 代码
export default function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      CallExpression(path) {
        if (
          t.isMemberExpression(path.node.callee) &&
          path.node.callee.object.name === 'console' &&
          path.node.callee.property.name === 'log'
        ) {
          path.remove();
        }
      }
    }
  };
}
```

**4. 快捷键**

- `Ctrl/Cmd + Enter`：重新解析
- `Ctrl/Cmd + S`：保存并生成分享链接

---

### 2. Babel REPL

**网址**：[babeljs.io/repl](https://babeljs.io/repl)

**Babel 官方的在线转换工具**。

#### 功能特性

1. **实时转换**：输入 ES6+ 代码，查看编译结果
2. **配置 Presets 和 Plugins**：可以选择不同的 Babel 配置
3. **查看 AST**：可以切换到 AST 视图
4. **分享**：保存并分享链接

#### 使用场景

- 测试 Babel 转换效果
- 学习 ES6+ 特性如何被编译
- 测试自定义 Babel 插件

#### 示例

**输入（ES6）：**
```javascript
const arrow = () => {};
class Foo {}
async function bar() {}
```

**输出（ES5）：**
```javascript
"use strict";

var arrow = function arrow() {};

function _classCallCheck(instance, Constructor) { ... }

var Foo = function Foo() {
  _classCallCheck(this, Foo);
};

function bar() {
  return _bar.apply(this, arguments);
}

function _bar() {
  _bar = _asyncToGenerator(function* () {});
  return _bar.apply(this, arguments);
}
```

---

### 3. TypeScript Playground

**网址**：[typescriptlang.org/play](https://www.typescriptlang.org/play)

**TypeScript 官方的在线工具**。

#### 功能特性

1. **实时编译**：TypeScript → JavaScript
2. **类型检查**：实时显示类型错误
3. **多种输出目标**：ES5, ES6, ESNext, etc.
4. **AST 查看器**（通过插件）

---

## 💻 本地工具

### 1. VS Code 插件

#### AST Preview

**安装：**
```bash
code --install-extension slevesque.vscode-ast-preview
```

**功能：**
- 在 VS Code 中查看 AST
- 支持多种语言
- 快捷键：`Ctrl/Cmd + Shift + P` → "AST: Preview"

#### Babel JavaScript

**安装：**
```bash
code --install-extension mgmcdermott.vscode-language-babel
```

**功能：**
- JavaScript/JSX/TypeScript 语法高亮
- 支持最新的 JavaScript 特性

### 2. 命令行工具

#### @babel/cli

**安装：**
```bash
npm install -g @babel/cli @babel/core
```

**使用：**
```bash
# 编译文件
babel input.js -o output.js

# 查看 AST（需要插件）
babel input.js --print-ast
```

#### astexplorer-cli

**安装：**
```bash
npm install -g astexplorer-cli
```

**使用：**
```bash
# 在终端中查看 AST
astexplorer input.js
```

---

## 🔧 编程工具

### 1. @babel/parser

**解析代码成 AST。**

**安装：**
```bash
npm install @babel/parser
```

**使用：**
```javascript
const parser = require('@babel/parser');

const code = `const x = 1;`;

const ast = parser.parse(code, {
  sourceType: 'module',        // "script" 或 "module"
  plugins: [
    'jsx',                     // 支持 JSX
    'typescript',              // 支持 TypeScript
    'decorators-legacy',       // 支持装饰器
  ]
});

console.log(JSON.stringify(ast, null, 2));
```

**常用选项：**

```javascript
parser.parse(code, {
  // 源文件类型
  sourceType: 'module',        // "script" | "module" | "unambiguous"
  
  // 启用的语法插件
  plugins: [
    'jsx',                     // JSX
    'typescript',              // TypeScript
    'flow',                    // Flow
    'decorators-legacy',       // 装饰器
    'classProperties',         // 类属性
    'asyncGenerators',         // 异步生成器
    'bigInt',                  // BigInt
    'dynamicImport',           // 动态 import
    'optionalChaining',        // 可选链 ?.
    'nullishCoalescingOperator' // 空值合并 ??
  ],
  
  // 附加位置信息
  ranges: false,               // 添加 start/end 属性
  tokens: false,               // 附加 token 流
  
  // 严格模式
  strictMode: false,
  
  // 允许返回语句在顶层
  allowReturnOutsideFunction: false,
  
  // 允许未声明的导出
  allowUndeclaredExports: false
});
```

### 2. @babel/traverse

**遍历和操作 AST。**

**安装：**
```bash
npm install @babel/traverse
```

**使用：**
```javascript
const traverse = require('@babel/traverse').default;

const visitor = {
  FunctionDeclaration(path) {
    console.log('函数名:', path.node.id.name);
  }
};

traverse(ast, visitor);
```

### 3. @babel/types

**创建和验证 AST 节点。**

**安装：**
```bash
npm install @babel/types
```

**使用：**
```javascript
const t = require('@babel/types');

// 创建节点
const id = t.identifier('x');
const num = t.numericLiteral(42);

// 验证节点
t.isIdentifier(id);           // true
t.isNumericLiteral(num);      // true

// 验证属性
t.isIdentifier(id, { name: 'x' });  // true
```

### 4. @babel/generator

**将 AST 生成回代码。**

**安装：**
```bash
npm install @babel/generator
```

**使用：**
```javascript
const generate = require('@babel/generator').default;

const { code } = generate(ast, {
  // 紧凑模式（移除空格）
  compact: false,
  
  // 保留注释
  comments: true,
  
  // 缩进
  retainLines: false,
  
  // Source Map
  sourceMaps: false
});

console.log(code);
```

**完整示例：**
```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// 1. 解析
const code = `const x = 1;`;
const ast = parser.parse(code);

// 2. 转换
traverse(ast, {
  VariableDeclaration(path) {
    if (path.node.kind === 'const') {
      path.node.kind = 'var';
    }
  }
});

// 3. 生成
const output = generate(ast);
console.log(output.code);  // "var x = 1;"
```

---

## 🐛 调试技巧

### 1. 打印 AST

#### 方法 1：JSON.stringify

```javascript
const ast = parser.parse(code);

// 格式化输出
console.log(JSON.stringify(ast, null, 2));
```

**优点：**
- ✅ 简单直观
- ✅ 包含所有信息

**缺点：**
- ❌ 输出太长
- ❌ 难以阅读

#### 方法 2：只打印关键信息

```javascript
function printASTSimple(node, indent = 0) {
  const spaces = '  '.repeat(indent);
  
  if (!node || typeof node !== 'object') {
    return;
  }
  
  console.log(`${spaces}${node.type}`);
  
  // 打印一些关键属性
  if (node.name) {
    console.log(`${spaces}  name: ${node.name}`);
  }
  if (node.value !== undefined) {
    console.log(`${spaces}  value: ${node.value}`);
  }
  if (node.operator) {
    console.log(`${spaces}  operator: ${node.operator}`);
  }
  
  // 递归打印子节点
  for (const key in node) {
    if (key === 'type' || key === 'loc' || key === 'start' || key === 'end') {
      continue;
    }
    
    const child = node[key];
    
    if (Array.isArray(child)) {
      child.forEach((item) => printASTSimple(item, indent + 1));
    } else if (child && typeof child === 'object' && child.type) {
      printASTSimple(child, indent + 1);
    }
  }
}

printASTSimple(ast);
```

**输出：**
```
Program
  VariableDeclaration
    VariableDeclarator
      Identifier
        name: x
      NumericLiteral
        value: 1
```

### 2. 使用 debugger

```javascript
const visitor = {
  FunctionDeclaration(path) {
    debugger;  // 断点
    console.log(path.node);
  }
};
```

**在 VS Code 中调试：**

1. 创建 `.vscode/launch.json`：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug AST",
      "program": "${workspaceFolder}/test.js"
    }
  ]
}
```

2. 在代码中添加 `debugger`
3. 按 `F5` 启动调试
4. 在调试控制台中查看变量

### 3. 使用 path.toString()

```javascript
FunctionDeclaration(path) {
  // 打印节点对应的代码
  console.log(path.toString());
}
```

**输出：**
```javascript
function add(a, b) {
  return a + b;
}
```

### 4. 检查节点类型

```javascript
FunctionDeclaration(path) {
  // 打印所有可用的判断方法
  for (const key in path) {
    if (key.startsWith('is') && typeof path[key] === 'function') {
      if (path[key]()) {
        console.log(key);  // isFunctionDeclaration, isStatement, ...
      }
    }
  }
}
```

### 5. 检查 Scope 信息

```javascript
FunctionDeclaration(path) {
  const { scope } = path;
  
  // 打印所有绑定
  console.log('Bindings:');
  for (const name in scope.bindings) {
    const binding = scope.bindings[name];
    console.log(`  ${name}:`);
    console.log(`    kind: ${binding.kind}`);
    console.log(`    references: ${binding.references}`);
    console.log(`    referenced: ${binding.referenced}`);
  }
}
```

---

## 📚 实用工具库

### 1. babel-helper-plugin-utils

**创建 Babel 插件的辅助工具。**

```bash
npm install @babel/helper-plugin-utils
```

```javascript
const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
  api.assertVersion(7);
  
  return {
    name: 'my-plugin',
    visitor: {
      // ...
    }
  };
});
```

### 2. @babel/template

**用模板字符串创建 AST。**

```bash
npm install @babel/template
```

```javascript
const template = require('@babel/template').default;

// 创建 AST 模板
const buildRequire = template(`
  var %%importName%% = require(%%source%%);
`);

// 使用模板
const ast = buildRequire({
  importName: t.identifier('myModule'),
  source: t.stringLiteral('./my-module')
});

// 生成代码
// var myModule = require("./my-module");
```

**更简洁的语法：**
```javascript
const template = require('@babel/template').default;
const t = require('@babel/types');

const buildRequire = template.statement`
  var NAME = require(SOURCE);
`;

const ast = buildRequire({
  NAME: t.identifier('myModule'),
  SOURCE: t.stringLiteral('./my-module')
});
```

### 3. @babel/code-frame

**美化错误信息，显示代码位置。**

```bash
npm install @babel/code-frame
```

```javascript
const { codeFrameColumns } = require('@babel/code-frame');

const code = `
function test() {
  console.log('hello');
  const x = 1;
  return x;
}
`;

const location = {
  start: { line: 3, column: 2 }
};

const result = codeFrameColumns(code, location, {
  highlightCode: true,
  message: '这里有问题'
});

console.log(result);
```

**输出：**
```
  1 |
  2 | function test() {
> 3 |   console.log('hello');
    |   ^ 这里有问题
  4 |   const x = 1;
  5 |   return x;
  6 | }
```

---

## 🎯 最佳实践

### 1. 开发流程

```
1. 在 AST Explorer 中实验
   ↓
2. 编写本地代码
   ↓
3. 使用 debugger 调试
   ↓
4. 测试和验证
   ↓
5. 优化和重构
```

### 2. 常用代码片段

**解析、转换、生成完整流程：**

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

function transform(code) {
  // 1. 解析
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  
  // 2. 转换
  traverse(ast, {
    // Visitor
  });
  
  // 3. 生成
  const output = generate(ast, {
    comments: true
  });
  
  return output.code;
}
```

**读取文件、转换、写回：**

```javascript
const fs = require('fs');
const path = require('path');

function transformFile(filePath) {
  // 读取文件
  const code = fs.readFileSync(filePath, 'utf-8');
  
  // 转换
  const transformedCode = transform(code);
  
  // 写回文件（或新文件）
  const outputPath = filePath.replace('.js', '.transformed.js');
  fs.writeFileSync(outputPath, transformedCode, 'utf-8');
  
  console.log(`✅ Transformed: ${filePath} -> ${outputPath}`);
}
```

### 3. 错误处理

```javascript
function transform(code) {
  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    
    traverse(ast, visitor);
    
    const output = generate(ast);
    return output.code;
  } catch (error) {
    if (error.loc) {
      // Babel 解析错误，包含位置信息
      console.error(`解析错误 (${error.loc.line}:${error.loc.column}): ${error.message}`);
    } else {
      // 其他错误
      console.error('转换错误:', error.message);
    }
    throw error;
  }
}
```

---

## 🎓 关键要点总结

1. **在线工具**：
   - **AST Explorer**：最强大的 AST 可视化工具
   - **Babel REPL**：测试 Babel 转换
   - **TypeScript Playground**：测试 TypeScript

2. **本地工具**：
   - **VS Code 插件**：AST Preview
   - **命令行工具**：@babel/cli

3. **编程工具**：
   - `@babel/parser`：解析代码 → AST
   - `@babel/traverse`：遍历 AST
   - `@babel/types`：创建/验证节点
   - `@babel/generator`：AST → 代码
   - `@babel/template`：模板创建 AST
   - `@babel/code-frame`：美化错误信息

4. **调试技巧**：
   - `JSON.stringify(ast, null, 2)`
   - `debugger` 断点调试
   - `path.toString()` 打印代码
   - 检查 Scope 和 Binding

---

## 🔗 下一步

掌握了 AST 工具后，开始实践：
- **Demo 01**：AST 基础探索
- **Demo 02**：AST 遍历实践
- **Demo 03**：AST 操作实战

**记住：工具是提升效率的关键！** 🎉

