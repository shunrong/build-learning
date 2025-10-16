# 库打包最佳实践

## 🎯 库 vs 应用

```
库（Library）：
- 被其他项目引用
- 需要多种格式（ESM/CJS/UMD）
- 体积要小
- → 用 Rollup ✅

应用（Application）：
- 最终产物
- 只需一种格式
- 功能完整
- → 用 Webpack/Vite
```

---

## 📦 完整的库打包配置

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  
  output: [
    {
      file: 'dist/my-lib.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/my-lib.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/my-lib.umd.js',
      format: 'umd',
      name: 'MyLib',
      sourcemap: true
    }
  ],
  
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser()
  ],
  
  external: ['react', 'lodash']  // 不打包这些依赖
};
```

```json
// package.json
{
  "name": "my-lib",
  "main": "dist/my-lib.cjs.js",
  "module": "dist/my-lib.esm.js",
  "browser": "dist/my-lib.umd.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
```

---

## 🎯 核心要点

1. **多格式输出**（CJS/ESM/UMD）
2. **External 依赖**（peerDependencies）
3. **Source Map**（便于调试）
4. **TypeScript 类型**（.d.ts）
5. **体积优化**（Terser 压缩）

**Rollup 让库打包变得简单！**

