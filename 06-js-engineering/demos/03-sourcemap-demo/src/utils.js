// 工具函数模块

export const add = (a, b) => {
  console.log(`计算: ${a} + ${b}`);
  return a + b;
};

export const subtract = (a, b) => {
  console.log(`计算: ${a} - ${b}`);
  return a - b;
};

export const multiply = (a, b) => a * b;

export const divide = (a, b) => {
  if (b === 0) {
    throw new Error('除数不能为 0');
  }
  return a / b;
};

