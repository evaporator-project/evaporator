// @ts-nocheck
import * as path from "path";
// @ts-ignore
import CracoSwcPlugin from 'craco-swc'
const resolve = (dirname) => path.resolve(__dirname, dirname);
// const swcConfig = require("./swcrc");
import swcConfig from './swcrc'
// const webpack = require("webpack");
// @ts-ignore
import webpack from 'webpack'
import {addAfterLoader, addPlugins, loaderByName, removeLoaders} from "@craco/craco";
// 开启自定义插件
const needAnalysis = true;
export default {
  devServer: {
    client: {
      overlay: false,
    },
    port: 8000,
    open:false
  },

  webpack: {
    alias: {

    },
    // 以下代码！！！  与alias或babel同级
    configure:(webpackConfig: { output: any; }, {env, paths}: any) => {
      // 修改build的生成文件名称
      paths.appBuild = 'dist';
      webpackConfig.output ={
        ...webpackConfig.output,
        path:path.resolve(__dirname,'dist'),
        publicPath:'/'
      }
      return webpackConfig;
    }
  },
  plugins:[
    {
      plugin: {
        overrideWebpackConfig: ({
                                  webpackConfig,
                                  cracoConfig,
                                  pluginOptions,
                                  context: { env, paths },
                                }) => {
          if (webpackConfig.mode === "development" && needAnalysis) {
            console.log('111111')
            // 耗时插件
            let startTime = 0;
            const progressPlugin = new webpack.ProgressPlugin({
              handler(percentage, message, ...args) {
                // console.log(percentage, message, args);
                if (percentage === 1) {
                  const info = `complied spend time: ${+new Date() - startTime}ms`;
                  console.log(`\x1b[38;2;83;167;179m${info}\x1b[0m`);
                } else if (percentage <= 0.05) {
                  startTime = +new Date();
                }
              },
            });
            addPlugins(webpackConfig, [progressPlugin]);
          }

          // 使用SWC 代替 babel
          addAfterLoader(webpackConfig, loaderByName("babel-loader"), {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: /(node_modules)/,
            loader: require.resolve("swc-loader"),
            options: swcConfig,
          });
          // 移除babel
          removeLoaders(webpackConfig, loaderByName("babel-loader"));
          // 检测
          // const { isFound: babelExist } = getLoader(webpackConfig, loaderByName("babel-loader"));
          // const { isFound: swcExist } = getLoader(webpackConfig, loaderByName("swc-loader"));
          // console.log("babel exist", babelExist);
          // console.log("swc exist", swcExist);

          return webpackConfig;
        },
      },
    }
  ]
};
