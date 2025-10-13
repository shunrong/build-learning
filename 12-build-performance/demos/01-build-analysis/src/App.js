import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>🔍 Webpack 构建分析 Demo</h1>
      
      <div className="card">
        <h2>📊 本 Demo 演示的工具</h2>
        <ul>
          <li><strong>speed-measure-webpack-plugin</strong> - 测量构建耗时</li>
          <li><strong>webpack-bundle-analyzer</strong> - 分析打包体积</li>
          <li><strong>webpack --profile --json</strong> - 生成构建统计</li>
        </ul>
      </div>

      <div className="card">
        <h2>🚀 使用方法</h2>
        <ol>
          <li><code>npm run build:measure</code> - 生成耗时报告（查看 build-measure.txt）</li>
          <li><code>npm run build:analyze</code> - 生成体积分析数据</li>
          <li><code>npm run analyze</code> - 查看可视化报告</li>
        </ol>
      </div>

      <div className="card">
        <h2>🎯 分析要点</h2>
        <ul>
          <li>找出最耗时的 Loader 和 Plugin</li>
          <li>识别体积最大的依赖</li>
          <li>确定优化优先级</li>
        </ul>
      </div>

      <div className="counter">
        <h3>计数器示例：{count}</h3>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(0)}>重置</button>
      </div>
    </div>
  );
}

export default App;

