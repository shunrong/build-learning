# 高级特性和优化

## 缓存机制

### 为什么需要缓存？

模块解析是 I/O 密集型操作，缓存可以显著提升性能。

### 实现缓存

```javascript
class CachedResolver {
  constructor() {
    this.cache = new Map();
  }
  
  resolve(specifier, fromFile) {
    const cacheKey = `${specifier}::${fromFile}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const result = this._doResolve(specifier, fromFile);
    this.cache.set(cacheKey, result);
    return result;
  }
  
  _doResolve(specifier, fromFile) {
    // 实际解析逻辑
  }
}
```

### 缓存失效

```javascript
// 监听文件变化，清除缓存
const chokidar = require('chokidar');

const watcher = chokidar.watch('src/**/*');
watcher.on('change', (filePath) => {
  resolver.cache.delete(filePath);
});
```

---

## 插件系统

### 解析插件

```javascript
class ResolverPlugin {
  apply(resolver) {
    resolver.hooks.beforeResolve.tap('MyPlugin', (request) => {
      // 在解析前修改请求
      if (request.startsWith('~')) {
        request = request.slice(1);
      }
      return request;
    });
    
    resolver.hooks.afterResolve.tap('MyPlugin', (result) => {
      // 在解析后处理结果
      console.log('Resolved:', result);
    });
  }
}
```

---

## 性能优化技巧

### 1. 减少扩展名数量

```javascript
// ❌ 慢
extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue', '.css']

// ✅ 快
extensions: ['.ts', '.js']
```

### 2. 精确指定 modules

```javascript
// ❌ 慢：会查找很多目录
modules: ['node_modules']

// ✅ 快：精确指定
modules: [path.resolve(__dirname, 'node_modules')]
```

### 3. 使用 noParse

```javascript
module: {
  noParse: /jquery|lodash/  // 不解析这些库的内部依赖
}
```

---

## Monorepo 解析

### 问题

```
my-monorepo/
├── packages/
│   ├── pkg-a/
│   │   └── index.js
│   └── pkg-b/
│       └── index.js (引用 pkg-a)
```

### 解决方案 1: workspace

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

### 解决方案 2: 自定义解析

```javascript
resolve: {
  modules: [
    path.resolve(__dirname, 'packages'),
    'node_modules'
  ]
}
```

---

## 总结

高级特性的价值：
1. **缓存** - 提升性能
2. **插件** - 扩展功能
3. **优化配置** - 减少不必要的查找
4. **Monorepo 支持** - 解决跨包引用

这样就完成了 Phase 19 的所有文档！
