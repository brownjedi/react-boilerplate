/* eslint no-console: 0 */
const path                 = require('path')
const express              = require('express')
const webpack              = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config               = require('./webpack.config.js')

const app      = express()
const devPort  = process.env.CLIENT_DEVSERVER_PORT
const devHost  = process.env.CLIENT_DEVSERVER_HOST || 'localhost'
const compiler = webpack(config)
const wdm      = webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath,
	hot: true,
	historyApiFallback: true,
	headers: {
		'Access-Control-Allow-Origin': '*'
	},
	stats: {
		colors: true,
		hash: false,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false
	}
})

// compiler.watch({}, () => {})
app.use(wdm)
app.use(webpackHotMiddleware(compiler))
app.use(express.static(config.output.path))
app.get('*', (req, res) => {
	res.write(wdm.fileSystem.readFileSync(path.resolve(config.output.path, 'index.html')))
})

const server = app.listen(devPort, devHost, err => {
	if (err) return console.log(err)
	return console.log(`===> 🌎  Dev Server started on http://${devHost}:${devPort}`)
})

function gracefulShutdown() {
	console.log('Stopping Dev Server')
	if (wdm) wdm.close()
	if (server) server.close(() => process.exit(0))
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown)

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)
