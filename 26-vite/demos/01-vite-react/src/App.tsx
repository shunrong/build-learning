import { useState } from "react";
import "./App.css";
import Counter from "./components/Counter";
import TodoList from "./components/TodoList";

function App() {
  const [activeTab, setActiveTab] = useState<"counter" | "todo">("counter");

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡️ Vite + React Demo</h1>
        <p>体验极速的开发体验！</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === "counter" ? "active" : ""}
          onClick={() => setActiveTab("counter")}
        >
          计数器
        </button>
        <button
          className={activeTab === "todo" ? "active" : ""}
          onClick={() => setActiveTab("todo")}
        >
          待办事项
        </button>
      </nav>

      <main className="content">
        {activeTab === "counter" && <Counter />}
        {activeTab === "todo" && <TodoList />}
      </main>

      <footer className="app-footer">
        <p>⚡️ 开发服务器启动 &lt; 1s | 🔥 HMR 响应 &lt; 100ms</p>
        <p className="tip">💡 尝试修改代码，感受极速的 HMR！</p>
      </footer>
    </div>
  );
}

export default App;
