import React, { useState, useEffect } from 'react';

function App() {
  const [cpuCount, setCpuCount] = useState('检测中...');
  const [buildMode, setBuildMode] = useState('unknown');

  useEffect(() => {
    // 模拟获取 CPU 信息（实际在浏览器中无法获取）
    setCpuCount('4-8 核（典型配置）');
    
    // 从 document.title 判断构建模式
    if (document.title.includes('单线程')) {
      setBuildMode('single');
    } else if (document.title.includes('并行')) {
      setBuildMode('parallel');
    }
  }, []);

  return (
    <div className="app">
      <h1>⚙️ Webpack 并行构建 Demo</h1>
      
      {buildMode !== 'unknown' && (
        <div className={`mode-badge ${buildMode}`}>
          当前构建模式：{buildMode === 'single' ? '🐢 单线程' : '🚀 并行'}
        </div>
      )}

      <div className="card highlight">
        <h2>💡 核心概念</h2>
        <p className="big-text">
          利用多核 CPU，将构建任务分发到多个 Worker 线程并行处理
        </p>
      </div>

      <div className="card">
        <h2>📊 单线程 vs 并行</h2>
        
        <div className="comparison">
          <div className="mode">
            <h3>🐢 单线程构建</h3>
            <pre className="flow">{`主线程
  ↓
模块1 (200ms)
  ↓
模块2 (200ms)
  ↓
模块3 (200ms)
  ↓
...
  ↓
总耗时：N × 200ms`}</pre>
          </div>

          <div className="mode">
            <h3>🚀 并行构建（4核）</h3>
            <pre className="flow">{`Worker 1: 模块1
Worker 2: 模块2
Worker 3: 模块3
Worker 4: 模块4
  ↓ (同时进行)
总耗时：N × 200ms ÷ 4`}</pre>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>🔧 配置对比</h2>
        
        <h3>单线程配置</h3>
        <pre><code>{`module.exports = {
  module: {
    rules: [
      {
        test: /\\.js$/,
        use: 'babel-loader'  // ❌ 单线程
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: false  // ❌ 单线程压缩
      })
    ]
  }
}`}</code></pre>

        <h3>并行配置 ⭐️</h3>
        <pre><code>{`const os = require('os');

module.exports = {
  module: {
    rules: [
      {
        test: /\\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1
            }
          },
          'babel-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true  // ✅ 并行压缩
      })
    ]
  }
}`}</code></pre>
      </div>

      <div className="card">
        <h2>📈 性能对比</h2>
        <table>
          <thead>
            <tr>
              <th>场景</th>
              <th>单线程</th>
              <th>并行（4核）</th>
              <th>提升</th>
            </tr>
          </thead>
          <tbody>
            <tr className="highlight-row">
              <td>首次构建（无缓存）</td>
              <td>20s</td>
              <td>12s</td>
              <td>-40% ⚡️</td>
            </tr>
            <tr>
              <td>二次构建（有缓存）</td>
              <td>2s</td>
              <td>2s</td>
              <td>0%</td>
            </tr>
            <tr>
              <td>大型项目（3000模块）</td>
              <td>120s</td>
              <td>70s</td>
              <td>-42% ⚡️</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>⚠️ 注意事项</h2>
        
        <div className="warning-box">
          <h4>❌ 不适合的场景</h4>
          <ul>
            <li>小型项目（&lt; 500 模块）</li>
            <li>已有缓存优化（缓存更快）</li>
            <li>开发环境热更新（Worker 启动有延迟）</li>
          </ul>
        </div>

        <div className="success-box">
          <h4>✅ 适合的场景</h4>
          <ul>
            <li>大型项目（&gt; 1000 模块）</li>
            <li>CI/CD 首次构建</li>
            <li>生产环境构建</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2>🎯 实验步骤</h2>
        <ol>
          <li>运行 <code>time npm run build:single</code></li>
          <li>记录单线程构建时间</li>
          <li>运行 <code>time npm run build:parallel</code></li>
          <li>记录并行构建时间</li>
          <li>对比两者差异</li>
          <li>运行 <code>npm run compare</code> 查看详细对比</li>
        </ol>
      </div>

      <div className="card">
        <h2>💡 关键发现</h2>
        <div className="insights">
          <div className="insight">
            <strong>发现 1</strong>
            <p>并行构建在无缓存时效果显著（-40-60%）</p>
          </div>
          <div className="insight">
            <strong>发现 2</strong>
            <p>有缓存后，并行优势不明显（缓存已经够快）</p>
          </div>
          <div className="insight">
            <strong>发现 3</strong>
            <p>Worker 启动有开销（~600ms），小项目可能反而慢</p>
          </div>
          <div className="insight">
            <strong>结论</strong>
            <p className="conclusion">
              缓存 &gt; 并行<br/>
              优先使用缓存，大型项目再考虑并行 ⭐️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

