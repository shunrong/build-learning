# Phase 22: Minifier

## 📋 本阶段概述

学习代码压缩器（Minifier）的核心原理，理解如何减小代码体积而不改变代码行为。

## 🎯 学习目标

- 理解 Minifier 的核心压缩技术
- 掌握变量混淆、常量折叠、死代码消除
- 了解 Terser、esbuild 的压缩策略
- 理解压缩的权衡（体积 vs 可读性 vs 性能）

## 📂 内容结构

```
22-minifier/
├── docs/                    # 📚 学习文档
│   ├── 00-guide.md         # 学习指南
│   └── 01-minifier-basics.md  # Minifier 基础
│
└── demos/                   # 💻 实战项目
    └── 01-simple-minifier/ # 简单压缩器实现（待补充）
```

## ✅ 当前状态

📝 **核心内容已完成**：
- ✅ 学习指南
- ✅ Minifier 基础文档

⏳ **待补充内容**（Phase 24-26 完成后）：
- 💻 简单 Minifier 实现Demo
- 📝 高级压缩优化技术
- 📝 性能对比分析
- 📝 Source Map 集成

## 🚀 快速开始

```bash
# 1. 阅读学习指南
cat docs/00-guide.md

# 2. 阅读基础文档
cat docs/01-minifier-basics.md
```

## 💡 核心要点

1. **压缩技术**：
   - 删除空格和注释
   - 变量混淆（Name Mangling）
   - 常量折叠（Constant Folding）
   - 死代码消除（DCE）

2. **性能对比**：
   - Terser（JS）：适中性能
   - esbuild（Go）：10-50x 更快
   - SWC（Rust）：3-10x 更快

3. **压缩权衡**：
   - 体积 ↓ = 可读性 ↓
   - 压缩率 ↑ = 压缩时间 ↑
   - Source Map 是调试的关键

## 📊 压缩效果

```
原始代码：100KB
→ 删除空格/注释：70KB（-30%）
→ 变量混淆：50KB（-50%）
→ 常量折叠 + DCE：40KB（-60%）
→ Gzip 压缩：15KB（-85%）
```

---

> 💡 提示：本阶段采用快速推进策略，重点掌握核心原理，详细内容后续补充。

