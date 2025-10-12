// ⚠️ 问题3：命名冲突风险
// 如果其他文件也定义了 Calculator 对象，就会被覆盖

// 计算器对象（使用命名空间模式减少污染）
var Calculator = {
  // 加法
  add: function(a, b) {
    log('执行加法: ' + a + ' + ' + b, 'info');
    return parseFloat(a) + parseFloat(b);
  },
  
  // 减法
  subtract: function(a, b) {
    log('执行减法: ' + a + ' - ' + b, 'info');
    return parseFloat(a) - parseFloat(b);
  },
  
  // 乘法
  multiply: function(a, b) {
    log('执行乘法: ' + a + ' × ' + b, 'info');
    return parseFloat(a) * parseFloat(b);
  },
  
  // 除法
  divide: function(a, b) {
    log('执行除法: ' + a + ' ÷ ' + b, 'info');
    return parseFloat(a) / parseFloat(b);
  }
};

// ⚠️ 问题：即使使用命名空间，Calculator 仍然是全局的
// 如果有其他库也叫 Calculator，就会冲突

log('✅ calculator.js 加载完成', 'info');
log('⚠️ 定义了全局对象: Calculator', 'warning');
log('⚠️ 依赖了 utils.js 的 log 函数', 'warning');

// 演示命名冲突
var version = "2.0.0";  // ⚠️ 覆盖了 utils.js 的 version！
log('⚠️ 覆盖了全局变量 version: 从 1.0.0 变成了 ' + version, 'error');

