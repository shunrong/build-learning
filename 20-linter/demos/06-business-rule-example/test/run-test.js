/**
 * 测试 no-cross-feature-import 规则
 */

const chalk = require('chalk');
const parser = require('@babel/parser');
const rule = require('../rules/no-cross-feature-import');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║    测试: no-cross-feature-import 规则          ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// 模拟 ESLint Context
class MockContext {
  constructor(filename, options = []) {
    this.filename = filename;
    this.options = options;
    this.reports = [];
  }

  getFilename() {
    return this.filename;
  }

  report(descriptor) {
    this.reports.push(descriptor);
  }
}

// 运行单个测试
function runTest(testCase) {
  const { code, filename, options, shouldPass, description } = testCase;
  
  // 解析代码
  const ast = parser.parse(code, {
    sourceType: 'module'
  });

  // 创建 context
  const context = new MockContext(filename, options);

  // 获取规则的 visitor
  const ruleInstance = rule.create(context);

  // 遍历 AST，查找 ImportDeclaration
  ast.program.body.forEach(node => {
    if (node.type === 'ImportDeclaration') {
      ruleInstance.ImportDeclaration(node);
    }
  });

  // 检查结果
  const hasPassed = context.reports.length === 0;
  const isCorrect = hasPassed === shouldPass;

  return {
    isCorrect,
    hasPassed,
    reports: context.reports,
    description
  };
}

// 测试用例
const testCases = [
  // ========== 应该通过的用例 ==========
  {
    description: '✅ 从其他 feature 的 shared.ts 导入（别名）',
    code: `import { ExpButton } from '@/features/exp/shared';`,
    filename: 'src/features/biz/index.tsx',
    options: [{ alias: { '@': 'src' } }],
    shouldPass: true
  },
  {
    description: '✅ 从其他 feature 的 shared 导入（相对路径）',
    code: `import { ExpButton } from '../exp/shared';`,
    filename: 'src/features/biz/components/Form.tsx',
    options: [{}],
    shouldPass: true
  },
  {
    description: '✅ 同一 feature 内部导入（相对路径）',
    code: `import { helper } from './utils/helper';`,
    filename: 'src/features/biz/index.tsx',
    options: [{}],
    shouldPass: true
  },
  {
    description: '✅ 同一 feature 内部导入（子目录）',
    code: `import { Button } from '../components/Button';`,
    filename: 'src/features/biz/pages/Home.tsx',
    options: [{}],
    shouldPass: true
  },
  {
    description: '✅ 导入 node_modules',
    code: `import React from 'react';`,
    filename: 'src/features/biz/index.tsx',
    options: [{}],
    shouldPass: true
  },
  {
    description: '✅ 非 feature 目录的文件',
    code: `import { something } from '@/utils/helper';`,
    filename: 'src/pages/Home.tsx',
    options: [{ alias: { '@': 'src' } }],
    shouldPass: true
  },

  // ========== 应该失败的用例 ==========
  {
    description: '❌ 跨 feature 导入内部组件（别名）',
    code: `import { Button } from '@/features/exp/components/Button';`,
    filename: 'src/features/biz/index.tsx',
    options: [{ alias: { '@': 'src' } }],
    shouldPass: false
  },
  {
    description: '❌ 跨 feature 导入内部工具函数（相对路径）',
    code: `import { helper } from '../../exp/utils/helper';`,
    filename: 'src/features/biz/pages/Home.tsx',
    options: [{}],
    shouldPass: false
  },
  {
    description: '❌ 跨 feature 导入内部 hooks',
    code: `import { useAuth } from '@/features/auth/hooks/useAuth';`,
    filename: 'src/features/dashboard/index.tsx',
    options: [{ alias: { '@': 'src' } }],
    shouldPass: false
  },
  {
    description: '❌ 跨 feature 导入深层嵌套文件',
    code: `import { config } from '../../exp/config/api/endpoints';`,
    filename: 'src/features/biz/services/api.ts',
    options: [{}],
    shouldPass: false
  }
];

// 运行所有测试
console.log(chalk.yellow('运行测试用例...\n'));

let passedCount = 0;
let failedCount = 0;

testCases.forEach((testCase, index) => {
  const result = runTest(testCase);
  
  if (result.isCorrect) {
    console.log(chalk.green(`✓ [${index + 1}/${testCases.length}]`), result.description);
    passedCount++;
  } else {
    console.log(chalk.red(`✗ [${index + 1}/${testCases.length}]`), result.description);
    console.log(chalk.gray(`  预期: ${testCase.shouldPass ? '通过' : '失败'}`));
    console.log(chalk.gray(`  实际: ${result.hasPassed ? '通过' : '失败'}`));
    
    if (result.reports.length > 0) {
      console.log(chalk.gray(`  错误信息: ${result.reports[0].messageId}`));
    }
    
    failedCount++;
  }
});

// 总结
console.log();
console.log(chalk.bold('═'.repeat(50)));
console.log(chalk.bold(`测试结果: ${passedCount}/${testCases.length} 通过`));

if (failedCount === 0) {
  console.log(chalk.green.bold('✅ 所有测试通过！\n'));
  process.exit(0);
} else {
  console.log(chalk.red.bold(`❌ ${failedCount} 个测试失败\n`));
  process.exit(1);
}

