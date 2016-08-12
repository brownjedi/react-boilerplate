const path              = require('path')
const webpack           = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
	target: 'web',
	resolve: {
		// These extensions are tried when resolving a file.
		extensions: ['', '.js', '.jsx']
	},
	entry: {
		main: [
			path.resolve(__dirname, 'src/client/index.js')
		],
		// We create a seperate chunk containing our vendor modules. This can
		// avoid unnecessary downloads by users as well as speed up development
		// rebuild times by not having to rebundle everything with every change.

		// Avoid adding react-router to vendor in dev mode as the react hot load
		// doesn't work when its added as a vendor. You can add this in production
		vendor: [
			'react',
			'react-dom',
			'react-css-modules',
			'react-redux',
			'react-router-redux',
			'redux',
			'redux-thunk',
			'fastclick'
		]
	},
	output: {
		// The dir in which our bundle should be output.
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/client/index.template.html',
			inject: 'body',
			filename: 'index.html'
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity
		})
	],
	module: {
		preLoaders: [
			// eslint
			{
				test: /\.js?$/,
				loader: 'eslint',
				exclude: [/node_modules/, path.resolve(__dirname, 'dist')]
			}
		],
		loaders: [
			// Javascript Loader
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: [/node_modules/, path.resolve(__dirname, 'dist')],
				query: {
					presets: ['react', ['es2015', { modules: false }], 'stage-0'],
					// Using babel-runtime instead of babel-polyfill to automatically
					// polyfill without polluting globals
					// @see https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3
					plugins: ['transform-runtime']
				}
			},
			// JSON Loader
			{
				test: /\.json?$/,
				loader: 'json'
			},
			// URL Loader (Images, fonts etc...)
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				loader: 'url-loader?limit=10000'
			},
			// File Loader
			{
				test: /\.(eot|ttf|wav|mp3)$/,
				loader: 'file-loader'
			}
		]
	},
	eslint: {
		failOnWarning: false,
		failOnError: true,
		configFile: './.eslintrc'
	}
}

module.exports = config
