# Demo 3: 动态入口配置

## 📖 说明

这个示例演示如何使用**函数式配置**和 **glob** 模式自动发现入口文件，实现动态入口配置。

---

## 🎯 学习目标

- 理解动态入口配置的原理
- 掌握 glob 模式匹配文件
- 学会自动生成 HtmlWebpackPlugin
- 理解适用场景和最佳实践

---

## 🚀 运行方式

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式（推荐）
```bash
npm run dev
```

浏览器会自动打开 http://localhost:8080，显示第一个页面（page1.html）

**在浏览器中切换页面**：
- http://localhost:8080/page1.html
- http://localhost:8080/page2.html
- http://localhost:8080/page3.html
- http://localhost:8080/page4.html

**支持热更新**：修改代码后，页面会自动刷新

### 3. 生产构建
```bash
npm run build
```

**观察输出**：
```
🔧 动态入口配置：
  - 发现 4 个页面: [ 'page1', 'page2', 'page3', 'page4' ]
  - 入口配置: {
      page1: './src/pages/page1/index.js',
      page2: './src/pages/page2/index.js',
      page3: './src/pages/page3/index.js',
      page4: './src/pages/page4/index.js'
    }
```

### 4. 查看构建结果
```bash
ls -lh dist/

# 输出：
# page1.html
# page2.html
# page3.html
# page4.html
# page1.[hash].js
# page2.[hash].js
# page3.[hash].js
# page4.[hash].js
# common.[hash].js    (公共代码)
# runtime.[hash].js   (runtime)
```

### 5. 打开构建后的页面
```bash
open dist/page1.html
```

---

## 🔍 核心原理

### 1. 动态发现入口文件

```javascript
const glob = require('glob');

function getEntries() {
  const entries = {};
  
  // 使用 glob 匹配所有入口文件
  const files = glob.sync('./src/pages/*/index.js');
  
  files.forEach(file => {
    // 提取页面名称
    const match = file.match(/\/pages\/(.+)\/index\.js$/);
    if (match) {
      const pageName = match[1];
      entries[pageName] = file;
    }
  });
  
  return entries;
}

// 返回：
// {
//   page1: './src/pages/page1/index.js',
//   page2: './src/pages/page2/index.js',
//   ...
// }
```

**工作流程**：
```
1. glob.sync() 扫描文件系统
    ↓
2. 匹配 src/pages/*/index.js
    ↓
3. 提取页面名称（正则表达式）
    ↓
4. 构建 entries 对象
    ↓
5. 返回给 Webpack
```

---

### 2. 动态生成 HTML 插件

```javascript
function getHtmlPlugins() {
  const plugins = [];
  
  // 匹配所有 HTML 模板
  const htmlFiles = glob.sync('./src/pages/*/index.html');
  
  htmlFiles.forEach(file => {
    const match = file.match(/\/pages\/(.+)\/index\.html$/);
    if (match) {
      const pageName = match[1];
      
      plugins.push(
        new HtmlWebpackPlugin({
          template: file,
          filename: `${pageName}.html`,
          chunks: [pageName],
          title: `${pageName} - 动态入口示例`
        })
      );
    }
  });
  
  return plugins;
}

// 使用
module.exports = {
  plugins: getHtmlPlugins()
};
```

**效果**：
- 自动为每个页面创建 HtmlWebpackPlugin 实例
- 无需手动添加

---

### 3. 完整配置

```javascript
module.exports = (env, argv) => {
  return {
    // 动态入口
    entry: getEntries(),
    
    // 动态插件
    plugins: getHtmlPlugins()
  };
};
```

---

## 🧪 动手实验

### 实验 1：添加新页面

**步骤**：
```bash
# 1. 创建新页面目录
mkdir src/pages/page5

# 2. 复制模板文件
cp src/pages/page1/index.html src/pages/page5/
cp src/pages/page1/index.js src/pages/page5/

# 3. 修改内容（可选）
# 编辑 src/pages/page5/index.html
# 编辑 src/pages/page5/index.js

# 4. 重新构建
npm run build

# 5. 查看结果
ls dist/
```

**结果**：
```
dist/
├── page1.html  ✅
├── page2.html  ✅
├── page3.html  ✅
├── page4.html  ✅
├── page5.html  ✅ 新页面自动出现！
└── ...
```

**观察控制台**：
```
🔧 动态入口配置：
  - 发现 5 个页面: [ 'page1', 'page2', 'page3', 'page4', 'page5' ]
```

---

### 实验 2：删除页面

```bash
# 删除 page4
rm -rf src/pages/page4

# 重新构建
npm run build

# page4 相关文件不会再生成
ls dist/
```

---

### 实验 3：自定义匹配规则

修改 `webpack.config.js`：

```javascript
// 只匹配以数字开头的页面
const files = glob.sync('./src/pages/[0-9]*/index.js');

// 或：排除某些页面
const files = glob.sync('./src/pages/!(test-*)/index.js');

// 或：匹配多层嵌套
const files = glob.sync('./src/**/page-*/index.js');
```

---

## 📊 Glob 模式说明

### 基础语法

