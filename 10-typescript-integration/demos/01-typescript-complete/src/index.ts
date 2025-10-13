// TypeScript 集成 Demo
import "./styles.css";
import { createButton } from "@components/Button";
import { createUserCard } from "@components/UserCard";
import { validateEmail, formatDate, unique, groupBy } from "@utils/helpers";
import type { User } from "@/types/index";

console.log("🚀 TypeScript 集成 Demo 已加载");

// 创建应用
const app = document.getElementById("app");
if (!app) {
  throw new Error("App element not found");
}

// 标题
const title = document.createElement("h1");
title.textContent = "🚀 TypeScript 集成 Demo";
app.appendChild(title);

// 说明
const info = document.createElement("div");
info.className = "info-box";
info.innerHTML = `
  <h2>✅ 本 Demo 特性：</h2>
  <ul>
    <li><strong>TypeScript</strong> - 完整的类型支持</li>
    <li><strong>ts-loader</strong> - TypeScript 编译</li>
    <li><strong>fork-ts-checker</strong> - 异步类型检查</li>
    <li><strong>路径别名</strong> - @/ @components/ @utils/</li>
    <li><strong>TypeScript ESLint</strong> - 代码检查</li>
  </ul>
  <p><strong>💡 提示：</strong>打开控制台查看类型安全的代码！</p>
`;
app.appendChild(info);

// 演示区域
const section = document.createElement("div");
section.className = "section";
section.innerHTML = "<h2>功能演示</h2>";

// 示例用户数据
const users: User[] = [
  { id: 1, name: "张三", email: "zhangsan@example.com", age: 25 },
  { id: 2, name: "李四", email: "lisi@example.com", age: 30 },
  { id: 3, name: "王五", email: "wangwu@example.com" },
];

// 按钮 1：验证邮箱
const button1 = createButton({
  text: "验证邮箱",
  onClick: () => {
    const email = "test@example.com";
    const isValid = validateEmail(email);
    console.log(`邮箱 ${email} 验证结果:`, isValid);
    alert(`邮箱 ${email} ${isValid ? "✅ 有效" : "❌ 无效"}`);
  },
  variant: "primary",
});

// 按钮 2：显示当前日期
const button2 = createButton({
  text: "显示当前日期",
  onClick: () => {
    const now = new Date();
    const formatted = formatDate(now);
    console.log("当前日期:", formatted);
    alert(`当前日期: ${formatted}`);
  },
  variant: "secondary",
});

// 按钮 3：数组去重
const button3 = createButton({
  text: "数组去重",
  onClick: () => {
    const numbers = [1, 2, 2, 3, 3, 3, 4, 5, 5];
    const uniqueNumbers = unique(numbers);
    console.log("原数组:", numbers);
    console.log("去重后:", uniqueNumbers);
    alert(`原数组: [${numbers}]\n去重后: [${uniqueNumbers}]`);
  },
});

section.appendChild(button1);
section.appendChild(button2);
section.appendChild(button3);
app.appendChild(section);

// 用户列表
const userSection = document.createElement("div");
userSection.className = "section";
userSection.innerHTML = "<h2>用户列表（TypeScript 类型安全）</h2>";

users.forEach((user) => {
  const card = createUserCard(user);
  userSection.appendChild(card);
});

app.appendChild(userSection);

// TypeScript 特性说明
const tsInfo = document.createElement("div");
tsInfo.className = "ts-info";
tsInfo.innerHTML = `
  <h2>🎯 TypeScript 特性</h2>
  
  <div class="ts-box">
    <h3>1. 类型安全</h3>
    <pre><code>interface User {
  id: number;
  name: string;
  email: string;
  age?: number;  // 可选属性
}

const user: User = { ... };  // 类型检查 ✅</code></pre>
  </div>
  
  <div class="ts-box">
    <h3>2. 泛型</h3>
    <pre><code>function unique&lt;T&gt;(array: T[]): T[] {
  return Array.from(new Set(array));
}

const numbers = unique([1, 2, 2, 3]);  // number[]
const strings = unique(['a', 'b', 'b']);  // string[]</code></pre>
  </div>
  
  <div class="ts-box">
    <h3>3. 路径别名</h3>
    <pre><code>// ❌ 相对路径
import { Button } from '../../../components/Button';

// ✅ 路径别名
import { Button } from '@components/Button';
import { helpers } from '@utils/helpers';</code></pre>
  </div>
  
  <div class="ts-box">
    <h3>4. 类型推导</h3>
    <pre><code>const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
];

// TypeScript 自动推导类型
users.forEach(user => {
  console.log(user.name);  // ✅ 有智能提示
});</code></pre>
  </div>
`;
app.appendChild(tsInfo);

// 演示分组功能
const groupSection = document.createElement("div");
groupSection.className = "section";
groupSection.innerHTML = "<h2>泛型示例：分组</h2>";

const items = [
  { name: "苹果", category: "水果" },
  { name: "香蕉", category: "水果" },
  { name: "胡萝卜", category: "蔬菜" },
  { name: "西兰花", category: "蔬菜" },
];

const grouped = groupBy(items, "category");
console.log("分组结果:", grouped);

const groupList = document.createElement("pre");
groupList.textContent = JSON.stringify(grouped, null, 2);
groupSection.appendChild(groupList);
app.appendChild(groupSection);

console.log("✅ 页面渲染完成");
console.log("💡 提示：所有函数都有完整的类型定义！");
console.log("💡 运行 npm run type-check 进行类型检查");
