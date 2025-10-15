# 自定义 ESLint 规则

## 规则基本结构

```javascript
module.exports = {
  meta: {
    type: 'problem',  // 'problem', 'suggestion', 'layout'
    docs: {
      description: '规则描述',
      category: '分类',
      recommended: false
    },
    fixable: 'code',  // 'code', 'whitespace'
    schema: []  // 规则选项 schema
  },
  
  create(context) {
    return {
      // Visitor 方法
      Identifier(node) {
        // 检查逻辑
      }
    };
  }
};
```

---

## context API

```javascript
create(context) {
  // 获取源代码
  const sourceCode = context.getSourceCode();
  
  // 获取规则选项
  const options = context.options;
  
  // 报告问题
  context.report({
    node,
    message: '错误消息',
    fix(fixer) {
      // 自动修复
      return fixer.replaceText(node, 'newText');
    }
  });
}
```

---

## 实战示例：禁止 console.log

```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止使用 console.log'
    }
  },
  
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        
        if (
          callee.type === 'MemberExpression' &&
          callee.object.name === 'console' &&
          callee.property.name === 'log'
        ) {
          context.report({
            node,
            message: '禁止使用 console.log'
          });
        }
      }
    };
  }
};
```

**继续阅读**: `04-rule-testing.md` 📖
