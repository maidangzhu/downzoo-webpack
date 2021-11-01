// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom'; // 这里可以省略.jsx
import App from './app';

const Home = () => (
  <App />
);

ReactDOM.render(<Home />, document.getElementById('app'));

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
