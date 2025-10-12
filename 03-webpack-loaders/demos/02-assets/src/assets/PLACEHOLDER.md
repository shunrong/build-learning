# 占位文件说明

由于无法在代码中创建真实的二进制文件（图片、字体等），这里使用占位说明。

## 需要手动添加的文件

### 图片文件（放在 `images/` 目录）

1. **large-1.jpg** - 大图片 1（建议 > 50KB）
   - 用于演示 `asset/resource` 类型
   - 会被输出到 `dist/images/` 目录

2. **large-2.jpg** - 大图片 2（建议 > 50KB）
   - 用于演示 `asset/resource` 类型
   - 会被输出到 `dist/images/` 目录

3. **pattern.jpg** - 背景图案（任意大小）
   - 用于 CSS `url()` 引用
   - 演示 CSS 中的图片处理

### 字体文件（放在 `fonts/` 目录）

1. **custom-font.woff2** - 自定义字体
   - 用于演示 `asset` 类型（自动选择）
   - < 8KB 会转 base64
   - >= 8KB 会输出到 `dist/fonts/` 目录

## 如何获取占位资源

### 方案 1：使用在线占位图（推荐）

修改 `src/index.js`，使用在线图片：

\`\`\`javascript
// 使用占位图服务
const largeImage1 = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Image+1';
const largeImage2 = 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Image+2';
\`\`\`

### 方案 2：生成本地图片

使用 ImageMagick 或在线工具生成：

\`\`\`bash
# 使用 ImageMagick 生成
convert -size 400x300 gradient:#667eea-#764ba2 large-1.jpg
convert -size 400x300 gradient:#764ba2-#667eea large-2.jpg
convert -size 200x200 pattern:checkerboard pattern.jpg
\`\`\`

### 方案 3：下载免费资源

- 图片：[Unsplash](https://unsplash.com/)
- 字体：[Google Fonts](https://fonts.google.com/)

## 或者修改代码

如果不想添加真实文件，可以修改 `src/index.js`：

\`\`\`javascript
// 使用 Canvas 生成占位图
function createPlaceholder(text, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 文字
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
}

// 使用
const largeImage1 = createPlaceholder('Image 1', 400, 300);
const largeImage2 = createPlaceholder('Image 2', 400, 300);
\`\`\`

## Demo 仍然可以运行

即使没有真实的资源文件，Demo 的核心逻辑（Webpack 配置、Loader 使用）仍然是正确的。

添加真实资源后，可以：
- 观察文件输出
- 对比文件大小
- 验证 base64 转换
- 测试缓存策略

