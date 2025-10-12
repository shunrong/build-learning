# Demo 2: 静态资源处理

## 📚 学习目标

- 理解 Webpack 5 Asset Modules 的四种类型
- 掌握图片、字体、文本等资源的处理
- 理解何时使用不同的资源类型
- 观察资源的输出路径和文件名

---

## 🎯 Asset Modules 类型

### 1. asset/resource（输出文件）

**替代**：file-loader

```javascript
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset/resource',
  generator: {
    filename: 'images/[name].[hash:8][ext]'
  }
}
```

**效果**：
- 输出文件到 `dist/images/`
- 返回文件路径：`"/images/logo.a1b2c3d4.png"`

**适用场景**：大图片、视频、PDF 等

---

### 2. asset/inline（转 base64）

**替代**：url-loader

```javascript
{
  test: /\.svg$/,
  type: 'asset/inline'
}
```

**效果**：
- 转换为 base64 DataURL
- 返回：`"data:image/svg+xml;base64,PHN2ZyB4..."`
- 不输出文件

**适用场景**：小图标、小图片（< 8KB）

---

### 3. asset（自动选择）

**替代**：url-loader（带 limit）

```javascript
{
  test: /\.(woff|woff2)$/,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024  // 8KB
    }
  }
}
```

**效果**：
- < 8KB：转 base64（asset/inline）
- >= 8KB：输出文件（asset/resource）

**适用场景**：字体、中等大小的图片

---

### 4. asset/source（导出源码）

**替代**：raw-loader

```javascript
{
  test: /\.txt$/,
  type: 'asset/source'
}
```

**效果**：
- 导出为字符串
- 返回：文件内容（string）

**适用场景**：文本文件、模板、SVG（作为字符串）

---

## 🚀 运行步骤

### 1. 准备资源文件

**重要**：这个 Demo 需要一些资源文件才能完整运行。

查看 `src/assets/PLACEHOLDER.md` 了解如何：
- 添加图片文件（images/large-1.jpg、large-2.jpg、pattern.jpg）
- 添加字体文件（fonts/custom-font.woff2）
- 或使用在线占位图（推荐，最简单）

**快速方案**（推荐）：

修改 `src/index.js`，在文件顶部添加：

```javascript
// 使用在线占位图
const largeImage1 = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Image+1';
const largeImage2 = 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Image+2';

// 注释掉原来的 import
// import largeImage1 from './assets/images/large-1.jpg';
// import largeImage2 from './assets/images/large-2.jpg';
```

---

### 2. 安装依赖

```bash
npm install
```

---

### 3. 开发模式

```bash
npm run dev
```

**观察点**：
1. 打开控制台，查看资源路径
2. Network 面板，查看资源加载
3. Elements 面板，查看 SVG 的 base64 编码

---

### 4. 生产构建

```bash
npm run build
```

查看 `dist/` 目录结构：

```
dist/
├── js/
│   └── main.abc123.js
├── images/
│   ├── large-1.def456.jpg
│   ├── large-2.ghi789.jpg
│   └── pattern.jkl012.jpg
├── fonts/
│   └── custom-font.mno345.woff2  (如果 >= 8KB)
└── index.html
```

---

### 5. 对比观察

#### asset/resource（输出文件）

```javascript
import logo from './logo.png';
console.log(logo);  // "/images/logo.a1b2c3d4.png"

// 文件在 dist/images/ 目录
```

#### asset/inline（base64）

```javascript
import icon from './icon.svg';
console.log(icon);  // "data:image/svg+xml;base64,PHN2ZyB4..."

// 没有输出文件，直接内联
```

#### asset（自动选择）

```javascript
// 小文件 (< 8KB)
import smallFont from './small.woff';
console.log(smallFont);  // "data:font/woff;base64,..."

// 大文件 (>= 8KB)
import largeFont from './large.woff2';
console.log(largeFont);  // "/fonts/large.abc123.woff2"
```

---

## 📊 配置详解

### webpack.config.js

