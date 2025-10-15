const babel = require('@babel/core');
const chalk = require('chalk');
const autoTrackPlugin = require('../plugins/auto-track');

console.log(chalk.bold.cyan('\n测试: auto-track 插件\n'));

const code = `
  function login(username, password) {
    const user = authenticate(username, password);
    return user;
  }
  
  function logout() {
    clearSession();
  }
`;

console.log(chalk.yellow('源代码:'));
console.log(chalk.white(code));

const result = babel.transformSync(code, {
  plugins: [
    [autoTrackPlugin, { 
      trackFunction: '_track',
      only: ['login', 'logout']
    }]
  ]
});

console.log(chalk.green('\n转换后:'));
console.log(chalk.white(result.code));
console.log();
