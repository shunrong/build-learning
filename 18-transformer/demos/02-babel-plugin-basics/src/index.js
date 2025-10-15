/**
 * Babel 插件基础示例
 */

const chalk = require('chalk');
const babel = require('@babel/core');
const t = require('@babel/types');
const template = require('@babel/template').default;

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║         Babel 插件基础示例                      ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// ==================== 示例 1: 最简单的插件 ====================
console.log(chalk.bold.yellow('【示例 1】最简单的插件\n'));

const simplePlugin = function(babel) {
  return {
    visitor: {
      Identifier(path) {
        console.log(chalk.gray(`  发现标识符: ${path.node.name}`));
      }
    }
  };
};

babel.transformSync('const x = 1;', {
  plugins: [simplePlugin]
});

// ==================== 示例 2: 带配置的插件 ====================
console.log(chalk.bold.yellow('\n【示例 2】带配置的插件\n'));

const configurablePlugin = function(babel) {
  return {
    name: 'configurable-plugin',
    visitor: {
      Identifier(path, state) {
        const { prefix = '' } = state.opts;
        
        if (path.isReferencedIdentifier()) {
          console.log(chalk.gray(`  ${prefix}标识符: ${path.node.name}`));
        }
      }
    }
  };
};

babel.transformSync('const x = 1; console.log(x);', {
  plugins: [
    [configurablePlugin, { prefix: '✓ ' }]
  ]
});

// ==================== 示例 3: 使用 template ====================
console.log(chalk.bold.yellow('\n【示例 3】使用 template 创建节点\n'));

const templatePlugin = function(babel) {
  const buildLog = template(`
    console.log('Function %%name%% called');
  `);
  
  return {
    visitor: {
      FunctionDeclaration(path) {
        const { id } = path.node;
        
        // 在函数开头插入日志
        const logStatement = buildLog({
          name: t.stringLiteral(id.name)
        });
        
        path.get('body').unshiftContainer('body', logStatement);
      }
    }
  };
};

const code = `
  function greet(name) {
    return 'Hello ' + name;
  }
`;

const result = babel.transformSync(code, {
  plugins: [templatePlugin]
});

console.log(chalk.green('转换后:'));
console.log(chalk.white(result.code));

// ==================== 示例 4: pre/post 钩子 ====================
console.log(chalk.bold.yellow('\n【示例 4】pre/post 钩子\n'));

const lifecyclePlugin = function(babel) {
  return {
    name: 'lifecycle-plugin',
    
    pre() {
      console.log(chalk.cyan('  ⭐ pre: 插件开始执行'));
      this.identifierCount = 0;
    },
    
    visitor: {
      Identifier() {
        this.identifierCount++;
      }
    },
    
    post() {
      console.log(chalk.cyan(`  ✨ post: 插件执行完毕，共发现 ${this.identifierCount} 个标识符`));
    }
  };
};

babel.transformSync('const x = 1; const y = 2;', {
  plugins: [lifecyclePlugin]
});

console.log(chalk.green('\n✅ 所有示例运行完毕！\n'));
