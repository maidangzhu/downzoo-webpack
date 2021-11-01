const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const eslintFormatterFriendly = require('eslint-formatter-friendly');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    port: 9000,
    hot: true,
    proxy: {
      '/api': 'https://www.downzoo.com',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Learn Webpack',
      filename: '[name].html',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
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
        test: /\.js$/,
        use: 'babel-loader',
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
          MiniCssExtractPlugin.loader,
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
  },
  optimization: {
    runtimeChunk: 'single',
    usedExports: true,
  },
};
