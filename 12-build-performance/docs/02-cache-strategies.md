# 缓存策略：最有效的构建优化手段

## 📖 为什么缓存如此重要？

> **缓存是构建优化中收益最高、成本最低的手段。**

### 数据说话

```
无缓存：
  ├─ 首次构建：180s
  └─ 二次构建：180s（没有任何提升）

有缓存：
  ├─ 首次构建：180s（首次需要建立缓存）
  └─ 二次构建：15s（-92%）⚡️⚡️⚡️

效果：
  └─ 每天构建 10 次 = 节省 27.5 分钟
```

**投入产出比极高**！

---

## 🔍 缓存的本质

### 什么是缓存？

```
没有缓存的构建流程：

源码 → Loader 转换 → AST 解析 → 生成代码 → 输出
  ↓       ↓            ↓          ↓        ↓
 100ms   500ms       300ms      200ms    50ms

总耗时：1150ms（每次都要执行）


有缓存的构建流程：

源码 → 检查缓存 → 命中 → 直接使用
  ↓       ↓         ↓       ↓
 100ms   10ms      ✅      0ms

总耗时：110ms（节省 90%）⚡️
```

### 缓存的核心原理

```javascript
// 伪代码
function build(file) {
  // 1. 生成缓存 key
  const cacheKey = generateCacheKey(file);
  //    ↓
  //    基于文件内容、依赖、配置等生成唯一标识
  
  // 2. 检查缓存
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);  // ⚡️ 直接返回
  }
  
  // 3. 执行构建
  const result = expensiveTransform(file);
  
  // 4. 存入缓存
  cache.set(cacheKey, result);
  
  return result;
}
```

**关键点**：
1. **缓存 key 的生成**：如何判断文件是否变化？
2. **缓存的存储**：内存 vs 磁盘？
3. **缓存的失效**：什么情况下缓存失效？

---

## 🚀 Webpack 5 的 Filesystem Cache（重点）⭐️⭐️⭐️

### 什么是 Filesystem Cache？

Webpack 5 的**革命性特性**，将编译结果持久化到磁盘。

**vs Webpack 4**：

| 特性 | Webpack 4 | Webpack 5 |
|------|-----------|-----------|
| 默认缓存 | 内存缓存（进程结束即失效） | 文件系统缓存 |
| 缓存位置 | 内存 | `node_modules/.cache/webpack` |
| 缓存持久性 | ❌ 重启失效 | ✅ 持久化 |
| 二次构建 | 无提升 | 提升 90%+ |

---

### 基础配置

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',  // ⭐️ 启用文件系统缓存
  }
};
```

就这么简单！**默认配置已经很好用了。**

---

### 完整配置（进阶）

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  cache: {
    type: 'filesystem',
    
    // 缓存目录（默认：node_modules/.cache/webpack）
    cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    
    // 缓存名称（用于多个配置共享缓存）
    name: 'production-cache',
    
    // 构建依赖（这些文件变化时，缓存失效）
    buildDependencies: {
      config: [__filename],  // ⭐️ 配置文件本身
      // 还可以添加其他依赖
      // tsconfig: [path.resolve(__dirname, 'tsconfig.json')],
    },
    
    // 缓存版本（手动控制缓存失效）
    version: '1.0.0',
    
    // 缓存存储策略
    store: 'pack',  // 'pack' | 'idle'
    //  'pack': 构建结束后立即写入磁盘
    //  'idle': 空闲时写入磁盘（默认）
    
    // 压缩缓存文件（节省磁盘空间）
    compression: 'gzip',  // false | 'gzip' | 'brotli'
  }
};
```

---

### 缓存失效条件

缓存会在以下情况失效：

```
1. 文件内容变化
   └─ 基于 contenthash

2. 依赖变化
   └─ 文件的 import/require 变化

3. Loader 配置变化
   └─ loader 的 options 变化

4. Plugin 配置变化
   └─ plugin 的 options 变化

5. Webpack 版本变化
   └─ 自动检测

6. buildDependencies 变化
   └─ 如 webpack.config.js 变化

7. 手动清除缓存
   └─ 删除 node_modules/.cache/webpack
```

---

### 缓存工作流程

```
第一次构建（Cold Build）：

1. 读取源文件
   └─ src/index.js

2. 执行 Loader 转换
   └─ babel-loader
   └─ ts-loader
   └─ ...

3. 生成缓存 key
   └─ hash = md5(文件内容 + 配置 + 依赖)

4. 存储缓存
   └─ node_modules/.cache/webpack/
       └─ production-cache/
           └─ 0.pack  ← 缓存文件（二进制）

5. 输出结果
   └─ dist/main.js


第二次构建（Warm Build）：

1. 读取源文件
   └─ src/index.js

2. 生成缓存 key
   └─ hash = md5(...)

3. 检查缓存
   └─ 命中 ✅

4. 直接返回缓存结果 ⚡️
   └─ 跳过 Loader 转换
   └─ 跳过 AST 解析
   └─ 直接使用之前的结果

5. 输出结果
   └─ dist/main.js（瞬间完成）
```

