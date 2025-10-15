/**
 * babel-plugin-remove-console
 * 移除代码中的 console 语句
 */

module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'remove-console',
    visitor: {
      CallExpression(path, state) {
        const { callee } = path.node;
        const { exclude = ['error'] } = state.opts;
        
        // 判断是否是 console.xxx 调用
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'console' })
        ) {
          const method = callee.property.name;
          
          // 检查是否在排除列表中
          if (!exclude.includes(method)) {
            path.parentPath.remove();
          }
        }
      }
    }
  };
};
