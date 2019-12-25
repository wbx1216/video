const path = require('path')
const resolve = dir => {return path.join(__dirname, dir)}
let target = 'http://localhost:8090/';
// let target = 'https://blog.csdn.net/superKM';
if (process.env.NODE_ENV === 'production') {
    target = '';
}
module.exports = {
    // 选项...
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',//部署服务器路径
    // 输出文件目录
    outputDir: "dist",
    assetsDir: "static",//放置生成的静态资源的目录
    indexPath: "index.html",//指定生成的 index.html 的输出路径
    filenameHashing: true,
    // pages: undefined,
    pages: {
        //pages 里配置的路径和文件名在你的文档目录必须存在 否则启动服务会报错
        index: {
            //除了 entry 之外都是可选的
            entry: 'src/main.js', // page 的入口,每个“page”应该有一个对应的 JavaScript 入口文件
            template: 'public/index.html', // 模板来源
            filename: 'index.html', // 在 dist/index.html 的输出
            title: 'Index Page', // 当使用 title 选项时,在 template 中使用：<title><%= htmlWebpackPlugin.options.title %></title>
            chunks: ['chunk-vendors', 'chunk-common', 'index'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
        }
    },
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    runtimeCompiler: true,
    transpileDependencies: ['webpack-dev-server/client'],
    //生产环境关闭map
    productionSourceMap: false,
    crossorigin: undefined,
    integrity: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config.entry.app = ['babel-polyfill', './src/main.js'];
        // 修复HMR
        config.resolve.symlinks(true);
        config.resolve.alias //别名
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_v', resolve('src/views'))
            .set('vendor', resolve('src/vendor'));
			config.output.filename('js/[name].js').end();
			config.output.chunkFilename('js/[name].js').end();
							// 为生产环境修改配置...
						config.plugin('extract-css').tap(args => [{
								filename: `css/[name].css`,
								chunkFilename: `css/[name].css`
							}]) 
    },
    //统一配置打包插件
    configureWebpack: {
        plugins: []
    },
    // vue-loader 配置项
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    pwa: {},
    devServer: {
        /**
         * 这一块是devServer的配置，可以参考https://webpack.js.org/configuration/dev-server/
         * (可选，根据自己情况来设置)
         */
        // 开发环境配置
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        open: false, //配置自动启动浏览器
		
        // 设置代理
        proxy: {
        	 '/': {
        			target: 'http://192.168.20.2:50001/',
        			changeOrigin: true,
        			ws: true,
        			pathRewrite: {
        	
        			}
        		}
        }, // 设置代理
    }
}
 