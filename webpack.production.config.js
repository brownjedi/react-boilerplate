const path              = require('path')
const webpack           = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StatsPlugin       = require('stats-webpack-plugin')
const autoprefixer      = require('autoprefixer')
const validate          = require('webpack-validator')

module.exports = validate({
	target: 'web',
	devtool: 'cheap-module-source-map',
	entry: {
		main: [
			path.resolve(__dirname, 'src/client/index.js')
		],
		vendor: [
			'react',
			'react-dom',
			'react-router',
			'react-css-modules',
			'react-redux',
			'react-router-redux',
			'redux',
			'redux-thunk',
			'fastclick'
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
			},
			__DEV__: false
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity
		}),
		new ExtractTextPlugin('[name]-[hash].min.css'),
		// Adds options to all of our loaders.
		new webpack.LoaderOptionsPlugin({
			// Indicates to our loaders that they should minify their output
			// if they have the capability to do so.
			minimize: true,
			// Indicates to our loaders that they should enter into debug mode
			// should they support it.
			debug: false
		}),
		// JS Minification.
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true
			}
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
					presets: ['react', ['es2015', { modules: false }], 'stage-0'],
					// Using babel-runtime instead of babel-polyfill to automatically
					// polyfill without polluting globals
					// @see https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3
					plugins: ['transform-runtime']
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
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: ['css', 'postcss']
				})
			}, {
				test: /^((?!\.global).)*\.css$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: [
						{
							loader: 'css',
							query: {
								modules: true,
								importLoaders: 1,
								localIdentName: '[name]---[local]---[hash:base64:5]'
							}
						},
						'postcss'
					]
				})
			},
			// SCSS
			{
				test: /\.global\.(scss|sass)$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: ['css', 'postcss', 'sass']
				})
			}, {
				test: /^((?!\.global).)*\.(scss|sass)$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: [
						{
							loader: 'css',
							query: {
								modules: true,
								importLoaders: 1,
								localIdentName: '[name]---[local]---[hash:base64:5]'
							}
						},
						'postcss',
						'sass'
					]
				})
			}, {
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				loader: 'url-loader?limit=10000'
			}, {
				test: /\.(eot|ttf|wav|mp3)$/,
				loader: 'file-loader'
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
