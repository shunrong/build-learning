import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// ===== HMR API 演示 =====
if (module.hot) {
  console.log('🔥 HMR 已启用');
  
  // 监听模块更新
  module.hot.accept('./App', () => {
    console.log('✅ App 组件已更新（通过 React Fast Refresh）');
  });
  
  // HMR 状态回调
  module.hot.addStatusHandler(status => {
    console.log(`📊 HMR 状态: ${status}`);
  });
  
  // 监听样式更新
  module.hot.accept('./styles.css', () => {
    console.log('🎨 样式已更新');
  });
}

