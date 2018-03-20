const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = env => {
    return {
        mode: 'development',
        entry: ['webpack-dev-server/client?http://localhost:8080', 'example/index.js'],
        output: { filename: 'dist/bundle.js', path: path.resolve('./') },
        module: { rules: [{ test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' }] },
        resolve: {
            modules: [path.resolve('./'), 'node_modules'],
            extensions: ['.js', '.jsx'],
        },
        plugins: [new HtmlWebpackPlugin({ template: 'example/template.html' })],
        devServer: { hot: false, contentBase: path.resolve('./'), stats: 'errors-only' },
        devtool: undefined,
        performance: { hints: false },
    }
}
