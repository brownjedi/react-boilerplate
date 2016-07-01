
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
		// We create a seperate chunk containing our vendor modules. This can
		// avoid unnecessary downloads by users as well as speed up development
		// rebuild times by not having to rebundle everything with every change.

		// Avoid adding react-router to vendor in dev mode as the react hot load
		// doesn't work when its added as a vendor. You can add this in production
		vendor: [
			'react',
			'react-dom',
			'react-css-modules',
			'fastclick'
		]
	},
	output: {
		// The dir in which our bundle should be output.
		path: path.resolve(__dirname, 'dist'),
		// The filename format for our bundle's entries.
		// We also want our client development builds to have a determinable
        // name for our hot reloading client bundle server.
		filename: '[name].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: '/'
	},
	resolve: {
		// These extensions are tried when resolving a file.
		extensions: ['', '.js', '.jsx']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/client/index.template.html',
			inject: 'body',
			filename: 'index.html'
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// We need this plugin to enable hot module reloading for our dev server.
		new webpack.HotModuleReplacementPlugin(),
		// We don't want webpack errors to occur during development as it will
		// kill our dev servers.
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
				SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
				CLIENT_DEVSERVER_PORT: JSON.stringify(process.env.CLIENT_DEVSERVER_PORT)
			},
			__DEV__: true
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
					presets: ['react', 'es2015-webpack', 'stage-0'],
					// Using babel-runtime instead of babel-polyfill to automatically
					// polyfill without polluting globals
					// @see https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3
					plugins: ['react-hot-loader/babel', 'transform-runtime']
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
	}
})
