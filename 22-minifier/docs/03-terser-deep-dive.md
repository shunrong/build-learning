# Terser 深度解析

## 📖 什么是 Terser

**Terser** 是目前最流行的 JavaScript 压缩工具，Webpack 5 的默认压缩器。

```
UglifyJS (不支持 ES6+)
  ↓
UglifyES (ES6 支持)
  ↓
Terser (fork from UglifyES，完整 ES6+ 支持)
```

---

## 🏗️ Terser 架构

```
JavaScript 代码
  ↓
1. Parse（解析为 AST）
  ↓
2. Compress（压缩优化）
  ↓
3. Mangle（变量名混淆）
  ↓
4. Generate（生成代码）
  ↓
压缩后的代码
```

---

## ⚙️ 核心配置

### 1. 基础配置

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,        // 删除 console
            drop_debugger: true,       // 删除 debugger
            pure_funcs: ['console.log'] // 删除特定函数调用
          },
          mangle: {
            reserved: ['$', 'jQuery']  // 保留特定变量名
          },
          format: {
            comments: false            // 删除所有注释
          }
        }
      })
    ]
  }
};
```

### 2. Compress 选项

```javascript
{
  compress: {
    // 死代码删除
    dead_code: true,
    
    // 移除 console
    drop_console: true,
    drop_debugger: true,
    
    // 移除未使用的代码
    unused: true,
    
    // 常量折叠
    evaluate: true,
    
    // 条件优化
    conditionals: true,
    
    // 比较优化
    comparisons: true,
    
    // 布尔值优化
    booleans: true,
    
    // 循环优化
    loops: true,
    
    // if 返回优化
    if_return: true,
    
    // 函数内联
    inline: 2,
    
    // 合并连续变量声明
    join_vars: true,
    
    // 移除不可达代码
    unreachable: true
  }
}
```

### 3. Mangle 选项

```javascript
{
  mangle: {
    // 保留特定名称
    reserved: ['$', 'jQuery', 'exports', 'require'],
    
    // 混淆属性名
    properties: {
      regex: /^_/  // 只混淆以 _ 开头的属性
    },
    
    // 顶层变量名混淆
    toplevel: false,
    
    // Safari 10 bug 修复
    safari10: true
  }
}
```

### 4. Format 选项

```javascript
{
  format: {
    // 删除注释
    comments: false,
    
    // 或保留特定注释
    comments: /^!/,  // 保留 /*! */ 注释
    
    // 美化输出（调试用）
    beautify: false,
    
    // ASCII only
    ascii_only: true,
    
    // 最大行长度
    max_line_len: false
  }
}
```

---

## 💡 压缩示例

### 示例 1：基础压缩

```javascript
// 原始代码
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    total += item.price * item.quantity;
  }
  return total;
}

// Terser 压缩后
function calculateTotal(t){let e=0;for(let i=0;i<t.length;i++){const l=t[i];e+=l.price*l.quantity}return e}
```

### 示例 2：Dead Code Elimination

```javascript
// 原始代码
function example() {
  const used = 1;
  const unused = 2;
  
  if (false) {
    console.log('never');
  }
  
  if (true) {
    return used;
  }
  
  return 999;  // unreachable
}

// Terser 压缩后
function example(){return 1}
```

### 示例 3：Constant Folding

```javascript
// 原始代码
const result = 1 + 2 * 3;
const flag = true && false;
const value = 'hello' + ' ' + 'world';

// Terser 压缩后
const result=7;
const flag=!1;
const value="hello world";
```

### 示例 4：删除 console

```javascript
// 原始代码
function debug() {
  console.log('debug info');
  console.warn('warning');
  console.error('error');
  return 'result';
}

// Terser 压缩后（drop_console: true）
function debug(){return"result"}
```

---

## 🎨 高级特性

### 1. Pure Functions

```javascript
// 配置
{
  compress: {
    pure_funcs: ['console.log', 'console.info']
  }
}

// 原始代码
console.log('debug');
console.info('info');
console.error('error');  // 保留

// 压缩后
console.error('error');
```

### 2. 顶层变量混淆

```javascript
// 配置
{
  mangle: {
    toplevel: true
  }
}

