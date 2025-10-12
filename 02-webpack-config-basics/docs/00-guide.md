# Phase 02: Webpack 配置系统入门

## 🎯 学习目标

通过这个阶段，你将：
1. **掌握 Entry 的 3 种配置方式**：单入口、多入口、动态入口
2. **掌握 Output 的核心配置**：path、filename、publicPath、clean
3. **理解 Mode 的作用**：development vs production 的差异
4. **理解配置文件的多种形式**：JS、TS、函数式配置
5. **掌握输出文件命名策略**：hash、chunkhash、contenthash 的区别

## 📚 学习路径

```
理论学习（1.5-2小时）
    ↓
1. 阅读 docs/01-entry-output.md         (45分钟) - Entry/Output 详解
2. 阅读 docs/02-mode-concept.md          (30分钟) - Mode 概念
3. 阅读 docs/03-config-file.md           (30分钟) - 配置文件形式
    ↓
实践体验（2-3小时）
    ↓
4. 运行 demos/01-single-entry/           (30分钟) - 单入口应用
5. 运行 demos/02-multi-entry/            (45分钟) - 多入口应用
6. 运行 demos/03-dynamic-entry/          (30分钟) - 动态入口
7. 运行 demos/04-output-patterns/        (45分钟) - 输出命名策略
    ↓
深入实践（2小时）
    ↓
8. 修改配置，观察变化                      (1小时)
9. 自己实现多页应用配置                     (1小时)
    ↓
总结反思（30分钟）
    ↓
10. 总结 Entry/Output/Mode 的核心要点
```

## 📖 文档列表

### 1. [Entry 和 Output 配置详解](./01-entry-output.md)
- Entry 的 3 种配置方式
- Output 的核心配置项
- 路径和文件名的处理
- publicPath 的作用

### 2. [Mode 概念详解](./02-mode-concept.md)
- development 模式做了什么
- production 模式做了什么
- 如何切换模式
- 自定义优化配置

### 3. [配置文件的多种形式](./03-config-file.md)
- 基础 JS 配置
- 函数式配置
- Promise 配置
- 多配置文件
- TypeScript 配置

## 🎮 Demo 列表

### Demo 1: [单入口应用配置](../demos/01-single-entry/)
**场景**：最常见的单页应用（SPA）配置

**核心内容**：
- ✅ 单个 entry 配置
- ✅ 基础 output 配置
- ✅ development vs production 对比
- ✅ Source Map 配置

**运行方式**：
```bash
cd demos/01-single-entry
npm install
npm run dev      # 开发模式
npm run build    # 生产模式
```

---

### Demo 2: [多入口应用配置](../demos/02-multi-entry/)
**场景**：多页应用（MPA），如官网有多个独立页面

**核心内容**：
- ✅ 多个 entry 配置
- ✅ 多个 HTML 页面生成
- ✅ 页面间的代码复用
- ✅ 公共依赖提取

**运行方式**：
```bash
cd demos/02-multi-entry
npm install
npm start        # 开发服务器
npm run build    # 生产构建
```

---

### Demo 3: [动态入口配置](../demos/03-dynamic-entry/)
**场景**：根据条件动态生成入口，如微前端、插件系统

**核心内容**：
- ✅ 函数式 entry 配置
- ✅ 动态发现入口文件
- ✅ 批量生成页面
- ✅ 实际应用场景

**运行方式**：
```bash
cd demos/03-dynamic-entry
npm install
npm run build
```

---

### Demo 4: [输出文件命名策略](../demos/04-output-patterns/)
**场景**：理解和使用各种 hash 实现长期缓存

**核心内容**：
- ✅ hash vs chunkhash vs contenthash
- ✅ 文件名模板变量
- ✅ 长期缓存策略
- ✅ 性能优化实践

**运行方式**：
```bash
cd demos/04-output-patterns
npm install
npm run build
npm run build:watch  # 监听变化，观察 hash
```

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 能说出 Entry 的 3 种配置方式及适用场景
- [ ] 能解释 path 和 publicPath 的区别
- [ ] 能说出 hash/chunkhash/contenthash 的区别
- [ ] 能解释 development 和 production 模式的差异
- [ ] 能画出多入口应用的打包流程

