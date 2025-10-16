/**
 * esbuild Demo - TypeScript 支持演示
 */

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

class Calculator {
  private history: number[] = [];
  
  add(a: number, b: number): number {
    const result = a + b;
    this.history.push(result);
    return result;
  }
  
  multiply(a: number, b: number): number {
    const result = a * b;
    this.history.push(result);
    return result;
  }
  
  getHistory(): number[] {
    return [...this.history];
  }
  
  clearHistory(): void {
    this.history = [];
  }
}

function createUser(name: string, email: string, age?: number): User {
  return {
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    age
  };
}

function calculateTotal(products: Product[]): number {
  return products.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
  }, 0);
}

// 异步函数演示
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// 泛型函数演示
function arrayToMap<T extends { id: number }>(items: T[]): Map<number, T> {
  const map = new Map<number, T>();
  items.forEach(item => map.set(item.id, item));
  return map;
}

// 装饰器演示
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };
  
  return descriptor;
}

class MathService {
  @log
  static power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }
}

// 主函数
function main() {
  console.log('🚀 esbuild Demo - TypeScript 编译测试\n');
  
  // 测试 Calculator
  const calc = new Calculator();
  console.log('Calculator:', calc.add(5, 3));
  console.log('Calculator:', calc.multiply(4, 2));
  console.log('History:', calc.getHistory());
  
  // 测试 User
  const user = createUser('Alice', 'alice@example.com', 30);
  console.log('User:', user);
  
  // 测试 Product
  const products: Product[] = [
    { id: 1, name: 'Book', price: 29.99, quantity: 2 },
    { id: 2, name: 'Pen', price: 1.99, quantity: 10 }
  ];
  console.log('Total:', calculateTotal(products));
  
  // 测试泛型
  const productMap = arrayToMap(products);
  console.log('Product Map:', productMap);
  
  // 测试装饰器
  MathService.power(2, 3);
  
  console.log('\n✅ 所有测试完成！');
}

// 执行
main();

// 导出
export {
  Calculator,
  createUser,
  calculateTotal,
  fetchData,
  arrayToMap,
  MathService
};

export type { User, Product };

