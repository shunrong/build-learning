// ✅ 显式导入依赖
// 从代码上就能看出这个模块依赖了 utils
import { log } from './utils.js';

// 验证数字
export function validateNumber(value) {
  log(`验证数字: ${value}`, 'info');
  
  if (value === null || value === undefined || value === '') {
    log('❌ 验证失败: 值为空', 'error');
    return false;
  }
  
  if (isNaN(value)) {
    log('❌ 验证失败: 不是数字', 'error');
    return false;
  }
  
  return true;
}

// 验证除法
export function validateDivision(divisor) {
  if (!validateNumber(divisor)) {
    return false;
  }
  
  if (parseFloat(divisor) === 0) {
    log('❌ 验证失败: 除数不能为 0', 'error');
    return false;
  }
  
  return true;
}

// 验证输入
export function validateInputs(num1, num2, operation) {
  log(`验证输入: num1=${num1}, num2=${num2}, op=${operation}`, 'info');
  
  if (!validateNumber(num1) || !validateNumber(num2)) {
    return false;
  }
  
  if (operation === 'divide') {
    return validateDivision(num2);
  }
  
  return true;
}

log('✅ validator 模块加载完成', 'success');
log('✅ 导出: validateNumber, validateDivision, validateInputs', 'success');

