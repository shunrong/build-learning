const parser = require('@babel/parser');
const t = require('@babel/types');

class BasicFormatter {
  constructor(options = {}) {
    this.options = {
      indent: options.indent || 2,
      ...options
    };
    
    this.output = '';
    this.indentLevel = 0;
  }
  
  format(code) {
    const ast = parser.parse(code, {
      sourceType: 'module'
    });
    
    this.output = '';
    this.indentLevel = 0;
    this.formatProgram(ast.program);
    
    return this.output.trim();
  }
  
  // ========== 工具方法 ==========
  indent() {
    this.indentLevel++;
  }
  
  dedent() {
    this.indentLevel--;
  }
  
  write(str) {
    this.output += str;
  }
  
  writeLine(str = '') {
    const spaces = ' '.repeat(this.indentLevel * this.options.indent);
    this.output += spaces + str + '\n';
  }
  
  writeSpace() {
    this.output += ' ';
  }
  
  getIndent() {
    return ' '.repeat(this.indentLevel * this.options.indent);
  }
  
  // ========== 格式化方法 ==========
  formatProgram(program) {
    program.body.forEach((stmt, index) => {
      this.formatStatement(stmt);
      
      if (t.isFunctionDeclaration(stmt) || t.isClassDeclaration(stmt)) {
        this.writeLine();
      }
    });
  }
  
  formatStatement(node) {
    if (t.isVariableDeclaration(node)) {
      this.formatVariableDeclaration(node);
    } else if (t.isFunctionDeclaration(node)) {
      this.formatFunctionDeclaration(node);
    } else if (t.isReturnStatement(node)) {
      this.formatReturnStatement(node);
    } else if (t.isExpressionStatement(node)) {
      this.formatExpressionStatement(node);
    } else if (t.isIfStatement(node)) {
      this.formatIfStatement(node);
    } else if (t.isBlockStatement(node)) {
      this.formatBlockStatement(node);
    }
  }
  
  formatVariableDeclaration(node) {
    this.write(node.kind);
    this.writeSpace();
    
    node.declarations.forEach((decl, index) => {
      if (index > 0) {
        this.write(',');
        this.writeSpace();
      }
      this.formatVariableDeclarator(decl);
    });
    
    this.writeLine(';');
  }
  
  formatVariableDeclarator(node) {
    this.write(node.id.name);
    
    if (node.init) {
      this.writeSpace();
      this.write('=');
      this.writeSpace();
      this.formatExpression(node.init);
    }
  }
  
  formatExpression(node) {
    if (t.isNumericLiteral(node)) {
      this.write(String(node.value));
    } else if (t.isStringLiteral(node)) {
      this.write(`"${node.value}"`);
    } else if (t.isIdentifier(node)) {
      this.write(node.name);
    } else if (t.isBinaryExpression(node)) {
      this.formatBinaryExpression(node);
    } else if (t.isCallExpression(node)) {
      this.formatCallExpression(node);
    } else if (t.isObjectExpression(node)) {
      this.formatObjectExpression(node);
    } else if (t.isArrayExpression(node)) {
      this.formatArrayExpression(node);
    } else if (t.isArrowFunctionExpression(node)) {
      this.formatArrowFunctionExpression(node);
    }
  }
  
  formatBinaryExpression(node) {
    this.formatExpression(node.left);
    this.writeSpace();
    this.write(node.operator);
    this.writeSpace();
    this.formatExpression(node.right);
  }
  
  formatCallExpression(node) {
    this.formatExpression(node.callee);
    this.write('(');
    
    node.arguments.forEach((arg, index) => {
      if (index > 0) {
        this.write(',');
        this.writeSpace();
      }
      this.formatExpression(arg);
    });
    
    this.write(')');
  }
  
  formatObjectExpression(node) {
    if (node.properties.length === 0) {
      this.write('{}');
      return;
    }
    
    this.write('{');
    this.writeSpace();
    
    node.properties.forEach((prop, index) => {
      if (index > 0) {
        this.write(',');
        this.writeSpace();
      }
      this.write(prop.key.name || prop.key.value);
      this.write(':');
      this.writeSpace();
      this.formatExpression(prop.value);
    });
    
    this.writeSpace();
    this.write('}');
  }
  
  formatArrayExpression(node) {
    this.write('[');
    
    node.elements.forEach((elem, index) => {
      if (index > 0) {
        this.write(',');
        this.writeSpace();
      }
      this.formatExpression(elem);
    });
    
    this.write(']');
  }
  
  formatArrowFunctionExpression(node) {
    if (node.params.length === 0) {
      this.write('()');
    } else if (node.params.length === 1) {
      this.write(node.params[0].name);
    } else {
      this.write('(');
      node.params.forEach((param, index) => {
        if (index > 0) {
          this.write(',');
          this.writeSpace();
        }
        this.write(param.name);
      });
      this.write(')');
    }
    
    this.writeSpace();
    this.write('=>');
    this.writeSpace();
    
    if (t.isBlockStatement(node.body)) {
      this.formatBlockStatement(node.body);
    } else {
      this.formatExpression(node.body);
    }
  }
  
  formatFunctionDeclaration(node) {
    this.write('function');
    this.writeSpace();
    this.write(node.id.name);
    this.write('(');
    
    node.params.forEach((param, index) => {
      if (index > 0) {
        this.write(',');
        this.writeSpace();
      }
      this.write(param.name);
    });
    
    this.write(')');
    this.writeSpace();
    this.formatBlockStatement(node.body);
  }
  
  formatBlockStatement(node) {
    this.write('{');
    this.writeLine();
    
    this.indent();
    node.body.forEach(stmt => {
      this.formatStatement(stmt);
    });
    this.dedent();
    
    this.writeLine('}');
  }
  
  formatReturnStatement(node) {
    this.write('return');
    
    if (node.argument) {
      this.writeSpace();
      this.formatExpression(node.argument);
    }
    
    this.writeLine(';');
  }
  
  formatExpressionStatement(node) {
    this.formatExpression(node.expression);
    this.writeLine(';');
  }
  
  formatIfStatement(node) {
    this.write('if');
    this.writeSpace();
    this.write('(');
    this.formatExpression(node.test);
    this.write(')');
    this.writeSpace();
    
    if (t.isBlockStatement(node.consequent)) {
      this.formatBlockStatement(node.consequent);
    } else {
      this.writeLine('{');
      this.indent();
      this.formatStatement(node.consequent);
      this.dedent();
      this.writeLine('}');
    }
    
    if (node.alternate) {
      this.writeSpace();
      this.write('else');
      this.writeSpace();
      
      if (t.isIfStatement(node.alternate)) {
        this.formatIfStatement(node.alternate);
      } else if (t.isBlockStatement(node.alternate)) {
        this.formatBlockStatement(node.alternate);
      } else {
        this.writeLine('{');
        this.indent();
        this.formatStatement(node.alternate);
        this.dedent();
        this.writeLine('}');
      }
    }
  }
}

module.exports = BasicFormatter;

