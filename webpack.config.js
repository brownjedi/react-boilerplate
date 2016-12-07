const path                = require('path')
const webpack             = require('webpack')
const HtmlWebpackPlugin   = require('html-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const CopyWebpackPlugin   = require('copy-webpack-plugin')
const autoprefixer        = require('autoprefixer')
const ExtractTextPlugin   = require('extract-text-webpack-plugin')
const WebpackMd5Hash      = require('webpack-md5-hash')
const StatsPlugin         = require('stats-webpack-plugin')
const HappyPack           = require('happypack')

const pkg                 = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'

const SRC_DIR       = path.resolve(__dirname, 'src')
const CLIENT_DIR    = path.join(SRC_DIR, 'client')
const HTML_TEMPLATE = path.resolve(__dirname, 'src/client/index.template.html')
const MODULE_DIR    = path.resolve(__dirname, 'node_modules')
const BUILD_DIR     = path.resolve(__dirname, 'build')
const OUTPUT_DIR    = path.join(BUILD_DIR, 'public')
const ENTRY_POINT   = path.join(CLIENT_DIR, 'index.js')

const HTML_TITLE    = pkg.description || ''

const VENDORS = [
	'react',
	'react-dom',
	'react-css-modules',
	'react-helmet',
	'react-redux',
	'react-router-redux',
	'redux',
	'redux-thunk',
	'fastclick',
	'es6-promise',
	'whatwg-fetch'
]

const AUTOPREFIXER_BROWSERS = [
	'Android 2.3',
	'Android >= 4',
	'Chrome >= 35',
	'Firefox >= 31',
	'Explorer >= 9',
	'iOS >= 7',
	'Opera >= 12',
	'Safari >= 7.1'
]

const ENTRY = [ENTRY_POINT]

if (!isProd) {
	ENTRY.unshift(...[
		'eventsource-polyfill', // Necessary for hot reloading with IE
		'react-hot-loader/patch',
		'webpack-hot-middleware/client?reload=true'
	])
}

const BABEL_PLUGINS = [
	'transform-runtime',
	['typecheck', { disable: { production: true } }],
	'transform-object-rest-spread',
	'transform-class-properties'
]

if (!isProd) {
	BABEL_PLUGINS.unshift('react-hot-loader/babel')
}

const PLUGINS = [
	new HappyPack({
		loaders: [
			{
				path: 'babel',
				query: {
					babelrc: false,
					presets: ['react', ['es2015', { modules: false }], 'stage-0'],
					// Using babel-runtime instead of babel-polyfill to automatically
					// polyfill without polluting globals
					// @see https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3
					plugins: BABEL_PLUGINS
				}
			}
		],
		threads: 4,
		id: 'js'
	}),
	new HtmlWebpackPlugin({
		template: HTML_TEMPLATE,
		title: HTML_TITLE,
		inject: 'body',
		filename: 'index.html'
	}),
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: Infinity
	}),
	new AssetsWebpackPlugin({
		filename: 'assets.json',
		path: BUILD_DIR
	}),
	new ExtractTextPlugin({
		filename: '[name]-[chunkhash].min.css',
		allChunks: true,
		disable: !isProd
	}),
	// Polyfill Promise and fetch for older browsers
	new webpack.ProvidePlugin({
		Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
		fetch: 'imports?this=>global!exports?global.fetch!fetch'
	}),
	// Copy the apple-icons, windows-icons and favicons to the dist directory
	new CopyWebpackPlugin([]),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(isProd ? 'production' : 'development')
		},
		__DEV__: !isProd
	}),
	// Adds options to all of our loaders.
	// The 'debug' property was removed in webpack 2.
	// Loaders should be updated to allow passing this option via loader options in module.rules.
	// Until loaders are updated one can use the LoaderOptionsPlugin to switch loaders into debug mod
	new webpack.LoaderOptionsPlugin({
		// Indicates to our loaders that they should minify their output
		// if they have the capability to do so.
		minimize: isProd,
		// Indicates to our loaders that they should enter into debug mode
		// should they support it.
		debug: !isProd
	})
]

