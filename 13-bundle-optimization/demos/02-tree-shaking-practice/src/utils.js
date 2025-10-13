/**
 * 工具函数模块
 * 演示 Tree Shaking 效果
 */

// ✅ 使用的函数（会被保留）
export function add(a, b) {
  console.log('add 函数被使用了');
  return a + b;
}

export function multiply(a, b) {
  console.log('multiply 函数被使用了');
  return a * b;
}

// ❌ 未使用的函数（会被 Tree Shaking 移除）
export function subtract(a, b) {
  console.log('subtract 函数未被使用，应该被移除');
  return a - b;
}

export function divide(a, b) {
  console.log('divide 函数未被使用，应该被移除');
  return a / b;
}

export function power(a, b) {
  console.log('power 函数未被使用，应该被移除');
  return Math.pow(a, b);
}

// ❌ 未使用的复杂函数（会被移除）
export function complexCalculation(data) {
  console.log('complexCalculation 未被使用');
  return data.reduce((acc, item) => {
    return acc + item.value * item.weight;
  }, 0);
}

// ❌ 未使用的类（会被移除）
export class Calculator {
  constructor() {
    this.result = 0;
    console.log('Calculator 类未被使用，应该被移除');
  }

  add(a, b) {
    this.result = a + b;
    return this.result;
  }

  subtract(a, b) {
    this.result = a - b;
    return this.result;
  }
}

// ❌ 未使用的常量（会被移除）
export const PI = 3.14159;
export const E = 2.71828;
export const GOLDEN_RATIO = 1.61803;

