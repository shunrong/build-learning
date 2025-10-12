# Demo 4: 多页面应用 (MPA) Dev Server 配置

## 📖 学习目标

通过本 Demo，你将掌握：

1. ✅ **多入口配置**：如何配置多个页面入口
2. ✅ **HTML 插件配置**：为每个页面生成独立的 HTML
3. ✅ **资源隔离**：确保每个页面只加载自己的 JS/CSS
4. ✅ **历史路由支持**：配置 `historyApiFallback` 处理路由
5. ✅ **开发体验优化**：多页面应用的开发最佳实践

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器会自动打开首页，并在控制台显示所有可访问的页面。

### 3. 构建生产版本

```bash
npm run build
```

---

## 📂 项目结构

```
04-multi-page/
├── src/
│   ├── pages/                    # 页面目录
│   │   ├── index/                # 首页
│   │   │   ├── index.html
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   ├── about/                # 关于页
│   │   │   ├── index.html
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   ├── contact/              # 联系页
│   │   │   └── ...
│   │   └── dashboard/            # 仪表盘页
│   │       └── ...
│   └── common/                   # 共享资源
│       └── common.css
├── webpack.config.js
├── package.json
└── README.md
```

---

## 🎯 核心配置详解

### 1. 多入口配置

```javascript
module.exports = {
  entry: {
    index: './src/pages/index/index.js',
    about: './src/pages/about/index.js',
    contact: './src/pages/contact/index.js',
    dashboard: './src/pages/dashboard/index.js'
  }
};
```

**说明**：
- 每个页面都有独立的入口文件
- `entry` 的 key 是 chunk 名称
- 打包后会生成 `index.js`、`about.js` 等独立的文件

---

### 2. 输出配置

```javascript
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'js/[name].[contenthash:8].js',
  clean: true
}
```

**说明**：
- `[name]` 会替换为 entry 的 key（index、about 等）
- `[contenthash]` 用于缓存优化
- 所有 JS 文件输出到 `dist/js/` 目录

---

### 3. HTML 插件配置

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/pages/index/index.html',
    filename: 'index.html',      // 输出文件名
    chunks: ['index'],           // 只引入 index 的 JS
    title: '首页'
  }),
  
  new HtmlWebpackPlugin({
    template: './src/pages/about/index.html',
    filename: 'about.html',
    chunks: ['about'],           // 只引入 about 的 JS
    title: '关于我们'
  }),
  
  // ... 其他页面
]
```

**关键配置**：
- `chunks`：指定页面引入哪些 JS bundle
- 不指定 `chunks` 会引入所有的 JS（不推荐）
- 每个页面只加载自己需要的资源

---

### 4. 历史路由支持

```javascript
devServer: {
  historyApiFallback: {
    rewrites: [
      { from: /^\/about/, to: '/about.html' },
      { from: /^\/contact/, to: '/contact.html' },
      { from: /^\/dashboard/, to: '/dashboard.html' }
    ]
  }
}
```

**作用**：
- 访问 `/about` 会返回 `about.html`
- 支持 HTML5 History API 风格的 URL
- 刷新页面不会 404

---

### 5. 自定义启动信息

```javascript
devServer: {
  onListening: function (devServer) {
    const port = devServer.server.address().port;
    const protocol = devServer.options.https ? 'https' : 'http';
    const host = devServer.options.host || 'localhost';
    
    console.log('\n📄 可访问的页面：');
    console.log(`  ${protocol}://${host}:${port}/`);
    console.log(`  ${protocol}://${host}:${port}/about.html`);
    console.log(`  ${protocol}://${host}:${port}/contact.html`);
    console.log(`  ${protocol}://${host}:${port}/dashboard.html`);
  }
}
```

**效果**：
启动服务器时在控制台显示所有可访问的页面链接。

---

## 🔬 实验指南

### 实验 1：页面独立性

**目标**：验证每个页面只加载自己的资源

1. 启动 `npm run dev`
2. 打开浏览器网络面板
3. 访问首页，观察加载的资源：
   - `index.[hash].js`
   - `main.css`

4. 访问关于页，观察加载的资源：
   - `about.[hash].js`
   - `main.css`

5. 注意：
   - ✅ 每个页面只加载自己的 JS
   - ✅ CSS 是共享的（因为使用 style-loader）
   - ✅ 页面切换会重新加载

---

### 实验 2：HMR 效果

**目标**：测试 HMR 在多页面应用中的表现

1. 打开首页
2. 修改 `src/pages/index/index.css`

```css
.hero {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
}
```

3. 观察：
   - ✅ 样式立即更新
   - ✅ 没有刷新页面
   - ✅ 状态保持

4. 修改 `src/pages/index/index.js`
5. 观察：
   - ✅ 页面自动刷新
   - ⚠️ 状态丢失（MPA 特性）

---

### 实验 3：共享资源

**目标**：理解共享 CSS 的使用

1. 所有页面都引入了 `common/common.css`：
```javascript
import '../../common/common.css';
```

2. 修改 `common/common.css` 中的导航栏样式：
```css
.navbar {
  background: #667eea;  /* 改成紫色 */
}

