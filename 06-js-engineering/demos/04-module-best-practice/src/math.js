// 数学工具函数模块
// 演示 Tree Shaking

export const add = (a, b) => {
  console.log(`add(${a}, ${b})`);
  return a + b;
};

export const subtract = (a, b) => {
  console.log(`subtract(${a}, ${b})`);
  return a - b;
};  // ❌ 未使用，会被 Tree Shaking 删除

export const multiply = (a, b) => {
  console.log(`multiply(${a}, ${b})`);
  return a * b;
};

export const divide = (a, b) => {
  console.log(`divide(${a}, ${b})`);
  if (b === 0) throw new Error('除数不能为 0');
  return a / b;
};  // ❌ 未使用，会被 Tree Shaking 删除

