/**
 * babel-plugin-auto-track
 * 自动为函数添加埋点代码
 */

module.exports = function(babel) {
  const { types: t, template } = babel;
  
  const buildEnterTrack = template(`
    TRACK_FUNC(FUNC_NAME, 'enter', { args: ARGS });
  `);
  
  const buildExitTrack = template(`
    TRACK_FUNC(FUNC_NAME, 'exit', { result: RESULT });
  `);
  
  return {
    name: 'auto-track',
    visitor: {
      FunctionDeclaration(path, state) {
        const { id, params, body } = path.node;
        const { 
          only = [], 
          trackFunction = '_track',
          skip = []
        } = state.opts;
        
        // 跳过列表检查
        if (skip.includes(id.name)) {
          return;
        }
        
        // only 列表检查
        if (only.length > 0 && !only.includes(id.name)) {
          return;
        }
        
        // 避免重复处理
        if (path.node._tracked) return;
        
        // 构建参数数组
        const argsArray = t.arrayExpression(
          params.map(param => t.identifier(param.name))
        );
        
        // 在函数开头插入 enter 埋点
        const enterTrack = buildEnterTrack({
          TRACK_FUNC: t.identifier(trackFunction),
          FUNC_NAME: t.stringLiteral(id.name),
          ARGS: argsArray
        });
        
        body.body.unshift(enterTrack);
        
        // 为所有 return 语句添加 exit 埋点
        path.traverse({
          ReturnStatement(returnPath) {
            const { argument } = returnPath.node;
            
            if (argument) {
              const resultVar = returnPath.scope.generateUidIdentifier('result');
              
              const exitTrack = buildExitTrack({
                TRACK_FUNC: t.identifier(trackFunction),
                FUNC_NAME: t.stringLiteral(id.name),
                RESULT: resultVar
              });
              
              returnPath.replaceWithMultiple([
                t.variableDeclaration('const', [
                  t.variableDeclarator(resultVar, argument)
                ]),
                exitTrack,
                t.returnStatement(resultVar)
              ]);
            }
          }
        });
        
        path.node._tracked = true;
      }
    }
  };
};