.nav-menu a {
  color: white;
}
```

3. 观察：
   - ✅ 当前页面的导航栏颜色立即改变
   - ⚠️ 其他页面需要刷新才能看到变化（MPA 特性）

---

### 实验 4：构建输出

**目标**：查看生产构建的输出

1. 运行 `npm run build`
2. 查看 `dist` 目录：

```
dist/
├── index.html
├── about.html
├── contact.html
├── dashboard.html
└── js/
    ├── index.[hash].js
    ├── about.[hash].js
    ├── contact.[hash].js
    └── dashboard.[hash].js
```

3. 打开 `dist/index.html`，查看引入的资源：
```html
<script src="js/index.[hash].js"></script>
```

4. 注意：
   - ✅ 每个 HTML 只引入自己的 JS
   - ✅ 使用 contenthash 优化缓存
   - ✅ 所有静态资源都可以直接部署

---

### 实验 5：页面导航

**目标**：体验多页面应用的导航方式

1. 点击导航栏切换页面
2. 观察浏览器行为：
   - ✅ URL 改变
   - ✅ 页面刷新（白屏）
   - ✅ 重新加载资源
   - ⚠️ 状态丢失

3. 对比 SPA（单页面应用）：
   - SPA：无刷新，状态保持
   - MPA：有刷新，状态丢失

---

## 💡 MPA vs SPA 对比

### MPA（多页面应用）

**优点**：
- ✅ 首屏加载快（只加载当前页面）
- ✅ SEO 友好（每个页面都是独立的 HTML）
- ✅ 页面隔离，不会相互影响
- ✅ 开发简单，每个页面独立开发

**缺点**：
- ❌ 页面切换有白屏
- ❌ 重复加载资源（虽然有缓存）
- ❌ 状态不能跨页面保持
- ❌ 用户体验不如 SPA 流畅

### SPA（单页面应用）

**优点**：
- ✅ 切换流畅，无白屏
- ✅ 状态可以全局管理
- ✅ 用户体验好
- ✅ 适合复杂交互

**缺点**：
- ❌ 首屏加载慢
- ❌ SEO 需要特殊处理（SSR）
- ❌ 路由需要额外管理
- ❌ 开发复杂度高

---

## 🎯 适用场景

### 适合 MPA 的场景

1. **内容型网站**：博客、新闻、文档
2. **企业官网**：首页、关于、产品、联系
3. **营销页面**：落地页、活动页
4. **SEO 要求高**：需要搜索引擎收录
5. **简单应用**：页面间关联少

### 适合 SPA 的场景

1. **管理后台**：Dashboard、CRM、ERP
2. **社交应用**：聊天、社区、论坛
3. **在线工具**：编辑器、设计工具
4. **实时应用**：协作工具、游戏
5. **复杂交互**：需要流畅的用户体验

---

## 🛠️ 优化建议

### 1. 提取公共代码

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // 提取共享的第三方库
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      // 提取共享的业务代码
      common: {
        minChunks: 2,
        name: 'common',
        priority: 5
      }
    }
  }
}
```

