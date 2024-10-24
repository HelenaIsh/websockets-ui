import path from 'path';
import nodeExternals from 'webpack-node-externals';

export default {
  entry: './index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
    libraryTarget: 'module',
    chunkFormat: 'commonjs'
  },
  experiments: {
    outputModule: true,
  },
  mode: 'development',
};