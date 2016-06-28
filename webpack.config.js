
require('dotenv').config({ silent: true })

const path                    = require('path')
const webpack                 = require('webpack')
const HtmlWebpackPlugin       = require('html-webpack-plugin')
const validate                = require('webpack-validator')

module.exports = validate({
	debug: true,
	target: 'web',
	devtool: 'eval-source-map',
	entry: {
		main: [
			'react-hot-loader/patch',
			'webpack-hot-middleware/client?reload=true',
			path.resolve(__dirname, 'src/client/index.js')
		],
		vendor: [
			'react',
			'react-dom'
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		chunkFilename: '[name]-[chunkhash].js',
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
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
				SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
				CLIENT_DEVSERVER_PORT: JSON.stringify(process.env.CLIENT_DEVSERVER_PORT)
			}
		}),
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
			// Javascript
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: [/node_modules/, path.resolve(__dirname, 'dist')],
				query: {
					presets: ['react', 'es2015-webpack'],
					plugins: ['react-hot-loader/babel']
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
				loaders: [
					'style',
					'css?sourceMap',
					'postcss'
				]
			}, {
				test: /^((?!\.global).)*\.css$/,
				loaders: [
					'style',
					'css?modules&sourceMap&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
					'postcss'
				]
			},
			// SCSS
			{
				test: /\.global\.(scss|sass)$/,
				loaders: [
					'style',
					'css?sourceMap',
					'postcss',
					'sass'
				]
			}, {
				test: /^((?!\.global).)*\.(scss|sass)$/,
				loaders: [
					'style',
					'css?modules&sourceMap&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
					'postcss',
					'sass'
				]
			}
		]
	},
	eslint: {
		failOnWarning: false,
		failOnError: true,
		configFile: './.eslintrc'
	}
})
