# Prettier 工作原理

## 📖 Prettier 简介

**Prettier** 是目前最流行的代码格式化工具，以"Opinionated"（强制风格）著称。

### 核心理念

```
"你不需要浪费时间争论代码风格，
 Prettier 已经为你做好了所有决定。"
 
 —— Prettier 官方
```

---

## 🏗️ Prettier 架构

### 整体流程

```
源代码
  ↓
1. Parser（解析）
  ↓
AST
  ↓
2. Printer（打印）
  ↓  
IR（中间表示）
  ↓
3. Layout（布局）
  ↓
格式化后的代码
```

---

## 🔍 核心算法：Layout Algorithm

### 1. IR（Intermediate Representation）

Prettier 不是直接从 AST 生成代码，而是先生成一个中间表示（IR）。

```javascript
// IR 的基本单元：Doc
const doc = {
  type: 'group',
  contents: [
    { type: 'text', value: 'function' },
    { type: 'space' },
    { type: 'text', value: 'add' },
    { type: 'text', value: '(' },
    { type: 'group', contents: [...] }  // 参数列表
  ]
};
```

### 2. 基本的 Doc 类型

```javascript
// 1. text - 文本
{ type: 'text', value: 'function' }

// 2. line - 换行（可能变成空格）
{ type: 'line' }

// 3. hardline - 强制换行
{ type: 'hardline' }

// 4. group - 分组（尝试放在同一行）
{ type: 'group', contents: [...] }

// 5. indent - 缩进
{ type: 'indent', contents: [...] }

// 6. ifBreak - 条件分支
{ type: 'ifBreak', 
  breakContents: '(', 
  flatContents: '' 
}
```

---

## 💡 Layout Algorithm 详解

### 核心思想

```
尝试将代码放在一行：
  - 如果长度 ≤ printWidth → 放在一行
  - 如果长度 > printWidth → 换行
```

### 示例 1：短对象（放在一行）

```javascript
// 源代码
const user = {
  name: 'Alice',
  age: 30
};

// IR
group([
  'const user = {',
  indent([
    line,
    'name: "Alice",',
    line,
    'age: 30'
  ]),
  line,
  '}'
])

// printWidth = 80
// 计算宽度：27 字符 < 80
// ✅ 结果：放在一行
const user = { name: "Alice", age: 30 };
```

### 示例 2：长对象（换行）

```javascript
// 源代码（同上）
const user = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  address: '123 Main St'
};

// printWidth = 50
// 计算宽度：89 字符 > 50
// ❌ 无法放在一行
// ✅ 结果：换行
const user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  address: "123 Main St",
};
```

---

## 🔧 Prettier 实现细节

### 1. Parser 层

Prettier 支持多种语言，每种语言有自己的 Parser：

```javascript
// JavaScript/TypeScript
import { parse } from '@babel/parser';

// CSS
import postcss from 'postcss';

// HTML
import { parse } from '@angular/compiler';

// Markdown
import { parse } from 'remark';
```

### 2. Printer 层

每种语言有自己的 Printer，负责将 AST 转换为 IR（Doc）：

```javascript
// JavaScript Printer 示例
function printFunctionDeclaration(path) {
  const node = path.node;
  
  return group([
    'function ',
    node.id.name,
    '(',
    printParameters(path),  // 参数列表
    ') ',
    printBlockStatement(path.get('body'))
  ]);
}

function printParameters(path) {
  const params = path.node.params;
  
  if (params.length === 0) {
    return '';
  }
  
  // 使用 group，让 Prettier 决定是否换行
  return group([
    indent([
      softline,
      join(concat([',', line]), params.map(printParameter))
    ]),
    softline
  ]);
}
```

### 3. Layout 层

Layout 算法负责将 IR 转换为最终代码：

```javascript
function printDoc(doc, options) {
  const { printWidth } = options;
  let currentWidth = 0;
  let output = '';
  
  function print(doc) {
    switch (doc.type) {
      case 'text':
        output += doc.value;
        currentWidth += doc.value.length;
        break;
        
      case 'line':
        // 如果当前行太长，换行；否则空格
        if (currentWidth > printWidth) {
          output += '\n';
          currentWidth = 0;
        } else {
          output += ' ';
          currentWidth += 1;
        }
        break;
        
      case 'group':
        // 尝试将整个 group 放在一行
        const groupWidth = calculateWidth(doc.contents);
        if (currentWidth + groupWidth <= printWidth) {
          // 放在一行
          doc.contents.forEach(print);
        } else {
          // 换行
          doc.contents.forEach((item, i) => {
            if (item.type === 'line') {
              output += '\n';
              currentWidth = 0;
            } else {
              print(item);
            }
          });
        }
        break;
    }
  }
  
  print(doc);
  return output;
}
```

