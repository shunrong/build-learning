# 常见代码转换实现

本文档深入分析常见代码转换的实现原理。

## JSX 转换

### JSX → React.createElement

#### 转换规则

```jsx
// 输入
<div className="container">
  <h1>Hello {name}</h1>
  <Button onClick={handleClick} />
</div>

// 输出
React.createElement('div', { className: 'container' },
  React.createElement('h1', null, 'Hello ', name),
  React.createElement(Button, { onClick: handleClick })
);
```

#### 实现原理

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      JSXElement(path) {
        const { openingElement, children } = path.node;
        const { name, attributes } = openingElement;
        
        // 1. 处理标签名
        let tagName;
        if (t.isJSXIdentifier(name)) {
          // <div> → 'div' 或 <Button> → Button
          const isComponent = /^[A-Z]/.test(name.name);
          tagName = isComponent 
            ? t.identifier(name.name)
            : t.stringLiteral(name.name);
        }
        
        // 2. 处理属性
        const props = attributes.length > 0
          ? t.objectExpression(
              attributes.map(attr => {
                if (t.isJSXAttribute(attr)) {
                  const key = t.identifier(attr.name.name);
                  const value = attr.value
                    ? (t.isJSXExpressionContainer(attr.value)
                        ? attr.value.expression
                        : attr.value)
                    : t.booleanLiteral(true);
                  return t.objectProperty(key, value);
                }
              })
            )
          : t.nullLiteral();
        
        // 3. 处理子元素
        const childElements = children
          .filter(child => 
            !t.isJSXText(child) || child.value.trim()
          )
          .map(child => {
            if (t.isJSXText(child)) {
              return t.stringLiteral(child.value.trim());
            } else if (t.isJSXExpressionContainer(child)) {
              return child.expression;
            } else if (t.isJSXElement(child)) {
              // 递归处理
              return transformJSXElement(child);
            }
            return child;
          });
        
        // 4. 创建 React.createElement 调用
        const createElement = t.memberExpression(
          t.identifier('React'),
          t.identifier('createElement')
        );
        
        path.replaceWith(
          t.callExpression(createElement, [
            tagName,
            props,
            ...childElements
          ])
        );
      }
    }
  };
};
```

---

## TypeScript 类型擦除

### 移除类型注解

```typescript
// 输入
function greet(name: string): string {
  return `Hello ${name}`;
}

interface User {
  name: string;
  age: number;
}

// 输出
function greet(name) {
  return `Hello ${name}`;
}
```

#### 实现原理

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      // 移除函数参数类型注解
      Function(path) {
        path.node.params.forEach(param => {
          if (param.typeAnnotation) {
            param.typeAnnotation = null;
          }
        });
        
        // 移除返回类型注解
        if (path.node.returnType) {
          path.node.returnType = null;
        }
      },
      
      // 移除变量类型注解
      VariableDeclarator(path) {
        if (path.node.id.typeAnnotation) {
          path.node.id.typeAnnotation = null;
        }
      },
      
      // 移除接口声明
      TSInterfaceDeclaration(path) {
        path.remove();
      },
      
      // 移除类型别名
      TSTypeAliasDeclaration(path) {
        path.remove();
      },
      
      // 移除 enum（如果配置了）
      TSEnumDeclaration(path, state) {
        if (state.opts.removeEnums) {
          path.remove();
        }
      }
    }
  };
};
```

---

## Class 转换

### Class → Function

```javascript
// 输入
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

// 输出
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};
```

#### 实现原理

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      ClassDeclaration(path) {
        const { id, body } = path.node;
        const methods = body.body;
        
        let constructor;
        const protoMethods = [];
        
        methods.forEach(method => {
          if (method.kind === 'constructor') {
            constructor = method;
          } else {
            protoMethods.push(method);
          }
        });
        
        // 创建构造函数
        const func = t.functionDeclaration(
          id,
          constructor ? constructor.params : [],
          constructor ? constructor.body : t.blockStatement([])
        );
        
        // 创建原型方法
        const protoAssignments = protoMethods.map(method => {
          return t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.memberExpression(
                t.memberExpression(id, t.identifier('prototype')),
                t.identifier(method.key.name)
              ),
              t.functionExpression(
                null,
                method.params,
                method.body
              )
            )
          );
        });
        
        path.replaceWithMultiple([func, ...protoAssignments]);
      }
    }
  };
};
```

---

## 箭头函数转换

### Arrow Function → Regular Function

```javascript
// 输入
const add = (a, b) => a + b;
const greet = name => {
  return `Hello ${name}`;
};

// 输出
const add = function(a, b) {
  return a + b;
};
const greet = function(name) {
  return `Hello ${name}`;
};
```

#### 实现原理

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const { params, body } = path.node;
        
        // 处理表达式体
        let blockBody;
        if (t.isBlockStatement(body)) {
          blockBody = body;
        } else {
          blockBody = t.blockStatement([
            t.returnStatement(body)
          ]);
        }
        
        // 替换为普通函数
        path.replaceWith(
          t.functionExpression(
            null,
            params,
            blockBody
          )
        );
      }
    }
  };
};
```

---

## 模板字符串转换

### Template Literal → String Concatenation

```javascript
// 输入
const msg = `Hello ${name}, you are ${age} years old`;

// 输出
const msg = "Hello " + name + ", you are " + age + " years old";
```

#### 实现原理

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      TemplateLiteral(path) {
        const { quasis, expressions } = path.node;
        
        // 构建字符串拼接
        let result = t.stringLiteral(quasis[0].value.cooked);
        
        for (let i = 0; i < expressions.length; i++) {
          result = t.binaryExpression(
            '+',
            result,
            expressions[i]
          );
          
          if (quasis[i + 1].value.cooked) {
            result = t.binaryExpression(
              '+',
              result,
              t.stringLiteral(quasis[i + 1].value.cooked)
            );
          }
        }
        
        path.replaceWith(result);
      }
    }
  };
};
```

---

## 解构转换

### Destructuring → Variable Assignment

```javascript
// 输入
const { name, age } = user;
const [a, b] = arr;

// 输出
const name = user.name;
const age = user.age;
const a = arr[0];
const b = arr[1];
```

---

## Async/Await 转换

### Async/Await → Promise

这是最复杂的转换之一，通常使用 regenerator-runtime。

```javascript
// 输入
async function fetchData() {
  const data = await fetch('/api');
  return data;
}

// 输出（简化版）
function fetchData() {
  return regeneratorRuntime.async(function fetchData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch('/api'));
        case 2:
          data = _context.sent;
          return _context.abrupt("return", data);
        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}
```

---

## 总结

常见转换的核心思路：
1. **分析 AST 结构差异**
2. **逐步构建目标 AST**
3. **处理边界情况**
4. **保持语义一致性**

**继续阅读**: `05-advanced-transformations.md` 📖
