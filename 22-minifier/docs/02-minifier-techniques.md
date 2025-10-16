# Minifier 核心技术

## 🎯 什么是 Minification

**代码压缩（Minification）**：在保持语义不变的前提下，尽可能减小代码体积。

```javascript
// 原始代码（1.2 KB）
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

// 压缩后（0.4 KB，减少 67%）
function calculateTotal(t){let e=0;for(let i=0;i<t.length;i++)e+=t[i].price*t[i].quantity;return e}
```

---

## 🔧 核心技术

### 1. 变量名混淆（Mangling）

```javascript
// 原始
function add(firstNumber, secondNumber) {
  return firstNumber + secondNumber;
}

// 混淆后
function add(a,b){return a+b}
```

**原理**：
- 缩短变量名（`firstNumber` → `a`）
- 缩短参数名（`secondNumber` → `b`）
- 局部变量名可以安全混淆
- ⚠️ 全局变量名不能混淆（可能被外部引用）

### 2. 移除空白符（Whitespace Removal）

```javascript
// 原始（18 字符）
const x = 1 + 2;

// 压缩后（12 字符）
const x=1+2;
```

移除：
- 空格
- 制表符
- 换行符
- 注释

### 3. 移除注释（Comment Removal）

```javascript
// 原始
/**
 * 计算总和
 * @param {number[]} numbers
 */
function sum(numbers) {
  // 初始化结果
  let result = 0;
  // 遍历数组
  for (let n of numbers) {
    result += n;  // 累加
  }
  return result;
}

// 压缩后（移除所有注释）
function sum(numbers){let result=0;for(let n of numbers){result+=n}return result}
```

### 4. 死代码删除（Dead Code Elimination）

```javascript
// 原始
function example() {
  const used = 1;
  const unused = 2;  // ❌ 从未使用
  
  if (false) {       // ❌ 永远不会执行
    console.log('never');
  }
  
  return used;
}

// 压缩后
function example(){const used=1;return used}

// 进一步优化
function example(){return 1}
```

### 5. 常量折叠（Constant Folding）

```javascript
// 原始
const result = 1 + 2 * 3;

// 编译时计算
const result = 7;
```

### 6. 常量传播（Constant Propagation）

```javascript
// 原始
const x = 10;
const y = x + 5;
const z = y * 2;

// 优化后
const z = 30;
```

### 7. 内联（Inlining）

```javascript
// 原始
function double(x) {
  return x * 2;
}
const result = double(5);

// 内联后
const result = 5 * 2;

// 常量折叠后
const result = 10;
```

### 8. 短路求值优化

```javascript
// 原始
if (condition) {
  value = true;
} else {
  value = false;
}

// 优化后
value = condition;
```

### 9. 表达式简化

```javascript
// 原始
const result = true ? x : y;

// 优化后
const result = x;
```

```javascript
// 原始
!!someValue

// 优化后（Boolean 构造函数）
Boolean(someValue)

// 进一步优化（取决于上下文）
someValue
```

### 10. 属性访问优化

```javascript
// 原始
obj['property']

// 优化为点访问（如果可能）
obj.property
```

---

## 🎨 高级技术

### 1. Tree Shaking

```javascript
// utils.js
export function used() { }
export function unused() { }

// main.js
import { used } from './utils';
used();

// 打包后：unused 被移除
```

### 2. Scope Hoisting

```javascript
// 原始（多个模块）
// module1.js
export const x = 1;

// module2.js
import { x } from './module1';
export const y = x + 1;

// 打包后（合并到一个作用域）
const x = 1;
const y = x + 1;
```

### 3. 短变量名分配策略

```javascript
// 策略：使用频率高的变量使用更短的名字

// 原始
function example() {
  const veryFrequentlyUsedVariable = 1;
  const rarelyUsedVariable = 2;
  // ... veryFrequentlyUsedVariable 使用 100 次
  // ... rarelyUsedVariable 使用 1 次
}

// 优化后
function example() {
  const a = 1;  // 高频变量用短名字
  const bc = 2; // 低频变量用长一点的名字
}
```

### 4. 函数参数优化

```javascript
// 原始
function example(a, b = 10, c = 20) {
  return a + b + c;
}

// 优化：合并默认值
function example(a,b,c){return a+(b||10)+(c||20)}
```

---

## 📊 压缩效果对比

| 技术 | 原始大小 | 压缩后 | 减少比例 |
|------|---------|--------|---------|
| **移除空白** | 100 KB | 70 KB | 30% |
| **变量混淆** | 70 KB | 55 KB | 21% |
| **死代码删除** | 55 KB | 50 KB | 9% |
| **常量折叠** | 50 KB | 48 KB | 4% |
| **Gzip** | 48 KB | 15 KB | 69% |
| **总计** | 100 KB | 15 KB | **85%** |

---

## 🔍 安全性考虑

### 1. 不能混淆的内容

```javascript
// ❌ 不能混淆
window.globalFunction = function() { };  // 全局变量
obj['dynamic' + 'Key'];                  // 动态属性
eval('someCode');                         // eval 中的代码
```

### 2. 保留特定名称

```javascript
// Terser 配置
{
  mangle: {
    reserved: ['jQuery', '$', 'exports', 'require']
  }
}
```

### 3. 保留注释

```javascript
// 原始
/*! Legal notice - must be preserved */
function example() {
  // Regular comment - can be removed
}

// 压缩后（保留 /*! */ 注释）
/*! Legal notice - must be preserved */
function example(){}
```

---

## 💡 实现示例

### 简单的 Minifier

```javascript
class SimpleMinifier {
  minify(code) {
    return code
      // 移除单行注释
      .replace(/\/\/.*/g, '')
      // 移除多行注释
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // 移除多余空白
      .replace(/\s+/g, ' ')
      // 移除括号前后的空格
      .replace(/\s*([{};,()=])\s*/g, '$1')
      .trim();
  }
}

const minifier = new SimpleMinifier();
const code = `
  function add(x, y) {
    // 返回和
    return x + y;
  }
`;

console.log(minifier.minify(code));
// 输出: function add(x,y){return x+y}
```

---

## 🎯 实践建议

### 1. 开发 vs 生产

```javascript
// 开发环境：不压缩（便于调试）
{
  mode: 'development',
  optimization: {
    minimize: false
  }
}

// 生产环境：完全压缩
{
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: true,
        mangle: true
      }
    })]
  }
}
```

### 2. Source Map

```javascript
// 生产环境也要生成 Source Map（用于错误追踪）
{
  devtool: 'hidden-source-map'
}
```

### 3. 性能优化

```javascript
// 并行压缩
{
  minimizer: [new TerserPlugin({
    parallel: true  // 使用多核 CPU
  })]
}
```

---

## 📚 工具对比

| 工具 | 语言 | 速度 | 压缩率 | 生态 |
|------|------|------|--------|------|
| **Terser** | JS | 中 | 高 | ★★★★★ |
| **UglifyJS** | JS | 慢 | 高 | ★★★★☆ |
| **esbuild** | Go | ★★★★★ | 中 | ★★★☆☆ |
| **SWC** | Rust | ★★★★☆ | 高 | ★★★☆☆ |
| **Closure Compiler** | Java | 慢 | ★★★★★ | ★★☆☆☆ |

---

## 🎓 核心收获

1. **Minification 的核心目标**：减小体积，保持语义
2. **主要技术**：混淆、删除、优化、内联
3. **安全第一**：不能混淆全局变量和动态属性
4. **配合 Gzip**：可以达到 80%+ 的压缩率
5. **生产必备**：Source Map + Minify

**代码压缩是前端性能优化的关键环节！**

