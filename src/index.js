import img from './assets/img/404.png';
import * as style from './style.css';

// eslint-disable-next-line
console.log('img', img);
// eslint-disable-next-line
console.log('style', style);

const hello = () => [1, 2, 3].map((i) => i * i);

hello();

// eslint-disable-next-line
alert('我就是要用 alert');

// 在入口文件index.js最后添加如下代码
if (module.hot) {
  // 通知 webpack 该模块接受 hmr
  module.hot.accept((err) => {
    if (err) {
      // eslint-disable-next-line
      console.error('Cannot apply HMR update.', err);
    }
  });
}