```javascript
module.exports = {
  output: {
    // 默认资源输出路径
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  
  module: {
    rules: [
      // 1. 图片：输出文件
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      
      // 2. SVG：转 base64
      {
        test: /\.svg$/,
        type: 'asset/inline'
      },
      
      // 3. 字体：自动选择
      {
        test: /\.(woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        },
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },
      
      // 4. 文本：导出源码
      {
        test: /\.txt$/,
        type: 'asset/source'
      }
    ]
  }
};
```

---

## 💡 关键概念

### 1. 文件名模板

```javascript
generator: {
  filename: 'images/[name].[hash:8][ext]'
}
```

**变量**：
- `[name]`：原文件名
- `[ext]`：扩展名（含 `.`）
- `[hash]`：完整 hash
- `[hash:8]`：8 位 hash
- `[query]`：查询参数

**示例**：
```
logo.png → images/logo.a1b2c3d4.png
icon.svg → images/icon.12345678.svg
```

---

### 2. 阈值配置

```javascript
parser: {
  dataUrlCondition: {
    maxSize: 8 * 1024  // 8KB
  }
}
```

**逻辑**：
- 文件 < 8KB：`asset/inline`（base64）
- 文件 >= 8KB：`asset/resource`（输出文件）

---

### 3. CSS 中的资源

```css
.background {
  background: url('../assets/images/bg.jpg');
}

@font-face {
  src: url('../assets/fonts/font.woff2');
}
```

**css-loader** 会：
1. 解析 `url()` 路径
2. 转换为 `require()`
3. 交由对应的 Asset Module 处理

---

## 🔍 实验任务

### 任务 1：对比文件大小

1. 创建一个 5KB 的图片
2. 创建一个 10KB 的图片
3. 配置阈值为 8KB
4. 观察哪个转 base64，哪个输出文件

---

### 任务 2：自定义输出路径

修改配置，将图片按类型分类：

```javascript
{
  test: /\.(png|jpg|gif)$/,
  type: 'asset/resource',
  generator: {
    filename: (pathData) => {
      if (pathData.filename.includes('icon')) {
        return 'icons/[name].[hash:8][ext]';
      }
      return 'images/[name].[hash:8][ext]';
    }
  }
}
```

---

### 任务 3：计算 base64 增量

1. 原始 SVG 文件：1KB
2. base64 后：约 1.33KB（增加 33%）
3. 权衡：减少 HTTP 请求 vs 增加体积

---

## 🐛 常见问题

### Q1: 图片路径不正确？

**原因**：`publicPath` 配置问题

```javascript
// webpack.config.js
output: {
  publicPath: '/'  // 或 '/static/'
}
```

---

### Q2: 字体文件没有加载？

**原因**：CORS 或路径问题

1. 检查 Network 面板
2. 检查 `@font-face` 的 `url()` 路径
3. 确认字体文件已输出

---

### Q3: base64 后文件变大？

**正常现象**：base64 会增加约 33% 体积

**建议**：
- 只对小文件（< 8KB）使用 base64
- 大文件使用 `asset/resource`

---

## 📚 对比表格

| 类型 | 替代 | 输出文件 | 适用场景 | 体积影响 |
|------|------|---------|---------|---------|
| **asset/resource** | file-loader | ✅ 是 | 大文件 | 无影响 |
| **asset/inline** | url-loader | ❌ 否 | 小文件 | +33% |
| **asset** | url-loader | 根据大小 | 中等文件 | 自动选择 |
| **asset/source** | raw-loader | ❌ 否 | 文本 | 无影响 |

---

## 🎯 最佳实践

1. **图片**：使用 `asset`，阈值 8-10KB
2. **图标**：小图标用 `asset/inline`，大图标用 `asset`
3. **字体**：使用 `asset`，阈值 8KB
4. **文本**：使用 `asset/source`
5. **视频/PDF**：使用 `asset/resource`

---

## 🎯 下一步

完成这个 Demo 后，继续学习：
- [Demo 3: CSS 预处理器](../03-preprocessors/) - Sass/Less 处理

