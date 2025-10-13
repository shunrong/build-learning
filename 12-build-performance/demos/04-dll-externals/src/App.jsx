import React, { useState, useEffect } from 'react';
import _ from 'lodash';

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟数据
  useEffect(() => {
    const mockData = _.range(1, 101).map(i => ({
      id: i,
      name: `Item ${i}`,
      price: _.random(10, 1000),
      category: _.sample(['电子', '图书', '服装', '食品'])
    }));
    setData(mockData);
  }, []);

  // 使用 lodash 的防抖搜索
  const debouncedSearch = _.debounce((term) => {
    console.log('搜索:', term);
  }, 500);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // 过滤和排序数据
  const filteredData = _.chain(data)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sortBy('price')
    .value();

  const stats = {
    total: data.length,
    filtered: filteredData.length,
    avgPrice: _.meanBy(filteredData, 'price')?.toFixed(2) || 0,
    maxPrice: _.maxBy(filteredData, 'price')?.price || 0
  };

  return (
    <div className="app">
      <header>
        <h1>DLL/Externals 优化对比 Demo</h1>
        <p>使用 React + Lodash 演示预编译优化效果</p>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="搜索商品..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="label">总数:</span>
          <span className="value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="label">筛选后:</span>
          <span className="value">{stats.filtered}</span>
        </div>
        <div className="stat-item">
          <span className="label">平均价格:</span>
          <span className="value">¥{stats.avgPrice}</span>
        </div>
        <div className="stat-item">
          <span className="label">最高价格:</span>
          <span className="value">¥{stats.maxPrice}</span>
        </div>
      </div>

      <div className="data-grid">
        {filteredData.map(item => (
          <div key={item.id} className="data-item">
            <h3>{item.name}</h3>
            <p className="category">{item.category}</p>
            <p className="price">¥{item.price}</p>
          </div>
        ))}
      </div>

      <footer>
        <p>
          本 Demo 演示了 3 种构建方式的性能差异：
        </p>
        <ul>
          <li><strong>普通构建:</strong> 每次都编译所有依赖（慢）</li>
          <li><strong>DLL 预编译:</strong> 第三方库预编译，业务代码快速构建</li>
          <li><strong>Externals:</strong> 使用 CDN，构建最快但依赖网络</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;

