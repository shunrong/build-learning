import React from 'react';

function Home() {
  return (
    <div className="page">
      <h2>🎯 综合优化 Demo</h2>
      <p>本 Demo 整合了所有 Bundle 优化技巧，展示优化前后的对比效果。</p>
      
      <div className="optimization-list">
        <div className="opt-item">
          <h3>1. 缓存策略</h3>
          <p>Webpack 5 filesystem cache + Babel cache</p>
        </div>
        <div className="opt-item">
          <h3>2. 并行构建</h3>
          <p>thread-loader + 并行压缩</p>
        </div>
        <div className="opt-item">
          <h3>3. 代码分割</h3>
          <p>vendor 分离 + 路由懒加载</p>
        </div>
        <div className="opt-item">
          <h3>4. Tree Shaking</h3>
          <p>JS + CSS Tree Shaking</p>
        </div>
        <div className="opt-item">
          <h3>5. 高级压缩</h3>
          <p>Terser + CSS Minifier + Gzip + Brotli</p>
        </div>
      </div>

      <div className="tip">
        <h4>💡 运行对比</h4>
        <pre><code>npm run compare</code></pre>
        <p>自动对比优化前后的构建效果</p>
      </div>
    </div>
  );
}

export default Home;

