/* eslint no-console: 0 */

// Invalidate the cache so that we can get a clean base config and not a modified
// one by the other webpack config. This happens when building for production while
// running the dev server
delete require.cache[require.resolve('./webpack.base.config')]

const webpack           = require('webpack')
const WebpackMd5Hash    = require('webpack-md5-hash')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StatsPlugin       = require('stats-webpack-plugin')
const config            = require('./webpack.base.config')

config.devtool = 'cheap-module-source-map'

// Avoid adding react-router to vendor in dev mode as the react hot load
// doesn't work when its added as a vendor. You can add this in production
config.entry.vendor.push('react-router')

config.output.filename = '[name]-[chunkhash].min.js'
config.output.chunkFilename = '[name]-[chunkhash].min.js'

config.plugins.push(...[
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		},
		__DEV__: false
	}),
	new ExtractTextPlugin({
		filename: '[name]-[chunkhash].min.css',
		allChunks: true
	}),
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
	}),
	// We use this so that our generated [chunkhash]'s are only different if
	// the content for our respective chunks have changed.  This optimises
	// our long term browser caching strategy for our client bundle, avoiding
	// cases where browsers end up having to download all the client chunks
	// even though 1 or 2 may have only changed.
	new WebpackMd5Hash()
])

config.module.loaders.push(...[
	// CSS
	{
		test: /\.global\.css$/,
		loader: ExtractTextPlugin.extract({
			fallbackLoader: 'style',
			loader: ['css', 'postcss']
		})
	},
	{
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
			// resolve-url-loader needs source maps from  preceding loaders and
			// resolves relative paths in url() statements based on the original source file.
			loader: ['css', 'postcss', 'resolve-url', 'sass?sourceMap']
		})
	},
	{
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
				'resolve-url',
				// resolve-url-loader needs source maps from  preceding loaders and
				// resolves relative paths in url() statements based on the original source file.
				'sass?sourceMap'
			]
		})
	}
])

module.exports = config
