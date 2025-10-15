/**
 * babel-plugin-import-on-demand
 * 实现按需加载（类似 babel-plugin-import）
 */

module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'import-on-demand',
    visitor: {
      ImportDeclaration(path, state) {
        const { source, specifiers } = path.node;
        const { 
          libraryName,
          libraryDirectory = 'lib',
          style = false,
          camel2DashComponentName = true
        } = state.opts;
        
        // 只处理指定库的导入
        if (!libraryName || source.value !== libraryName) {
          return;
        }
        
        // 收集命名导入
        const imports = [];
        
        specifiers.forEach(spec => {
          if (t.isImportSpecifier(spec)) {
            const importedName = spec.imported.name;
            const localName = spec.local.name;
            
            // 转换组件名格式
            let componentPath = importedName;
            if (camel2DashComponentName) {
              componentPath = importedName
                .replace(/([A-Z])/g, '-$1')
                .toLowerCase()
                .slice(1);
            } else {
              componentPath = importedName.toLowerCase();
            }
            
            // 创建新的默认导入
            imports.push(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(localName))],
                t.stringLiteral(`${libraryName}/${libraryDirectory}/${componentPath}`)
              )
            );
            
            // 如果需要导入样式
            if (style === true) {
              imports.push(
                t.importDeclaration(
                  [],
                  t.stringLiteral(`${libraryName}/${libraryDirectory}/${componentPath}/style/css`)
                )
              );
            } else if (typeof style === 'string') {
              imports.push(
                t.importDeclaration(
                  [],
                  t.stringLiteral(`${libraryName}/${libraryDirectory}/${componentPath}/${style}`)
                )
              );
            }
          }
        });
        
        // 替换原有导入
        if (imports.length > 0) {
          path.replaceWithMultiple(imports);
        }
      }
    }
  };
};
