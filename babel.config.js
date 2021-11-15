// .babelrc
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {}, // 这里是targets的配置，根据实际browserslist设置
        corejs: { version: 3, proposals: true }, // 添加core-js版本
        modules: false, // 模块使用 es modules ，不使用 commonJS 规范
        useBuiltIns: 'usage', // 默认 false, 可选 entry , usage
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false, // 默认值，可以不写
        helpers: true, // 默认，可以不写
        regenerator: false,
        useESModules: true, // 使用 es modules helpers, 减少 commonJS 语法代码
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: false }],
  ],
};
