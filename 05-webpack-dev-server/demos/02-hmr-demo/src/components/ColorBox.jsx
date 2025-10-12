import React, { useState } from 'react';

function ColorBox() {
  const [color, setColor] = useState('#667eea');
  
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0'
  ];

  const randomColor = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(newColor);
  };

  return (
    <div className="color-card">
      <h3>🎨 颜色选择器2</h3>
      <div 
        className="color-display" 
        style={{ backgroundColor: color }}
      >
        {color}
      </div>
      <button onClick={randomColor} className="color-button">
        随机颜色
      </button>
      <p className="hint">
        💡 修改此组件，<br/>
        当前选择的颜色会<strong>保持</strong>！
      </p>
    </div>
  );
}

export default ColorBox;

