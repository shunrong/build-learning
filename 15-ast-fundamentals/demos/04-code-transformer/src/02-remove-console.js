/**
 * 删除 console 语句（生产优化版）
 * 支持选择性保留某些 console 方法
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n【Transformer 02】智能删除 console 语句\n'));
console.log(chalk.gray('='.repeat(70)));

// 示例代码
const code = `
function processOrder(order) {
  console.log('Processing order:', order.id);
  
  if (!order.items || order.items.length === 0) {
    console.error('Error: Order has no items');
    return null;
  }
  
  console.debug('Order items:', order.items);
  
  const total = order.items.reduce((sum, item) => {
    console.log('Item:', item.name, 'Price:', item.price);
    return sum + item.price;
  }, 0);
  
  if (total > 1000) {
    console.warn('Warning: Large order detected, total:', total);
  }
  
  console.info('Order processed successfully');
  console.log('Total:', total);
  
  return { orderId: order.id, total };
}
`;

console.log(chalk.yellow('📝 原始代码:'));
console.log(chalk.white(code));
console.log(chalk.gray('='.repeat(70)));

// 配置：保留哪些 console 方法
const keepMethods = ['error', 'warn']; // 生产环境保留错误和警告

console.log(chalk.cyan('\n⚙️  配置:\n'));
console.log(chalk.white(`  保留方法: ${keepMethods.join(', ')}`));
console.log(chalk.white(`  删除方法: log, debug, info 等其他方法`));

// Parse
console.log(chalk.cyan('\n🔍 Step 1: Parsing...\n'));
const ast = parser.parse(code);
console.log(chalk.green('  ✓ 解析完成'));

// Transform
console.log(chalk.cyan('\n🔄 Step 2: Transforming...\n'));

const stats = {
  removed: 0,
  kept: 0,
  byMethod: {}
};

const visitor = {
  CallExpression(path) {
    const { callee } = path.node;
    
    // 检查是否是 console.xxx()
    if (
      callee.type === 'MemberExpression' &&
      callee.object.type === 'Identifier' &&
      callee.object.name === 'console' &&
      callee.property.type === 'Identifier'
    ) {
      const method = callee.property.name;
      
      // 统计
      if (!stats.byMethod[method]) {
        stats.byMethod[method] = { removed: 0, kept: 0 };
      }
      
      if (keepMethods.includes(method)) {
        // 保留
        console.log(chalk.green(`  ✓ 保留 console.${method}() (第 ${path.node.loc.start.line} 行)`));
        stats.kept++;
        stats.byMethod[method].kept++;
      } else {
        // 删除
        console.log(chalk.yellow(`  × 删除 console.${method}() (第 ${path.node.loc.start.line} 行)`));
        
        if (path.parent.type === 'ExpressionStatement') {
          path.parentPath.remove();
        } else {
          path.remove();
        }
        
        stats.removed++;
        stats.byMethod[method].removed++;
      }
    }
  }
};

traverse(ast, visitor);

console.log(chalk.green(`\n  ✓ 转换完成`));

// Generate
console.log(chalk.cyan('\n📦 Step 3: Generating...\n'));

const output = generator(ast, {
  retainLines: false,
  compact: false
});

console.log(chalk.green('  ✓ 生成完成'));

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.yellow('\n✨ 转换后的代码:\n'));
console.log(chalk.white(output.code));

// 统计报告
console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.bold.cyan('\n📊 转换统计报告:\n'));
console.log(chalk.white(`  总计: 删除 ${stats.removed} 个，保留 ${stats.kept} 个\n`));

console.log(chalk.white('  详细统计:'));
Object.entries(stats.byMethod).forEach(([method, counts]) => {
  const total = counts.removed + counts.kept;
  console.log(chalk.white(`    console.${method}(): ${total} 个 (删除 ${counts.removed}, 保留 ${counts.kept})`));
});

console.log(chalk.gray('\n' + '='.repeat(70)));
console.log(chalk.green('\n💡 生产环境最佳实践:\n'));
console.log(chalk.white('  ✅ 保留 console.error - 用于错误追踪'));
console.log(chalk.white('  ✅ 保留 console.warn  - 用于警告提示'));
console.log(chalk.white('  ❌ 删除 console.log   - 避免泄露调试信息'));
console.log(chalk.white('  ❌ 删除 console.debug - 性能优化'));
console.log(chalk.white('  ❌ 删除 console.info  - 减少输出'));
console.log();

