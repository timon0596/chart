const path = require('path');
const HWP = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {

  entry: {
    main1: './src/index.js',
    init1: './src/init.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [{
      test: /\.pug$/,
      loader: 'pug-loader',
      options: { pretty: true },
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/',
    },
    {
      test: /\.(scss|sass)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer(),
            ],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    },
    {
      test: /\.(woff|svg|ttf|eot|woff2)$/,
      exclude: [path.resolve(__dirname, 'src/img'), path.resolve(__dirname, 'node_modules')],
      use: [
        'file-loader',
      ],
    }],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HWP({
      template: './src/index.pug',
      filename: 'index.html',
    }), new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
};
