import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// ⭐ 路由级别懒加载（代码分割）
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home'));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'));
const Analytics = lazy(() => import(/* webpackChunkName: "analytics" */ './pages/Analytics'));
const Heavy = lazy(() => import(/* webpackChunkName: "heavy" */ './pages/Heavy'));

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h1>📦 代码分割策略 Demo</h1>
        <div className="nav-links">
          <Link to="/">首页</Link>
          <Link to="/dashboard">仪表盘</Link>
          <Link to="/analytics">数据分析</Link>
          <Link to="/heavy">大型组件</Link>
        </div>
      </nav>

      <main className="main-content">
        <Suspense fallback={
          <div className="loading">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/heavy" element={<Heavy />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="footer">
        <div className="strategy-info">
          <h3>🎯 代码分割策略说明</h3>
          <div className="strategy-grid">
            <div className="strategy-item">
              <h4>1. 路由级别懒加载</h4>
              <p>每个页面单独打包为一个 chunk</p>
              <ul>
                <li>home.xxx.chunk.js</li>
                <li>dashboard.xxx.chunk.js</li>
                <li>analytics.xxx.chunk.js</li>
                <li>heavy.xxx.chunk.js</li>
              </ul>
            </div>
            <div className="strategy-item">
              <h4>2. vendor 分离</h4>
              <p>第三方库单独打包</p>
              <ul>
                <li>react-vendors.js (React 生态)</li>
                <li>utils.js (Lodash, Axios)</li>
                <li>vendors.js (其他库)</li>
              </ul>
            </div>
            <div className="strategy-item">
              <h4>3. 运行时分离</h4>
              <p>Webpack 运行时单独提取</p>
              <ul>
                <li>runtime.js (~2 KB)</li>
                <li>模块加载逻辑</li>
                <li>chunk 映射关系</li>
              </ul>
            </div>
            <div className="strategy-item">
              <h4>4. 公共代码提取</h4>
              <p>被多次引用的代码</p>
              <ul>
                <li>common.js</li>
                <li>minChunks: 2</li>
                <li>复用率高的代码</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="comparison-tip">
          <h3>📊 对比测试</h3>
          <pre><code>npm run compare</code></pre>
          <p>自动对比单一 Bundle vs 代码分割的效果</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

