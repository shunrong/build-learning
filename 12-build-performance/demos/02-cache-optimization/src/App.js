import React, { useState } from 'react';

function App() {
  const [buildTime, setBuildTime] = useState('');
  const [cacheType, setCacheType] = useState('');

  return (
    <div className="app">
      <h1>💾 Webpack 缓存优化 Demo</h1>
      
      <div className="card highlight">
        <h2>⚡️ 缓存优化 = 最有效的优化手段</h2>
        <div className="stat">
          <strong>效果</strong>：二次构建时间减少 <span className="big">90%+</span>
        </div>
      </div>

      <div className="card">
        <h2>📊 对比实验haha</h2>
        <table>
          <thead>
            <tr>
              <th>场景</th>
              <th>无缓存</th>
              <th>有缓存</th>
              <th>提升</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>首次构建</td>
              <td>~10s</td>
              <td>~10s</td>
              <td>0%</td>
            </tr>
            <tr className="highlight-row">
              <td>二次构建</td>
              <td>~10s</td>
              <td>~1s</td>
              <td>-90% ⚡️</td>
            </tr>
            <tr>
              <td>修改一个文件dd</td>
              <td>~10s</td>
              <td>~2s</td>
              <td>-80% ⚡️</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>🔧 两种缓存配置</h2>
        
        <h3>1️⃣ Webpack 5 Filesystem Cache</h3>
        <pre><code>{`cache: {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename]
  }
}`}</code></pre>

        <h3>2️⃣ babel-loader Cache</h3>
        <pre><code>{`{
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    cacheCompression: false
  }
}`}</code></pre>
      </div>

      <div className="card">
        <h2>🚀 实验步骤</h2>
        <ol>
          <li>运行 <code>time npm run build:no-cache</code> 记录时间</li>
          <li>运行 <code>time npm run build:with-cache:first</code> 记录时间（首次）</li>
          <li>运行 <code>time npm run build:with-cache:second</code> 记录时间（二次）⚡️</li>
          <li>修改本文件任意内容</li>
          <li>再次运行 <code>time npm run build:with-cache</code> 记录时间</li>
          <li>对比数据，感受缓存的威力！</li>
        </ol>
      </div>

      <div className="card">
        <h2>💡 关键知识点</h2>
        <ul>
          <li><strong>缓存存在哪里？</strong> <code>node_modules/.cache/webpack/</code></li>
          <li><strong>如何判断缓存失效？</strong> 基于文件内容、配置、依赖的 hash</li>
          <li><strong>缓存何时失效？</strong> 文件变化、配置变化、依赖变化</li>
          <li><strong>如何清除缓存？</strong> <code>npm run clean</code></li>
        </ul>
      </div>

      <div className="input-demo">
        <h3>输入记录</h3>
        <label>
          构建时间（秒）：
          <input 
            type="number" 
            value={buildTime} 
            onChange={(e) => setBuildTime(e.target.value)} 
            placeholder="例如：10.5"
          />
        </label>
        <label>
          缓存类型：
          <select value={cacheType} onChange={(e) => setCacheType(e.target.value)}>
            <option value="">请选择</option>
            <option value="no-cache">无缓存</option>
            <option value="first">有缓存（首次）</option>
            <option value="second">有缓存（二次）</option>
          </select>
        </label>
        {buildTime && cacheType && (
          <div className="result">
            记录：{cacheType === 'second' ? '二次构建' : cacheType === 'first' ? '首次构建' : '无缓存'} - {buildTime}秒
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

