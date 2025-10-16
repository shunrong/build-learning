const BasicFormatter = require('./index');
const chalk = require('chalk');

const formatter = new BasicFormatter();

console.log(chalk.bold.blue('\n========== Basic Formatter Demo ==========\n'));

// 示例 1: 变量声明
console.log(chalk.yellow('【示例 1】变量声明\n'));
const code1 = 'const x=1+2;const y=3+4;';
console.log(chalk.gray('输入:'), code1);
console.log(chalk.green('输出:'));
console.log(formatter.format(code1));

// 示例 2: 函数声明
console.log(chalk.yellow('\n【示例 2】函数声明\n'));
const code2 = 'function add(a,b){return a+b;}';
console.log(chalk.gray('输入:'), code2);
console.log(chalk.green('输出:'));
console.log(formatter.format(code2));

// 示例 3: 对象和数组
console.log(chalk.yellow('\n【示例 3】对象和数组\n'));
const code3 = 'const obj={name:"Alice",age:30};const arr=[1,2,3];';
console.log(chalk.gray('输入:'), code3);
console.log(chalk.green('输出:'));
console.log(formatter.format(code3));

// 示例 4: 箭头函数
console.log(chalk.yellow('\n【示例 4】箭头函数\n'));
const code4 = 'const double=x=>x*2;const add=(a,b)=>a+b;';
console.log(chalk.gray('输入:'), code4);
console.log(chalk.green('输出:'));
console.log(formatter.format(code4));

// 示例 5: If 语句
console.log(chalk.yellow('\n【示例 5】If 语句\n'));
const code5 = 'if(x>0){console.log("positive");}else{console.log("negative");}';
console.log(chalk.gray('输入:'), code5);
console.log(chalk.green('输出:'));
console.log(formatter.format(code5));

// 示例 6: 复杂示例
console.log(chalk.yellow('\n【示例 6】复杂示例\n'));
const code6 = `
function calculate(x,y){const result=x*y;if(result>100){return result*2;}else{return result;}}
const data={items:[1,2,3],total:6};
`;
console.log(chalk.gray('输入:'), code6.trim());
console.log(chalk.green('输出:'));
console.log(formatter.format(code6));

console.log(chalk.bold.green('\n✅ 所有示例运行完成！\n'));

