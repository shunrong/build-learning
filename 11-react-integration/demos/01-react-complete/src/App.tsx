import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";

// 懒加载页面
const Home = lazy(() => import("@pages/Home"));
const About = lazy(() => import("@pages/About"));
const Counter = lazy(() => import("@pages/Counter"));

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <h1>⚛️ React + Webpack Demo</h1>
          <div className="nav-links">
            <Link to="/">首页</Link>
            <Link to="/about">关于</Link>
            <Link to="/counter">计数器</Link>
          </div>
        </nav>

        <main className="main">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/counter" element={<Counter />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
