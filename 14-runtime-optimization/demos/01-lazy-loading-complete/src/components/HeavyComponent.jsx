import React from 'react';

function HeavyComponent() {
  // 模拟重型组件
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `这是第 ${i + 1} 个数据项的描述内容`
  }));

  return (
    <div className="heavy-component">
      <h3>✅ 重型组件已加载</h3>
      <p>这个组件被单独打包为一个 chunk，只在需要时才加载。</p>
      
      <div className="data-list">
        {data.slice(0, 10).map(item => (
          <div key={item.id} className="data-item">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      
      <p className="note">显示前 10 项，共 {data.length} 项</p>
    </div>
  );
}

export default HeavyComponent;

