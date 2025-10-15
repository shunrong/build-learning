# 高级转换技巧

本文档介绍高级的代码转换技巧和优化方法。

## 作用域处理

### 变量重命名避免冲突

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      FunctionDeclaration(path) {
        // 在函数开头插入变量
        const tempVar = path.scope.generateUidIdentifier('temp');
        
        path.get('body').unshiftContainer('body', [
          t.variableDeclaration('var', [
            t.variableDeclarator(tempVar, t.numericLiteral(0))
          ])
        ]);
      }
    }
  };
};
```

### 检查变量引用

```javascript
visitor: {
  VariableDeclarator(path) {
    const binding = path.scope.getBinding(path.node.id.name);
    
    if (binding) {
      console.log('Referenced:', binding.referenced);
      console.log('References:', binding.references);
      console.log('Constant:', binding.constant);
      
      // 如果未被引用，可以删除
      if (!binding.referenced) {
        path.remove();
      }
    }
  }
}
```

---

## 路径操作技巧

### 向上查找父节点

```javascript
visitor: {
  Identifier(path) {
    // 查找函数父节点
    const funcParent = path.getFunctionParent();
    
    // 查找特定类型的父节点
    const blockParent = path.findParent(p => p.isBlockStatement());
    
    // 检查是否在某个节点内
    const inLoop = path.findParent(p => 
      p.isWhileStatement() || p.isForStatement()
    );
  }
}
```

### 节点替换技巧

```javascript
visitor: {
  BinaryExpression(path) {
    // 常量折叠
    const { left, right, operator } = path.node;
    
    if (t.isNumericLiteral(left) && t.isNumericLiteral(right)) {
      let result;
      switch (operator) {
        case '+': result = left.value + right.value; break;
        case '-': result = left.value - right.value; break;
        case '*': result = left.value * right.value; break;
        case '/': result = left.value / right.value; break;
      }
      
      if (result !== undefined) {
        path.replaceWith(t.numericLiteral(result));
      }
    }
  }
}
```

---

## 性能优化

### 1. 缓存查询结果

```javascript
// ❌ 不好
visitor: {
  CallExpression(path) {
    if (path.get('callee').isIdentifier()) {
      const callee = path.get('callee');
      // ...
    }
  }
}

// ✅ 更好
visitor: {
  CallExpression(path) {
    const callee = path.get('callee');
    if (callee.isIdentifier()) {
      // 使用缓存的 callee
    }
  }
}
```

### 2. 使用 path.skip()

```javascript
visitor: {
  FunctionDeclaration(path) {
    // 处理完立即跳过子节点
    doSomething();
    path.skip();
  }
}
```

### 3. 避免重复遍历

```javascript
// ❌ 不好
visitor: {
  Program(path) {
    path.traverse({
      Identifier(innerPath) {
        // ...
      }
    });
  }
}

// ✅ 更好
visitor: {
  Identifier(path) {
    // 直接在顶层处理
  }
}
```

---

## 错误处理

### 友好的错误提示

```javascript
visitor: {
  CallExpression(path) {
    if (invalidCondition) {
      throw path.buildCodeFrameError(
        'Invalid usage: expected X but got Y',
        SyntaxError
      );
    }
  }
}
```

### 边界情况处理

```javascript
visitor: {
  ArrowFunctionExpression(path) {
    const { params, body } = path.node;
    
    // 处理空参数
    if (params.length === 0) {
      // ...
    }
    
    // 处理表达式体 vs 块体
    const blockBody = t.isBlockStatement(body)
      ? body
      : t.blockStatement([t.returnStatement(body)]);
    
    // 处理 this 绑定
    // 箭头函数不能直接转换如果内部使用了 this
    let usesThis = false;
    path.traverse({
      ThisExpression() {
        usesThis = true;
      }
    });
    
    if (usesThis) {
      // 需要特殊处理
    }
  }
}
```

---

## 高级模式

### 状态机模式

用于处理复杂的转换逻辑：

```javascript
module.exports = function(babel) {
  return {
    pre() {
      this.state = 'initial';
      this.data = [];
    },
    
    visitor: {
      Program: {
        enter() {
          this.state = 'collecting';
        },
        exit() {
          this.state = 'transforming';
          // 基于收集的数据进行转换
        }
      },
      
      Identifier(path) {
        if (this.state === 'collecting') {
          this.data.push(path.node.name);
        }
      }
    },
    
    post() {
      console.log('Collected:', this.data);
    }
  };
};
```

---

## 总结

高级技巧的关键：
1. **正确处理作用域**
2. **优化性能**
3. **完善错误处理**
4. **处理边界情况**

这样就完成了 Transformer 的所有理论知识！接下来需要通过 Demo 实践来巩固。