// 原始代码
const topLevelVar = 1;
function topLevelFunc() { }

// 压缩后（toplevel: true）
const t=1;
function n(){}

// 压缩后（toplevel: false）
const topLevelVar=1;
function topLevelFunc(){}
```

### 3. 属性名混淆

```javascript
// 配置
{
  mangle: {
    properties: {
      regex: /^_private/
    }
  }
}

// 原始代码
const obj = {
  publicProp: 1,
  _privateProp: 2
};

// 压缩后
const obj={publicProp:1,t:2};
```

---

## 🚀 性能优化

### 1. 并行压缩

```javascript
new TerserPlugin({
  parallel: true,  // 使用所有 CPU 核心
  // 或指定数量
  parallel: 4
})
```

### 2. 缓存

```javascript
new TerserPlugin({
  cache: true,  // 启用缓存
  cacheKeys: (defaultCacheKeys) => {
    // 自定义缓存键
    return {
      ...defaultCacheKeys,
      myKey: 'myValue'
    };
  }
})
```

### 3. Source Map

```javascript
new TerserPlugin({
  sourceMap: true,
  // 提取注释到单独文件
  extractComments: {
    condition: /^\**!|@preserve|@license|@cc_on/i,
    filename: (fileData) => {
      return `${fileData.filename}.LICENSE.txt`;
    }
  }
})
```

---

## 📊 压缩效果

### 真实项目示例

```
原始大小：    500 KB
Terser 压缩：  200 KB (60% 减少)
Gzip 压缩：    50 KB  (75% 进一步减少)
Brotli 压缩：  40 KB  (20% 进一步减少)

总计：500 KB → 40 KB (92% 减少)
```

### 压缩时间

```
500 KB 代码：
  - 单线程：10 秒
  - 4 线程： 3 秒
  - 8 线程： 2 秒
```

---

## 🎯 最佳实践

### 1. 开发环境

```javascript
{
  mode: 'development',
  optimization: {
    minimize: false,  // 不压缩，便于调试
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  }
}
```

### 2. 生产环境

```javascript
{
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          mangle: {
            safari10: true
          },
          format: {
            comments: false
          }
        },
        extractComments: false,
        parallel: true
      })
    ]
  },
  devtool: 'hidden-source-map'
}
```

### 3. 保留重要注释

```javascript
{
  format: {
    comments: /^!/  // 保留 /*! */ 格式的注释
  },
  extractComments: {
    condition: /^\**!|@preserve|@license/i
  }
}
```

---

## 💡 常见问题

### 1. 压缩破坏了代码

**原因**：使用了 `eval` 或动态属性访问

```javascript
// ❌ 不安全
eval('someCode');
obj['dynamic' + 'Key'];

// ✅ 安全
obj.knownKey;
```

### 2. 压缩时间太长

**解决方案**：
- 启用并行压缩
- 启用缓存
- 排除已压缩的文件

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [...]
}
```

### 3. Source Map 丢失

**解决方案**：

```javascript
{
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true
      })
    ]
  }
}
```

---

## 🔧 CLI 使用

```bash
# 基础压缩
terser input.js -o output.js

# 压缩 + Source Map
terser input.js -o output.js --source-map

# 完整配置
terser input.js -o output.js \
  --compress drop_console=true \
  --mangle reserved=['$','jQuery'] \
  --format comments=false
```

---

## 📚 API 使用

```javascript
const { minify } = require('terser');

const code = `
  function add(x, y) {
    console.log('adding');
    return x + y;
  }
`;

async function compress() {
  const result = await minify(code, {
    compress: {
      drop_console: true
    },
    mangle: true
  });
  
  console.log(result.code);
  // function add(x,y){return x+y}
}

compress();
```

---

## 🎓 核心收获

1. **Terser 是现代 JS 压缩的标准**
2. **核心流程**：Parse → Compress → Mangle → Generate
3. **关键配置**：compress, mangle, format
4. **性能优化**：parallel + cache
5. **生产必备**：Source Map + 保留 License

**Terser 让你的代码体积减少 60%+！**

