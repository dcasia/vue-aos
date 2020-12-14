const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const TimeFixPlugin = require('time-fix-plugin')

module.exports = {
    outputDir: 'dist',
    // css: {
    //     loaderOptions: {
    //         sass: {
    //             implementation: require('sass'),
    //             // additionalData: '@import "./scss/global.scss";',
    //             sassOptions: {
    //                 includePaths: [
    //                     path.resolve(__dirname, 'src')
    //                 ]
    //             }
    //         }
    //     }
    // },
    chainWebpack: config => {

        config.module
            .rule('eslint')
            .use('eslint-loader')
            .options({ fix: true })

        config.module
            .rule('js')
            .use('babel-loader')
        
        // config.module
        //     .rule('vue')
        //     .use('vue-loader')
        //     .loader('vue-loader')
        //     .tap(options => {

                

        //         return options
        //     })

    },
    configureWebpack: config => {

        const configuration = {
            plugins: [
                new TimeFixPlugin(),
                new StyleLintPlugin({
                    files: [ '**/*.{vue,html,css,scss}' ],
                    fix: true
                })
            ],
            output: {
                libraryExport: 'default'
            }
        }

        // if (process.env.NODE_ENV === 'production') {

        //     const routes = [
        //         '',
        //         'about',
        //         'what-we-do',
        //         'our-work',
        //         'open-source',
        //         'contact',
        //         'hublot-ec',
        //         'hublot-wct',
        //         'nike'
        //     ]

        //     configuration.plugins.push(
        //         new PrerenderSPAPlugin({
        //             staticDir: path.join(__dirname, 'distribution'),
        //             routes: [ '/cn', '' ]
        //                 .map(locale => routes.map(route => `${ locale }/${ route }`))
        //                 .reduce((a, b) => ( [ ...a, ...b ] ))
        //         })
        //     )

        // }

        return configuration

    },
    // devServer: {
    //     proxy: {
    //         '^/api': {
    //             target: 'https://staging.digitalcreative.cn',
    //             auth: 'dc:FAKbAZRRWeVUX9xC',
    //             changeOrigin: true
    //         }
    //     }
    // }
}
