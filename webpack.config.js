var path = require('path');

module.exports = {
    entry: ['./app/main.js'],
    mode: 'development',
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath:'/dist/',
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        port: 3000
    }
}