# Demo 3: 自定义 Plugin 实现

通过实现 4 个实用的自定义 Plugin，深入理解 Plugin 开发。

---

## 🔌 包含的 Plugin

### 1. FileListPlugin
**功能**：生成文件清单

**实现要点**：
- 监听 `compiler.hooks.emit`
- 遍历 `compilation.assets`
- 添加新的资源文件

**输出文件**：`dist/filelist.txt`

---

### 2. InjectVersionPlugin
**功能**：在 JS 文件顶部注入版本信息

**实现要点**：
- 监听 `compiler.hooks.emit`
- 修改符合条件的资源
- 添加 banner 注释

**效果**：
```javascript
/*!
 * Version: 1.0.0
 * Author: Learning Project
 * Build: 2025-01-12T10:30:00.000Z
 */
(function() {
  // 原始代码...
})();
```

---

### 3. RemoveConsolePlugin
**功能**：移除 console.log（生产环境）

**实现要点**：
- 条件启用（根据环境）
- 使用正则替换 console
- 处理多余空行

**注意**：实际项目建议使用 AST 处理，更准确

---

### 4. BuildNotificationPlugin
**功能**：构建完成通知

**实现要点**：
- 监听 `compiler.hooks.done`
- 获取构建统计信息
- 格式化输出

---

## 🚀 运行方式

### 1. 安装依赖

```bash
npm install
```

### 2. 开发构建

```bash
npm run build:dev
```

**效果**：
- ✅ console.log 保留
- ✅ 文件清单生成
- ✅ 版本信息注入
- ✅ 构建通知显示

### 3. 生产构建

```bash
npm run build
```

**效果**：
- ✅ console.log 移除
- ✅ 文件清单生成
- ✅ 版本信息注入
- ✅ 构建通知显示

---

## 📁 输出目录

```
dist/
├── index.html
├── main.abc12345.js       # 包含版本信息，移除了 console
└── filelist.txt           # 文件清单
```

---

## 🔍 核心实现

### 1. FileListPlugin

```javascript
compiler.hooks.emit.tapAsync(
  'FileListPlugin',
  (compilation, callback) => {
    // 收集文件
    const fileList = [];
    for (const name in compilation.assets) {
      fileList.push({
        name,
        size: compilation.assets[name].size()
      });
    }
    
    // 生成内容
    const content = generateContent(fileList);
    
    // 添加到输出
    compilation.assets['filelist.txt'] = {
      source: () => content,
      size: () => content.length
    };
    
    callback();
  }
);
```

---

### 2. InjectVersionPlugin

```javascript
compiler.hooks.emit.tapAsync(
  'InjectVersionPlugin',
  (compilation, callback) => {
    const banner = generateBanner();
    
    for (const filename in compilation.assets) {
      if (filename.endsWith('.js')) {
        const asset = compilation.assets[filename];
        const content = asset.source();
        
        // 注入 banner
        const newContent = banner + content;
        
        // 更新资源
        compilation.assets[filename] = {
          source: () => newContent,
          size: () => newContent.length
        };
      }
    }
    
    callback();
  }
);
```

---

### 3. RemoveConsolePlugin

```javascript
compiler.hooks.emit.tapAsync(
  'RemoveConsolePlugin',
  (compilation, callback) => {
    for (const filename in compilation.assets) {
      if (filename.endsWith('.js')) {
        const asset = compilation.assets[filename];
        let content = asset.source().toString();
        
        // 移除 console.log
        content = content.replace(/console\.log\([^)]*\);?/g, '');
        
        // 更新资源
        compilation.assets[filename] = {
          source: () => content,
          size: () => content.length
        };
      }
    }
    
    callback();
  }
);
```

---

### 4. BuildNotificationPlugin

```javascript
compiler.hooks.done.tap('BuildNotificationPlugin', (stats) => {
  const info = stats.toJson();
  
  console.log('✅ 构建成功');
  console.log(`⏱️  耗时: ${info.time}ms`);
  console.log(`📦 模块: ${info.modules.length} 个`);
});

compiler.hooks.failed.tap('BuildNotificationPlugin', (error) => {
  console.error('❌ 编译失败:', error.message);
});
```

---

## 🎯 学习要点

### 1. Plugin 基本结构

```javascript
class MyPlugin {
  constructor(options = {}) {
    // 接收配置
    this.options = options;
  }
  
  apply(compiler) {
    // 监听 Hooks
    compiler.hooks.emit.tapAsync(
      'MyPlugin',
      (compilation, callback) => {
        // 执行逻辑
        callback();
      }
    );
  }
}
```

### 2. 修改资源的标准方式

```javascript
compilation.assets[filename] = {
  source: () => content,      // 必须是函数
  size: () => content.length  // 必须是函数
};
```

### 3. 参数验证

```javascript
constructor(options = {}) {
  this.options = {
    enabled: true,  // 默认值
    ...options
  };
  
  // 验证
  if (typeof this.options.enabled !== 'boolean') {
    throw new Error('enabled must be a boolean');
  }
}
```

### 4. 条件启用

```javascript
apply(compiler) {
  if (!this.options.enabled) {
    return;  // 禁用时直接返回
  }
  
  // 插件逻辑...
}
```

---

## 💡 实验建议

### 实验 1：修改 FileListPlugin

尝试生成 JSON 格式：

```javascript
new FileListPlugin({
  filename: 'filelist.json',
  format: 'json'
})
```

### 实验 2：自定义 Banner

```javascript
new InjectVersionPlugin({
  banner: '/*! My Custom Banner */'
})
```

### 实验 3：扩展 RemoveConsolePlugin

移除所有 console 方法：

```javascript
content = content.replace(/console\.(log|warn|error|info)\([^)]*\);?/g, '');
```

### 实验 4：实现自己的 Plugin

尝试实现一个：
- 统计代码行数的 Plugin
- 生成构建报告的 Plugin
- 上传文件到 CDN 的 Plugin

---

## 📚 相关文档

- [如何编写一个 Plugin](https://webpack.js.org/contribute/writing-a-plugin/)
- [Plugin API](https://webpack.js.org/api/plugins/)
- [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/)
- [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)

---

## 🎯 检验标准

完成这个 Demo 后，你应该能够：

- [ ] 理解 Plugin 的基本结构
- [ ] 能够监听正确的 Hook
- [ ] 能够修改编译产物
- [ ] 能够处理配置参数
- [ ] 能够实现自己的 Plugin

---

**恭喜！Phase 04 全部完成！** 🎉

继续学习：[Phase 05: 开发服务器](../../05-webpack-dev-server/)

