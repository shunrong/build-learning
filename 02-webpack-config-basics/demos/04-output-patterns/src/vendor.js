// 第三方库或公共代码
// 这个文件很少修改

console.log('📚 Vendor bundle 加载完成');

export function vendorFunction() {
  console.log('这是 vendor 代码');
}

// 模拟第三方库代码
export const VERSION = '1.0.0';

export const utils = {
  log: (msg) => console.log(`[Utils] ${msg}`),
  warn: (msg) => console.warn(`[Utils] ${msg}`),
  error: (msg) => console.error(`[Utils] ${msg}`)
};