然后在 HTML 插件中引入：
```javascript
chunks: ['vendors', 'common', 'index']
```

### 2. 预加载其他页面

```html
<link rel="prefetch" href="about.html">
<link rel="prefetch" href="contact.html">
```

### 3. 共享样式提取

```javascript
// 开发环境：style-loader（支持 HMR）
// 生产环境：MiniCssExtractPlugin（提取 CSS）

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    !isDev && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ].filter(Boolean)
};
```

### 4. 懒加载优化

虽然是 MPA，但可以在页面内部使用动态导入：

```javascript
// dashboard/index.js
button.addEventListener('click', async () => {
  const { loadChart } = await import('./chart.js');
  loadChart();
});
```

---

## 🎓 知识点总结

### 1. 配置要点

| 配置项 | 作用 | 重要性 |
|--------|------|--------|
| **entry** | 定义多个入口 | ⭐⭐⭐⭐⭐ |
| **HtmlWebpackPlugin** | 生成多个 HTML | ⭐⭐⭐⭐⭐ |
| **chunks** | 控制资源引入 | ⭐⭐⭐⭐⭐ |
| **historyApiFallback** | 路由支持 | ⭐⭐⭐⭐ |
| **splitChunks** | 代码分割 | ⭐⭐⭐ |

### 2. 最佳实践

1. ✅ **独立目录**：每个页面有自己的目录
2. ✅ **共享资源**：公共代码放在 `common/`
3. ✅ **按需加载**：使用 `chunks` 控制引入
4. ✅ **代码分割**：提取公共代码
5. ✅ **缓存优化**：使用 `contenthash`

### 3. 开发流程

```
1. 新增页面
   ├─ 创建页面目录
   ├─ 编写 HTML、JS、CSS
   ├─ 添加 entry
   └─ 添加 HtmlWebpackPlugin

2. 开发调试
   ├─ npm run dev
   ├─ 修改代码
   └─ 观察 HMR

3. 构建部署
   ├─ npm run build
   ├─ 检查 dist 目录
   └─ 部署到服务器
```

---

## 🐛 常见问题

### 1. 页面加载了所有 JS

**原因**：未配置 `chunks`

**解决**：
```javascript
new HtmlWebpackPlugin({
  chunks: ['index']  // ✅ 只引入 index 的 JS
})
```

### 2. 刷新页面 404

**原因**：未配置 `historyApiFallback`

**解决**：
```javascript
devServer: {
  historyApiFallback: {
    rewrites: [
      { from: /^\/about/, to: '/about.html' }
    ]
  }
}
```

### 3. 共享代码重复打包

**原因**：未配置 `splitChunks`

**解决**：
```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      common: {
        minChunks: 2,
        name: 'common'
      }
    }
  }
}
```

### 4. CSS 没有提取

**原因**：开发环境使用 `style-loader`

**解决**：生产环境使用 `MiniCssExtractPlugin.loader`

---

## 🔗 相关资源

- [HtmlWebpackPlugin 文档](https://github.com/jantimon/html-webpack-plugin)
- [Webpack 多页面配置](https://webpack.js.org/concepts/entry-points/#multi-page-application)
- 本项目文档：`../docs/04-advanced-config.md`

---

## 🎯 总结

多页面应用（MPA）配置的核心：

1. **多入口** + **多 HTML 插件** + **chunks 控制**
2. 适合内容型网站和 SEO 要求高的场景
3. 开发简单，但用户体验不如 SPA
4. 可以通过代码分割和预加载优化性能

完成本 Demo 后，你已经掌握了 MPA 的开发配置！🚀

