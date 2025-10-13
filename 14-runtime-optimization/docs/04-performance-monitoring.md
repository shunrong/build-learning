# 运行时性能监控

## 📖 为什么需要性能监控

前面我们学习了构建优化、Bundle 优化、运行时优化，但**如何验证优化效果？如何持续监控性能？**

性能监控可以：
1. **量化**优化效果（数据驱动）
2. **发现**性能问题（及时预警）
3. **追踪**性能趋势（持续改进）
4. **定位**慢查询（精准优化）

## 🎯 Core Web Vitals

Google 提出的三大核心指标，直接影响 SEO 排名和用户体验。

### 1. LCP (Largest Contentful Paint)

**最大内容绘制** - 衡量**加载性能**。

**定义**：页面开始加载到最大文本块或图片渲染完成的时间。

**标准**：
- ✅ 优秀：< 2.5s
- ⚠️  需要改进：2.5s - 4.0s
- ❌ 差：> 4.0s

**优化方法**：
1. 优化服务器响应时间
2. 使用 CDN
3. 图片优化和懒加载
4. 预加载关键资源
5. 减少 CSS/JS 阻塞

```javascript
// 监控 LCP
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

### 2. FID (First Input Delay)

**首次输入延迟** - 衡量**交互性**。

**定义**：用户首次与页面交互（点击、输入）到浏览器响应的时间。

**标准**：
- ✅ 优秀：< 100ms
- ⚠️  需要改进：100ms - 300ms
- ❌ 差：> 300ms

**优化方法**：
1. 减少 JavaScript 执行时间
2. 代码分割
3. 使用 Web Workers
4. 延迟非关键 JavaScript

```javascript
// 监控 FID
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    const fid = entry.processingStart - entry.startTime;
    console.log('FID:', fid);
  });
}).observe({ entryTypes: ['first-input'] });
```

### 3. CLS (Cumulative Layout Shift)

**累积布局偏移** - 衡量**视觉稳定性**。

**定义**：页面加载期间元素意外移动的程度。

**标准**：
- ✅ 优秀：< 0.1
- ⚠️  需要改进：0.1 - 0.25
- ❌ 差：> 0.25

**优化方法**：
1. 为图片/视频设置尺寸
2. 避免在现有内容上方插入内容
3. 为动态内容预留空间
4. 使用 CSS `aspect-ratio`

```javascript
// 监控 CLS
let clsValue = 0;
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      console.log('CLS:', clsValue);
    }
  });
}).observe({ entryTypes: ['layout-shift'] });
```

## 📊 其他重要指标

### FCP (First Contentful Paint)

**首次内容绘制** - 首次渲染任何内容的时间。

```javascript
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('FCP:', entry.startTime);
  });
});
observer.observe({ entryTypes: ['paint'] });
```

### TTI (Time to Interactive)

**可交互时间** - 页面完全可交互的时间。

### TTFB (Time to First Byte)

**首字节时间** - 服务器响应时间。

```javascript
const ttfb = performance.timing.responseStart - performance.timing.requestStart;
console.log('TTFB:', ttfb);
```

## 🛠️ Performance API

### Navigation Timing

```javascript
const timing = performance.timing;

// DNS 查询时间
const dns = timing.domainLookupEnd - timing.domainLookupStart;

// TCP 连接时间
const tcp = timing.connectEnd - timing.connectStart;

// 请求响应时间
const request = timing.responseEnd - timing.requestStart;

// DOM 解析时间
const domParse = timing.domInteractive - timing.domLoading;

// 页面加载完成时间
const loadComplete = timing.loadEventEnd - timing.navigationStart;

console.log({
  dns,
  tcp,
  request,
  domParse,
  loadComplete
});
```

### Resource Timing

```javascript
// 监控资源加载
const resources = performance.getEntriesByType('resource');

resources.forEach(resource => {
  console.log({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType
  });
});
```

### User Timing

```javascript
// 自定义性能标记
performance.mark('start-render');

// 执行渲染
renderApp();

performance.mark('end-render');

// 测量时间
performance.measure('render-time', 'start-render', 'end-render');

const measure = performance.getEntriesByName('render-time')[0];
console.log('Render time:', measure.duration);
```

## 📡 性能监控 SDK

### 基础实现

```javascript
class PerformanceMonitor {
  constructor(options = {}) {
    this.reportUrl = options.reportUrl;
    this.sampleRate = options.sampleRate || 1; // 采样率
    this.metrics = {};
  }

