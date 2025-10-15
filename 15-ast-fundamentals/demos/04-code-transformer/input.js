// 示例代码 - 将被转换
const greeting = (name) => {
  console.log(`Hello, ${name}!`);
  debugger;
  return `Welcome, ${name}`;
};

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

console.log('Numbers:', numbers);
console.log('Doubled:', doubled);

debugger;
greeting('World');
