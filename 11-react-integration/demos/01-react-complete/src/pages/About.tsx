function About() {
  return (
    <div className="page">
      <h2>📖 关于</h2>

      <div className="content-box">
        <h3>React + Webpack 集成方案</h3>
        <p>
          本项目展示了如何在 Webpack 中完整集成 React，包括 TypeScript、 Fast
          Refresh、React Router 等现代 React 开发必备特性。
        </p>
      </div>

      <div className="tech-stack">
        <h3>技术栈</h3>
        <div className="stack-grid">
          <div className="stack-item">
            <h4>⚛️ React 18</h4>
            <p>最新版本的 React</p>
          </div>
          <div className="stack-item">
            <h4>🔷 TypeScript</h4>
            <p>类型安全的 JavaScript</p>
          </div>
          <div className="stack-item">
            <h4>📦 Webpack 5</h4>
            <p>现代化打包工具</p>
          </div>
          <div className="stack-item">
            <h4>🔥 Fast Refresh</h4>
            <p>极速热更新体验</p>
          </div>
          <div className="stack-item">
            <h4>🛣️ React Router</h4>
            <p>声明式路由管理</p>
          </div>
          <div className="stack-item">
            <h4>⚡ 代码分割</h4>
            <p>按需加载优化性能</p>
          </div>
        </div>
      </div>

      <div className="content-box">
        <h3>核心配置</h3>
        <pre>
          <code>{`// webpack.config.js
{
  module: {
    rules: [{
      test: /\\.(js|jsx|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react',
            '@babel/preset-typescript'
          ],
          plugins: ['react-refresh/babel']
        }
      }
    }]
  },
  plugins: [
    new ReactRefreshWebpackPlugin()
  ]
}`}</code>
        </pre>
      </div>
    </div>
  );
}

export default About;
