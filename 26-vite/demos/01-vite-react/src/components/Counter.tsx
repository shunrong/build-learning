import { useState } from 'react';
import './Counter.css';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h2>计数器组件</h2>
      <div className="counter-display">
        <span className="count">{count}</span>
      </div>
      <div className="counter-buttons">
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(0)}>重置</button>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
      <div className="counter-info">
        <p>当前值：{count}</p>
        <p>状态：{count > 0 ? '正数' : count < 0 ? '负数' : '零'}</p>
      </div>
    </div>
  );
}

export default Counter;

