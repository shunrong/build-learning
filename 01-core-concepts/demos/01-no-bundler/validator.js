// ⚠️ 问题2：依赖不明确
// 这个文件依赖 utils.js 的 log 函数
// 但从代码上看不出来，只能通过 script 标签的顺序来保证

// ⚠️ 如果 utils.js 没有先加载，这里会报错：log is not defined

// 验证数字
function validateNumber(value) {
  log('验证数字: ' + value, 'info');
  
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
function validateDivision(divisor) {
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
function validateInputs(num1, num2, operation) {
  log('验证输入: num1=' + num1 + ', num2=' + num2 + ', op=' + operation, 'info');
  
  if (!validateNumber(num1) || !validateNumber(num2)) {
    return false;
  }
  
  if (operation === 'divide') {
    return validateDivision(num2);
  }
  
  return true;
}

log('✅ validator.js 加载完成', 'info');
log('⚠️ 定义了全局函数: validateNumber, validateDivision, validateInputs', 'warning');
log('⚠️ 依赖了 utils.js 的 log 函数（但看不出来！）', 'warning');

