// 模拟 API 调用

export const fetchData = async () => {
  console.log('📡 发起 API 请求...');
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 故意抛出错误
  throw new Error('API 请求失败（这是故意的，用于测试 Source Map）');
};

