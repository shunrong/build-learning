// ✅ 显式导入所需的依赖
import { log } from './utils.js';
import { validateInputs } from './validator.js';
import * as calculator from './calculator.js';  // 导入整个模块

// 获取输入值
function getInputs() {
  const num1 = document.getElementById('num1').value;
  const num2 = document.getElementById('num2').value;
  return { num1, num2 };
}

// 显示结果
function displayResult(result) {
  const resultEl = document.getElementById('result');
  resultEl.textContent = `结果: ${result}`;
  resultEl.style.color = '#28a745';
  log(`✅ 结果已显示: ${result}`, 'success');
}

// 显示错误
function displayError(message) {
  const resultEl = document.getElementById('result');
  resultEl.textContent = `❌ 错误: ${message}`;
  resultEl.style.color = '#dc3545';
  
  setTimeout(() => {
    resultEl.style.color = '#28a745';
  }, 2000);
}

// 执行计算
export function performCalculation(operation) {
  log('==========================================', 'info');
  log(`🚀 开始执行 ${operation} 操作`, 'info');
  
  const inputs = getInputs();
  
  // 验证输入
  if (!validateInputs(inputs.num1, inputs.num2, operation)) {
    displayError('输入验证失败');
    return;
  }
  
  let result;
  
  // 执行计算
  switch (operation) {
    case 'add':
      result = calculator.add(inputs.num1, inputs.num2);
      break;
    case 'subtract':
      result = calculator.subtract(inputs.num1, inputs.num2);
      break;
    case 'multiply':
      result = calculator.multiply(inputs.num1, inputs.num2);
      break;
    case 'divide':
      result = calculator.divide(inputs.num1, inputs.num2);
      break;
  }
  
  // 显示结果
  displayResult(result);
  log('==========================================', 'info');
}

log('✅ ui 模块加载完成', 'success');
log('✅ 导出: performCalculation', 'success');

