const path = require('path');

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
  extensions: [ '.ts', '.js' ],
}
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
  plugins: [
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/test'),
    libraryTarget: 'commonjs'
  }
};

module.exports = [test]