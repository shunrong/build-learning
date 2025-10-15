# 路径解析详解

## 路径类型详解

### 1. 相对路径解析

相对路径是基于当前文件位置的路径。

```javascript
// 当前文件：/project/src/pages/Home.js

import Header from './Header';          // ./Header
import utils from '../utils/format';    // ../utils/format
import config from '../../config';      // ../../config
```

**解析步骤**：
```
1. 获取当前文件的目录：/project/src/pages/
2. 使用 path.resolve() 解析相对路径
3. ./Header → /project/src/pages/Header
4. 补全扩展名或查找索引文件
```

---

### 2. 绝对路径解析

绝对路径直接指向文件系统的特定位置。

```javascript
// Unix/Linux/macOS
import config from '/etc/app/config';

// Windows
import data from 'C:\\data\\app.json';
```

**特点**：
- 不推荐使用（可移植性差）
- 通常用于系统级配置
- 不受当前文件位置影响

---

### 3. 模块路径解析

不以 `./`, `../`, `/` 开头的路径。

```javascript
import React from 'react';
import lodash from 'lodash';
import { Button } from 'antd/lib/button';
```

**解析策略**：
1. 在 `node_modules` 中查找
2. 逐级向上查找父目录
3. 直到找到或到达根目录

---

## path 模块核心 API

### path.resolve()

```javascript
const path = require('path');

// 解析为绝对路径
path.resolve('/foo', './bar', 'file.js');
// → /foo/bar/file.js

path.resolve('src', 'utils', 'format.js');
// → /current/working/directory/src/utils/format.js
```

### path.join()

```javascript
// 拼接路径
path.join('/foo', 'bar', 'baz');
// → /foo/bar/baz

path.join('src', '../lib', 'index.js');
// → src/../lib/index.js → lib/index.js
```

### path.dirname()

```javascript
// 获取目录名
path.dirname('/foo/bar/baz.js');
// → /foo/bar
```

### path.extname()

```javascript
// 获取扩展名
path.extname('file.js');        // → .js
path.extname('archive.tar.gz'); // → .gz
```

---

## 路径规范化

### 处理 `.` 和 `..`

```javascript
const path = require('path');

path.normalize('/foo/bar/../baz/./file.js');
// → /foo/baz/file.js

path.normalize('src/./utils/../helper.js');
// → src/helper.js
```

---

## 符号链接（Symlink）处理

### 什么是符号链接？

符号链接是指向另一个文件或目录的引用。

```bash
# 创建符号链接
ln -s /real/path /link/path
```

### 解析符号链接

```javascript
const fs = require('fs');
const path = require('path');

// 解析符号链接的真实路径
const realPath = fs.realpathSync('/link/path');
console.log(realPath);  // → /real/path
```

### Webpack 配置

```javascript
resolve: {
  symlinks: true  // 是否解析符号链接（默认 true）
}
```

---

## 跨平台路径处理

### 路径分隔符

```javascript
// Unix: /
// Windows: \

// 使用 path.sep 兼容
const filePath = ['src', 'utils', 'format.js'].join(path.sep);

// 或使用 path.join()
const filePath = path.join('src', 'utils', 'format.js');
```

### 路径转换

```javascript
// 转换为 POSIX 路径（Unix 风格）
path.posix.join('src', 'utils', 'file.js');
// → src/utils/file.js

// Windows 风格
path.win32.join('src', 'utils', 'file.js');
// → src\utils\file.js
```

---

## 总结

路径解析的关键：
1. 使用 `path.resolve()` 获取绝对路径
2. 使用 `path.join()` 拼接路径
3. 处理符号链接
4. 跨平台兼容

**继续阅读**: `05-advanced-features.md` 📖
