import React from 'react';

function Results() {
  return (
    <div className="page">
      <h2>📊 优化效果对比</h2>
      
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>优化前</th>
              <th>优化后</th>
              <th>提升</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>首次构建时间</td>
              <td>12.5s</td>
              <td>14.2s</td>
              <td className="negative">-13.6%</td>
            </tr>
            <tr>
              <td>二次构建时间</td>
              <td>12.3s</td>
              <td>1.5s</td>
              <td className="positive">+87.8%</td>
            </tr>
            <tr>
              <td>总 Bundle 体积</td>
              <td>450 KB</td>
              <td>180 KB</td>
              <td className="positive">+60%</td>
            </tr>
            <tr>
              <td>首屏加载体积</td>
              <td>450 KB</td>
              <td>120 KB</td>
              <td className="positive">+73.3%</td>
            </tr>
            <tr>
              <td>Gzip 后体积</td>
              <td>-</td>
              <td>38 KB</td>
              <td className="positive">-</td>
            </tr>
            <tr>
              <td>Brotli 后体积</td>
              <td>-</td>
              <td>32 KB</td>
              <td className="positive">-</td>
            </tr>
            <tr>
              <td>文件数量</td>
              <td>2 个</td>
              <td>8 个</td>
              <td>-</td>
            </tr>
            <tr>
              <td>缓存命中率</td>
              <td>0%</td>
              <td>~70%</td>
              <td className="positive">+70%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="insights">
        <h3>💡 关键发现</h3>
        <ul>
          <li><strong>二次构建提速 87.8%：</strong>filesystem cache 的巨大威力</li>
          <li><strong>首屏体积减少 73.3%：</strong>代码分割 + 懒加载的效果</li>
          <li><strong>Brotli 压缩：</strong>相比原始体积减少 92.9%</li>
          <li><strong>长期缓存：</strong>vendor 分离 + contenthash，更新业务代码时第三方库无需重新下载</li>
        </ul>
      </div>

      <div className="recommendations">
        <h3>🎯 建议</h3>
        <p><strong>开发环境：</strong>不压缩 + 基础分割（快速开发）</p>
        <p><strong>测试环境：</strong>基础压缩 + 代码分割（接近生产）</p>
        <p><strong>生产环境：</strong>全部优化（本 Demo 的配置）</p>
      </div>
    </div>
  );
}

export default Results;

