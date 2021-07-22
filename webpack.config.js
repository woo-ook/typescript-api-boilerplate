const appRoot = require('app-root-path');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = () => {
  const rootPath = appRoot.toString();
  const env = process.env.NODE_ENV;
  const isDev = env.toUpperCase() === 'DEVELOPMENT';
  const isLocal = env.toUpperCase() === 'LOCAL';
  const terserPlugin =
    isDev || isLocal
      ? new TerserPlugin({
          terserOptions: {
            output: {
              comments: /@swagger/i,
            },
          },
        })
      : new TerserPlugin();

  return {
    target: 'node',
    node: { __dirname: false, __filename: false },
    mode: env,
    entry: { index: ['@babel/polyfill', './src/index.ts'] },
    context: rootPath,
    output: {
      path: path.resolve(rootPath, 'build'),
      filename: '[name].bundle.js',
      // filename: '[id].[chunkhash].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.js', 'json'],
      alias: {
        '@': path.join(rootPath, 'src'),
      },
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(ts|js)?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        },
      ],
    },
    plugins: [
      new WebpackObfuscator({
        compact: true,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: true,
        rotateStringArray: true,
        sourceMap: true,
        sourceMapFileName: 'test.map',
        sourceMapMode: 'separate',
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        unicodeEscapeSequence: true,
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [terserPlugin],
      concatenateModules: true,
    },
    // devtool: 'source-map',
  };
};

// {
//   loader: 'babel-loader',
//   options: {
//     presets: ['@babel/preset-env', '@babel/preset-typescript'],
//     plugins: [
//       ['@babel/plugin-proposal-decorators', { legacy: true }],
//       ['@babel/plugin-proposal-class-properties', { loose: true }],
//     ],
//   },
// },
