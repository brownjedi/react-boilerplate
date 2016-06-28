const path              = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const devMode  = process.env.NODE_ENV !== 'production'

module.exports = {
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
				plugins: devMode ? ['react-hot-loader/babel'] : []
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
			loaders: devMode ? [
				'style',
				'css?sourceMap',
				'postcss'
			] : ExtractTextPlugin.extract('style', [
				'css',
				'postcss'
			])
		}, {
			test: /^((?!\.global).)*\.css$/,
			loaders: devMode ? [
				'style',
				'css?modules&sourceMap&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
				'postcss'
			] : ExtractTextPlugin.extract('style', [
				'css?modules&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
				'postcss'
			])
		},
		// SCSS
		{
			test: /\.global\.(scss|sass)$/,
			loaders: devMode ? [
				'style',
				'css?sourceMap',
				'postcss',
				'sass'
			] : ExtractTextPlugin.extract('style', [
				'css',
				'postcss',
				'sass'
			])
		}, {
			test: /^((?!\.global).)*\.(scss|sass)$/,
			loaders: devMode ? [
				'style',
				'css?modules&sourceMap&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
				'postcss',
				'sass'
			] : ExtractTextPlugin.extract('style', [
				'css?modules&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]',
				'postcss',
				'sass'
			])
		}
	]
}
