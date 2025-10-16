const parser = require('@babel/parser');
const t = require('@babel/types');
const chalk = require('chalk');

class CompleteFormatter {
  constructor(options = {}) {
    this.printWidth = options.printWidth || 80;
    this.indent = options.indent || 2;
    this.output = '';
    this.indentLevel = 0;
    this.column = 0;
  }
  
  format(code) {
    const ast = parser.parse(code, { sourceType: 'module' });
    this.output = '';
    this.indentLevel = 0;
    this.column = 0;
    ast.program.body.forEach((stmt, i) => {
      this.formatStatement(stmt);
      if (t.isFunctionDeclaration(stmt)) this.writeLine();
    });
    return this.output.trim();
  }
  
  write(str) {
    this.output += str;
    this.column += str.length;
  }
  
  writeLine() {
    this.output += '\n';
    this.column = 0;
  }
  
  writeIndent() {
    const indent = ' '.repeat(this.indentLevel * this.indent);
    this.write(indent);
  }
  
  formatStatement(node) {
    if (t.isVariableDeclaration(node)) {
      this.writeIndent();
      this.write(node.kind + ' ');
      node.declarations.forEach((d, i) => {
        if (i > 0) this.write(', ');
        this.write(d.id.name);
        if (d.init) {
          this.write(' = ');
          this.formatExpr(d.init);
        }
      });
      this.write(';\n');
    } else if (t.isFunctionDeclaration(node)) {
      this.writeIndent();
      this.write('function ' + node.id.name + '(');
      node.params.forEach((p, i) => {
        if (i > 0) this.write(', ');
        this.write(p.name);
      });
      this.write(') {\n');
      this.indentLevel++;
      node.body.body.forEach(s => this.formatStatement(s));
      this.indentLevel--;
      this.writeIndent();
      this.write('}\n');
    } else if (t.isReturnStatement(node)) {
      this.writeIndent();
      this.write('return');
      if (node.argument) {
        this.write(' ');
        this.formatExpr(node.argument);
      }
      this.write(';\n');
    } else if (t.isExpressionStatement(node)) {
      this.writeIndent();
      this.formatExpr(node.expression);
      this.write(';\n');
    }
  }
  
  formatExpr(node) {
    if (t.isNumericLiteral(node)) {
      this.write(String(node.value));
    } else if (t.isStringLiteral(node)) {
      this.write('"' + node.value + '"');
    } else if (t.isIdentifier(node)) {
      this.write(node.name);
    } else if (t.isBinaryExpression(node)) {
      this.formatExpr(node.left);
      this.write(' ' + node.operator + ' ');
      this.formatExpr(node.right);
    } else if (t.isCallExpression(node)) {
      this.formatExpr(node.callee);
      this.write('(');
      node.arguments.forEach((arg, i) => {
        if (i > 0) this.write(', ');
        this.formatExpr(arg);
      });
      this.write(')');
    } else if (t.isObjectExpression(node)) {
      const shouldBreak = this.shouldBreakObject(node);
      if (shouldBreak) {
        this.write('{\n');
        this.indentLevel++;
        node.properties.forEach((p, i) => {
          this.writeIndent();
          this.write(p.key.name + ': ');
          this.formatExpr(p.value);
          this.write(i < node.properties.length - 1 ? ',\n' : '\n');
        });
        this.indentLevel--;
        this.writeIndent();
        this.write('}');
      } else {
        this.write('{ ');
        node.properties.forEach((p, i) => {
          if (i > 0) this.write(', ');
          this.write(p.key.name + ': ');
          this.formatExpr(p.value);
        });
        this.write(' }');
      }
    } else if (t.isArrayExpression(node)) {
      this.write('[');
      node.elements.forEach((e, i) => {
        if (i > 0) this.write(', ');
        this.formatExpr(e);
      });
      this.write(']');
    }
  }
  
  shouldBreakObject(node) {
    return node.properties.length > 3;
  }
}

// Demo
console.log(chalk.bold.blue('\n========== Complete Formatter 演示 ==========\n'));

const formatter = new CompleteFormatter({ printWidth: 60 });

const code1 = 'const obj={a:1,b:2,c:3,d:4,e:5};';
console.log(chalk.yellow('【示例 1】对象智能换行\n'));
console.log(chalk.gray('输入:'), code1);
console.log(chalk.green('输出:'));
console.log(formatter.format(code1));

const code2 = 'function calculate(x,y){const result=x*y+10;return result;}';
console.log(chalk.yellow('\n【示例 2】函数格式化\n'));
console.log(chalk.gray('输入:'), code2);
console.log(chalk.green('输出:'));
console.log(formatter.format(code2));

console.log(chalk.bold.green('\n✅ Demo 完成！\n'));

