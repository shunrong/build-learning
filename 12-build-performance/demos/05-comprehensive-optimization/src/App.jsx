import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// 🚀 懒加载页面组件 - 实现代码分割
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h1>📊 综合优化 Demo</h1>
        <div className="nav-links">
          <Link to="/">首页</Link>
          <Link to="/dashboard">仪表盘</Link>
          <Link to="/analytics">分析</Link>
        </div>
      </nav>

      <main className="main-content">
        <Suspense fallback={<div className="loading">加载中...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="footer">
        <p>本 Demo 综合应用了所有性能优化技巧</p>
        <ul>
          <li>✅ 持久化缓存 (Filesystem Cache)</li>
          <li>✅ 并行构建 (thread-loader)</li>
          <li>✅ 并行压缩 (TerserPlugin parallel)</li>
          <li>✅ 代码分割 (splitChunks + 懒加载)</li>
          <li>✅ Tree Shaking (usedExports)</li>
          <li>✅ 缩小 resolve 范围</li>
          <li>✅ noParse 跳过预编译库</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;

