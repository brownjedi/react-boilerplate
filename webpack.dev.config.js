/* eslint no-console: 0 */
const webpack    = require('webpack')
const validate   = require('webpack-validator')
const _          = require('lodash')
const baseConfig = require('./webpack.base.config')

const config = _.cloneDeep(baseConfig)

config.debug = true
config.devtool = 'eval-source-map'
config.entry.main.unshift(...[
	'react-hot-loader/patch',
	'webpack-hot-middleware/client?reload=true'
])

// The filename format for our bundle's entries.
// We also want our client development builds to have a determinable
// name for our hot reloading client bundle server.
config.output.filename = '[name].js'
config.output.chunkFilename = '[name]-[chunkhash].js'

config.plugins.push(...[
	// We need this plugin to enable hot module reloading for our dev server.
	new webpack.HotModuleReplacementPlugin(),
	// We don't want webpack errors to occur during development as it will
	// kill our dev servers.
	new webpack.NoErrorsPlugin(),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('development')
		},
		__DEV__: true
	})
])

config.module.loaders.forEach((elem, index) => {
	if (elem.loader === 'babel') {
		config.module.loaders[index].query.plugins.unshift('react-hot-loader/babel')
	}
	return
})

config.module.loaders.push(...[
	// CSS
	{
		test: /\.global\.css$/,
		loaders: [
			'style',
			'css?sourceMap',
			'postcss'
		]
	},
	{
		test: /^((?!\.global).)*\.css$/,
		loaders: [
			'style',
			{
				loader: 'css',
				query: {
					modules: true,
					sourceMap: true,
					importLoaders: 1,
					localIdentName: '[name]---[local]---[hash:base64:5]'
				}
			},
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
	},
	{
		test: /^((?!\.global).)*\.(scss|sass)$/,
		loaders: [
			'style',
			{
				loader: 'css',
				query: {
					modules: true,
					sourceMap: true,
					importLoaders: 1,
					localIdentName: '[name]---[local]---[hash:base64:5]'
				}
			},
			'postcss',
			'sass'
		]
	}
])

module.exports = validate(config)
