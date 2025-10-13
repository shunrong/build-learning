import React from 'react';

function Home() {
  return (
    <div className="page">
      <h2>🎯 懒加载综合示例</h2>
      <p>本 Demo 展示了四种懒加载场景的完整实现。</p>

      <div className="features">
        <div className="feature-card">
          <h3>1. 图片懒加载</h3>
          <p>使用 Intersection Observer API 实现图片按需加载</p>
          <ul>
            <li>滚动到可视区域才加载</li>
            <li>显示加载占位符</li>
            <li>淡入动画效果</li>
          </ul>
        </div>

        <div className="feature-card">
          <h3>2. 组件懒加载</h3>
          <p>使用 React.lazy + Suspense 实现组件按需加载</p>
          <ul>
            <li>点击时才加载组件</li>
            <li>显示加载状态</li>
            <li>单独打包 chunk</li>
          </ul>
        </div>

        <div className="feature-card">
          <h3>3. 路由懒加载</h3>
          <p>使用 React Router + dynamic import 实现路由懒加载</p>
          <ul>
            <li>访问路由时加载</li>
            <li>首屏不加载其他页面</li>
            <li>路由切换加载状态</li>
          </ul>
        </div>

        <div className="feature-card">
          <h3>4. 第三方库懒加载</h3>
          <p>使用 dynamic import 按需加载第三方库</p>
          <ul>
            <li>使用时才加载</li>
            <li>避免首屏加载大型库</li>
            <li>库代码单独打包</li>
          </ul>
        </div>
      </div>

      <div className="tip-box">
        <h4>💡 使用提示</h4>
        <p>1. 打开 Chrome DevTools - Network 面板</p>
        <p>2. 切换不同页面，观察 chunk 文件加载</p>
        <p>3. 对比首屏加载和按需加载的差异</p>
      </div>
    </div>
  );
}

export default Home;

