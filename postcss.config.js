const autoprefixer = require('autoprefixer');
const postcssSprites = require('postcss-sprites');

module.exports = {
  plugins: [
    autoprefixer(['IE 10']),
    postcssSprites({
      // 在这里制定了从哪里加载的图片被主动使用css sprite
      // 可以约定好一个目录名称规范，防止全部图片都被处理
      spritePath: './src/assets/img/',
    }),
  ],
};
