# ESLint 规则系统

## 规则配置

### .eslintrc.js

```javascript
module.exports = {
  rules: {
    'no-console': 'warn',          // 警告
    'no-debugger': 'error',        // 错误
    'prefer-const': 'off',         // 关闭
    'quotes': ['error', 'single']  // 带选项
  }
};
```

---

## 规则等级

- `off` / `0` - 关闭规则
- `warn` / `1` - 警告（不影响退出码）
- `error` / `2` - 错误（退出码为 1）

---

## 常用规则

### 代码质量

- `no-unused-vars` - 禁止未使用的变量
- `no-undef` - 禁止使用未定义的变量
- `no-console` - 禁止 console

### 代码风格

- `quotes` - 引号风格
- `semi` - 分号
- `indent` - 缩进

---

## 规则继承

```javascript
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb"
  ]
}
```

**继续阅读**: `03-custom-rules.md` 📖
