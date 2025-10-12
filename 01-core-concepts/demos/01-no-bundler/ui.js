// UI 相关函数

// 获取输入值
function getInputs() {
  var num1 = document.getElementById('num1').value;
  var num2 = document.getElementById('num2').value;
  return { num1: num1, num2: num2 };
}

// 显示结果
function displayResult(result) {
  var resultEl = document.getElementById('result');
  resultEl.textContent = '结果: ' + result;
  log('✅ 结果已显示: ' + result, 'info');
}

// 显示错误
function displayError(message) {
  var resultEl = document.getElementById('result');
  resultEl.textContent = '❌ 错误: ' + message;
  resultEl.style.color = '#e74c3c';
  
  setTimeout(function() {
    resultEl.style.color = '#667eea';
  }, 2000);
}

// 执行计算
function performCalculation(operation) {
  log('==========================================', 'info');
  log('🚀 开始执行 ' + operation + ' 操作', 'info');
  
  var inputs = getInputs();
  
  // 验证输入
  if (!validateInputs(inputs.num1, inputs.num2, operation)) {
    displayError('输入验证失败');
    return;
  }
  
  var result;
  
  // 执行计算
  switch (operation) {
    case 'add':
      result = Calculator.add(inputs.num1, inputs.num2);
      break;
    case 'subtract':
      result = Calculator.subtract(inputs.num1, inputs.num2);
      break;
    case 'multiply':
      result = Calculator.multiply(inputs.num1, inputs.num2);
      break;
    case 'divide':
      result = Calculator.divide(inputs.num1, inputs.num2);
      break;
  }
  
  // 显示结果
  displayResult(result);
  log('==========================================', 'info');
}

// 按钮处理函数（这些会被 HTML 的 onclick 调用）
function handleAdd() {
  performCalculation('add');
}

function handleSubtract() {
  performCalculation('subtract');
}

function handleMultiply() {
  performCalculation('multiply');
}

function handleDivide() {
  performCalculation('divide');
}

log('✅ ui.js 加载完成', 'info');
log('⚠️ 定义了全局函数: getInputs, displayResult, displayError, performCalculation', 'warning');
log('⚠️ 依赖了 validator.js 的 validateInputs', 'warning');
log('⚠️ 依赖了 calculator.js 的 Calculator 对象', 'warning');

