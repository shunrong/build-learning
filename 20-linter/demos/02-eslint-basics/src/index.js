/**
 * ESLint 基础示例
 */

const chalk = require('chalk');

console.log(chalk.bold.cyan('\nESLint 基础配置示例\n'));

// .eslintrc.js 配置示例
const config = {
  env: {
    node: true,
    es2021: true
  },
  extends: 'eslint:recommended',
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};

console.log(chalk.yellow('ESLint 配置:'));
console.log(chalk.white(JSON.stringify(config, null, 2)));
console.log();