### 实践层面
- [ ] 能配置单页应用（SPA）
- [ ] 能配置多页应用（MPA）
- [ ] 能实现动态入口
- [ ] 能根据需求选择合适的 hash 策略
- [ ] 能配置合理的输出文件名

### 面试攻防
能够清晰回答以下面试问题：

1. **Webpack 的 entry 有哪几种配置方式？分别适用于什么场景？**
2. **path 和 publicPath 有什么区别？什么时候需要配置 publicPath？**
3. **hash、chunkhash、contenthash 有什么区别？如何选择？**
4. **development 和 production 模式的区别是什么？**
5. **如何实现多页应用的配置？**
6. **如何实现长期缓存策略？**

## 🎯 核心知识点

### 1. Entry 配置的 3 种方式

```javascript
// 方式 1: 字符串（单入口）
module.exports = {
  entry: './src/index.js'
};

// 方式 2: 对象（多入口）
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};

// 方式 3: 函数（动态入口）
module.exports = {
  entry: () => {
    return {
      app: './src/app.js',
      admin: './src/admin.js'
    };
  }
};
```

### 2. Output 核心配置

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),      // 输出目录（绝对路径）
    filename: '[name].[contenthash:8].js',      // 输出文件名
    publicPath: '/assets/',                      // 公共路径
    clean: true,                                 // 清空输出目录
    assetModuleFilename: 'images/[hash][ext]'   // 静态资源文件名
  }
};
```

### 3. Hash 策略对比

| 类型 | 更新时机 | 适用场景 |
|------|---------|---------|
| **hash** | 任何文件变化都会改变 | ❌ 不推荐 |
| **chunkhash** | 同一个 chunk 的文件变化才改变 | ✅ JS 文件 |
| **contenthash** | 文件内容变化才改变 | ✅ CSS 文件 |

### 4. Mode 对比

| 特性 | development | production |
|------|-------------|------------|
| **代码压缩** | ❌ 不压缩 | ✅ 压缩混淆 |
| **Source Map** | ✅ 完整 | ⚠️ 简化或无 |
| **Tree Shaking** | ❌ 不开启 | ✅ 开启 |
| **热更新** | ✅ 支持 | ❌ 不需要 |
| **构建速度** | ✅ 快 | ⚠️ 慢 |
| **文件体积** | ⚠️ 大 | ✅ 小 |

## 💡 学习建议

### 1. 循序渐进
- 先理解单入口，再学多入口
- 先掌握基础配置，再学高级技巧
- 先跑通 Demo，再修改实验

### 2. 对比学习
- 对比开发模式和生产模式的打包结果
- 对比不同 hash 策略的效果
- 对比单入口和多入口的配置差异

### 3. 实际应用
- 思考自己项目的入口配置
- 思考如何优化缓存策略
- 思考如何组织多页应用

### 4. 记录实验
建议创建一个实验笔记：
```markdown
## 实验 1: hash vs chunkhash vs contenthash

### 实验步骤
1. 使用 hash: 修改 JS，CSS hash 都变了
2. 使用 chunkhash: 修改 JS，CSS hash 也变了（因为在同一个 chunk）
3. 使用 contenthash: 修改 JS，CSS hash 不变 ✅

### 结论
CSS 应该使用 contenthash，实现独立缓存
```

## 🎯 下一步

完成 Phase 02 后，继续学习：
- **Phase 03**: Loader 机制深入 - 处理 CSS、图片等非 JS 资源
- **Phase 04**: Plugin 机制深入 - 深入理解插件系统

---

## 📝 预计学习时间

- **快速模式**：4 小时（快速浏览 + 运行 Demo）
- **标准模式**：8 小时（仔细阅读 + 实践 + 总结）
- **深入模式**：2 天（研究细节 + 自己实现 + 扩展实验）

选择适合自己的节奏，重要的是理解透彻，而不是完成速度。

---

## 🎓 进阶挑战

完成基础学习后，可以尝试：

1. **实现一个真实的多页应用**
   - 多个独立页面
   - 共享公共代码
   - 合理的缓存策略

2. **实现一个微前端基座**
   - 动态加载子应用
   - 子应用独立打包
   - 运行时集成

3. **优化现有项目的配置**
   - 分析当前配置的问题
   - 应用本阶段学到的知识
   - 测量优化效果

记住：**最好的学习是解决实际问题！** 🚀

