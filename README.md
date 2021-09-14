# build-webpack-package

> 基于webpack5的构建vue项目的配置包

## 可以用来干什么？

- 开箱即用的构建vue项目（基于webpack5）
- 拦截git提交规范（angular规范）
- 拦截git提交eslint语法检查

## 安装

### npm

```sh
$ npm install build-webpack-package -D
```

### husky注入

``` sh
$ npm rebuild
```

### package.json设置

#### scripts

``` json
  "scripts": {
    "dev": "webpack-cli serve --inline --progress --config node_modules/build-webpack-package/build/webpack.dev.conf.js",
    "start": "npm run dev",
    "build": "node node_modules/build-webpack-package/build/build.js --profile --json",
    "lint": "node_modules/.bin/eslint -c node_modules/build-webpack-package/.eslintrc.js --ignore-path node_modules/build-webpack-package/.eslintignore --ext .js,.vue src",
    "lint-fix": "node_modules/.bin/eslint -c node_modules/build-webpack-package/.eslintrc.js --ignore-path node_modules/build-webpack-package/.eslintignore --ext .js,.vue src --fix",
    "commit": "cz"
  }
```

#### husky&lint-staged&config配置

``` json
	"husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "",
      "commit-msg": "commitlint --config node_modules/build-webpack-package/commitlint.config.js -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*{.js,.vue}": [
      "eslint -c node_modules/build-webpack-package/.eslintrc.js --ignore-path node_modules/build-webpack-package/.eslintignore --ext .js,.vue"
    ]
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": "node_modules/build-webpack-package/.cz-config.js"
    }
  }
```

## 使用

### 命令列表

- dev或start：开发启动项目
- build：构建项目资源，用于发布
- lint：检测项目中src目录下语法错误
- lint-fix：检测并尝试修复项目中src目录下语法错误
- commit:启动commitizen进行git的commit提交

### webpack配置扩展

1.在项目目录下新增**extendBuild**目录

2.新增webpack.base.conf.js文件，即可拓展webpack配置，示例如下：

``` javascript
'use strict'
const webpack = require('webpack')
const path = require('path')
const babelConfig = require('../node_modules/build-webpack-package/babel.config')
function resolve (dir) {
  return path.join(__dirname, '../node_modules', dir)
}

module.exports = {
  plugins: [
    // 只加载 `moment/locale/zh-cn.js`
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('vue-echarts'),
          resolve('resize-detector'),
          resolve('mathjs/lib'),
          resolve('@jiaminghi/data-view/lib')
        ],
        options: babelConfig
      }
    ]
  }
}
```

### 环境变量配置&扩展

> 默认配置以下环境变量：
>
> - API_BASE_URL：接口请求BASE_URL
> - ROUTER_BASE_URL：路由BASE_URL
> - BUILD_PATH：build构建输出目录，默认为../../../dist,当前项目的dist文件夹
> - NODE_ENV：环境模式，development 或 production
> - PORT: 开发模式端口。默认为8080
> - RELATIVE: 构建资源是否是相对路径引入，默认值是null，表示绝对路径引入资源

1.在项目目录下新增**extendBuild**目录

2.新增env.js文件，即可拓展环境变量配置，示例如下：

``` javascript
'use strict'
module.exports = {
  API_BASE_URL: `'${process.env.API_BASE_URL || ""}'`,
  DOCUMENT_PRTYPE: `'${process.env.DOCUMENT_PRTYPE || "1"}'`
}
```

## todo

- [ ] 命令配置写入包内部，项目package.json无需配置，进入包执行命令即可
- [ ] 支持react项目打包构建

## 感谢不会写vue的尤雨溪🙏

> 本构建包基于vue-cli2.0的架构基础上进行改进