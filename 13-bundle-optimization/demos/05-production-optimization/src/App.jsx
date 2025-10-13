import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// 懒加载页面组件
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home'));
const Features = lazy(() => import(/* webpackChunkName: "features" */ './pages/Features'));
const Results = lazy(() => import(/* webpackChunkName: "results" */ './pages/Results'));

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h1>⚡ 生产环境综合优化 Demo</h1>
        <div className="nav-links">
          <Link to="/">首页</Link>
          <Link to="/features">优化特性</Link>
          <Link to="/results">效果对比</Link>
        </div>
      </nav>

      <main className="main-content">
        <Suspense fallback={<div className="loading">加载中...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

