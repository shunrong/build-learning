const babel = require('@babel/core');
const chalk = require('chalk');
const importOnDemandPlugin = require('../plugins/import-on-demand');

console.log(chalk.bold.cyan('\n测试: import-on-demand 插件\n'));

const code = `
  import { Button, Select, DatePicker } from 'antd';
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

const result = babel.transformSync(code, {
  plugins: [
    [importOnDemandPlugin, {
      libraryName: 'antd',
      libraryDirectory: 'lib',
      style: true
    }]
  ]
});

console.log(chalk.green('\n转换后:'));
console.log(chalk.white(result.code));
console.log();
