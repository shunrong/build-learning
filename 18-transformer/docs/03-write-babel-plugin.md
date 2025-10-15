# 手写 Babel 插件实战

本文档通过实战案例，教你如何编写实用的 Babel 插件。

## 插件开发流程

### 标准流程

```
1. 明确需求
   ├─ 要转换什么代码？
   ├─ 转换成什么样？
   └─ 有哪些边界情况？

2. 分析 AST
   ├─ 使用 AST Explorer 查看源码的 AST
   ├─ 查看目标代码的 AST
   └─ 确定需要修改哪些节点

3. 编写插件
   ├─ 创建 visitor
   ├─ 实现转换逻辑
   └─ 处理边界情况

4. 测试
   ├─ 基本功能测试
   ├─ 边界情况测试
   └─ 错误处理测试

5. 优化
   ├─ 性能优化
   ├─ 代码优化
   └─ 添加文档
```

---

## 实战案例 1: 移除 console 语句

### 需求

移除代码中的 `console.log`、`console.warn` 等调用，但保留 `console.error`。

### 分析 AST

```javascript
// 源代码
console.log('debug');

// AST 结构
ExpressionStatement {
  expression: CallExpression {
    callee: MemberExpression {
      object: Identifier { name: 'console' },
      property: Identifier { name: 'log' }
    },
    arguments: [StringLiteral { value: 'debug' }]
  }
}
```

### 实现插件

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'remove-console',
    visitor: {
      CallExpression(path, state) {
        const { callee } = path.node;
        
        // 判断是否是 console.xxx 调用
        if (!t.isMemberExpression(callee)) return;
        if (!t.isIdentifier(callee.object, { name: 'console' })) return;
        
        // 获取选项
        const { exclude = ['error'] } = state.opts;
        const method = callee.property.name;
        
        // 检查是否在排除列表中
        if (exclude.includes(method)) return;
        
        // 删除整个表达式语句
        path.parentPath.remove();
      }
    }
  };
};
```

### 配置使用

```javascript
{
  "plugins": [
    ["remove-console", {
      "exclude": ["error", "warn"]
    }]
  ]
}
```

### 测试

```javascript
// 输入
console.log('debug');
console.warn('warning');
console.error('error');
const x = 1;

// 输出
console.error('error');
const x = 1;
```

---

## 实战案例 2: 自动埋点插件

### 需求

为指定的函数自动添加埋点代码，记录函数调用、参数和返回值。

### 实现插件

```javascript
module.exports = function(babel) {
  const { types: t, template } = babel;
  
  // 创建埋点代码模板
  const buildTrack = template(`
    TRACK_FUNC('FUNC_NAME', 'enter', { args: ARGS });
  `);
  
  const buildTrackReturn = template(`
    TRACK_FUNC('FUNC_NAME', 'exit', { result: RESULT });
  `);
  
  return {
    name: 'auto-track',
    visitor: {
      FunctionDeclaration(path, state) {
        const { id, params, body } = path.node;
        const { only = [], trackFunction = '_track' } = state.opts;
        
        // 如果指定了 only，只处理列表中的函数
        if (only.length > 0 && !only.includes(id.name)) {
          return;
        }
        
        // 跳过已处理的函数
        if (path.node._tracked) return;
        
        // 构建参数数组
        const argsArray = t.arrayExpression(
          params.map(param => t.identifier(param.name))
        );
        
        // 在函数开头插入 enter 埋点
        const enterTrack = buildTrack({
          TRACK_FUNC: t.identifier(trackFunction),
          FUNC_NAME: t.stringLiteral(id.name),
          ARGS: argsArray
        });
        
        body.body.unshift(enterTrack);
        
        // 为所有 return 语句添加 exit 埋点
        path.traverse({
          ReturnStatement(returnPath) {
            const { argument } = returnPath.node;
            
            // 生成临时变量存储返回值
            const resultVar = returnPath.scope.generateUidIdentifier('result');
            
            if (argument) {
              const exitTrack = buildTrackReturn({
                TRACK_FUNC: t.identifier(trackFunction),
                FUNC_NAME: t.stringLiteral(id.name),
                RESULT: resultVar
              });
              
              returnPath.replaceWithMultiple([
                t.variableDeclaration('const', [
                  t.variableDeclarator(resultVar, argument)
                ]),
                exitTrack,
                t.returnStatement(resultVar)
              ]);
            }
          }
        });
        
        // 标记已处理
        path.node._tracked = true;
      }
    }
  };
};
```

### 效果

```javascript
// 输入
function calculate(x, y) {
  return x + y;
}

// 输出
function calculate(x, y) {
  _track('calculate', 'enter', { args: [x, y] });
  const _result = x + y;
  _track('calculate', 'exit', { result: _result });
  return _result;
}
```

---

## 实战案例 3: 按需加载插件

### 需求

实现类似 `babel-plugin-import` 的功能，将库的整体导入转换为按需导入。

```javascript
// 输入
import { Button, Select } from 'antd';

