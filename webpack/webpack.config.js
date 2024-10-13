const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const host = 'localhost';
const port = ( process.argv[2] ) || 9000;

module.exports = {
	mode: 'development',
	entry: {
		mainjs: [
			'webpack-dev-server/client?http://' + host + ':' + port,
			'webpack/hot/dev-server',
			'./src/index.js'
		],
	},
	output: {
		path: __dirname,
		filename: 'bundle.js',
		publicPath: '/'
	},
	resolve: {
		alias: {
			// tweenjs: 'tweenjs/lib/tweenjs.js'
		}
	},
	externals: {
		config: 'config'
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{ from: './src/assets', to: 'assets' },
				{ from: './src/assets/favicon.ico', to: 'favicon.ico' },
				{from: './index.html', to: 'index.html' }
			]
		})
	],
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [{
					loader: 'file-loader',
				}]
			}
		]
	}
}
