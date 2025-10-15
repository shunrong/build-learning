/**
 * 运行 ESLint
 */

const { ESLint } = require('eslint');
const chalk = require('chalk');

async function main() {
  const eslint = new ESLint({
    overrideConfig: {
      env: { node: true, es2021: true },
      extends: 'eslint:recommended',
      rules: {
        'no-console': 'warn',
        'prefer-const': 'error'
      }
    }
  });

  const code = `
var x = 1;
console.log(x);
  `;

  const results = await eslint.lintText(code);
  
  console.log(chalk.cyan('\nESLint 检查结果:\n'));
  results[0].messages.forEach(msg => {
    const color = msg.severity === 2 ? chalk.red : chalk.yellow;
    console.log(color(`  ${msg.line}:${msg.column}  ${msg.message} (${msg.ruleId})`));
  });
  console.log();
}

main();
