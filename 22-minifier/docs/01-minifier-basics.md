# Minifier 基础概念

## 📖 什么是 Minifier？

**Minifier（代码压缩器）**是一个将代码体积减小到最小的工具，通过删除不必要的字符、重命名变量、优化代码结构等方式实现。

### 核心目标

```
原始代码（10KB）
  ↓
压缩后（3KB）
  ↓
目标：减小文件体积 70%，加快加载速度
```

---

## 🎯 主要压缩技术

### 1. 删除空格和换行

```javascript
// 压缩前（100 字节）
function add(a, b) {
  return a + b;
}

// 压缩后（28 字节，节省 72%）
function add(a,b){return a+b}
```

### 2. 删除注释

```javascript
// 压缩前
// 这是一个求和函数
function add(a, b) {
  return a + b;  // 返回和
}

// 压缩后
function add(a,b){return a+b}
```

### 3. 变量混淆（Name Mangling）

```javascript
// 压缩前
function calculateTotal(price, quantity) {
  const subtotal = price * quantity;
  return subtotal;
}

// 压缩后
function a(b,c){const d=b*c;return d}
```

### 4. 常量折叠（Constant Folding）

```javascript
// 压缩前
const x = 1 + 2 + 3;
const y = 'hello' + ' ' + 'world';

// 压缩后
const x=6;
const y='hello world';
```

### 5. 死代码消除（Dead Code Elimination）

```javascript
// 压缩前
if (false) {
  console.log('never');
}
const unused = 123;

// 压缩后
// 完全删除
```

### 6. 合并声明

```javascript
// 压缩前
const a = 1;
const b = 2;
const c = 3;

// 压缩后
const a=1,b=2,c=3;
```

---

## 🆚 Minifier vs Formatter

| 维度 | Minifier | Formatter |
|------|----------|-----------|
| **目标** | 减小体积 | 统一风格 |
| **可读性** | ❌ 极差 | ✅ 极好 |
| **文件大小** | ✅ 最小 | ❌ 较大 |
| **使用场景** | 生产环境 | 开发环境 |
| **是否保留语义** | ✅ 是 | ✅ 是 |

---

## 🔧 主流 Minifier 工具

### 1. Terser（最流行）
```javascript
// 配置
{
  compress: {
    dead_code: true,
    drop_console: true,
    passes: 2
  },
  mangle: {
    toplevel: true
  }
}
```

### 2. esbuild（最快）
```javascript
// 极致性能
esbuild.build({
  entryPoints: ['app.js'],
  minify: true,
  outfile: 'out.js'
});
```

### 3. SWC（Rust 实现）
```javascript
// 高性能压缩
{
  jsc: {
    minify: {
      compress: true,
      mangle: true
    }
  }
}
```

---

## 💡 压缩的权衡

### 1. 体积 vs 可读性

```javascript
// 可读性好，但体积大
function calculateDiscount(originalPrice, discountRate) {
  const discountAmount = originalPrice * discountRate;
  const finalPrice = originalPrice - discountAmount;
  return finalPrice;
}

// 体积小，但不可读
function a(b,c){return b-b*c}
```

### 2. 压缩率 vs 压缩时间

```
Level 1（快速）：
- 删除空格、注释
- 压缩率：30-40%
- 耗时：100ms

Level 2（平衡）：
- + 变量混淆
- 压缩率：50-60%
- 耗时：500ms

Level 3（极致）：
- + 常量折叠、死代码消除
- 压缩率：60-70%
- 耗时：2000ms
```

---

## 🚀 实际案例

### React 生产构建

```
开发版本：
- react.development.js: 1.3MB
- 包含警告、错误提示
- 变量名完整

生产版本：
- react.production.min.js: 130KB（减少 90%）
- 删除所有警告
- 变量混淆
- 代码压缩
```

---

## 📊 压缩效果对比

```
原始代码：100KB

→ 删除空格/注释：70KB（-30%）
→ 变量混淆：50KB（-50%）
→ 常量折叠：45KB（-55%）
→ 死代码消除：40KB（-60%）
→ Gzip 压缩：15KB（-85%）
```

---

## 🎯 下一步

运行 Demo 项目，实际体验代码压缩的效果！