// 输出
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
```

### 实现插件

```javascript
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'import-on-demand',
    visitor: {
      ImportDeclaration(path, state) {
        const { source, specifiers } = path.node;
        const { 
          libraryName, 
          libraryDirectory = 'lib',
          style = false 
        } = state.opts;
        
        // 只处理指定库的导入
        if (source.value !== libraryName) return;
        
        // 收集命名导入
        const imports = [];
        
        specifiers.forEach(spec => {
          if (t.isImportSpecifier(spec)) {
            const importedName = spec.imported.name;
            const localName = spec.local.name;
            
            // 转换为小写连字符格式
            const componentPath = importedName
              .replace(/([A-Z])/g, '-$1')
              .toLowerCase()
              .slice(1);
            
            // 创建新的默认导入
            imports.push(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(localName))],
                t.stringLiteral(`${libraryName}/${libraryDirectory}/${componentPath}`)
              )
            );
            
            // 如果需要导入样式
            if (style) {
              imports.push(
                t.importDeclaration(
                  [],
                  t.stringLiteral(`${libraryName}/${libraryDirectory}/${componentPath}/style/css`)
                )
              );
            }
          }
        });
        
        // 替换原有导入
        if (imports.length > 0) {
          path.replaceWithMultiple(imports);
        }
      }
    }
  };
};
```

### 配置

```javascript
{
  "plugins": [
    ["import-on-demand", {
      "libraryName": "antd",
      "libraryDirectory": "lib",
      "style": true
    }]
  ]
}
```

---

## 实战案例 4: 自动添加 try-catch

### 需求

为异步函数自动添加 try-catch 包装，捕获错误并上报。

### 实现

```javascript
module.exports = function(babel) {
  const { types: t, template } = babel;
  
  const buildTryCatch = template(`
    try {
      %%body%%
    } catch (%%error%%) {
      ERROR_HANDLER(%%error%%, '%%funcName%%');
      throw %%error%%;
    }
  `);
  
  return {
    name: 'auto-try-catch',
    visitor: {
      Function(path, state) {
        const { async } = path.node;
        const { errorHandler = 'handleError' } = state.opts;
        
        // 只处理异步函数
        if (!async) return;
        
        // 跳过已处理的函数
        if (path.node._wrapped) return;
        
        const body = path.get('body');
        if (!body.isBlockStatement()) return;
        
        // 获取函数名
        const funcName = path.node.id 
          ? path.node.id.name 
          : 'anonymous';
        
        // 生成错误变量名
        const errorVar = path.scope.generateUidIdentifier('error');
        
        // 包装函数体
        const wrappedBody = buildTryCatch({
          body: body.node.body,
          error: errorVar,
          ERROR_HANDLER: t.identifier(errorHandler),
          funcName: t.stringLiteral(funcName)
        });
        
        body.replaceWith(t.blockStatement(wrappedBody));
        
        path.node._wrapped = true;
      }
    }
  };
};
```

---

## 最佳实践

### 1. 使用 @babel/helper-plugin-utils

```javascript
const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
  api.assertVersion(7);
  
  const { loose = false } = options;
  
  return {
    name: 'my-plugin',
    visitor: {
      // ...
    }
  };
});
```

### 2. 添加选项验证

```javascript
module.exports = function(babel) {
  return {
    visitor: {
      Program(path, state) {
        const { opts } = state;
        
        // 验证必需选项
        if (!opts.libraryName) {
          throw path.buildCodeFrameError(
            'libraryName option is required'
          );
        }
        
        // 验证选项类型
        if (typeof opts.loose !== 'boolean') {
          throw new Error('loose option must be a boolean');
        }
      }
    }
  };
};
```

### 3. 添加错误提示

```javascript
visitor: {
  CallExpression(path) {
    if (someCondition) {
      throw path.buildCodeFrameError(
        'This syntax is not supported',
        TypeError
      );
    }
  }
}
```

### 4. 性能优化

```javascript
// ❌ 不好：每次都重新创建
visitor: {
  Identifier(path) {
    const t = babel.types;
    // ...
  }
}

// ✅ 更好：在外部创建一次
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      Identifier(path) {
        // 使用缓存的 t
      }
    }
  };
};
```

---

## 插件发布

### 1. 命名规范

```
babel-plugin-xxx      # 插件
@scope/babel-plugin-xxx  # 带 scope 的插件
```

### 2. package.json

```json
{
  "name": "babel-plugin-my-transform",
  "version": "1.0.0",
  "main": "lib/index.js",
  "keywords": ["babel-plugin"],
  "peerDependencies": {
    "@babel/core": "^7.0.0"
  }
}
```

### 3. README 文档

包含以下内容：
- 功能说明
- 安装方法
- 使用示例
- 配置选项
- 常见问题

---

## 总结

### 关键要点

1. **使用 AST Explorer 分析**
2. **从简单到复杂逐步实现**
3. **正确处理作用域和边界情况**
4. **添加充分的测试**
5. **提供清晰的文档**

**继续阅读**: `04-common-transformations.md` 📖
