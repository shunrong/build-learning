// 数学计算模块（用于动态导入演示）

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  console.log(`计算: ${a} × ${b}`);
  return a * b;
}

export function divide(a, b) {
  if (b === 0) throw new Error('除数不能为 0');
  return a / b;
}