const DEV_PLUGINS = [
	// We need this plugin to enable hot module reloading for our dev server.
	new webpack.HotModuleReplacementPlugin(),
	// We don't want webpack errors to occur during development as it will
	// kill our dev servers.
	new webpack.NoErrorsPlugin()
]

const PROD_PLUGINS = [
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
	}),
	// We use this so that our generated [chunkhash]'s are only different if
	// the content for our respective chunks have changed.  This optimises
	// our long term browser caching strategy for our client bundle, avoiding
	// cases where browsers end up having to download all the client chunks
	// even though 1 or 2 may have only changed.
	new WebpackMd5Hash()
]

const config = {
	target: 'web',
	devtool: !isProd ? 'eval-source-map' : 'cheap-module-source-map',
	resolve: {
		// These extensions are tried when resolving a file.
		extensions: ['', '.js', '.jsx'],
		// In which folders the resolver look for modules
		// relative paths are looked up in every parent folder (like node_modules)
		// absolute paths are looked up directly
		// the order is respected
		modules: [SRC_DIR, MODULE_DIR]
	},
	entry: {
		main: ENTRY,
		// We create a seperate chunk containing our vendor modules. This can
		// avoid unnecessary downloads by users as well as speed up development
		// rebuild times by not having to rebundle everything with every change.

		// Avoid adding react-router to vendor in dev mode as the react hot load
		// doesn't work when its added as a vendor. You can add this in production
		vendor: VENDORS.concat(isProd ? 'react-router' : [])
	},
	output: {
		// The dir in which our bundle should be output.
		path: OUTPUT_DIR,
		publicPath: '/',
		// The filename format for our bundle's entries.
		// We also want our client development builds to have a determinable
		// name for our hot reloading client bundle server.
		filename: !isProd ? '[name].js' : '[name]-[chunkhash].min.js',
		chunkFilename: !isProd ? '[name]-[chunkhash].js' : '[name]-[chunkhash].min.js'
	},
	plugins: PLUGINS.concat(isProd ? PROD_PLUGINS : DEV_PLUGINS),
	module: {
		preLoaders: [
			// eslint
			{
				test: /\.js?$/,
				loader: 'eslint',
				exclude: [MODULE_DIR, BUILD_DIR]
			}
		],
		loaders: [
			// Javascript Loader (via HappyPack to speed up the execution)
			{
				test: /\.js$/,
				loader: 'happypack/loader?id=js',
				exclude: [MODULE_DIR, BUILD_DIR]
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
			}, {
				test: /\.global\.css$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: [`css?sourceMap=${!isProd}`, `postcss?sourceMap=${!isProd ? 'inline' : false}`]
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
								sourceMap: !isProd,
								importLoaders: 1,
								localIdentName: '[name]---[local]---[hash:base64:5]'
							}
						},
						`postcss?sourceMap=${!isProd ? 'inline' : false}`
					]
				})
			},
			// SCSS
			{
				test: /\.global\.(scss|sass)$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					// resolve-url-loader needs source maps from  preceding loaders and
					// resolves relative paths in url() statements based on the original source file.
					loader: [
						`css?sourceMap=${!isProd}`,
						`postcss?sourceMap=${!isProd ? 'inline' : false}`,
						'resolve-url',
						// resolve-url-loader needs source maps from  preceding loaders and
						// resolves relative paths in url() statements based on the original source file.
						`sass?sourceMap&sourceMapContents=${!isProd}`
					]
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
								sourceMap: !isProd,
								localIdentName: '[name]---[local]---[hash:base64:5]'
							}
						},
						`postcss?sourceMap=${!isProd ? 'inline' : false}`,
						'resolve-url',
						// resolve-url-loader needs source maps from  preceding loaders and
						// resolves relative paths in url() statements based on the original source file.
						`sass?sourceMap&sourceMapContents=${!isProd}`
					]
				})
			}
		]
	},
	eslint: {
		failOnWarning: false,
		failOnError: true,
		configFile: './.eslintrc'
	},

	postcss: [autoprefixer({ browsers: AUTOPREFIXER_BROWSERS })]
}

module.exports = config
