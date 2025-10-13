import React, { Suspense, lazy, useState } from 'react';

const HeavyComponent = lazy(() => 
  import(/* webpackChunkName: "heavy-component" */ '../components/HeavyComponent')
);

function ComponentLazy() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div className="page">
      <h2>⚛️ 组件懒加载示例</h2>
      <p>点击按钮加载重型组件（打开 Network 面板查看 chunk 加载）</p>

      <button 
        className="load-btn"
        onClick={() => setShowHeavy(true)}
      >
        {showHeavy ? '已加载组件' : '加载重型组件'}
      </button>

      {showHeavy && (
        <Suspense fallback={
          <div className="loading-box">
            <div className="spinner"></div>
            <p>组件加载中...</p>
          </div>
        }>
          <HeavyComponent />
        </Suspense>
      )}

      <div className="info-box">
        <h4>📊 工作原理</h4>
        <ul>
          <li><strong>React.lazy</strong>：创建懒加载组件</li>
          <li><strong>dynamic import()</strong>：Webpack 打包为单独 chunk</li>
          <li><strong>Suspense</strong>：捕获加载 Promise，显示 fallback</li>
          <li><strong>按需加载</strong>：点击时才下载组件代码</li>
        </ul>
      </div>
    </div>
  );
}

export default ComponentLazy;

