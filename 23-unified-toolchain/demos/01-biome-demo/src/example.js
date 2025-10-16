// 故意包含一些格式和 Lint 问题的代码
// Biome 会自动检测并修复

// 1. 格式问题：缩进不一致
function add(a,b){
return a+b;
}

// 2. Lint 问题：未使用的变量
const unusedVar = 123;

// 3. 格式问题：对象属性间距
const user={name:"Alice",age:30,email:"alice@example.com"};

// 4. Lint 问题：console.log
console.log("This is a debug message");

// 5. 格式问题：数组格式
const items=[1,2,3,4,5,6,7,8,9,10];

// 6. Lint 问题：使用 var
var oldStyleVar = "should use const or let";

// 7. 格式问题：复杂表达式
const result=1+2*3-4/2;

// 8. 正常的代码
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

// 9. 异步函数
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

// 10. 导出
export { add, calculateTotal, fetchData, user, items };

