module.exports = {
    watch: true,
    entry: './src/lem_charts.es6',
    output: {
        filename: 'build/lem_charts.js'
    },
    module: {
        rules: [
            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};