---

### 实战效果

#### 项目背景

```
├─ 模块数量：~3000
├─ 技术栈：React + TypeScript
└─ 未优化构建时间：180s
```

#### 配置对比

**配置 1：无缓存**

```javascript
module.exports = {
  // 默认（Webpack 5 之前）
};
```

**配置 2：Filesystem Cache**

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};
```

#### 数据对比

```
┌─────────────────┬──────────┬──────────┬──────────┐
│     场景         │  无缓存   │ 有缓存   │  提升    │
├─────────────────┼──────────┼──────────┼──────────┤
│ 首次构建（冷启动）│  180s    │  180s    │   0%    │
│ 二次构建（无变化）│  180s    │   12s    │  -93%   │
│ 修改一个文件     │  180s    │   15s    │  -92%   │
│ 修改多个文件     │  180s    │   25s    │  -86%   │
│ 修改配置文件     │  180s    │  180s    │   0%    │
└─────────────────┴──────────┴──────────┴──────────┘

结论：
  ├─ 首次构建：无差异（需要建立缓存）
  ├─ 二次构建：提升 90%+ ⚡️⚡️⚡️
  └─ 配置变化：缓存失效（符合预期）
```

---

## 💾 babel-loader Cache ⭐️⭐️

### 为什么需要？

即使有 Webpack 5 的 filesystem cache，babel-loader 自己的缓存也很有价值：

```
Webpack filesystem cache：
  └─ 缓存整个模块的编译结果

babel-loader cache：
  └─ 缓存 Babel 转换的中间结果
  
两者结合：
  └─ 效果更好 ⚡️
```

---

### 配置

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,  // ⭐️ 启用缓存
            // cacheDirectory: path.resolve(__dirname, '.babel-cache'),  // 自定义目录
            
            cacheCompression: false,  // ⭐️ 不压缩缓存（更快）
          }
        },
        exclude: /node_modules/
      }
    ]
  }
};
```

**关键配置**：
- `cacheDirectory: true` - 启用缓存（默认目录：`node_modules/.cache/babel-loader`）
- `cacheCompression: false` - 不压缩缓存文件（牺牲磁盘空间换速度）

---

### 缓存位置

```
node_modules/
└─ .cache/
    ├─ webpack/              ← Webpack filesystem cache
    │   └─ production-cache/
    │       └─ 0.pack
    └─ babel-loader/         ← babel-loader cache
        ├─ 0a1b2c3d.json    ← 缓存文件（JSON格式）
        ├─ 1e2f3g4h.json
        └─ ...
```

---

### 效果对比

```
无 babel-loader cache：
  └─ 每个 .js 文件都要经过 Babel 转换

有 babel-loader cache：
  └─ 文件内容未变化 → 直接使用缓存

数据：
  ├─ 首次构建：180s → 180s（需要建立缓存）
  └─ 二次构建：180s → 90s（-50%）
  
结合 Webpack filesystem cache：
  ├─ 首次构建：180s → 180s
  └─ 二次构建：180s → 12s（-93%）⚡️⚡️⚡️
```

---

## 🔧 cache-loader（Webpack 4 时代）

### 什么是 cache-loader？

Webpack 4 时代的缓存方案（在 Webpack 5 中已不推荐使用）。

**Webpack 5 后不推荐的原因**：
- Filesystem cache 已经足够好
- cache-loader 增加了额外的配置复杂度
- 维护成本高

**了解历史**：方便理解老项目。

---

### 配置（仅供参考）

```javascript
// webpack.config.js (Webpack 4)
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'cache-loader',  // ⚠️ 放在最前面
          'babel-loader'
        ]
      }
    ]
  }
};
```

**原理**：
- 在 babel-loader 之前添加 cache-loader
- 缓存 babel-loader 的输出结果
- 下次构建时直接使用缓存

---

## 📊 缓存策略对比

### 全方位对比

