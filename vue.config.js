const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Build/Cesium'
// const cesiumSource = 'static/cesium'

module.exports = {
    /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
    /* baseUrl: process.env.NODE_ENV === 'production' ? './' : '/' */
    publicPath: './',
    /* 输出文件目录：在npm run build时，生成文件的目录名称 */
    outputDir: 'dist',
    /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
    assetsDir: './static',
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
    filenameHashing: false,
    /* 代码保存时进行eslint检测 */
    lintOnSave: true, // 是否开启eslint
    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/assets/scss/mixin.scss";'
            }
        }
    },
    /* webpack-dev-server 相关配置 */
    devServer: {
        /* 自动打开浏览器 */
        open: true,
        // /* 设置为0.0.0.0则所有的地址均能访问 */
        host: '0.0.0.0',
        port: 8380,
    },
    configureWebpack: (config) => {
        let plugins = []
        config.entry.app = ['babel-polyfill', './src/main.js'];
        if (process.env.NODE_ENV === 'production') {
            plugins = [
                new webpack.DefinePlugin({
                    // Cesium载入静态的资源的相对路径
                    CESIUM_BASE_URL: JSON.stringify('static')
                }),
                // 拷贝Cesium 资源、控价、web worker到静态目录
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'Workers'),
                    to: 'static/Workers'
                }]),
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'Assets'),
                    to: 'static/Assets'
                }]),
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'ThirdParty'),
                    to: 'static/ThirdParty'
                }]),
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'Widgets'),
                    to: 'static/Widgets'
                }
                ])
            ]
        } else {
            plugins = [
                new webpack.DefinePlugin({
                    // Cesium载入静态的资源的相对路径
                    CESIUM_BASE_URL: JSON.stringify('')
                }),
                // 拷贝Cesium 资源、控价、web worker到静态目录
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'Workers'),
                    to: 'Workers'
                }]),
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'Assets'),
                    to: 'Assets'
                }]),
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'ThirdParty'),
                    to: 'ThirdParty'
                }]),
                new CopyWebpackPlugin([{
                    from: path.join(cesiumSource, 'Widgets'),
                    to: 'Widgets'
                }])
            ]
        }
        return {
            module: {
                unknownContextCritical: false,
                rules: [{
                    test: /\.js$/,
                    enforce: 'pre',
                    include: path.resolve(__dirname, 'node_modules/cesium/Source'),
                    sideEffects: false,
                    use: [{ // Cesium源码里包含了一些开发错误和警告信息，但是产品中是不需要的。
                        // 因为没有webpack内置的方式去删除这些警告，我们将使用 strip-pragma-loader。
                        loader: 'strip-pragma-loader',
                        options: {
                            pragmas: {
                                debug: false
                            }
                        }
                    }]
                }
                ]
            },
            optimization: {
                // 我们去查看哪些导出的模块被使用，然后再进行打包
                usedExports: true,
                // webpack默认会把Cesium和整个程序代码打进一个 chunk中，最终这个库非常庞大。
                // 我们也可以用CommonChunksPlugin把Cesium打到它自己的包，提升程序的性能。
                // 如果最终你的程序创建了多个chunks，他们可以引用一个通用的cesiumchunk。
                // 最新版webpack使用config.optimization.splitChunks去设置
                splitChunks: {
                    maxInitialRequests: Infinity,
                    minSize: 0,
                    maxSize: 250000,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            chunks: 'all',
                            name(module) {
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                return `npm.${packageName.replace('@', '')}`
                            }
                        },
                        commons: {
                            name: 'Cesium',
                            test: /[\\/]node_modules[\\/]cesium/,
                            priority: 10,
                            chunks: 'all'
                        }
                    }
                }
            },
            output: {
                // 需要编译Cesium中的多行字符串
                sourcePrefix: ' '
            },
            amd: {
                // 允许Cesium兼容 webpack的require方式
                toUrlUndefined: true
            },
            resolve: {
                alias: {
                    vue$: 'vue/dist/vue.esm.js',
                    '@': path.resolve('src')
                }
            },
            node: {
                // 解决一些第三方库使用的fs 模块，它一般是用在NodeJS的环境里，而不能在浏览器环境里使用。
                fs: 'empty',
                Buffer: false,
                http: 'empty',
                https: 'empty',
                zlib: 'empty'
            },
            plugins: plugins
        }
    }
}
