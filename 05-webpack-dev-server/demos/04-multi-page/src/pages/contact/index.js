import './index.css';
import '../../common/common.css';

console.log('📄 联系页已加载');

// 计算页面加载时间
window.addEventListener('load', () => {
  const loadTime = performance.now();
  document.getElementById('load-time').textContent = Math.round(loadTime);
  console.log(`⏱️ 页面加载时间: ${Math.round(loadTime)}ms`);
});

// 当前页面标识
document.getElementById('current-page').textContent = '联系页 (contact.html)';

// 表单提交处理
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());
  
  console.log('📤 提交表单数据:', data);
  
  // 模拟提交
  formMessage.className = 'form-message form-message-loading';
  formMessage.textContent = '正在发送...';
  
  setTimeout(() => {
    formMessage.className = 'form-message form-message-success';
    formMessage.textContent = '✅ 消息发送成功！我们会尽快回复您。';
    contactForm.reset();
    
    console.log('✅ 表单提交成功');
  }, 1000);
});

console.log('✅ 联系页 JavaScript 已执行');