| 缓存方案 | Webpack 版本 | 缓存位置 | 配置复杂度 | 效果 | 推荐度 |
|---------|--------------|---------|-----------|------|--------|
| **Filesystem Cache** | Webpack 5 | 磁盘 | ⭐️ 简单 | ⭐️⭐️⭐️ 最好 | ⭐️⭐️⭐️ 强烈推荐 |
| **babel-loader cache** | 所有版本 | 磁盘 | ⭐️ 简单 | ⭐️⭐️ 很好 | ⭐️⭐️⭐️ 推荐（结合使用） |
| **cache-loader** | Webpack 4 | 磁盘 | ⭐️⭐️ 中等 | ⭐️⭐️ 好 | ⭐️ 不推荐（Webpack 5） |
| **内存缓存** | Webpack 4 默认 | 内存 | ⭐️ 无需配置 | ⭐️ 一般 | ❌ 已淘汰 |

---

### 最佳实践

#### Webpack 5 项目 ⭐️⭐️⭐️

```javascript
// webpack.config.js
module.exports = {
  // 1. Webpack filesystem cache（核心）
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            // 2. babel-loader cache（锦上添花）
            cacheDirectory: true,
            cacheCompression: false,
          }
        }
      }
    ]
  }
};
```

**效果**：
- 首次构建：180s
- 二次构建：12s（-93%）⚡️⚡️⚡️

---

#### Webpack 4 项目

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          // 1. cache-loader
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, '.cache')
            }
          },
          // 2. babel-loader with cache
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  }
};
```

---

## 🎯 CI/CD 中的缓存策略

### 问题

CI/CD 环境通常是**无状态**的：

```
每次 CI/CD 构建：
  ├─ 拉取代码
  ├─ 安装依赖（npm install）
  ├─ 构建项目（npm run build）
  └─ 部署

问题：
  └─ 每次都是"首次构建"
  └─ 无法利用缓存 ❌
```

---

### 解决方案：持久化缓存目录

#### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: Build and Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      # ⭐️ 恢复 npm 缓存
      - name: Cache node modules
        uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
      # ⭐️ 恢复 Webpack 缓存
      - name: Cache webpack
        uses: actions/cache@v3
        with:
          path: node_modules/.cache/webpack
          key: ${{ runner.os }}-webpack-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-webpack-
      
      - name: Install
        run: npm install
      
      - name: Build
        run: npm run build
```

**效果**：
- 首次构建：180s
- 后续构建：30s（-83%）⚡️

---

#### GitLab CI

```yaml
# .gitlab-ci.yml
build:
  stage: build
  
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - node_modules/.cache/webpack/  # ⭐️ Webpack 缓存
      - node_modules/.cache/babel-loader/  # ⭐️ Babel 缓存
  
  script:
    - npm install
    - npm run build
```

---

## 🐛 常见问题

### 问题 1：缓存不生效？

**症状**：
- 二次构建时间没有明显减少
- 缓存目录为空

**排查步骤**：

```javascript
// 1. 确认配置正确
module.exports = {
  cache: {
    type: 'filesystem',  // ⚠️ 必须显式配置
  }
};

// 2. 检查缓存目录
// node_modules/.cache/webpack/ 是否存在？

// 3. 检查构建依赖
cache: {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename]  // ⚠️ 配置文件变化会清空缓存
  }
}

// 4. 启用调试日志
module.exports = {
  infrastructureLogging: {
    level: 'verbose',  // 查看缓存日志
    debug: /webpack\.cache/
  }
};
```

---

### 问题 2：缓存占用磁盘空间过大？

**症状**：
- `node_modules/.cache/` 目录几个 GB

**解决方案**：

```javascript
// 1. 启用压缩
module.exports = {
  cache: {
    type: 'filesystem',
    compression: 'gzip',  // ⚡️ 压缩缓存文件
  }
};

// 2. 定期清理缓存
// package.json
{
  "scripts": {
    "clean:cache": "rm -rf node_modules/.cache"
  }
}

// 3. 在 .gitignore 中忽略
node_modules/.cache/
```

---

### 问题 3：如何手动清除缓存？

```bash
# 方式 1：删除缓存目录
rm -rf node_modules/.cache

# 方式 2：使用 npm script
npm run clean:cache

# 方式 3：修改缓存版本
# webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',
    version: '1.0.1',  // ⭐️ 改变版本号
  }
};
```

---

### 问题 4：开发环境 vs 生产环境缓存？

**策略**：

```javascript
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    cache: isDev ? {
      // 开发环境：激进缓存
      type: 'filesystem',
      compression: false,  // 不压缩（更快）
    } : {
      // 生产环境：保守缓存
      type: 'filesystem',
      compression: 'gzip',  // 压缩（节省空间）
      version: process.env.CI_COMMIT_SHA,  // CI 环境使用 commit hash
    }
  };
};
```

---

## 🎓 面试攻防

### 问题 1：Webpack 5 的 filesystem cache 原理是什么？

**标准回答**：

