# Demo 02: 缓存优化

## 📖 学习目标

体验缓存优化带来的**巨大性能提升**（二次构建 -90%+）。

---

## ⚡️ 核心价值

**缓存是构建优化中效果最好、成本最低的手段！**

```
投入：5 分钟配置
产出：90%+ 性能提升 ⚡️⚡️⚡️
ROI：极高！
```

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

---

## 📊 对比实验

### 实验 1：无缓存 vs 有缓存

#### Step 1: 测试无缓存构建

```bash
time npm run build:no-cache
```

**记录时间**：___ 秒

---

#### Step 2: 测试有缓存（首次构建）

```bash
time npm run build:with-cache:first
```

**记录时间**：___ 秒

**预期**：和无缓存差不多（需要建立缓存）

---

#### Step 3: 测试有缓存（二次构建）⭐️

```bash
time npm run build:with-cache:second
```

**记录时间**：___ 秒

**预期**：快 **90%+** ⚡️⚡️⚡️

---

### 实验 2：修改文件后的增量构建

#### Step 1: 修改源代码

```bash
# 修改 src/App.js 中的任意内容
# 例如：修改一个文字
```

#### Step 2: 再次构建

```bash
time npm run build:with-cache
```

**记录时间**：___ 秒

**预期**：仍然很快（增量更新）⚡️

---

## 📈 数据记录表

| 场景 | 无缓存 | 有缓存 | 提升 |
|------|--------|--------|------|
| 首次构建 | ___s | ___s | ___% |
| 二次构建（无变化） | ___s | ___s | ___% |
| 修改一个文件 | ___s | ___s | ___% |

---

## 🔍 深入理解

### 1. 缓存存在哪里？

```bash
# 查看 Webpack 缓存
ls -lh node_modules/.cache/webpack/

# 查看 babel-loader 缓存
ls -lh node_modules/.cache/babel-loader/
```

---

### 2. 缓存的工作原理

```
首次构建：
  源码 → Loader 转换 → 生成缓存 → 输出
  
二次构建：
  源码 → 检查缓存 → 命中 ✅ → 直接使用
         ↓ (跳过 Loader 转换)
  节省 90%+ 时间 ⚡️
```

---

### 3. 缓存何时失效？

```
自动失效：
  ├─ 文件内容变化
  ├─ 配置文件变化
  ├─ 依赖变化
  └─ Webpack 版本升级

手动清除：
  └─ npm run clean
```

---

## 🔧 配置对比

### 无缓存配置

```javascript
// webpack.no-cache.config.js
module.exports = {
  cache: false,  // ❌ 禁用缓存
  
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false  // ❌ babel 也不缓存
          }
        }
      }
    ]
  }
};
```

---

### 有缓存配置 ⭐️

```javascript
// webpack.with-cache.config.js
module.exports = {
  // ⭐️ Webpack 5 filesystem cache
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // ⭐️ babel-loader 缓存
            cacheDirectory: true,
            cacheCompression: false
          }
        }
      }
    ]
  }
};
```

---

## 💡 关键知识点

### 1. 两种缓存的作用

| 缓存类型 | 作用范围 | 缓存位置 | 效果 |
|---------|---------|---------|------|
| **filesystem cache** | 整个模块编译结果 | `node_modules/.cache/webpack/` | ⭐️⭐️⭐️ |
| **babel-loader cache** | Babel 转换结果 | `node_modules/.cache/babel-loader/` | ⭐️⭐️ |

**最佳实践**：两者都用，效果叠加！

---

### 2. 缓存 key 的生成

```javascript
cacheKey = hash(
  文件内容 +
  loader 配置 +
  plugin 配置 +
  依赖关系 +
  Webpack 版本
)
```

**任何一项变化，缓存都会失效。**

---

### 3. 为什么首次构建时间不变？

```
首次构建：
  └─ 需要执行完整的构建流程
  └─ 同时建立缓存文件
  └─ 时间 ≈ 无缓存构建

二次构建：
  └─ 直接读取缓存
  └─ 跳过 Loader 转换
  └─ 时间 ≈ 10% 无缓存构建 ⚡️
```

---

## 🎯 实战技巧

### 技巧 1：清除缓存

```bash
# 完全清除
npm run clean

# 只清除 Webpack 缓存
rm -rf node_modules/.cache/webpack

# 只清除 babel-loader 缓存
rm -rf node_modules/.cache/babel-loader
```

---

### 技巧 2：验证缓存是否生效

```bash
# 1. 查看缓存目录
ls -lh node_modules/.cache/webpack/

# 2. 启用调试日志
# webpack.config.js
module.exports = {
  infrastructureLogging: {
    level: 'verbose',
    debug: /webpack\.cache/
  }
};

# 3. 对比构建时间
time npm run build  # 首次
time npm run build  # 二次（应该快很多）
```

---

### 技巧 3：CI/CD 中使用缓存

```yaml
# .github/workflows/ci.yml
- uses: actions/cache@v3
  with:
    path: node_modules/.cache/webpack
    key: ${{ hashFiles('package-lock.json') }}
```

---

## 📊 性能提升案例

### 小型项目（~500 模块）

```
首次：5s
二次：0.5s（-90%）
```

### 中型项目（~1500 模块）

```
首次：30s
二次：3s（-90%）
```

### 大型项目（~3000 模块）

```
首次：180s
二次：15s（-92%）
```

**结论**：项目越大，缓存效果越明显！

---

## 🎓 面试攻防

### 问题 1：Webpack 5 的 filesystem cache 原理是什么？

**回答要点**：
```
1. 序列化
   └─ 将编译结果序列化为二进制

2. 存储
   └─ 保存到 node_modules/.cache/webpack/

3. 缓存 key
   └─ 基于文件内容、配置、依赖生成

4. 失效条件
   └─ 文件变化、配置变化、依赖变化

效果：二次构建 -90%+ ⚡️
```

---

### 问题 2：babel-loader 的 cacheDirectory 和 Webpack cache 有什么区别？

**对比回答**：

| 特性 | babel-loader cache | Webpack cache |
|------|-------------------|---------------|
| 缓存范围 | 只缓存 Babel 转换 | 缓存整个模块 |
| 缓存格式 | JSON | 二进制 |
| 效果 | ⭐️⭐️ | ⭐️⭐️⭐️ |

**最佳实践**：两者都用！

---

## 🚀 下一步

现在你已经体验了**缓存优化的威力**：
- ✅ 理解缓存原理
- ✅ 配置 filesystem cache
- ✅ 配置 babel-loader cache
- ✅ 二次构建 -90%+ ⚡️⚡️⚡️

**下一个 Demo**：并行构建优化 - `../03-parallel-build/`

---

## 📚 相关文档

- [02-cache-strategies.md](../../docs/02-cache-strategies.md) - 缓存策略详细文档

