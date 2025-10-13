import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 模拟 API 请求
  const fetchData = async () => {
    setLoading(true);
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 生成模拟数据
    const mockData = _.range(1, 51).map(i => ({
      id: i,
      name: `用户 ${i}`,
      score: _.random(60, 100),
      status: _.sample(['active', 'inactive', 'pending'])
    }));
    
    setData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 计算统计数据
  const stats = {
    total: data.length,
    active: data.filter(d => d.status === 'active').length,
    avgScore: _.meanBy(data, 'score')?.toFixed(2) || 0,
    topScorer: _.maxBy(data, 'score')
  };

  return (
    <div className="page">
      <h2>📊 仪表盘</h2>
      <p>本页面演示了 Axios 和 Lodash 的协作使用。</p>

      {loading ? (
        <div className="loading">加载数据中...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>总用户数</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <h3>活跃用户</h3>
              <p className="stat-value">{stats.active}</p>
            </div>
            <div className="stat-card">
              <h3>平均分数</h3>
              <p className="stat-value">{stats.avgScore}</p>
            </div>
            <div className="stat-card">
              <h3>最高分用户</h3>
              <p className="stat-value">{stats.topScorer?.name}</p>
            </div>
          </div>

          <div className="info-box">
            <h4>💡 优化说明</h4>
            <ul>
              <li>本页面懒加载，只在访问时才下载代码</li>
              <li>Axios 和 Lodash 被提取到单独的 vendor chunk</li>
              <li>首次构建后，vendor chunk 会被缓存</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

