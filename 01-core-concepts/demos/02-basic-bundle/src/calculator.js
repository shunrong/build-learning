// ✅ 显式导入依赖
import { log } from './utils.js';

// ✅ 不需要担心命名冲突
// 即使有其他模块也导出了 version，也不会冲突
export const version = "2.0.0";  // 这个 version 不会覆盖 utils.js 的 version

// 加法
export function add(a, b) {
  log(`执行加法: ${a} + ${b}`, 'info');
  return parseFloat(a) + parseFloat(b);
}

// 减法
export function subtract(a, b) {
  log(`执行减法: ${a} - ${b}`, 'info');
  return parseFloat(a) - parseFloat(b);
}

// 乘法
export function multiply(a, b) {
  log(`执行乘法: ${a} × ${b}`, 'info');
  return parseFloat(a) * parseFloat(b);
}

// 除法
export function divide(a, b) {
  log(`执行除法: ${a} ÷ ${b}`, 'info');
  return parseFloat(a) / parseFloat(b);
}

log('✅ calculator 模块加载完成', 'success');
log('✅ 导出: version, add, subtract, multiply, divide', 'success');

