// 本文件注释引自网络，注意甄别 https://www.cnblogs.com/ye-hcj/p/7078047.html
'use strict'
// 引入nodejs路径模块
const path = require('path')
// 引入config目录下的index.js配置文件
const config = require('../config')
// 引入extract-text-webpack-plugin插件，用来将css提取到单独的css文件中
// webpack4弃用
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

// webpack4中代替上一插件的新插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const packageConfig = require('../package.json')

// exports其实就是一个对象，用来导出方法的最终还是使用module.exports，此处导出assetsPath
exports.assetsPath = function (_path) {
  // 如果是生产环境assetsSubDirectory就是'static'，否则还是'static'
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  // path.join和path.posix.join的区别就是，前者返回的是完整的路径，后者返回的是完整路径的相对根路径
  // 也就是说path.join的路径是C:a/a/b/xiangmu/b，那么path.posix.join就是b（？）
  return path.posix.join(assetsSubDirectory, _path)
}

// 是导出cssLoaders的相关配置
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      // 若是生产环境，压缩CSS代码
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // const postcssLoader = {
  //   loader: 'postcss-loader',
  //   options: {
  //     sourceMap: options.sourceMap
  //   }
  // }

  // const cssLoader = {
  //   loader: 'vue-loader',
  //   options: {
  //     sourceMap: options.sourceMap
  //   }
  // }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    // 如果该函数传递了单独的loader就加到这个loaders数组里面，这个loader可能是less,sass之类的
    // const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    const loaders = [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // webpack4 ++
    return [
      options.extract ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    ].concat(loaders)

    // webpack4 --
    // // Extract CSS when that option is specified
    // // (which is the case during production build)
    // if (options.extract) {
    //   return ExtractTextPlugin.extract({
    //     use: loaders,
    //     fallback: 'vue-style-loader'
    //   })
    // } else {
    //   return ['vue-style-loader'].concat(loaders)
    // }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
