import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <h3>🔢 计数器</h3>
      <div className="counter-display">{count}</div>
      <div className="counter-buttons">
        <button onClick={() => setCount(count - 1)}>-</button>
        <button onClick={() => setCount(0)}>重置</button>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <p className="hint">
        💡 修改此组件的样式或文本1，<br/>
        计数器的值s会<strong>保持不变</strong>！
      </p>
    </div>
  );
}

export default Counter;

