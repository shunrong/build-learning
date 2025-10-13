/**
 * Lodash-ES Tree Shaking 演示
 * 对比完整导入 vs 按需导入
 */

// ✅ 按需导入（支持 Tree Shaking）
import { debounce, throttle, chunk } from 'lodash-es';

// 只会打包这三个函数，其他 lodash 函数不会被打包

export function createDebouncedHandler(fn, wait) {
  return debounce(fn, wait);
}

export function createThrottledHandler(fn, wait) {
  return throttle(fn, wait);
}

export function chunkArray(arr, size) {
  return chunk(arr, size);
}

// 说明：如果使用 import _ from 'lodash'，
// 则会打包整个 lodash (70 KB)
// 使用 lodash-es 的按需导入，只打包使用的函数（约 2-3 KB）

