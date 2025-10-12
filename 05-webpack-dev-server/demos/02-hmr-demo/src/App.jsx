import React, { useState } from 'react';
import Counter from './components/Counter';
import ColorBox from './components/ColorBox';
import VanillaJSDemo from './vanilla-js-demo';

function App() {
  const [message, setMessage] = useState('欢迎来到 HMR 演示！');

  return (
    <div className="app">
      <header className="header">
        <h1>🔥 Hot Module Replacement 深入演示</h1>
        <p className="subtitle">{message}</p>
      </header>

      <div className="container">
        {/* Section 1: React HMR */}
        <section className="section">
          <h2>⚛️ React Fast Refresh</h2>
          <p className="description">
            修改 React 组件，观察<strong>状态保持</strong>的热更新
          </p>
          <div className="demo-grid">
            <Counter />
            <ColorBox />
          </div>
          <div className="tips">
            <h3>💡 实验提示：</h3>
            <ul>
              <li>增加计数器，然后修改 <code>Counter.jsx</code> 的样式或文本</li>
              <li>观察：计数器的值<strong>保持不变</strong>，只有 UI 更新</li>
              <li>这就是 React Fast Refresh 的强大之处！</li>
            </ul>
          </div>
        </section>

        {/* Section 2: CSS HMR */}
        <section className="section">
          <h2>🎨 CSS 热更新</h2>
          <p className="description">
            修改 <code>styles.css</code>，样式<strong>无刷新</strong>更新
          </p>
          <div className="color-demo">
            <div className="box box-1">Box 1</div>
            <div className="box box-2">Box 2</div>
            <div className="box box-3">Box 3</div>
          </div>
          <div className="tips">
            <h3>💡 实验提示：</h3>
            <ul>
              <li>修改 <code>.box-1</code> 的背景色</li>
              <li>观察：页面<strong>不刷新</strong>，颜色立即改变</li>
              <li>原理：<code>style-loader</code> 实现了 HMR 接口</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Vanilla JS HMR */}
        <section className="section">
          <h2>🛠️ 原生 JavaScript HMR</h2>
          <p className="description">
            使用 <code>module.hot.accept()</code> 实现 JS 模块热更新
          </p>
          <div id="vanilla-demo"></div>
          <div className="tips">
            <h3>💡 实验提示：</h3>
            <ul>
              <li>修改 <code>vanilla-js-demo.js</code> 中的配置</li>
              <li>观察控制台日志和页面更新</li>
              <li>需要手动处理状态恢复</li>
            </ul>
          </div>
        </section>

        {/* Section 4: HMR API */}
        <section className="section">
          <h2>🔍 HMR API 详解</h2>
          <div className="api-demo">
            <h3>module.hot 对象</h3>
            <pre className="code-block">
{`if (module.hot) {
  // 接受当前模块的更新
  module.hot.accept();
  
  // 接受特定模块的更新
  module.hot.accept('./module', () => {
    // 处理更新逻辑
  });
  
  // 监听 HMR 状态
  module.hot.addStatusHandler(status => {
    console.log('HMR 状态:', status);
  });
  
  // 清理函数（模块更新前调用）
  module.hot.dispose(data => {
    data.count = currentCount;
  });
}`}
            </pre>
            
            <h3>HMR 生命周期</h3>
            <div className="lifecycle">
              <div className="lifecycle-step">1. 文件修改</div>
              <div className="arrow">→</div>
              <div className="lifecycle-step">2. Webpack 重新编译</div>
              <div className="arrow">→</div>
              <div className="lifecycle-step">3. HMR Runtime 接收更新</div>
              <div className="arrow">→</div>
              <div className="lifecycle-step">4. 应用更新</div>
              <div className="arrow">→</div>
              <div className="lifecycle-step">5. 成功 / 失败降级</div>
            </div>
          </div>
        </section>

        {/* Section 5: HMR 最佳实践 */}
        <section className="section">
          <h2>✅ HMR 最佳实践</h2>
          <div className="best-practices">
            <div className="practice">
              <h3>1. React 组件</h3>
              <p>✅ 使用 React Fast Refresh</p>
              <p>✅ 避免匿名函数作为组件</p>
              <p>✅ 保持组件纯净</p>
            </div>
            
            <div className="practice">
              <h3>2. CSS 样式</h3>
              <p>✅ 使用 style-loader（自动支持）</p>
              <p>✅ CSS Modules 完美兼容</p>
              <p>❌ 生产环境使用 MiniCssExtractPlugin</p>
            </div>
            
            <div className="practice">
              <h3>3. Vanilla JS</h3>
              <p>✅ 使用 module.hot.accept()</p>
              <p>✅ 保存和恢复状态</p>
              <p>✅ 清理副作用（定时器、事件监听）</p>
            </div>
            
            <div className="practice">
              <h3>4. 第三方库</h3>
              <p>⚠️ 不要对 node_modules 使用 HMR</p>
              <p>✅ 使用 Externals 提取稳定依赖</p>
              <p>✅ DLL Plugin 预编译第三方库</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

