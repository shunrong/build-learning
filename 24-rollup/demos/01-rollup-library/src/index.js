/**
 * Math Utils Library
 * 一个简单的数学工具库，演示 Rollup 的库打包能力
 */

/**
 * 加法
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function add(a, b) {
  return a + b;
}

/**
 * 减法
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function subtract(a, b) {
  return a - b;
}

/**
 * 乘法
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function multiply(a, b) {
  return a * b;
}

/**
 * 除法
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

/**
 * 求和
 * @param {number[]} numbers 
 * @returns {number}
 */
export function sum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * 求平均值
 * @param {number[]} numbers 
 * @returns {number}
 */
export function average(numbers) {
  if (numbers.length === 0) {
    throw new Error('Cannot calculate average of empty array');
  }
  return sum(numbers) / numbers.length;
}

/**
 * 求最大值
 * @param {number[]} numbers 
 * @returns {number}
 */
export function max(numbers) {
  if (numbers.length === 0) {
    throw new Error('Cannot find max of empty array');
  }
  return Math.max(...numbers);
}

/**
 * 求最小值
 * @param {number[]} numbers 
 * @returns {number}
 */
export function min(numbers) {
  if (numbers.length === 0) {
    throw new Error('Cannot find min of empty array');
  }
  return Math.min(...numbers);
}

/**
 * 幂运算
 * @param {number} base 
 * @param {number} exponent 
 * @returns {number}
 */
export function power(base, exponent) {
  return Math.pow(base, exponent);
}

/**
 * 平方根
 * @param {number} n 
 * @returns {number}
 */
export function sqrt(n) {
  if (n < 0) {
    throw new Error('Cannot calculate square root of negative number');
  }
  return Math.sqrt(n);
}

// 默认导出
export default {
  add,
  subtract,
  multiply,
  divide,
  sum,
  average,
  max,
  min,
  power,
  sqrt
};

