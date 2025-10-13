import React from 'react';
import _ from 'lodash';

function Home() {
  // 使用 lodash 的 Tree Shaking 演示
  const data = _.range(1, 21);
  const chunked = _.chunk(data, 5);

  return (
    <div className="page">
      <h2>🏠 首页</h2>
      <p>欢迎来到综合优化 Demo！本页面演示了 Lodash 的 Tree Shaking。</p>

      <div className="demo-section">
        <h3>Lodash Tree Shaking 演示</h3>
        <p>原始数据: {data.join(', ')}</p>
        <p>分块后 (chunk size: 5):</p>
        <pre>{JSON.stringify(chunked, null, 2)}</pre>
      </div>

      <div className="info-box">
        <h4>💡 优化说明</h4>
        <ul>
          <li>本页面只导入了 lodash 的 <code>range</code> 和 <code>chunk</code> 方法</li>
          <li>通过 Tree Shaking，未使用的方法不会被打包</li>
          <li>查看构建结果，lodash 体积会明显减小</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;

