# Node.js 模块解析算法

## Node.js 解析流程

### require.resolve() 原理

Node.js 使用 `require.resolve()` 来解析模块路径。

```javascript
// 解析模块路径
const path = require.resolve('lodash');
console.log(path);
// /project/node_modules/lodash/lodash.js
```

---

## node_modules 查找算法

### 逐级向上查找

```
当前文件: /project/src/utils/helper.js
查找模块: require('lodash')

查找顺序:
1. /project/src/utils/node_modules/lodash
2. /project/src/node_modules/lodash
3. /project/node_modules/lodash  ← 找到！
4. /node_modules/lodash
5. 全局 node_modules
```

### 算法实现

```javascript
function findInNodeModules(moduleName, fromDir) {
  const paths = [];
  let currentDir = fromDir;
  
  // 逐级向上
  while (true) {
    paths.push(path.join(currentDir, 'node_modules', moduleName));
    
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }
  
  return paths;
}
```

---

## package.json 解析

### main 字段优先

```json
{
  "name": "lodash",
  "version": "4.17.21",
  "main": "lodash.js"
}
```

解析流程：
```
1. 找到 /node_modules/lodash/
2. 读取 package.json
3. 取 main 字段：lodash.js
4. 返回 /node_modules/lodash/lodash.js
```

### 没有 package.json

```
查找索引文件：
1. index.js
2. index.json
3. index.node
```

---

## 完整解析算法

### 伪代码实现

```javascript
function resolve(specifier, fromFile) {
  // 1. 判断路径类型
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    // 相对路径
    return resolveRelative(specifier, fromFile);
  }
  
  if (specifier.startsWith('/')) {
    // 绝对路径
    return resolveAbsolute(specifier);
  }
  
  // 模块路径
  return resolveModule(specifier, fromFile);
}

function resolveModule(moduleName, fromFile) {
  const dirs = getNodeModulesPaths(fromFile);
  
  for (const dir of dirs) {
    const modulePath = path.join(dir, moduleName);
    
    // 1. 尝试作为文件
    const file = resolveAsFile(modulePath);
    if (file) return file;
    
    // 2. 尝试作为目录
    const directory = resolveAsDirectory(modulePath);
    if (directory) return directory;
  }
  
  throw new Error(`Module not found: ${moduleName}`);
}

function resolveAsFile(filePath) {
  const extensions = ['.js', '.json', '.node'];
  
  // 精确匹配
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }
  
  // 补全扩展名
  for (const ext of extensions) {
    const fileWithExt = filePath + ext;
    if (fs.existsSync(fileWithExt)) {
      return fileWithExt;
    }
  }
  
  return null;
}

function resolveAsDirectory(dirPath) {
  // 1. 读取 package.json
  const pkgPath = path.join(dirPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath));
    if (pkg.main) {
      return resolveAsFile(path.join(dirPath, pkg.main));
    }
  }
  
  // 2. 查找 index 文件
  return resolveAsFile(path.join(dirPath, 'index'));
}
```

---

## 实际示例

### 示例 1: 第三方模块

```javascript
// 文件：/project/src/app.js
const _ = require('lodash');

// 解析过程：
1. 判断：模块路径
2. 查找：
   - /project/src/node_modules/lodash ✗
   - /project/node_modules/lodash ✓
3. 读取：/project/node_modules/lodash/package.json
4. 取 main: "lodash.js"
5. 返回：/project/node_modules/lodash/lodash.js
```

### 示例 2: 相对路径

```javascript
// 文件：/project/src/utils/helper.js
const config = require('../config');

// 解析过程：
1. 判断：相对路径
2. 解析：/project/src/config
3. 尝试：
   - /project/src/config (文件) ✗
   - /project/src/config.js ✓
4. 返回：/project/src/config.js
```

---

## 总结

Node.js 解析算法的核心：
1. **逐级向上查找** node_modules
2. **package.json 优先** （main 字段）
3. **扩展名补全**（.js, .json, .node）
4. **索引文件** fallback

**继续阅读**: `03-webpack-resolution.md` 📖
