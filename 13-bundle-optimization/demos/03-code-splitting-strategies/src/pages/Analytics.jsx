import React, { useState } from 'react';
import { chunk, sum, mean } from 'lodash-es';

function Analytics() {
  const [dataPoints] = useState(
    Array.from({ length: 100 }, () => Math.floor(Math.random() * 100))
  );

  const chunkedData = chunk(dataPoints, 10);
  const totalSum = sum(dataPoints);
  const average = mean(dataPoints).toFixed(2);
  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints);

  return (
    <div className="page">
      <div className="page-header">
        <h2>📈 数据分析</h2>
        <p>使用更多 lodash-es 函数进行数据处理</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>总和</h4>
          <p className="stat-value">{totalSum}</p>
        </div>
        <div className="stat-card">
          <h4>平均值</h4>
          <p className="stat-value">{average}</p>
        </div>
        <div className="stat-card">
          <h4>最大值</h4>
          <p className="stat-value">{max}</p>
        </div>
        <div className="stat-card">
          <h4>最小值</h4>
          <p className="stat-value">{min}</p>
        </div>
      </div>

      <div className="chart-section">
        <h3>数据分布（每组 10 个）</h3>
        <div className="chart-bars">
          {chunkedData.map((group, index) => {
            const groupSum = sum(group);
            const height = (groupSum / totalSum) * 100;
            return (
              <div key={index} className="bar-container">
                <div
                  className="bar"
                  style={{ height: `${height * 2}px` }}
                  title={`组 ${index + 1}: ${groupSum}`}
                />
                <span className="bar-label">#{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="info-box">
        <h4>📦 Lodash-ES Tree Shaking</h4>
        <p>本页面导入了以下函数：</p>
        <ul>
          <li><code>chunk</code> - 数组分组</li>
          <li><code>sum</code> - 求和</li>
          <li><code>mean</code> - 求平均值</li>
        </ul>
        <p>
          使用 <strong>lodash-es</strong> 的按需导入，只会打包这 3 个函数，
          而不是整个 lodash 库 (70 KB)
        </p>
      </div>
    </div>
  );
}

export default Analytics;

