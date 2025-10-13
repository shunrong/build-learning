import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 使用 lodash 生成模拟数据
  React.useEffect(() => {
    const mockData = _.range(1, 101).map(i => ({
      id: i,
      name: `商品 ${i}`,
      price: _.random(10, 1000),
      category: _.sample(['电子', '图书', '服装', '食品', '家居']),
      inStock: _.sample([true, false]),
      createdAt: moment().subtract(_.random(1, 365), 'days').format('YYYY-MM-DD')
    }));
    setData(mockData);
  }, []);

  // 使用 lodash 的防抖搜索
  const debouncedSearch = React.useMemo(
    () => _.debounce((term) => {
      console.log('搜索:', term);
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // 使用 lodash 过滤和排序
  const filteredData = React.useMemo(() => {
    return _.chain(data)
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.includes(searchTerm)
      )
      .sortBy('price')
      .value();
  }, [data, searchTerm]);

  // 统计数据
  const stats = React.useMemo(() => ({
    total: data.length,
    filtered: filteredData.length,
    inStock: _.filter(data, 'inStock').length,
    avgPrice: _.meanBy(filteredData, 'price')?.toFixed(2) || 0,
    maxPrice: _.maxBy(filteredData, 'price')?.price || 0,
    categories: _.countBy(data, 'category')
  }), [data, filteredData]);

  // 模拟 API 请求
  const handleRefresh = async () => {
    try {
      console.log('模拟 API 请求...');
      // 这里演示 axios 的存在（实际不发送请求）
      const config = axios.defaults;
      console.log('Axios config:', config);
    } catch (error) {
      console.error('请求失败:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📊 Bundle 分析 Demo</h1>
        <p>本 Demo 演示了完整导入大型库对 Bundle 体积的影响</p>
      </header>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="搜索商品名称或分类..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn-refresh" onClick={handleRefresh}>
          🔄 刷新数据
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>总商品数</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>筛选后</h3>
          <p className="stat-value">{stats.filtered}</p>
        </div>
        <div className="stat-card">
          <h3>库存中</h3>
          <p className="stat-value">{stats.inStock}</p>
        </div>
        <div className="stat-card">
          <h3>平均价格</h3>
          <p className="stat-value">¥{stats.avgPrice}</p>
        </div>
      </div>

      <div className="categories">
        <h3>分类统计：</h3>
        {Object.entries(stats.categories).map(([cat, count]) => (
          <span key={cat} className="category-tag">
            {cat} ({count})
          </span>
        ))}
      </div>

      <div className="data-grid">
        {filteredData.slice(0, 20).map(item => (
          <div key={item.id} className="data-item">
            <h4>{item.name}</h4>
            <p className="category">{item.category}</p>
            <p className="price">¥{item.price}</p>
            <p className="stock">{item.inStock ? '✅ 有货' : '❌ 缺货'}</p>
            <p className="date">
              {moment(item.createdAt).fromNow()}
            </p>
          </div>
        ))}
      </div>

      <div className="analysis-tips">
        <h3>🔍 Bundle 分析要点</h3>
        <ul>
          <li>
            <strong>Lodash (70 KB):</strong> 完整导入了整个库，但实际只用了几个方法
            <br />
            <code>优化方案：使用 lodash-es 或按需导入</code>
          </li>
          <li>
            <strong>Moment.js (280 KB):</strong> 包含了所有语言文件
            <br />
            <code>优化方案：替换为 Day.js (2 KB) 或使用 IgnorePlugin</code>
          </li>
          <li>
            <strong>Axios (13 KB):</strong> 相对轻量，但如果只用基础功能可考虑 Fetch API
            <br />
            <code>优化方案：评估是否真的需要 Axios 的高级特性</code>
          </li>
          <li>
            <strong>React + ReactDOM (150 KB):</strong> 核心依赖，无法避免
            <br />
            <code>优化方案：代码分割，将 vendor 单独打包并长期缓存</code>
          </li>
        </ul>
        <p className="tip">
          💡 运行 <code>npm run analyze</code> 查看详细的 Bundle 分析报告
        </p>
      </div>
    </div>
  );
}

export default App;

