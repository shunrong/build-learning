import React from 'react';

function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <h2>🏠 首页</h2>
        <p>这是一个轻量级的首页，快速加载</p>
      </div>

      <div className="content-section">
        <h3>代码分割的好处</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="emoji">⚡</span>
            <h4>首屏加载快</h4>
            <p>只加载当前页面需要的代码</p>
          </div>
          <div className="benefit-card">
            <span className="emoji">💾</span>
            <h4>缓存友好</h4>
            <p>第三方库长期缓存</p>
          </div>
          <div className="benefit-card">
            <span className="emoji">🔀</span>
            <h4>并行加载</h4>
            <p>多个 chunk 同时下载</p>
          </div>
          <div className="benefit-card">
            <span className="emoji">📦</span>
            <h4>按需加载</h4>
            <p>用户不访问就不下载</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h3>本 Demo 的分割策略</h3>
        <div className="code-block">
          <pre>{`
// App.jsx - 路由级别懒加载
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Heavy = lazy(() => import('./pages/Heavy'));

// webpack.split.config.js - vendor 分离
splitChunks: {
  cacheGroups: {
    react: {
      test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
      name: 'react-vendors'
    },
    utils: {
      test: /[\\/]node_modules[\\/](lodash-es|axios)[\\/]/,
      name: 'utils'
    }
  }
}
          `}</pre>
        </div>
      </div>

      <div className="tip-box">
        <h4>💡 提示</h4>
        <p>打开浏览器开发者工具的 Network 面板，切换不同页面，观察懒加载的 chunk 文件</p>
      </div>
    </div>
  );
}

export default Home;

