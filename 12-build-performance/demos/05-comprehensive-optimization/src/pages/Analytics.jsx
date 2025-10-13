import React, { useState } from 'react';
import moment from 'moment';
import _ from 'lodash';

function Analytics() {
  const [dateRange, setDateRange] = useState({
    start: moment().subtract(7, 'days'),
    end: moment()
  });

  // 生成图表数据
  const generateChartData = () => {
    const days = dateRange.end.diff(dateRange.start, 'days') + 1;
    return _.range(0, days).map(i => {
      const date = moment(dateRange.start).add(i, 'days');
      return {
        date: date.format('YYYY-MM-DD'),
        value: _.random(100, 1000)
      };
    });
  };

  const chartData = generateChartData();
  const total = _.sumBy(chartData, 'value');
  const average = _.meanBy(chartData, 'value').toFixed(2);
  const max = _.maxBy(chartData, 'value');
  const min = _.minBy(chartData, 'value');

  return (
    <div className="page">
      <h2>📈 数据分析</h2>
      <p>本页面演示了 Moment.js 和 Lodash 的协作使用。</p>

      <div className="date-info">
        <p>📅 时间范围: {dateRange.start.format('YYYY-MM-DD')} ~ {dateRange.end.format('YYYY-MM-DD')}</p>
        <p>📊 总天数: {chartData.length} 天</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>总计</h3>
          <p className="stat-value">{total}</p>
        </div>
        <div className="stat-card">
          <h3>平均值</h3>
          <p className="stat-value">{average}</p>
        </div>
        <div className="stat-card">
          <h3>最大值</h3>
          <p className="stat-value">{max?.value}</p>
          <p className="stat-date">{max?.date}</p>
        </div>
        <div className="stat-card">
          <h3>最小值</h3>
          <p className="stat-value">{min?.value}</p>
          <p className="stat-date">{min?.date}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>每日数据趋势</h3>
        <div className="chart">
          {chartData.map((item, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar" 
                style={{ height: `${(item.value / 1000) * 100}%` }}
                title={`${item.date}: ${item.value}`}
              />
              <span className="bar-label">{item.date.split('-')[2]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-box warning">
        <h4>⚠️ 注意</h4>
        <ul>
          <li>Moment.js 体积较大（~300KB），生产环境建议使用 date-fns 或 Day.js</li>
          <li>本 Demo 中 Moment.js 通过 <code>noParse</code> 跳过解析，加快构建速度</li>
          <li>但最佳实践是使用更轻量的日期库</li>
        </ul>
      </div>
    </div>
  );
}

export default Analytics;

