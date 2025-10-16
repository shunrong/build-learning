const chalk = require('chalk');

// Prettier 的 IR (Doc) 类型
const docTypes = {
  text: (value) => ({ type: 'text', value }),
  line: () => ({ type: 'line' }),
  hardline: () => ({ type: 'hardline' }),
  group: (contents) => ({ type: 'group', contents }),
  indent: (contents) => ({ type: 'indent', contents }),
};

// 简化的 Layout 算法
class PrettierMini {
  constructor(printWidth = 80) {
    this.printWidth = printWidth;
  }
  
  print(doc) {
    let output = '';
    let column = 0;
    let indentLevel = 0;
    
    const printDoc = (doc) => {
      if (typeof doc === 'string') {
        output += doc;
        column += doc.length;
        return;
      }
      
      switch (doc.type) {
        case 'text':
          output += doc.value;
          column += doc.value.length;
          break;
          
        case 'line':
          output += ' ';
          column++;
          break;
          
        case 'hardline':
          output += '\n' + '  '.repeat(indentLevel);
          column = indentLevel * 2;
          break;
          
        case 'group':
          const groupWidth = this.calculateWidth(doc.contents);
          if (column + groupWidth <= this.printWidth) {
            doc.contents.forEach(printDoc);
          } else {
            doc.contents.forEach(item => {
              if (item.type === 'line') {
                output += '\n' + '  '.repeat(indentLevel);
                column = indentLevel * 2;
              } else {
                printDoc(item);
              }
            });
          }
          break;
          
        case 'indent':
          indentLevel++;
          doc.contents.forEach(printDoc);
          indentLevel--;
          break;
      }
    };
    
    printDoc(doc);
    return output;
  }
  
  calculateWidth(contents) {
    let width = 0;
    contents.forEach(doc => {
      if (typeof doc === 'string') {
        width += doc.length;
      } else if (doc.type === 'text') {
        width += doc.value.length;
      } else if (doc.type === 'line') {
        width += 1;
      }
    });
    return width;
  }
}

// 演示
console.log(chalk.bold.blue('\n========== Prettier Mini 演示 ==========\n'));

const printer = new PrettierMini(40);

// 示例 1: 短对象（放在一行）
console.log(chalk.yellow('【示例 1】短对象\n'));
const doc1 = docTypes.group([
  'const user = {',
  docTypes.line(),
  'name: "Alice",',
  docTypes.line(),
  'age: 30',
  docTypes.line(),
  '}'
]);
console.log(chalk.green('输出:'));
console.log(printer.print(doc1));

// 示例 2: 长对象（换行）
console.log(chalk.yellow('\n【示例 2】长对象\n'));
const doc2 = docTypes.group([
  'const user = {',
  docTypes.line(),
  'veryLongPropertyName: "value",',
  docTypes.line(),
  'anotherLongProperty: "value"',
  docTypes.line(),
  '}'
]);
console.log(chalk.green('输出:'));
console.log(printer.print(doc2));

// 示例 3: 嵌套缩进
console.log(chalk.yellow('\n【示例 3】嵌套缩进\n'));
const doc3 = docTypes.group([
  'function add(a, b) {',
  docTypes.hardline(),
  docTypes.indent([
    docTypes.text('return a + b;'),
    docTypes.hardline()
  ]),
  '}'
]);
console.log(chalk.green('输出:'));
console.log(printer.print(doc3));

console.log(chalk.bold.green('\n✅ Prettier IR 演示完成！'));
console.log(chalk.gray('\n核心思想：'));
console.log(chalk.gray('1. 将代码转换为 IR (Doc)'));
console.log(chalk.gray('2. Layout 算法智能决定换行'));
console.log(chalk.gray('3. group 尝试放在一行，超长则换行\n'));

