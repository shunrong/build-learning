/**
 * Demo: 完整的项目示例
 * 演示规则在实际项目中的使用
 */

const chalk = require('chalk');
const parser = require('@babel/parser');
const rule = require('../rules/no-cross-feature-import');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║        Feature 模块边界检查 - 实战演示          ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// 模拟项目文件结构
const projectFiles = {
  'src/features/exp/shared.ts': `
// ✅ exp feature 的公共 API
export { Button as ExpButton } from './components/Button';
export { useExpData } from './hooks/useExpData';
export { expHelper } from './utils/helper';
  `,
  
  'src/features/exp/components/Button.tsx': `
// ❌ 内部实现，不应该被跨 feature 导入
export const Button = () => <button>Exp Button</button>;
  `,
  
  'src/features/exp/utils/helper.ts': `
// ❌ 内部工具，不应该被跨 feature 导入
export const expHelper = () => { /* ... */ };
  `,
  
  'src/features/biz/index.tsx': `
// Feature biz 的入口文件

// ✅ 正确：从 exp 的 shared 导入
import { ExpButton, useExpData } from '@/features/exp/shared';

// ❌ 错误：直接导入 exp 的内部文件
import { Button } from '@/features/exp/components/Button';
import { expHelper } from '@/features/exp/utils/helper';

// ✅ 正确：同一 feature 内部导入
import { BizForm } from './components/Form';
import { bizHelper } from './utils/helper';

export default function BizPage() {
  return (
    <div>
      <ExpButton />
      <BizForm />
    </div>
  );
}
  `,
  
  'src/features/biz/components/Form.tsx': `
// Feature biz 的内部组件

// ✅ 正确：从其他 feature 的 shared 导入
import { ExpButton } from '../../exp/shared';

// ❌ 错误：直接导入其他 feature 的内部文件
import { Button } from '../../exp/components/Button';

// ✅ 正确：同一 feature 内部导入
import { bizHelper } from '../utils/helper';

export const BizForm = () => {
  return <form>{/* ... */}</form>;
};
  `
};

// 模拟 Context
class MockContext {
  constructor(filename) {
    this.filename = filename;
    this.options = [{ alias: { '@': 'src' } }];
    this.reports = [];
  }

  getFilename() {
    return this.filename;
  }

  report(descriptor) {
    this.reports.push(descriptor);
  }
}

// 检查单个文件
function checkFile(filename, code) {
  console.log(chalk.bold.yellow(`\n检查文件: ${filename}`));
  console.log(chalk.gray('─'.repeat(60)));

  // 解析代码
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  } catch (e) {
    console.log(chalk.red('解析失败:', e.message));
    return;
  }

  // 创建 context
  const context = new MockContext(filename);

  // 获取规则的 visitor
  const ruleInstance = rule.create(context);

  // 找出所有 import 语句
  const imports = ast.program.body.filter(node => node.type === 'ImportDeclaration');

  if (imports.length === 0) {
    console.log(chalk.gray('  (没有 import 语句)'));
    return;
  }

  // 检查每个 import
  imports.forEach(node => {
    const importPath = node.source.value;
    
    // 运行规则
    ruleInstance.ImportDeclaration(node);
    
    // 检查是否有错误
    const reportsForThis = context.reports.filter(r => r.node === node.source);
    
    if (reportsForThis.length > 0) {
      const report = reportsForThis[0];
      console.log(chalk.red('  ✗'), chalk.white(importPath));
      console.log(chalk.red('    →'), report.messageId);
      console.log(chalk.cyan('    💡'), report.data.suggestion);
    } else {
      console.log(chalk.green('  ✓'), chalk.white(importPath));
    }
  });

  // 总结
  const errorCount = context.reports.length;
  if (errorCount === 0) {
    console.log(chalk.green(`\n  ✅ 无错误`));
  } else {
    console.log(chalk.red(`\n  ❌ 发现 ${errorCount} 个错误`));
  }
}

// 运行 Demo
console.log(chalk.bold.cyan('项目结构:\n'));
console.log(chalk.white(`
src/features/
  ├── exp/
  │   ├── shared.ts          ${chalk.green('← 公共 API 入口')}
  │   ├── components/
  │   │   └── Button.tsx     ${chalk.gray('← 内部实现')}
  │   └── utils/
  │       └── helper.ts      ${chalk.gray('← 内部工具')}
  │
  └── biz/
      ├── index.tsx
      └── components/
          └── Form.tsx
`));

console.log(chalk.bold.cyan('\n开始检查...\n'));
console.log(chalk.gray('═'.repeat(60)));

// 检查每个文件
Object.entries(projectFiles).forEach(([filename, code]) => {
  checkFile(filename, code);
});

console.log();
console.log(chalk.gray('═'.repeat(60)));
console.log(chalk.bold.green('\n✅ Demo 演示完成！\n'));

console.log(chalk.cyan('说明:'));
console.log(chalk.white('  • '), chalk.green('✓'), '表示导入符合规范');
console.log(chalk.white('  • '), chalk.red('✗'), '表示违反模块边界规则');
console.log(chalk.white('  • 规则强制执行 Feature 之间的清晰边界'));
console.log(chalk.white('  • 跨 Feature 只能从 shared.ts 导入公共 API\n'));

