# Phase 14: 运行时优化 - 学习指南

## 📖 阶段概述

**运行时优化**是性能优化的最后一环，也是用户最直接感知的部分。前面我们优化了构建速度（Phase 12）和 Bundle 体积（Phase 13），现在要优化**用户实际使用时的性能**。

本阶段将学习：
- 如何通过懒加载减少首屏加载时间
- 如何使用 Prefetch/Preload 预加载资源
- 如何使用 Module Federation 构建微前端架构
- 如何监控和优化运行时性能

## 🎯 学习目标

### 核心目标

1. **掌握懒加载技术**
   - 图片懒加载（Intersection Observer）
   - 组件懒加载（React.lazy）
   - 路由懒加载（dynamic import）
   - 第三方库懒加载

2. **理解资源预加载**
   - Prefetch vs Preload 的区别
   - 资源优先级和加载时机
   - 实际应用场景和最佳实践

3. **掌握 Module Federation**
   - 微前端架构理解
   - 远程模块加载
   - 共享依赖和版本管理
   - 独立部署和动态更新

4. **运行时性能监控**
   - 首屏加载时间（FCP/LCP）
   - 交互响应时间（FID/INP）
   - 布局稳定性（CLS）
   - 性能监控和上报

### 技能目标

- ✅ 能够实现各种场景的懒加载
- ✅ 合理使用 Prefetch/Preload 优化用户体验
- ✅ 掌握 Module Federation 的配置和使用
- ✅ 能够监控和分析运行时性能
- ✅ 能够优化实际项目的运行时性能

## 📚 学习路径

### 第一步：懒加载深度解析（1-2天）

**学习内容**：
- 懒加载的原理和实现
- Intersection Observer API
- React.lazy 和 Suspense
- dynamic import() 语法
- 第三方库按需加载

**实践项目**：
- 图片懒加载 Demo
- 组件懒加载 Demo
- 路由懒加载 Demo
- 库懒加载 Demo

**验证标准**：
- [ ] 理解懒加载的触发时机
- [ ] 掌握 Intersection Observer 用法
- [ ] 能够实现各种场景的懒加载
- [ ] 理解懒加载对性能的影响

### 第二步：Prefetch 和 Preload（1天）

**学习内容**：
- Prefetch 的原理和使用
- Preload 的原理和使用
- 两者的区别和应用场景
- Webpack 的 Magic Comments
- 资源优先级和加载策略

**实践项目**：
- Prefetch/Preload 对比 Demo
- 资源优先级测试
- 实际场景应用

**验证标准**：
- [ ] 理解 Prefetch 和 Preload 的区别
- [ ] 掌握资源优先级
- [ ] 能够合理选择预加载策略
- [ ] 理解对首屏性能的影响

### 第三步：Module Federation 微前端（1-2天）

**学习内容**：
- Module Federation 原理
- 微前端架构模式
- 远程模块配置
- 共享依赖管理
- 版本兼容性
- 独立部署策略

**实践项目**：
- 基础 Module Federation Demo
- 多应用集成示例
- 共享依赖优化
- 动态加载和错误处理

**验证标准**：
- [ ] 理解 Module Federation 原理
- [ ] 掌握远程模块配置
- [ ] 能够处理依赖共享
- [ ] 理解微前端架构优势

### 第四步：运行时性能监控（1天）

**学习内容**：
- Core Web Vitals（LCP/FID/CLS）
- Performance API
- PerformanceObserver
- 性能指标采集
- 性能数据上报
- 性能优化策略

**实践项目**：
- 性能监控 SDK
- 性能数据可视化
- 性能优化实战

**验证标准**：
- [ ] 理解核心性能指标
- [ ] 掌握性能监控 API
- [ ] 能够采集和分析性能数据
- [ ] 能够根据数据优化性能

## 📝 文档清单

| 序号 | 文档 | 内容 | 重要性 |
|------|------|------|--------|
| 1 | `01-lazy-loading.md` | 懒加载深度解析 | ⭐⭐⭐⭐⭐ |
| 2 | `02-prefetch-preload.md` | Prefetch/Preload | ⭐⭐⭐⭐ |
| 3 | `03-module-federation.md` | Module Federation | ⭐⭐⭐⭐⭐ |
| 4 | `04-performance-monitoring.md` | 性能监控 | ⭐⭐⭐⭐ |

