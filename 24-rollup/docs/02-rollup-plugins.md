# Rollup 插件系统

## 🎯 为什么需要插件

Rollup 核心只处理 ES Module，其他功能通过插件实现。

---

## 🔧 常用插件

### 1. @rollup/plugin-node-resolve

解析 node_modules 中的模块：

```javascript
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: { file: 'dist/bundle.js', format: 'esm' },
  plugins: [resolve()]
};
```

### 2. @rollup/plugin-commonjs

转换 CommonJS 模块：

```javascript
import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [commonjs()]
};
```

### 3. @rollup/plugin-babel

使用 Babel 转换代码：

```javascript
import babel from '@rollup/plugin-babel';

export default {
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env']
    })
  ]
};
```

### 4. @rollup/plugin-terser

压缩代码：

```javascript
import terser from '@rollup/plugin-terser';

export default {
  plugins: [terser()]
};
```

---

## 💡 完整配置示例

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/bundle.cjs.js', format: 'cjs' },
    { file: 'dist/bundle.esm.js', format: 'esm' }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    terser()
  ]
};
```

---

## 🎯 核心收获

- 插件扩展 Rollup 功能
- resolve + commonjs 是必备
- babel + terser 用于生产构建

