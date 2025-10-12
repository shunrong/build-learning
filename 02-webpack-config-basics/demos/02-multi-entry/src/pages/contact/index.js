// 联系页入口文件
import '../../shared/styles.css';  // 导入样式
import { log, initPage, validateEmail } from '../../shared/utils.js';

log('📧 联系页加载完成', 'success');

// 初始化页面
initPage('联系页');

// 表单提交
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  log('表单提交:', 'info');
  log(`姓名: ${name}`, 'info');
  log(`邮箱: ${email}`, 'info');
  log(`留言: ${message}`, 'info');
  
  // 验证邮箱（使用共享工具函数）
  if (validateEmail(email)) {
    alert('✅ 提交成功！（这只是一个演示）');
    log('✅ 表单验证通过', 'success');
    
    // 清空表单
    e.target.reset();
  } else {
    alert('❌ 邮箱格式不正确');
    log('❌ 邮箱验证失败', 'error');
  }
});

// 显示构建信息
function displayBuildInfo() {
  const mode = process.env.NODE_ENV || 'development';
  
  const html = `
    <strong>📦 构建信息：</strong><br>
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li>构建模式: ${mode}</li>
      <li>入口文件: contact</li>
      <li>是否开发模式: ${mode === 'development' ? '是' : '否'}</li>
    </ul>
  `;
  
  document.getElementById('output').innerHTML = html;
}

// 页面加载完成后显示构建信息
setTimeout(displayBuildInfo, 500);

log('✅ 联系页初始化完成', 'success');

