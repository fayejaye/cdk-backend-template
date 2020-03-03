const path = require('path');
const webpack = require('webpack')

const externals = {
    'aws-sdk': 'aws-sdk'
}
const devtool = false
const moduleLoaders = {
  rules: [
    {
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: [/node_modules/],
    },
  ],
}
const resolve = {
  extensions: [ '.ts', '.js' ]
},
plugins = [new webpack.IgnorePlugin(/^pg-native$/)]
const target = 'node'
const mode = 'development'

const test = {
  entry: path.resolve(__dirname, 'src/test.ts'),
  devtool,
  target,
  module: moduleLoaders,
  externals,
  mode,
  resolve,
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/test'),
    libraryTarget: 'commonjs'
  }
};

const test_put = {
  entry: path.resolve(__dirname, 'src/test-put.ts'),
  devtool,
  target,
  module: moduleLoaders,
  externals,
  mode,
  resolve,
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/test-put'),
    libraryTarget: 'commonjs'
  }
};

module.exports = [test, test_put]