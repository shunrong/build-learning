/**
 * babel-plugin-auto-track
 * 自动为函数添加埋点代码
 */

module.exports = function(babel) {
  const { types: t } = babel;
  
  // 构建 enter 埋点: _track(funcName, 'enter', { args: [...] })
  function buildEnterTrack(trackFunction, funcName, argsArray) {
    return t.expressionStatement(
      t.callExpression(
        t.identifier(trackFunction),
        [
          t.stringLiteral(funcName),
          t.stringLiteral('enter'),
          t.objectExpression([
            t.objectProperty(
              t.identifier('args'),
              argsArray
            )
          ])
        ]
      )
    );
  }
  
  // 构建 exit 埋点: _track(funcName, 'exit', { result: resultVar })
  function buildExitTrack(trackFunction, funcName, resultVar) {
    return t.expressionStatement(
      t.callExpression(
        t.identifier(trackFunction),
        [
          t.stringLiteral(funcName),
          t.stringLiteral('exit'),
          t.objectExpression([
            t.objectProperty(
              t.identifier('result'),
              resultVar
            )
          ])
        ]
      )
    );
  }
  
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
        const enterTrack = buildEnterTrack(trackFunction, id.name, argsArray);
        body.body.unshift(enterTrack);
        
        // 为所有 return 语句添加 exit 埋点
        path.traverse({
          ReturnStatement(returnPath) {
            // 避免重复处理已经处理过的 return 语句
            if (returnPath.node._tracked) {
              return;
            }
            
            const { argument } = returnPath.node;
            
            // 先标记，避免重复处理
            returnPath.node._tracked = true;
            
            if (argument) {
              const resultVar = returnPath.scope.generateUidIdentifier('result');
              
              const exitTrack = buildExitTrack(trackFunction, id.name, resultVar);
              
              // 标记新创建的 return 节点，避免重复遍历
              const newReturn = t.returnStatement(resultVar);
              newReturn._tracked = true;
              
              returnPath.replaceWithMultiple([
                t.variableDeclaration('const', [
                  t.variableDeclarator(resultVar, argument)
                ]),
                exitTrack,
                newReturn
              ]);
            }
          }
        });
        
        path.node._tracked = true;
      }
    }
  };
};
