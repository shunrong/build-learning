/**
 * 简单代码格式化器
 * 演示 AST → 格式化代码的核心流程
 */

const parser = require('@babel/parser');
const t = require('@babel/types');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║           简单代码格式化器演示                  ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

// 格式化配置
const config = {
  indent: '  ',        // 2空格缩进
  semicolon: true,     // 加分号
  singleQuote: true,   // 单引号
  space: true          // 操作符周围加空格
};

// 简单的 Formatter 实现
class SimpleFormatter {
  constructor(config) {
    this.config = config;
    this.indentLevel = 0;
  }

  // 主入口
  format(code) {
    const ast = parser.parse(code, { sourceType: 'module' });
    return this.printProgram(ast.program);
  }

  // 打印程序
  printProgram(program) {
    return program.body
      .map(node => this.print(node))
      .join('\n\n');  // 语句之间空行
  }

  // 核心：打印节点
  print(node) {
    switch (node.type) {
      case 'VariableDeclaration':
        return this.printVariableDeclaration(node);
      case 'FunctionDeclaration':
        return this.printFunctionDeclaration(node);
      case 'ExpressionStatement':
        return this.printExpressionStatement(node);
      case 'ReturnStatement':
        return this.printReturnStatement(node);
      case 'IfStatement':
        return this.printIfStatement(node);
      default:
        return `/* Unsupported: ${node.type} */`;
    }
  }

  // 打印变量声明
  printVariableDeclaration(node) {
    const kind = node.kind;  // const/let/var
    const declarations = node.declarations
      .map(d => this.printVariableDeclarator(d))
      .join(', ');
    
    return this.indent() + `${kind} ${declarations}${this.semi()}`;
  }

  // 打印变量声明符
  printVariableDeclarator(node) {
    const id = node.id.name;
    const init = node.init ? this.printExpression(node.init) : null;
    
    if (init) {
      return `${id}${this.space()}=${this.space()}${init}`;
    }
    return id;
  }

  // 打印函数声明
  printFunctionDeclaration(node) {
    const name = node.id.name;
    const params = node.params.map(p => p.name).join(',${this.space()}');
    const body = this.printBlockStatement(node.body);
    
    return this.indent() + `function ${name}(${params}) ${body}`;
  }

  // 打印块语句
  printBlockStatement(node) {
    this.indentLevel++;
    const body = node.body
      .map(stmt => this.print(stmt))
      .join('\n');
    this.indentLevel--;
    
    return `{\n${body}\n${this.indent()}}`;
  }

  // 打印表达式语句
  printExpressionStatement(node) {
    return this.indent() + this.printExpression(node.expression) + this.semi();
  }

  // 打印返回语句
  printReturnStatement(node) {
    const argument = node.argument ? this.printExpression(node.argument) : '';
    return this.indent() + `return${argument ? ' ' + argument : ''}${this.semi()}`;
  }

  // 打印 if 语句
  printIfStatement(node) {
    const test = this.printExpression(node.test);
    const consequent = t.isBlockStatement(node.consequent)
      ? this.printBlockStatement(node.consequent)
      : '{\n' + this.print(node.consequent) + '\n' + this.indent() + '}';
    
    let result = this.indent() + `if (${test}) ${consequent}`;
    
    if (node.alternate) {
      const alternate = t.isBlockStatement(node.alternate)
        ? this.printBlockStatement(node.alternate)
        : '{\n' + this.print(node.alternate) + '\n' + this.indent() + '}';
      result += ` else ${alternate}`;
    }
    
    return result;
  }

  // 打印表达式
  printExpression(node) {
    switch (node.type) {
      case 'Identifier':
        return node.name;
      
      case 'Literal':
        if (typeof node.value === 'string') {
          const quote = this.config.singleQuote ? "'" : '"';
          return `${quote}${node.value}${quote}`;
        }
        return String(node.value);
      
      case 'BinaryExpression':
        const left = this.printExpression(node.left);
        const right = this.printExpression(node.right);
        return `${left}${this.space()}${node.operator}${this.space()}${right}`;
      
      case 'CallExpression':
        const callee = this.printExpression(node.callee);
        const args = node.arguments.map(arg => this.printExpression(arg)).join(',${this.space()}');
        return `${callee}(${args})`;
      
      case 'MemberExpression':
        const object = this.printExpression(node.object);
        const property = this.printExpression(node.property);
        return node.computed ? `${object}[${property}]` : `${object}.${property}`;
      
      case 'ArrowFunctionExpression':
        const params = node.params.map(p => p.name).join(',${this.space()}');
        const body = t.isBlockStatement(node.body)
          ? this.printBlockStatement(node.body)
          : this.printExpression(node.body);
        return `(${params})${this.space()}=>${this.space()}${body}`;
      
      default:
        return `/* Unsupported expression: ${node.type} */`;
    }
  }

  // 辅助方法
  indent() {
    return this.config.indent.repeat(this.indentLevel);
  }

  semi() {
    return this.config.semicolon ? ';' : '';
  }

  space() {
    return this.config.space ? ' ' : '';
  }
}

// 测试用例
const testCases = [
  {
    name: '变量声明',
    code: 'const x=1;const y=2'
  },
  {
    name: '函数声明',
    code: 'function add(a,b){return a+b}'
  },
  {
    name: '复杂表达式',
    code: 'const sum=arr.filter(x=>x>0).reduce((a,b)=>a+b,0)'
  },
  {
    name: 'if 语句',
    code: 'function test(x){if(x>0){console.log("positive")}else{console.log("negative")}}'
  }
];

// 运行测试
const formatter = new SimpleFormatter(config);

testCases.forEach(({ name, code }, index) => {
  console.log(chalk.yellow(`\n【测试 ${index + 1}】${name}`));
  console.log(chalk.gray('格式化前:'));
  console.log(chalk.white(code));
  
  try {
    const formatted = formatter.format(code);
    console.log(chalk.gray('\n格式化后:'));
    console.log(chalk.green(formatted));
  } catch (e) {
    console.log(chalk.red('格式化失败:', e.message));
  }
});

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║              核心原理总结                       ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝'));

console.log(chalk.white(`
核心流程：
  1. 解析代码为 AST（使用 @babel/parser）
  2. 遍历 AST 节点（递归访问）
  3. 为每个节点生成格式化后的代码
  4. 应用格式化规则（缩进、空格、分号）
  5. 拼接为最终代码

关键点：
  ✓ 不改变代码语义
  ✓ 统一代码风格
  ✓ 递归处理嵌套结构
  ✓ 维护缩进层级
`));

console.log(chalk.green('\n✅ Demo 完成！\n'));

