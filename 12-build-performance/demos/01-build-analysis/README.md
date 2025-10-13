# Demo 01: 构建分析工具

## 📖 学习目标

掌握使用分析工具定位 Webpack 构建性能瓶颈的方法。

---

## 🛠️ 使用的工具

### 1. speed-measure-webpack-plugin ⭐️⭐️⭐️

**作用**：测量每个 Loader 和 Plugin 的耗时。

**输出示例**：
```
SMP  ⏱  General output time took 5.234 secs

SMP  ⏱  Loaders
babel-loader took 3.456 secs
  module count = 15
css-loader, and style-loader took 1.234 secs
  module count = 2
```

---

### 2. webpack-bundle-analyzer ⭐️⭐️⭐️

**作用**：可视化分析打包体积。

**功能**：
- 查看每个模块的体积
- 识别重复打包
- 找出体积大户

---

### 3. webpack --profile --json

**作用**：生成完整的构建统计信息。

**用途**：
- 深度分析构建过程
- 上传到在线工具分析

---

## 🚀 使用方法

### 安装依赖

```bash
npm install
```

---

### 方式 1：测量构建耗时

```bash
npm run build:measure
```

**查看结果**：
- 打开 `build-measure.txt` 文件
- 查看每个 Loader/Plugin 的耗时
- 找出最慢的环节

**输出示例**：
```
SMP  ⏱  General output time took 5.234 secs

SMP  ⏱  Loaders
babel-loader took 3.456 secs (66%)  ← ⚠️ 主要瓶颈
  module count = 15
  
css-loader, and style-loader took 1.234 secs (24%)
  module count = 2

SMP  ⏱  Plugins
HtmlWebpackPlugin took 0.456 secs (9%)
```

---

### 方式 2：分析打包体积

#### Step 1: 生成分析数据

```bash
npm run build:analyze
```

这会生成 `stats.json` 文件。

#### Step 2: 查看可视化报告

```bash
npm run analyze
```

浏览器会自动打开，显示可视化的体积分析报告。

**你会看到**：
- 📊 交互式的树状图
- 📦 每个模块的体积
- 🔍 可以放大缩小查看细节

---

### 方式 3：普通构建

```bash
npm run build
```

生成生产环境的打包文件。

---

## 📊 分析要点

### 1. 从 build-measure.txt 分析耗时

**查看要点**：

```
问题 1：哪个 Loader 最慢？
  └─ 如果是 babel-loader → 考虑缓存优化

问题 2：处理了多少模块？
  └─ module count 过多 → 考虑减少构建范围

问题 3：耗时占比多少？
  └─ 占比 > 50% → 优先优化这个环节
```

---

### 2. 从 bundle-report 分析体积

**查看要点**：

```
问题 1：哪个依赖最大？
  └─ 可能的优化：Externals、按需引入

问题 2：是否有重复打包？
  └─ 同一个库被打包多次

问题 3：是否有不需要的代码？
  └─ 如 moment.js 的 locale 文件
```

---

## 🎯 实战练习

### 练习 1：找出最慢的 Loader

1. 运行 `npm run build:measure`
2. 查看 `build-measure.txt`
3. 回答：
   - 哪个 Loader 最耗时？
   - 占总时间的百分比？
   - 处理了多少个模块？

---

### 练习 2：分析包体积

1. 运行 `npm run build:analyze`
2. 运行 `npm run analyze`
3. 回答：
   - 最大的依赖是什么？
   - React 和 React-DOM 占多大？
   - 你的业务代码占多大？

---

### 练习 3：对比优化效果

**场景**：假设你要添加 `lodash` 依赖

```bash
# 1. 先记录当前体积
npm run build:analyze
# 记录总体积

# 2. 安装 lodash
npm install lodash

# 3. 在 App.js 中使用
import _ from 'lodash';
// ...使用 lodash

# 4. 再次分析
npm run build:analyze
npm run analyze

# 5. 对比体积变化
```

**思考**：
- 体积增加了多少？
- lodash 占了多大？
- 如何优化？（提示：lodash-es + Tree Shaking）

---

## 💡 优化建议

基于分析结果，可能的优化方向：

### 如果 babel-loader 慢：
```javascript
// webpack.config.js
{
  loader: 'babel-loader',
  options: {
    cacheDirectory: true  // ⭐️ 启用缓存
  }
}
```

### 如果包体积大：
```javascript
// webpack.config.js
externals: {
  'react': 'React',
  'react-dom': 'ReactDOM'
}
```

### 如果有重复模块：
```javascript
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

---

## 📝 分析报告模板

将你的分析结果填入以下模板：

```markdown
## 构建分析报告

### 构建耗时分析

**总构建时间**：___ 秒

**Loader 耗时排名**：
1. babel-loader: ___ 秒（____%）
2. css-loader: ___ 秒（____%）
3. ...

**优化建议**：
- [ ] ...

---

### 包体积分析

**总体积（未压缩）**：___ MB

**体积排名**：
1. react: ___ KB
2. react-dom: ___ KB
3. ...

**优化建议**：
- [ ] ...
```

---

## 🎓 关键知识点

### 1. 为什么要先分析？

❌ **错误**：盲目优化
```
看到文章说要用 thread-loader
→ 直接加上
→ 反而变慢了（小项目，Worker 开销大）
```

✅ **正确**：分析后优化
```
分析发现：babel-loader 占 70% 时间
→ 针对性优化：启用缓存
→ 效果：构建时间减少 50%
```

---

### 2. 分析工具的选择

| 工具 | 分析内容 | 适用场景 |
|------|---------|---------|
| speed-measure | 构建耗时 | 优化构建速度 |
| bundle-analyzer | 包体积 | 优化打包体积 |
| webpack --profile | 完整统计 | 深度分析 |

**建议**：
- 🚀 首次优化：speed-measure + bundle-analyzer
- 🔍 深度分析：webpack --profile --json

---

### 3. 优化的优先级

```
优先级排序：
1. 效果最好的（如缓存 -90%）
2. 成本最低的（配置简单）
3. 风险最小的（不会引入新问题）

本 Demo 的分析就是帮你确定优先级！
```

---

## 🚀 下一步

分析完成后，进入下一个 Demo：
- **Demo 02: 缓存优化** - 体验缓存带来的巨大提升

---

## 📚 相关文档

- [01-build-analysis.md](../../docs/01-build-analysis.md) - 构建分析详细文档
- [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

