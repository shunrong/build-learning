// 重量级模块
// 演示动态 import 和代码分割

console.log('📦 Heavy Module 已加载');

export const processData = (data) => {
  console.log('🔄 处理数据:', data);
  
  // 模拟复杂计算
  return data.map(x => x * 2).filter(x => x > 5);
};

export const heavyCalculation = () => {
  // 模拟重量级计算
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return result;
};

