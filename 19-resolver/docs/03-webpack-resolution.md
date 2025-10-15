# Webpack 模块解析

## Webpack Resolver 特性

Webpack 使用 `enhanced-resolve` 库，提供比 Node.js 更强大的解析能力。

---

## resolve.alias（别名）

### 基本用法

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/utils')
    }
  }
};
```

### 使用别名

```javascript
// 之前
import Button from '../../../components/Button';

// 之后
import Button from '@/components/Button';
import { format } from 'utils/format';
```

### 精确匹配 vs 前缀匹配

```javascript
alias: {
  'react$': '/path/to/react.js',     // 精确匹配
  'react': '/path/to/react',         // 前缀匹配
}

import React from 'react';           // 匹配 react$
import { Component } from 'react/component';  // 匹配 react
```

---

## resolve.extensions（扩展名）

### 配置扩展名

```javascript
resolve: {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
}
```

### 解析顺序

```javascript
import App from './App';

// 尝试顺序：
1. ./App          (精确匹配)
2. ./App.ts       ← 找到！
3. ./App.tsx      (不再尝试)
4. ./App.js
5. ./App.jsx
6. ./App.json
```

### 性能优化

```javascript
// ❌ 不好：扩展名太多
extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue', '.css', '.scss']

// ✅ 更好：只配置必要的
extensions: ['.ts', '.tsx', '.js']
```

---

## resolve.modules（模块目录）

### 自定义模块目录

```javascript
resolve: {
  modules: [
    path.resolve(__dirname, 'src'),
    'node_modules'
  ]
}
```

### 使用效果

```javascript
// 之前
import Button from '../../components/Button';

// 之后（直接从 src 导入）
import Button from 'components/Button';
```

---

## resolve.mainFields

### 选择 package.json 字段

```javascript
resolve: {
  mainFields: ['browser', 'module', 'main']
}
```

### 字段优先级

```json
{
  "browser": "dist/index.browser.js",  ← 浏览器优先
  "module": "dist/index.esm.js",
  "main": "dist/index.cjs.js"
}
```

---

## resolve.mainFiles

### 自定义索引文件

```javascript
resolve: {
  mainFiles: ['index', 'main']
}
```

### 查找顺序

```
import utils from './utils';

如果 ./utils 是目录：
1. ./utils/index.ts
2. ./utils/index.js
3. ./utils/main.ts
4. ./utils/main.js
```

---

## 完整配置示例

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  resolve: {
    // 别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'react$': require.resolve('react')
    },
    
    // 扩展名
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    
    // 模块目录
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    
    // package.json 字段优先级
    mainFields: ['browser', 'module', 'main'],
    
    // 索引文件
    mainFiles: ['index'],
    
    // 符号链接
    symlinks: true,
    
    // 缓存
    cache: true
  }
};
```

---

## 总结

Webpack 解析的强大之处：
1. **别名系统** - 简化路径
2. **扩展名配置** - 支持任意文件类型
3. **多模块目录** - 灵活的模块查找
4. **mainFields** - 适应不同环境

**继续阅读**: `04-path-resolution.md` 📖
