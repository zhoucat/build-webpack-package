'use strict'
const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const utils = require('./utils')
const config = require('../config')
const { VueLoaderPlugin } = require('vue-loader')
// eslint解析
const ESLintPlugin = require('eslint-webpack-plugin')
const babelConfig = require('../babel.config')

function resolve (dir) {
  return path.join(__dirname, '../../../', dir)
}

const extendBaseConfig = utils.getExtendConfig('extendBuild/webpack.base.conf.js')

const createEslint = () => {
  return new ESLintPlugin({
    files: 'src',
    extensions: ['js', 'vue'],
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  })
}

const mergeObj = merge(extendBaseConfig, {
  context: resolve('src'),
  entry: {
    app: './main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: false,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false
    }
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    fallback: {
      setImmediate: false,
      process: false,
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      crypto: false
    },
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@assets': resolve('src/assets'),
      '@utils': resolve('src/utils'),
      '@util': resolve('src/utils/util.js'),
      '@pages': resolve('src/pages'),
      '@comps': resolve('src/components'),
      '@router': resolve('src/router'),
      '@mixins': resolve('src/mixins'),
      '@http': resolve('src/http'),
      '@req_bus': resolve('src/request_business'),
      '@business': resolve('src/business'),
      '@api': resolve('src/api')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      process: 'process'
    }),
    ...(config.dev.useEslint ? [createEslint()] : [])
  ],
  module: {
    unsafeCache: true,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
        // options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src')
        ],
        options: babelConfig
      },
      {
        // 匹配markdown说明文档，仅用于规避部分情况下babel-loader的控制台 warn
        test: /\.md$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [
          resolve('src')
        ],
        options: {
          limit: 10 * 1024,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          esModule: false
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        include: [
          resolve('src')
        ],
        options: {
          limit: 10 * 1024,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
          esModule: false
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        include: [
          resolve('src')
        ],
        options: {
          limit: 10 * 1024,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
          esModule: false
        }
      }
    ]
  },
  node: false
},)

module.exports = mergeObj
