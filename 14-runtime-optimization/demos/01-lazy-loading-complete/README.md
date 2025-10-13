# Demo 01: 懒加载综合示例

## 📖 Demo 说明

本 Demo 展示了**四种懒加载场景**的完整实现：

1. **图片懒加载** - Intersection Observer API
2. **组件懒加载** - React.lazy + Suspense
3. **路由懒加载** - React Router + 动态 import
4. **第三方库懒加载** - 动态 import 按需加载

## 🎯 学习目标

- 掌握 Intersection Observer API 实现图片懒加载
- 理解 React.lazy 的工作原理
- 学会路由级别的懒加载
- 掌握第三方库的按需加载

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

访问 http://localhost:xxxx，体验各种懒加载效果。

### 3. 生产构建

```bash
npm run build
```

查看 `dist/` 目录，观察代码分割结果。

## 🔍 功能演示

### 1. 图片懒加载

**实现方式**：Intersection Observer API

**效果**：
- 滚动到图片附近才开始加载
- 显示加载中占位符
- 加载完成后淡入效果

**验证**：
1. 打开 Chrome DevTools - Network 面板
2. 刷新页面
3. 滚动页面
4. 观察图片按需加载

### 2. 组件懒加载

**实现方式**：React.lazy + Suspense

**效果**：
- 点击按钮才加载组件
- 显示加载中状态
- 组件单独打包为 chunk

**验证**：
1. 打开 Network 面板
2. 点击"加载重型组件"
3. 观察 `heavy-component.xxx.chunk.js` 加载

### 3. 路由懒加载

**实现方式**：React Router + dynamic import

**效果**：
- 访问路由时才加载页面代码
- 首屏不加载其他页面代码
- 路由切换时显示加载状态

**验证**：
1. 打开 Network 面板
2. 切换不同路由
3. 观察对应的 chunk 文件加载

### 4. 第三方库懒加载

**实现方式**：dynamic import

**效果**：
- 使用时才加载图表库
- 库代码单独打包
- 避免首屏加载大型库

**验证**：
1. 打开 Network 面板
2. 点击"显示图表"
3. 观察图表库加载

## 📊 性能对比

| 场景 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 首屏 Bundle | 500 KB | 150 KB | 70% ↓ |
| 首屏加载时间 | 3.0s | 1.0s | 67% ↓ |
| FCP | 2.5s | 0.8s | 68% ↓ |
| 总请求数（首屏） | 1 | 3 | - |

## 💡 最佳实践

1. **图片懒加载**：`rootMargin: '50px'` 提前加载
2. **组件懒加载**：提供友好的 loading 状态
3. **路由懒加载**：使用 Suspense fallback
4. **库懒加载**：使用 Magic Comments 命名 chunk

## 📚 相关文档

- `docs/01-lazy-loading.md` - 懒加载深度解析
- `docs/02-prefetch-preload.md` - 预加载优化

---

**下一步**：尝试在实际项目中应用懒加载优化！

