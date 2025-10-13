import { useState } from "react";
import Button from "@components/Button";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="page">
      <h2>🔢 计数器（Fast Refresh 演示）</h2>

      <div className="counter-box">
        <div className="count-display">
          <h1>{count}</h1>
        </div>

        <div className="counter-buttons">
          <Button variant="danger" onClick={() => setCount(count - 1)}>
            -1
          </Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            重置
          </Button>
          <Button variant="primary" onClick={() => setCount(count + 1)}>
            +1
          </Button>
        </div>
      </div>

      <div className="tip-box">
        <h3>🔥 Fast Refresh 演示</h3>
        <ol>
          <li>点击按钮增加计数</li>
          <li>修改此文件中的任意文字或样式</li>
          <li>保存文件</li>
          <li>✅ 页面会自动更新，但计数器的状态会保留！</li>
        </ol>
        <p>
          这就是 Fast Refresh 的威力 - 修改组件代码时保留组件状态，
          极大提升开发体验！
        </p>
      </div>

      <div className="info-box">
        <h3>📊 计数器统计</h3>
        <ul>
          <li>
            当前值：<strong>{count}</strong>
          </li>
          <li>
            是否为正数：<strong>{count > 0 ? "是" : "否"}</strong>
          </li>
          <li>
            是否为偶数：<strong>{count % 2 === 0 ? "是" : "否"}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Counter;
