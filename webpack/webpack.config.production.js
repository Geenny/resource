const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin2');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const outputPath = path.resolve(__dirname, '../dist');

const object = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: './bundle.js',
		path: outputPath,
        publicPath: '/'
	},
    optimization: {
        minimize: true
    },
    plugins: [
        new Visualizer({
            filename: path.join('..', 'dist', 'statistics.html'),
            throwOnError: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/assets', to: 'assets' },
                { from: './src/assets/favicon.ico', to: 'favicon.ico' }
            ]
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: false,
            minify: {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({ filename: '[name].css', chunkFilename: '[id].css' })
    ]
};

module.exports = object;