  // 监控 FCP
  observeFCP() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.report();
        }
      });
    }).observe({ entryTypes: ['paint'] });
  }

  // 监控 LCP
  observeLCP() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      this.report();
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // 监控 FID
  observeFID() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.report();
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  // 监控 CLS
  observeCLS() {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
      this.report();
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // 监控资源加载
  observeResources() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) {
          // 慢资源上报
          this.reportSlowResource(entry);
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  // 上报数据
  report() {
    if (Math.random() > this.sampleRate) return; // 采样

    // 使用 sendBeacon 确保数据发送
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.reportUrl, JSON.stringify({
        url: location.href,
        metrics: this.metrics,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }));
    } else {
      // fallback: 使用 Image 或 fetch
      fetch(this.reportUrl, {
        method: 'POST',
        body: JSON.stringify(this.metrics),
        keepalive: true
      });
    }
  }

  // 初始化
  init() {
    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeResources();
  }
}

// 使用
const monitor = new PerformanceMonitor({
  reportUrl: '/api/performance',
  sampleRate: 0.1  // 10% 采样
});

monitor.init();
```

### web-vitals 库（推荐）

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  // 上报到分析平台
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({ name, value, id }),
    keepalive: true
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 📈 性能数据可视化

### 实时监控大盘

```javascript
class PerformanceDashboard {
  constructor() {
    this.data = [];
  }

  addMetric(metric) {
    this.data.push({
      ...metric,
      timestamp: Date.now()
    });
    this.render();
  }

  render() {
    // 计算平均值
    const avgFCP = this.average('fcp');
    const avgLCP = this.average('lcp');
    const avgFID = this.average('fid');
    const avgCLS = this.average('cls');

    // 绘制图表
    this.drawChart({
      fcp: avgFCP,
      lcp: avgLCP,
      fid: avgFID,
      cls: avgCLS
    });
  }

  average(key) {
    const values = this.data.map(d => d[key]).filter(Boolean);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  drawChart(metrics) {
    // 使用 ECharts 或其他图表库绘制
    console.table(metrics);
  }
}
```

## 💡 性能优化建议

### 基于 LCP 优化

```javascript
// 监控 LCP 元素
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  
  console.log('LCP element:', lastEntry.element);
  console.log('LCP time:', lastEntry.renderTime);
  
  // 如果是图片，检查是否可以优化
  if (lastEntry.element?.tagName === 'IMG') {
    console.log('Optimize image:', lastEntry.element.src);
  }
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

### 基于 FID 优化

```javascript
// 监控长任务
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.duration > 50) {
      console.warn('Long task detected:', {
        duration: entry.duration,
        startTime: entry.startTime
      });
      // 分析调用栈，找出耗时操作
    }
  });
}).observe({ entryTypes: ['longtask'] });
```

### 基于 CLS 优化

```javascript
// 监控布局偏移
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('Layout shift:', {
      value: entry.value,
      sources: entry.sources?.map(s => s.node)
    });
    
    // 找出导致偏移的元素
    entry.sources?.forEach(source => {
      console.warn('Shift source:', source.node);
    });
  });
}).observe({ entryTypes: ['layout-shift'] });
```

## 🎓 面试高频问题

### Q1: 什么是 Core Web Vitals？

**答**：

Google 提出的三大核心性能指标：
1. **LCP**：加载性能（< 2.5s）
2. **FID**：交互性（< 100ms）
3. **CLS**：视觉稳定性（< 0.1）

直接影响 SEO 和用户体验。

### Q2: 如何监控首屏加载时间？

**答**：

```javascript
// 方法1：Performance API
const fcp = performance.getEntriesByName('first-contentful-paint')[0];
console.log('FCP:', fcp.startTime);

// 方法2：PerformanceObserver
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(entry.name, entry.startTime);
  });
}).observe({ entryTypes: ['paint'] });

// 方法3：web-vitals 库
import { getFCP, getLCP } from 'web-vitals';
getFCP(console.log);
getLCP(console.log);
```

### Q3: 如何优化 LCP？

**答**：

1. **服务器优化**：TTFB < 600ms
2. **资源优化**：压缩、CDN、缓存
3. **关键资源预加载**：`<link rel="preload">`
4. **图片优化**：WebP、懒加载、响应式
5. **减少阻塞**：async/defer、代码分割

---

🎉 **Phase 14 所有文档创建完成！** 现在开始创建 Demos！

