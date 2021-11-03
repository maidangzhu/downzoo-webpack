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
  devtool: 'source-map',
  devServer: {
    static: './dist',
    host: '127.0.0.1',
    port: 8899,
    hot: true,
    proxy: {
      '/api': 'https://www.downzoo.com',
    },
  },
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
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
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
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        options: {
          format: eslintFormatterFriendly,
        },
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
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 3 * 1024, // 3k
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'http://www.downzoo.com/img/', // example
    sourceMapFilename: '[name].js.map',
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
            drop_console: true,
            dead_code: true,
          },
        },
      }),
    ],
  },
};
