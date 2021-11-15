const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const eslintFormatterFriendly = require('eslint-formatter-friendly'); // 检查eslint
const StyleLintPlugin = require('stylelint-webpack-plugin'); // 检查style
const TerserPlugin = require('terser-webpack-plugin'); // uglify

module.exports = {
  mode: 'development',
  entry: {
    entry: './src/index.jsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'http://www.downzoo.com/img/', // example
    sourceMapFilename: '[name].js.map',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Learn Webpack',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[contenthash:8].css',
    }),
    new StyleLintPlugin({
      context: path.resolve(__dirname, 'src'),
      files: ['*.css', '*.less'],
      emitError: true, // 将错误发送给webpack
      failOnError: true, // 有错误将终止webpack编译
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
        exclude: [path.resolve(__dirname, './node_modules')],
        include: [path.resolve(__dirname, './src')],
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              // 添加 preset-react
              require.resolve('@babel/preset-react'),
              [require.resolve('@babel/preset-env'), { modules: false }],
            ],
            cacheDirectory: true,
          },
        },
        exclude: [path.resolve(__dirname, './node_modules')],
        include: [path.resolve(__dirname, './src')],
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          format: eslintFormatterFriendly,
        },
        exclude: [path.resolve(__dirname, './node_modules')],
        include: [path.resolve(__dirname, './src')],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
          },
        ],
        exclude: [path.resolve(__dirname, './node_modules')],
        include: [path.resolve(__dirname, './src')],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'less-loader', // 将 Less 编译为 CSS
          'postcss-loader',
        ],
        exclude: [path.resolve(__dirname, './node_modules')],
        include: [path.resolve(__dirname, './src')],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [path.resolve(__dirname, './node_modules')],
        include: [path.resolve(__dirname, './src')],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 3 * 1024, // 3k
          },
        },
        exclude: [path.resolve(__dirname, './node_modules')],
        include: [path.resolve(__dirname, './src')],
      },
    ],
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx', 'json'],
  },
  optimization: {
    runtimeChunk: 'single',
    usedExports: true,
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多线程
        extractComments: false,
        terserOptions: {
          compress: {
            unused: true,
            drop_debugger: true,
            // drop_console: true,
            dead_code: true,
          },
        },
      }),
    ],
    // splitChunks: {
    //   chunks: 'async', // 三选一： "initial" | "all" | "async" (默认)
    //   minSize: 30000,
    //   // 最小尺寸，30K，development 下是10k，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，
    //   // 不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
    //   maxSize: 0, // 文件的最大尺寸，0为不限制，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize
    //   minChunks: 1, // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
    //   maxAsyncRequests: 5, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
    //   maxInitialRequests: 3,
    //   // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了
    //   automaticNameDelimiter: '~', // 打包文件名分隔符
    //   name: true, // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
    // cacheGroups: {
    //   vendors: {
    //     test: /[\\/]node_modules[\\/]/, // 正则规则，如果符合就提取 chunk
    //     priority: -10, // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
    //   },
    //   default: {
    //     minChunks: 2,
    //     priority: -20, // 优先级
    //     reuseExistingChunk: true,
    //     // 如果该chunk包含的modules都已经另一个被分割的chunk中存在，那么直接引用已存在的chunk，不会再重新产生一个
    //   },
    // },
    // },
  },
  devServer: {
    static: './dist',
    host: '127.0.0.1',
    port: 8899,
    hot: true,
    proxy: {
      '/api': 'https://www.downzoo.com',
    },
  },
};