---

## 📊 Prettier vs 手写 Formatter

| 特性 | Prettier | 手写 Formatter |
|------|----------|----------------|
| **复杂度** | 非常复杂 | 相对简单 |
| **IR 层** | ✅ 有 | ❌ 无 |
| **Layout 算法** | ✅ 智能 | ❌ 简单 |
| **断行策略** | ✅ 优化 | ❌ 基础 |
| **性能** | 优化过的 | 可能较慢 |
| **可读性** | ✅ 极好 | ⚠️ 一般 |

---

## 🎨 Prettier 的巧妙设计

### 1. Opinionated（强制风格）

```javascript
// Prettier 的选项很少（< 20 个）
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}

// 其他决定都由 Prettier 自动做
// ✅ 减少团队争论
// ✅ 配置简单
```

### 2. 幂等性（Idempotent）

```javascript
const code = 'const x=1';

format(code) === format(format(code))
// ✅ 格式化多次结果相同
```

### 3. 语义保留（Semantics Preserving）

```javascript
// 格式化前
const sum=1+2*3

// 格式化后
const sum = 1 + 2 * 3;

// ✅ 语义完全相同（仍然是 7）
```

---

## 🔬 深入：Group 和 Line 的配合

### 示例：函数参数

```javascript
// 短参数列表
function add(a, b) { }
// 放在一行 ✅

// 长参数列表
function calculate(
  firstNumber,
  secondNumber,
  operation,
  options
) { }
// 换行 ✅
```

### IR 表示

```javascript
group([
  'function ',
  node.id.name,
  '(',
  group([
    indent([
      softline,  // 软换行（可能变成空格）
      join([',', line], params)
    ]),
    softline
  ]),
  ') ',
  body
])
```

### Layout 决策

```
1. 计算参数列表的宽度
2. 如果 currentWidth + paramsWidth ≤ printWidth:
   - softline → 空格
   - 放在一行
3. 否则:
   - softline → 换行
   - 每个参数独占一行
```

---

## 🚀 Prettier 的性能优化

### 1. 缓存

```javascript
// Prettier 会缓存格式化结果
const cache = new Map();

function format(code) {
  if (cache.has(code)) {
    return cache.get(code);
  }
  
  const result = doFormat(code);
  cache.set(code, result);
  return result;
}
```

### 2. 并行处理

```javascript
// 格式化多个文件时，并行处理
const results = await Promise.all(
  files.map(file => formatFile(file))
);
```

### 3. 增量格式化

```javascript
// 只格式化修改的部分（VSCode 插件）
function formatRange(code, start, end) {
  // 只格式化 [start, end] 范围
}
```

---

## 💡 学习要点

1. **IR 层是关键**：
   - 分离 AST 和输出
   - 提供灵活性

2. **Layout Algorithm**：
   - Group 尝试放在一行
   - Line 智能决定换行

3. **Opinionated 设计**：
   - 减少选项
   - 统一风格

4. **性能优化**：
   - 缓存
   - 并行
   - 增量

---

## 🎯 实践建议

1. **阅读 Prettier 源码**：
   - `src/language-js/printer-estree.js`
   - `src/document/doc-builders.js`

2. **实现简化版**：
   - 只实现核心的 group/line
   - 理解 Layout 算法

3. **对比测试**：
   - 用 Prettier 格式化代码
   - 分析生成的 IR

---

## 📚 扩展阅读

- [Prettier 官方博客](https://prettier.io/blog/)
- [How Prettier works](https://github.com/prettier/prettier/blob/main/commands.md)
- [Building a Printer](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/)

---

## 🎓 核心收获

1. Prettier 不是简单的 AST → Code
2. IR 层提供了强大的灵活性
3. Layout Algorithm 智能决定换行
4. Opinionated 设计减少争论
5. 性能优化是持续的工作

**Prettier 是现代代码格式化的标杆！**