## 🛠️ Demo 清单

| 序号 | Demo | 内容 | 难度 |
|------|------|------|------|
| 1 | `01-lazy-loading-complete/` | 懒加载综合示例 | ⭐⭐⭐ |
| 2 | `02-prefetch-preload/` | 预加载对比 | ⭐⭐⭐ |
| 3 | `03-module-federation/` | 微前端实战 | ⭐⭐⭐⭐⭐ |
| 4 | `04-performance-optimization/` | 性能综合优化 | ⭐⭐⭐⭐ |

## ✅ 验证标准

完成本阶段学习后，你应该能够：

### 理论知识

- [ ] 解释懒加载的原理和实现方式
- [ ] 说明 Prefetch 和 Preload 的区别
- [ ] 解释 Module Federation 的工作原理
- [ ] 理解 Core Web Vitals 各项指标
- [ ] 说明运行时性能优化的策略

### 实践能力

- [ ] 实现各种场景的懒加载
- [ ] 合理使用 Prefetch/Preload
- [ ] 配置和使用 Module Federation
- [ ] 搭建性能监控系统
- [ ] 分析和优化实际项目性能

### 面试能力

- [ ] 能够回答懒加载相关问题
- [ ] 能够解释资源加载优化策略
- [ ] 能够讨论微前端架构方案
- [ ] 能够分析性能优化案例

## 🎓 面试高频问题

### 懒加载相关

1. **Q: 什么是懒加载？为什么需要懒加载？**
   - 考察：基础概念、性能优化意识

2. **Q: React.lazy 的原理是什么？**
   - 考察：React 底层、Suspense 机制

3. **Q: 图片懒加载如何实现？有哪些方案？**
   - 考察：Intersection Observer、实战经验

### Prefetch/Preload 相关

4. **Q: Prefetch 和 Preload 的区别是什么？**
   - 考察：资源加载、优先级理解

5. **Q: 什么场景下使用 Prefetch？什么场景使用 Preload？**
   - 考察：实际应用、最佳实践

### Module Federation 相关

6. **Q: Module Federation 解决了什么问题？**
   - 考察：微前端、架构设计

7. **Q: Module Federation 的共享依赖是如何工作的？**
   - 考察：深度理解、版本管理

8. **Q: Module Federation vs iframe vs single-spa？**
   - 考察：微前端方案对比

### 性能监控相关

9. **Q: 什么是 LCP/FID/CLS？如何优化？**
   - 考察：Core Web Vitals、性能优化

10. **Q: 如何监控首屏加载时间？**
    - 考察：Performance API、实战经验

## 💡 学习建议

### 1. 循序渐进

- 从简单的图片懒加载开始
- 逐步深入到组件、路由懒加载
- 最后学习 Module Federation

### 2. 动手实践

- 每个概念都通过 Demo 验证
- 在实际项目中应用
- 对比优化前后的性能

### 3. 理解原理

- 不只是会用，要理解为什么
- 深入研究浏览器加载机制
- 理解 Webpack 的懒加载实现

### 4. 性能为先

- 始终关注性能指标
- 使用 Chrome DevTools 分析
- 建立性能优化思维

### 5. 关联学习

- 结合 Phase 12-13 的知识
- 理解构建优化和运行时优化的关系
- 形成完整的性能优化体系

## 🔗 参考资源

### 官方文档

- [Webpack Lazy Loading](https://webpack.js.org/guides/lazy-loading/)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Web Vitals](https://web.dev/vitals/)

### 推荐阅读

- [Lazy Loading Images and Video](https://web.dev/lazy-loading/)
- [Preload, Prefetch And Priorities](https://web.dev/preload-critical-assets/)
- [Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [User-centric Performance Metrics](https://web.dev/user-centric-performance-metrics/)

### 工具

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

## 📈 学习进度追踪

- [ ] 完成所有文档阅读
- [ ] 完成所有 Demo 实践
- [ ] 理解核心概念和原理
- [ ] 能够独立实现优化方案
- [ ] 完成面试题自测

---

**准备好了吗？** 让我们开始运行时优化的学习之旅！🚀

