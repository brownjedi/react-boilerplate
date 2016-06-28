
require('dotenv').config({ silent: true })

const path                    = require('path')
const webpack                 = require('webpack')
const HtmlWebpackPlugin       = require('html-webpack-plugin')
const ExtractTextPlugin       = require('extract-text-webpack-plugin')
const StatsPlugin             = require('stats-webpack-plugin')
const autoprefixer            = require('autoprefixer')
const validate                = require('webpack-validator')

module.exports = validate({
	target: 'web',
	devtool: 'cheap-module-source-map',
	entry: {
		main: [
			path.resolve(__dirname, 'src/client/index.js')
		],
		vendor: [
			'react',
			'react-dom'
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]-[hash].min.js',
		chunkFilename: '[name]-[chunkhash].min.js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/client/index.template.html',
			inject: 'body',
			filename: 'index.html'
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
				CLIENT_DEVSERVER_PORT: JSON.stringify(process.env.CLIENT_DEVSERVER_PORT)
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity
		}),
		new ExtractTextPlugin('[name]-[hash].min.css'),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true
			}
		}),
		new webpack.LoaderOptionsPlugin({
			// Indicates to our loaders that they should minify their output
			// if they have the capability to do so.
			minimize: true,
			// Indicates to our loaders that they should enter into debug mode
			// should they support it.
			debug: false
		}),
		new StatsPlugin('webpack.stats.json', {
			source: false,
			modules: false
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
			// Javascript
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: [/node_modules/, path.resolve(__dirname, 'dist')],
				query: {
					presets: ['react', 'es2015-webpack']
				}
			},
			// JSON
			{
				test: /\.json?$/,
				loader: 'json'
			},
			// CSS
			{
				test: /\.global\.css$/,
				loader: ExtractTextPlugin.extract('style', [
					'css',
					'postcss'
				])
			}, {
				test: /^((?!\.global).)*\.css$/,
				loader: ExtractTextPlugin.extract('style', [
					'css?modules&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
					'postcss'
				])
			},
			// SCSS
			{
				test: /\.global\.(scss|sass)$/,
				loader: ExtractTextPlugin.extract('style', [
					'css',
					'postcss',
					'sass'
				])
			}, {
				test: /^((?!\.global).)*\.(scss|sass)$/,
				loader: ExtractTextPlugin.extract('style', [
					'css?modules&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
					'postcss',
					'sass'
				])
			}
		]
	},
	eslint: {
		failOnWarning: false,
		failOnError: true,
		configFile: './.eslintrc'
	},
	postcss: [
		autoprefixer
	]
})
