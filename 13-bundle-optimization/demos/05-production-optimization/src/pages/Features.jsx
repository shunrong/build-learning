import React from 'react';
import { debounce } from 'lodash-es';

function Features() {
  const handleClick = debounce(() => {
    console.log('Lodash-es debounce 演示');
  }, 300);

  return (
    <div className="page">
      <h2>✨ 优化特性详解</h2>
      
      <section>
        <h3>缓存优化</h3>
        <ul>
          <li>Webpack 5 filesystem cache（首次构建后提速 90%）</li>
          <li>Babel cacheDirectory（Babel 转译缓存）</li>
          <li>contenthash 长期缓存（文件名哈希）</li>
        </ul>
      </section>

      <section>
        <h3>并行优化</h3>
        <ul>
          <li>thread-loader（多线程 Babel 转译）</li>
          <li>TerserPlugin parallel（并行压缩）</li>
          <li>CssMinimizerPlugin parallel（并行 CSS 压缩）</li>
        </ul>
      </section>

      <section>
        <h3>代码分割</h3>
        <ul>
          <li>React vendors 单独打包（长期缓存）</li>
          <li>Utils（lodash-es, axios）单独打包</li>
          <li>公共代码提取（minChunks: 2）</li>
          <li>路由级别懒加载（按需加载）</li>
        </ul>
      </section>

      <section>
        <h3>Tree Shaking</h3>
        <ul>
          <li>保留 ES Module（modules: false）</li>
          <li>usedExports 标记未使用导出</li>
          <li>PurgeCSS 移除未使用 CSS</li>
          <li>Scope Hoisting 模块合并</li>
        </ul>
      </section>

      <section>
        <h3>高级压缩</h3>
        <ul>
          <li>移除 console.log/debugger</li>
          <li>多次传递优化（passes: 2）</li>
          <li>深度变量名混淆（toplevel: true）</li>
          <li>Gzip 压缩（减少 70%）</li>
          <li>Brotli 压缩（比 Gzip 再减少 15%）</li>
        </ul>
      </section>

      <button onClick={handleClick} className="demo-btn">
        点击测试 Lodash-ES Debounce
      </button>
    </div>
  );
}

export default Features;

