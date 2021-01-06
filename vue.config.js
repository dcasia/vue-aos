const StyleLintPlugin = require('stylelint-webpack-plugin')
const TimeFixPlugin = require('time-fix-plugin')

module.exports = {
    outputDir: 'dist',
    chainWebpack: config => {

        config.module
            .rule('eslint')
            .use('eslint-loader')
            .options({ fix: true })

        config.module
            .rule('js')
            .use('babel-loader')

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

        return configuration

    }
}
