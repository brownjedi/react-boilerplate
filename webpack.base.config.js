const path              = require('path')
const webpack           = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer      = require('autoprefixer')

const config = {
	target: 'web',
	resolve: {
		// These extensions are tried when resolving a file.
		extensions: ['', '.js', '.jsx'],
		// In which folders the resolver look for modules
		// relative paths are looked up in every parent folder (like node_modules)
		// absolute paths are looked up directly
		// the order is respected
		modules: [path.resolve(__dirname, 'src'), 'node_modules']
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
		path: path.resolve(__dirname, 'build'),
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
				exclude: [/node_modules/, path.resolve(__dirname, 'build')]
			}
		],
		loaders: [
			// Javascript Loader
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: [/node_modules/, path.resolve(__dirname, 'build')],
				query: {
					presets: ['react', ['es2015', { modules: false }], 'stage-0'],
					// Using babel-runtime instead of babel-polyfill to automatically
					// polyfill without polluting globals
					// @see https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3
					plugins: [
						'transform-runtime',
						['typecheck', { disable: { production: true } }],
						'transform-object-rest-spread',
						'transform-class-properties'
					]
				}
			},
			// JSON Loader
			{
				test: /\.json?$/,
				loader: 'json'
			},
			// URL Loader (Images Definitions)
			// Any file with a byte smaller than this will be "inlined" via
            // a base64 representation.
			{
				test: /\.(jpg|jpeg|png|gif|ico)$/,
				loader: 'url?limit=10000'
			},
			// Font Definitions
			{
				test: /\.svg$/,
				loader: 'url?limit=65000&mimetype=image/svg+xml'
			}, {
				test: /\.woff$/,
				loader: 'url?limit=65000&mimetype=application/font-woff'
			}, {
				test: /\.woff2$/,
				loader: 'url?limit=65000&mimetype=application/font-woff2'
			}, {
				test: /\.[ot]tf$/,
				loader: 'url?limit=65000&mimetype=application/octet-stream'
			}, {
				test: /\.eot$/,
				loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject'
			},
			// File Loader
			{
				test: /\.(wav|mp3)$/,
				loader: 'file'
			}
		]
	},
	eslint: {
		failOnWarning: false,
		failOnError: true,
		configFile: './.eslintrc'
	},

	postcss: [autoprefixer]
}

module.exports = config
