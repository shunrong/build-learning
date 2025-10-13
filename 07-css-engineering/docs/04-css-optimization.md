# CSS 优化技巧

## 📖 优化维度

1. **体积优化**：减小 CSS 文件大小
2. **性能优化**：提升加载和渲染速度
3. **开发体验**：提升开发效率

---

## 体积优化

### 1. PurgeCSS - 删除未使用样式

**安装**：
```bash
npm install -D purgecss-webpack-plugin glob
```

**配置**：
```javascript
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const path = require('path');

module.exports = {
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, {
        nodir: true
      }),
      safelist: ['active', 'disabled']  // 保留这些类
    })
  ]
};
```

**效果**：
- Bootstrap: 150KB → 10KB
- Tailwind: 3MB → 10KB

### 2. cssnano - 压缩

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true
      }]
    })
  ]
};
```

### 3. MiniCssExtractPlugin - 提取 CSS

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // 替代 style-loader
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ]
};
```

---

## 性能优化

### 1. 关键 CSS（Critical CSS）

**提取首屏 CSS**：

```bash
npm install -D critical-webpack-plugin
```

```javascript
const CriticalCssPlugin = require('critical-webpack-plugin');

module.exports = {
  plugins: [
    new CriticalCssPlugin({
      base: './dist',
      src: 'index.html',
      target: 'index.html',
      inline: true,
      minify: true,
      width: 1300,
      height: 900
    })
  ]
};
```

### 2. CSS 代码分割

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};
```

### 3. 异步加载 CSS

```javascript
// 动态 import CSS
const loadCSS = async () => {
  await import('./heavy-styles.css');
};

button.addEventListener('click', loadCSS);
```

---

## 开发体验优化

### 1. CSS HMR

```javascript
module.exports = {
  devServer: {
    hot: true  // 启用 HMR
  }
};
```

### 2. Source Map

```javascript
module.exports = {
  devtool: isDev 
    ? 'eval-cheap-module-source-map'
    : 'source-map'
};
```

---

## 🎯 完整优化方案

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'autoprefixer',
                    !isDev && 'cssnano'
                  ].filter(Boolean)
                }
              }
            }
          ]
        }
      ]
    },
    
    plugins: [
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
      }),
      !isDev && new PurgeCSSPlugin({
        paths: glob.sync('./src/**/*', { nodir: true })
      })
    ].filter(Boolean),
    
    optimization: {
      minimizer: [
        new CssMinimizerPlugin()
      ]
    }
  };
};
```

---

## 优化效果对比

| 优化手段 | 优化前 | 优化后 | 效果 |
|---------|--------|--------|------|
| **PurgeCSS** | 150KB | 10KB | ⬇️ 93% |
| **cssnano** | 50KB | 35KB | ⬇️ 30% |
| **Gzip** | 35KB | 10KB | ⬇️ 71% |
| **关键 CSS** | 首屏 3s | 首屏 1s | ⬆️ 66% |

---

**Phase 07 文档已完成！接下来创建 Demo 项目。** 🎉

