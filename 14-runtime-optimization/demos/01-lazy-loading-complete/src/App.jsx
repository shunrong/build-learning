import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// 路由懒加载
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home'));
const ImageLazy = lazy(() => import(/* webpackChunkName: "image-lazy" */ './pages/ImageLazy'));
const ComponentLazy = lazy(() => import(/* webpackChunkName: "component-lazy" */ './pages/ComponentLazy'));

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h1>🚀 懒加载综合示例 Demo</h1>
        <div className="nav-links">
          <Link to="/">首页</Link>
          <Link to="/image-lazy">图片懒加载</Link>
          <Link to="/component-lazy">组件懒加载</Link>
        </div>
      </nav>

      <main className="main-content">
        <Suspense fallback={
          <div className="loading">
            <div className="spinner"></div>
            <p>页面加载中...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-lazy" element={<ImageLazy />} />
            <Route path="/component-lazy" element={<ComponentLazy />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

