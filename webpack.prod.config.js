/* eslint no-console: 0 */

// Invalidate the cache so that we can get a clean base config and not a modified
// one by the other webpack config. This happens when building for production while
// running the dev server
delete require.cache[require.resolve('./webpack.base.config')]

const webpack           = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StatsPlugin       = require('stats-webpack-plugin')
const autoprefixer      = require('autoprefixer')
const validate          = require('webpack-validator')
const config            = require('./webpack.base.config')

config.devtool = 'cheap-module-source-map'

// Avoid adding react-router to vendor in dev mode as the react hot load
// doesn't work when its added as a vendor. You can add this in production
config.entry.vendor.push('react-router')

config.output.filename = '[name]-[hash].min.js'
config.output.chunkFilename = '[name]-[chunkhash].min.js'

config.plugins.push(...[
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		},
		__DEV__: false
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
			loader: ['css', 'postcss', 'sass']
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
				'sass'
			]
		})
	}
])

config.postcss = [autoprefixer]

module.exports = validate(config)
