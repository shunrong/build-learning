import Button from "@components/Button";

function Home() {
  return (
    <div className="page">
      <h2>🏠 首页</h2>

      <div className="info-box">
        <h3>✅ 本 Demo 特性</h3>
        <ul>
          <li>
            <strong>React 18</strong> - 最新版本
          </li>
          <li>
            <strong>TypeScript</strong> - 类型安全
          </li>
          <li>
            <strong>Fast Refresh</strong> - 组件热更新
          </li>
          <li>
            <strong>React Router</strong> - 路由管理
          </li>
          <li>
            <strong>代码分割</strong> - 懒加载页面
          </li>
        </ul>
      </div>

      <div className="feature-box">
        <h3>🚀 快速开始</h3>
        <pre>
          <code>{`npm install
npm run dev      # 开发模式
npm run build    # 生产构建`}</code>
        </pre>
      </div>

      <div className="demo-section">
        <h3>🎯 组件示例</h3>
        <Button variant="primary" onClick={() => alert("Primary 按钮")}>
          Primary 按钮
        </Button>
        <Button variant="secondary" onClick={() => alert("Secondary 按钮")}>
          Secondary 按钮
        </Button>
        <Button variant="danger" onClick={() => alert("Danger 按钮")}>
          Danger 按钮
        </Button>
      </div>

      <div className="tip-box">
        <p>
          💡 <strong>Fast Refresh 提示：</strong>
        </p>
        <p>修改组件代码后，页面会自动更新并保留状态！</p>
        <p>尝试修改按钮文字或样式，体验 Fast Refresh！</p>
      </div>
    </div>
  );
}

export default Home;
