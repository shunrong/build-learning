module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // 颜色值小写
    'color-hex-case': 'lower',
    
    // 颜色值简写
    'color-hex-length': 'short',
    
    // 允许空源（开发中可能暂时为空）
    'no-empty-source': null,
    
    // 允许任意类名格式
    'selector-class-pattern': null
  }
};