```
核心原理：
1. 序列化
   └─ 将模块编译结果序列化为二进制文件

2. 存储
   └─ 保存到 node_modules/.cache/webpack/

3. 缓存 key 生成
   └─ 基于文件内容 + 配置 + 依赖生成 hash

4. 缓存失效
   ├─ 文件内容变化（contenthash）
   ├─ 配置变化（buildDependencies）
   ├─ 依赖变化
   └─ Webpack 版本变化

优势：
  ├─ 持久化（重启不失效）
  ├─ 增量更新（只缓存变化的模块）
  └─ 自动失效（智能判断）
```

**数据支撑**：
"我们项目启用 filesystem cache 后，二次构建时间从 3 分钟减少到 18 秒，提升了 90%。"

---

### 问题 2：babel-loader 的 cacheDirectory 和 Webpack 5 cache 有什么区别？

**对比表格**：

| 特性 | babel-loader cache | Webpack filesystem cache |
|------|-------------------|-------------------------|
| **缓存范围** | 只缓存 Babel 转换结果 | 缓存整个模块编译结果 |
| **缓存位置** | `.cache/babel-loader/` | `.cache/webpack/` |
| **缓存格式** | JSON | 二进制（更高效） |
| **适用版本** | 所有 Webpack 版本 | Webpack 5+ |
| **配置位置** | babel-loader options | webpack.config.js |

**最佳实践**：
- ✅ Webpack 5：**两者都用**（效果叠加）
- ✅ Webpack 4：必须用 babel-loader cache

---

### 问题 3：缓存会在什么情况下失效？

**完整清单**：

```
自动失效：
1. 文件内容变化
   └─ Git commit 后源码变化

2. 配置文件变化
   └─ webpack.config.js 修改

3. 依赖变化
   └─ package.json 或 node_modules 变化

4. Loader/Plugin 配置变化
   └─ loader options 修改

5. Webpack 版本升级
   └─ 自动检测

手动失效：
1. 删除缓存目录
   └─ rm -rf node_modules/.cache

2. 修改 cache.version
   └─ 改变版本号

3. 清空构建目录
   └─ rm -rf dist && npm run build
```

---

### 问题 4：CI/CD 环境如何利用缓存？

**策略**：

```
问题：
  └─ CI/CD 每次都是全新环境
  └─ 无法利用本地缓存

解决方案：
1. 持久化缓存目录
   └─ 使用 CI 的 cache 机制
   
2. 配置缓存路径
   └─ GitHub Actions: actions/cache
   └─ GitLab CI: cache.paths
   └─ Jenkins: cache 插件

3. 使用合适的 cache key
   └─ 基于 package-lock.json hash
   └─ 基于 commit SHA

效果：
  ├─ 首次构建：3 分钟
  └─ 后续构建：30 秒（-83%）
```

**配置示例**：

```yaml
# GitHub Actions
- uses: actions/cache@v3
  with:
    path: node_modules/.cache/webpack
    key: ${{ hashFiles('package-lock.json') }}
```

---

### 问题 5：如何验证缓存是否生效？

**验证方法**：

```bash
# 方式 1：对比构建时间
time npm run build  # 第一次
time npm run build  # 第二次（应该快很多）

# 方式 2：查看缓存目录
ls -lh node_modules/.cache/webpack/
# 应该能看到 .pack 文件

# 方式 3：启用调试日志
# webpack.config.js
module.exports = {
  infrastructureLogging: {
    level: 'verbose',
    debug: /webpack\.cache/
  }
};

# 输出示例：
# [webpack.cache] restore cache content 0.pack (134 ms)
# [webpack.cache] used restore cache from pack (143 ms)
```

---

## 📝 实践建议

### 1. 优先级

```
P0（必须）：
  └─ Webpack 5 filesystem cache

P1（推荐）：
  └─ babel-loader cacheDirectory

P2（可选）：
  └─ 其他 loader 的缓存配置
```

### 2. 配置模板

```javascript
// webpack.config.js（生产级配置）
const path = require('path');

module.exports = {
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
    buildDependencies: {
      config: [__filename],
    },
    compression: 'gzip',
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          }
        }
      }
    ]
  }
};
```

### 3. 监控和维护

- ✅ 定期检查缓存目录大小
- ✅ CI/CD 中配置缓存持久化
- ✅ 记录优化效果（Baseline vs 优化后）

---

## 🚀 下一步

现在你已经掌握了**最有效的优化手段**：
- ✅ 理解缓存原理
- ✅ 掌握 Webpack 5 filesystem cache
- ✅ 掌握 babel-loader 缓存
- ✅ 能够在 CI/CD 中应用缓存

**二次构建时间减少 90%+ 不是梦！** ⚡️⚡️⚡️

**下一步**：学习并行构建优化 - [03-parallel-build.md](./03-parallel-build.md) 🚀

