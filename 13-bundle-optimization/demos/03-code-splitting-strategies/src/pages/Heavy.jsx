import React, { useState } from 'react';
import { range, shuffle, sortBy, groupBy } from 'lodash-es';

/**
 * 大型组件演示
 * 包含大量数据和复杂逻辑，适合懒加载
 */
function Heavy() {
  const [data] = useState(() => {
    return range(1, 501).map(i => ({
      id: i,
      name: `Item ${i}`,
      category: ['A', 'B', 'C', 'D', 'E'][i % 5],
      value: Math.floor(Math.random() * 1000),
      priority: Math.floor(Math.random() * 5) + 1
    }));
  });

  const [view, setView] = useState('all');

  const processedData = (() => {
    switch (view) {
      case 'shuffle':
        return shuffle([...data]);
      case 'sorted':
        return sortBy(data, 'value').reverse();
      case 'grouped':
        return groupBy(data, 'category');
      default:
        return data;
    }
  })();

  return (
    <div className="page">
      <div className="page-header">
        <h2>🚀 大型组件</h2>
        <p>包含 500 条数据和复杂处理逻辑，演示懒加载的重要性</p>
      </div>

      <div className="view-controls">
        <button
          className={view === 'all' ? 'active' : ''}
          onClick={() => setView('all')}
        >
          全部数据
        </button>
        <button
          className={view === 'shuffle' ? 'active' : ''}
          onClick={() => setView('shuffle')}
        >
          随机排序
        </button>
        <button
          className={view === 'sorted' ? 'active' : ''}
          onClick={() => setView('sorted')}
        >
          按值排序
        </button>
        <button
          className={view === 'grouped' ? 'active' : ''}
          onClick={() => setView('grouped')}
        >
          分组显示
        </button>
      </div>

      <div className="heavy-content">
        {view === 'grouped' ? (
          <div className="grouped-view">
            {Object.entries(processedData).map(([category, items]) => (
              <div key={category} className="category-group">
                <h3>分类 {category} ({items.length} 项)</h3>
                <div className="items-grid">
                  {items.slice(0, 10).map(item => (
                    <div key={item.id} className="heavy-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-value">{item.value}</span>
                    </div>
                  ))}
                </div>
                {items.length > 10 && (
                  <p className="more-items">还有 {items.length - 10} 项...</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="list-view">
            {processedData.slice(0, 50).map(item => (
              <div key={item.id} className="heavy-item">
                <span className="item-id">#{item.id}</span>
                <span className="item-name">{item.name}</span>
                <span className="item-category">分类: {item.category}</span>
                <span className="item-value">值: {item.value}</span>
                <span className="item-priority">优先级: {'⭐'.repeat(item.priority)}</span>
              </div>
            ))}
            <p className="more-items">显示前 50 项，共 {data.length} 项</p>
          </div>
        )}
      </div>

      <div className="info-box">
        <h4>⚡ 为什么要懒加载大型组件？</h4>
        <ul>
          <li><strong>减少首屏加载体积：</strong>不访问此页面就不下载这部分代码</li>
          <li><strong>加快首页加载速度：</strong>首页只需下载 20-30 KB，而不是 200 KB</li>
          <li><strong>提升用户体验：</strong>用户更快看到首页内容</li>
          <li><strong>节省带宽：</strong>部分用户可能永远不会访问此页面</li>
        </ul>
        <p className="highlight">
          本组件使用了大量 lodash-es 函数 (range, shuffle, sortBy, groupBy)，
          如果不懒加载，这些代码会影响首屏加载速度！
        </p>
      </div>
    </div>
  );
}

export default Heavy;

