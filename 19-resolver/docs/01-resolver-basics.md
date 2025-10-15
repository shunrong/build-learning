# Resolver 基础概念

## 什么是 Resolver？

**Resolver（模块解析器）** 是构建工具中负责将模块标识符（module specifier）转换为实际文件路径的组件。

### 核心功能

```
模块标识符 ───→ Resolver ───→ 实际文件路径

import Button from 'antd/button'
                    ↓
/node_modules/antd/lib/button.js
```

---

## 模块解析的三种路径类型

### 1. 相对路径（Relative Path）

以 `./` 或 `../` 开头的路径。

```javascript
// 相对于当前文件
import utils from './utils';
import config from '../config';
import helper from './lib/helper';
```

**解析规则**：
1. 以当前文件所在目录为基准
2. 解析相对路径
3. 尝试补全扩展名
4. 如果是目录，查找索引文件

---

### 2. 绝对路径（Absolute Path）

以 `/` 开头的路径（Unix）或盘符开头（Windows）。

```javascript
import config from '/etc/config';
import data from 'C:\\data\\file';
```

**解析规则**：
1. 直接使用绝对路径
2. 尝试补全扩展名
3. 如果是目录，查找索引文件

---

### 3. 模块路径（Module Path）

不以 `./`、`../`、`/` 开头的路径。

```javascript
import React from 'react';
import { Button } from 'antd';
import lodash from 'lodash/fp';
```

**解析规则**：
1. 在 `node_modules` 中查找
2. 逐级向上查找父目录的 `node_modules`
3. 读取 `package.json` 确定入口文件
4. 如果没有 package.json，查找索引文件

---

## 解析算法核心步骤

### 完整流程

```
1. 解析导入语句
   └─ import Button from 'antd/button'

2. 判断路径类型
   ├─ 相对路径？ → 基于当前文件解析
   ├─ 绝对路径？ → 直接使用
   └─ 模块路径？ → 在 node_modules 查找

3. 应用配置（Webpack/自定义）
   ├─ 别名替换 (alias)
   ├─ 扩展名配置 (extensions)
   └─ 模块目录 (modules)

4. 文件查找
   ├─ 精确匹配文件
   ├─ 补全扩展名
   └─ 查找目录索引文件

5. 返回结果
   ├─ 成功：返回绝对路径
   └─ 失败：抛出 "Module not found" 错误
```

---

## 扩展名处理

### 扩展名补全

```javascript
// 代码中省略扩展名
import utils from './utils';

// Resolver 尝试的顺序
1. ./utils          (精确匹配)
2. ./utils.js       (补全 .js)
3. ./utils.json     (补全 .json)
4. ./utils.node     (补全 .node)
```

**Webpack 配置**：
```javascript
resolve: {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
}
```

**性能影响**：扩展名越多，尝试次数越多，性能越差。

---

## 索引文件（Index File）

### 目录作为模块

```javascript
import utils from './utils';

// 如果 ./utils 是目录，查找顺序
1. ./utils/index.js
2. ./utils/index.json
3. ./utils/index.node
```

**package.json 的 main 字段**：
```json
{
  "name": "my-module",
  "main": "lib/index.js"
}
```

---

## package.json 字段详解

### main 字段（CommonJS 入口）

```json
{
  "main": "dist/index.js"
}
```

用于 CommonJS (`require()`) 解析。

---

### module 字段（ES Module 入口）

```json
{
  "module": "dist/index.esm.js",
  "main": "dist/index.cjs.js"
}
```

打包工具优先使用 `module` 字段（支持 Tree Shaking）。

---

### exports 字段（现代导出）

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": "./dist/utils.js"
  }
}
```

最新的条件导出机制，支持多种环境和路径。

---

## Node.js vs Webpack 解析对比

| 特性 | Node.js | Webpack |
|------|---------|---------|
| 别名 | ✗ 不支持 | ✓ resolve.alias |
| 扩展名 | `.js`, `.json`, `.node` | 可配置（.ts, .tsx, .vue 等） |
| 模块目录 | `node_modules` | 可配置（resolve.modules） |
| package.json | main, exports | main, module, browser, etc. |
| 缓存 | 内置缓存 | enhanced-resolve 缓存 |

---

## 总结

### 核心要点

1. **三种路径类型**：相对、绝对、模块
2. **解析步骤**：判断类型 → 查找文件 → 补全扩展名
3. **package.json**：main/module/exports 字段
4. **配置化**：Webpack 提供更灵活的配置

**继续阅读**: `02-nodejs-resolution.md` 📖
