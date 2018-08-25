const webpack = require('webpack');
const path = require('path');

const appVendors = [];

module.exports = {
  entry: {
    'js/app.js': path.resolve(__dirname, './src/app/index.js'),
    'js/vendor.js': appVendors,
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
    }],
  },
  devtool: 'cheap-module-source-map',
};
