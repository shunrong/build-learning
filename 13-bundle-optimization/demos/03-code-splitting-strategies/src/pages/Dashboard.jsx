import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash-es';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 模拟 API 请求
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `项目 ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
      status: ['进行中', '已完成', '待开始'][Math.floor(Math.random() * 3)]
    }));
    setData(mockData);
  }, []);

  const handleSearch = debounce((term) => {
    console.log('搜索:', term);
    // 这里会使用 axios（虽然是模拟）
    console.log('Axios 已加载:', typeof axios);
  }, 300);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>📊 仪表盘</h2>
        <p>演示 lodash-es 和 axios 的使用</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索项目..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>

      <div className="data-grid">
        {filteredData.map(item => (
          <div key={item.id} className="data-card">
            <h4>{item.name}</h4>
            <p className="value">数值: {item.value}</p>
            <span className={`status status-${item.status}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="info-box">
        <h4>📦 依赖说明</h4>
        <ul>
          <li><strong>lodash-es:</strong> 使用 debounce 函数（按需导入）</li>
          <li><strong>axios:</strong> HTTP 请求库（本页面导入）</li>
          <li>这些库会被打包到 <code>utils.xxx.js</code> chunk</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

