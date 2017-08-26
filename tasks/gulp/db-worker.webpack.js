const webpack = require('webpack');
const path = require('app-root-path').path;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const mainDir = path + '/src';

module.exports = {
	entry: {
		worker: `${mainDir}/worker/db-worker.ts`
	},

	context: mainDir,

	output: {
		path: path + '/.tmp',
		filename: '[name].js',
		sourceMapFilename: '[name].map',
		chunkFilename: '[id].chunk.js'
	},

	resolve: {
		extensions: ['.ts'],
		modules: [
			mainDir,
			path + '/node_modules'
		]
	},

	module: {
		rules: [{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			}
		]
	},

	plugins: [
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)@angular/,
			path + '/src'
		),
		new UglifyJSPlugin()
	]
};