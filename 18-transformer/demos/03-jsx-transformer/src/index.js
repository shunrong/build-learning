/**
 * JSX 转换器 - 手写实现
 */

const babel = require('@babel/core');
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║            JSX 转换器                          ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// JSX 转换插件
const jsxTransformerPlugin = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'jsx-transformer',
    visitor: {
      JSXElement(path) {
        // 转换 JSX 元素为 React.createElement
        const openingElement = path.node.openingElement;
        const children = path.node.children;
        
        // 1. 处理标签名
        const tagName = getTagName(openingElement.name);
        
        // 2. 处理属性
        const attributes = openingElement.attributes;
        const props = buildProps(attributes);
        
        // 3. 处理子元素
        const childElements = buildChildren(children);
        
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
  
  // 获取标签名
  function getTagName(name) {
    if (t.isJSXIdentifier(name)) {
      // 判断是组件还是HTML标签
      const isComponent = /^[A-Z]/.test(name.name);
      return isComponent
        ? t.identifier(name.name)      // <Button> → Button
        : t.stringLiteral(name.name);  // <div> → 'div'
    }
    
    if (t.isJSXMemberExpression(name)) {
      // <Dialog.Header> → Dialog.Header
      return t.memberExpression(
        t.identifier(name.object.name),
        t.identifier(name.property.name)
      );
    }
    
    return t.stringLiteral('div');
  }
  
  // 构建属性对象
  function buildProps(attributes) {
    if (attributes.length === 0) {
      return t.nullLiteral();
    }
    
    const properties = attributes.map(attr => {
      if (t.isJSXAttribute(attr)) {
        const key = t.identifier(attr.name.name);
        let value;
        
        if (!attr.value) {
          // <input disabled> → { disabled: true }
          value = t.booleanLiteral(true);
        } else if (t.isJSXExpressionContainer(attr.value)) {
          // <div className={styles.container}> → { className: styles.container }
          value = attr.value.expression;
        } else {
          // <div id="app"> → { id: "app" }
          value = attr.value;
        }
        
        return t.objectProperty(key, value);
      }
      
      if (t.isJSXSpreadAttribute(attr)) {
        // <div {...props}> → { ...props }
        return t.spreadElement(attr.argument);
      }
    });
    
    return t.objectExpression(properties);
  }
  
  // 构建子元素数组
  function buildChildren(children) {
    return children
      .map(child => {
        if (t.isJSXText(child)) {
          // 文本节点
          const text = child.value.trim();
          return text ? t.stringLiteral(text) : null;
        } else if (t.isJSXExpressionContainer(child)) {
          // 表达式 {name}
          return child.expression;
        } else if (t.isJSXElement(child)) {
          // 嵌套的 JSX 元素（递归处理）
          return child;
        }
        return null;
      })
      .filter(Boolean);
  }
};

// ==================== 测试示例 ====================

const examples = [
  {
    name: '基本元素',
    code: '<div>Hello World</div>'
  },
  {
    name: '带属性',
    code: '<div className="container" id="app">Content</div>'
  },
  {
    name: '组件',
    code: '<Button onClick={handleClick}>Click Me</Button>'
  },
  {
    name: '嵌套元素',
    code: `
      <div className="container">
        <h1>Title</h1>
        <p>Content</p>
      </div>
    `
  },
  {
    name: '表达式',
    code: '<div>Hello {name}, you are {age} years old</div>'
  },
  {
    name: '自闭合标签',
    code: '<img src="/logo.png" alt="Logo" />'
  },
  {
    name: '扩展运算符',
    code: '<Button {...props} disabled />'
  }
];

examples.forEach((example, index) => {
  console.log(chalk.bold.yellow(`\n【示例 ${index + 1}】${example.name}`));
  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.white('JSX:'), chalk.cyan(example.code.trim()));
  
  try {
    const result = babel.transformSync(example.code, {
      plugins: [
        jsxTransformerPlugin,
        '@babel/plugin-syntax-jsx'
      ]
    });
    
    console.log(chalk.white('JS: '), chalk.green(result.code.trim()));
  } catch (error) {
    console.log(chalk.red('错误:'), error.message);
  }
});

console.log(chalk.bold.green('\n✅ JSX 转换演示完成！\n'));

console.log(chalk.blue('💡 核心要点:'));
console.log(chalk.white('  1. JSXElement → React.createElement(type, props, ...children)'));
console.log(chalk.white('  2. 小写标签 → 字符串 (\'div\')，大写标签 → 标识符 (Button)'));
console.log(chalk.white('  3. JSXAttribute → 对象属性'));
console.log(chalk.white('  4. JSXText → 字符串，JSXExpression → 表达式'));
console.log(chalk.white('  5. 递归处理嵌套元素'));
console.log();
