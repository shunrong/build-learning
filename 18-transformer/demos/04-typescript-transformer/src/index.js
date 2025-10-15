/**
 * TypeScript 类型擦除转换器
 */

const babel = require('@babel/core');
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║        TypeScript 类型擦除转换器                ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// TypeScript 类型擦除插件
const typeScriptEraserPlugin = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'typescript-eraser',
    visitor: {
      // 移除类型注解
      TypeAnnotation(path) {
        path.remove();
      },
      
      // 移除接口声明
      TSInterfaceDeclaration(path) {
        console.log(chalk.gray(`  - 移除接口: ${path.node.id.name}`));
        path.remove();
      },
      
      // 移除类型别名
      TSTypeAliasDeclaration(path) {
        console.log(chalk.gray(`  - 移除类型别名: ${path.node.id.name}`));
        path.remove();
      },
      
      // 移除类型参数
      TSTypeParameterDeclaration(path) {
        path.remove();
      },
      
      // 移除类型断言
      TSAsExpression(path) {
        path.replaceWith(path.node.expression);
      },
      
      // 移除非空断言
      TSNonNullExpression(path) {
        path.replaceWith(path.node.expression);
      },
      
      // 处理 enum（可选保留或删除）
      TSEnumDeclaration(path, state) {
        const { preserveEnums = false } = state.opts;
        
        if (!preserveEnums) {
          console.log(chalk.gray(`  - 移除枚举: ${path.node.id.name}`));
          path.remove();
        }
      }
    }
  };
};

// ==================== 测试示例 ====================

const examples = [
  {
    name: '函数类型注解',
    code: `
      function greet(name: string): string {
        return 'Hello ' + name;
      }
    `
  },
  {
    name: '变量类型注解',
    code: `
      const age: number = 25;
      let count: number = 0;
      const user: { name: string; age: number } = { name: 'Alice', age: 25 };
    `
  },
  {
    name: '接口声明',
    code: `
      interface User {
        name: string;
        age: number;
      }
      
      const user: User = { name: 'Bob', age: 30 };
    `
  },
  {
    name: '类型别名',
    code: `
      type UserID = string | number;
      
      const id: UserID = '123';
    `
  },
  {
    name: '泛型函数',
    code: `
      function identity<T>(arg: T): T {
        return arg;
      }
    `
  },
  {
    name: '类型断言',
    code: `
      const value = someValue as string;
      const num = getValue() as number;
    `
  },
  {
    name: '非空断言',
    code: `
      const element = document.getElementById('app')!;
    `
  }
];

examples.forEach((example, index) => {
  console.log(chalk.bold.yellow(`\n【示例 ${index + 1}】${example.name}`));
  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.white('TypeScript:'));
  console.log(chalk.cyan(example.code.trim()));
  
  try {
    const result = babel.transformSync(example.code, {
      plugins: [
        typeScriptEraserPlugin,
        '@babel/plugin-syntax-typescript'
      ]
    });
    
    console.log(chalk.white('\nJavaScript:'));
    console.log(chalk.green(result.code.trim()));
  } catch (error) {
    console.log(chalk.red('错误:'), error.message);
  }
});

console.log(chalk.bold.green('\n✅ TypeScript 转换演示完成！\n'));

console.log(chalk.blue('💡 核心要点:'));
console.log(chalk.white('  1. 类型注解是纯编译时信息，运行时可以完全移除'));
console.log(chalk.white('  2. interface 和 type 不产生运行时代码'));
console.log(chalk.white('  3. 类型断言 (as) 和非空断言 (!) 可以直接擦除'));
console.log(chalk.white('  4. enum 需要特殊处理（转换为对象或移除）'));
console.log(chalk.white('  5. 泛型参数在运行时不存在'));
console.log();