| 模式 | 说明 | 示例 |
|------|------|------|
| `*` | 匹配任意字符（不含 `/`） | `*.js` |
| `**` | 匹配任意字符（含 `/`） | `**/*.js` |
| `?` | 匹配单个字符 | `page?.js` |
| `[abc]` | 匹配字符集 | `page[123].js` |
| `{a,b}` | 匹配选项 | `{foo,bar}.js` |
| `!(pattern)` | 排除模式 | `!(test).js` |

### 示例

```javascript
// 匹配所有 JS 文件
glob.sync('**/*.js');

// 匹配 pages 下的 index.js
glob.sync('./src/pages/*/index.js');

// 匹配多个扩展名
glob.sync('./src/**/*.{js,ts}');

// 排除 node_modules
glob.sync('./src/**/*.js', {
  ignore: '**/node_modules/**'
});
```

---

## 💡 实际应用场景

### 1. 微前端

```javascript
// 自动发现子应用
const subApps = glob.sync('./apps/*/src/index.js');

entry: subApps.reduce((acc, file) => {
  const name = path.basename(path.dirname(path.dirname(file)));
  acc[name] = file;
  return acc;
}, {})
```

### 2. 插件系统

```javascript
// 自动加载所有插件
const plugins = glob.sync('./src/plugins/*/index.js');

entry: {
  main: './src/main.js',
  ...plugins.reduce((acc, file) => {
    const name = path.basename(path.dirname(file));
    acc[`plugin-${name}`] = file;
    return acc;
  }, {})
}
```

### 3. 多语言站点

```javascript
// 自动生成多语言页面
const locales = ['zh', 'en', 'ja'];
const pages = glob.sync('./src/pages/*/index.js');

entry: pages.reduce((acc, file) => {
  const pageName = extractName(file);
  
  locales.forEach(locale => {
    acc[`${locale}-${pageName}`] = file;
  });
  
  return acc;
}, {})
```

---

## ⚠️ 注意事项

### 1. 性能考虑

```javascript
// ❌ 不好：每次构建都扫描
entry: () => {
  return getEntries();  // 同步操作
}

// ✅ 更好：缓存结果
const entries = getEntries();
module.exports = {
  entry: entries
};
```

### 2. 错误处理

```javascript
function getEntries() {
  const entries = {};
  
  try {
    const files = glob.sync('./src/pages/*/index.js');
    
    if (files.length === 0) {
      console.warn('⚠️ 未找到任何入口文件');
    }
    
    files.forEach(file => {
      // ... 处理
    });
  } catch (error) {
    console.error('❌ 扫描入口文件失败:', error);
    throw error;
  }
  
  return entries;
}
```

### 3. 命名规范

```javascript
// 建议：统一命名规范
src/pages/
├── home/
│   └── index.js       ✅ 规范
├── about/
│   └── index.js       ✅ 规范
└── contact/
    └── main.js        ❌ 不规范
```

---

## 📝 对比：手动 vs 动态

### 手动配置

```javascript
module.exports = {
  entry: {
    page1: './src/pages/page1/index.js',
    page2: './src/pages/page2/index.js',
    page3: './src/pages/page3/index.js',
    page4: './src/pages/page4/index.js',
    // 添加新页面需要修改这里 ❌
  },
  
  plugins: [
    new HtmlWebpackPlugin({ /* page1 */ }),
    new HtmlWebpackPlugin({ /* page2 */ }),
    new HtmlWebpackPlugin({ /* page3 */ }),
    new HtmlWebpackPlugin({ /* page4 */ }),
    // 添加新页面需要修改这里 ❌
  ]
};
```

### 动态配置

```javascript
module.exports = {
  entry: getEntries(),           // ✅ 自动发现
  plugins: getHtmlPlugins()      // ✅ 自动生成
};

// 添加新页面：
// 1. 创建 src/pages/page5/ 目录
// 2. 添加 index.js 和 index.html
// 3. 重新构建
// 完成！无需修改配置 ✅
```

---

## 📊 优缺点

### 优点 ✅
- 自动发现新页面，无需修改配置
- 减少重复代码
- 适合大型、多页面项目
- 便于团队协作（不同人开发不同页面）

### 缺点 ⚠️
- 增加构建复杂度
- 需要统一的目录结构
- glob 扫描有性能开销（可缓存）
- 调试稍微困难（动态生成）

---

## 🎯 适用场景

**推荐使用**：
- ✅ 页面数量多（10+ 个）
- ✅ 页面经常增删
- ✅ 有统一的目录规范
- ✅ 团队协作开发

**不推荐使用**：
- ❌ 页面数量少（< 5 个）
- ❌ 页面配置差异大
- ❌ 目录结构不规范
- ❌ 需要精确控制每个页面的配置

---

## 📝 总结

### 核心要点
1. 使用 `glob` 自动发现文件
2. 函数式配置动态生成 entry 和 plugins
3. 统一的目录结构是前提
4. 适合页面多、经常变化的项目

### 最佳实践
- 制定统一的目录规范
- 添加错误处理和日志
- 缓存 glob 扫描结果
- 在控制台输出发现的页面

---

## 🎯 下一步

完成 Demo 3 后，继续学习：
- [Demo 4: 输出文件命名策略](../04-output-patterns/) - Hash 策略详解

或进入下一阶段：
- **Phase 03**: Loader 机制深入

