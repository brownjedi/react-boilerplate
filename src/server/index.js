/* eslint no-console: 0, global-require: 0 */
// Import polyfills
import './utils/polyfills'

import path        from 'path'
import express     from 'express'
import bodyParser  from 'body-parser'
import morgan      from 'morgan'
import hpp         from 'hpp'
import compression from 'compression'

import {
	notFoundMiddleware,
	errorHandlerMiddleware
}                  from './middlewares'

import apiRoutes   from './routes/apiRoutes'

const app     = express()
const port    = process.env.VCAP_APP_PORT || process.env.PORT || 3000
const host    = process.env.VCAP_APP_HOST || process.env.HOST || 'localhost'
const __DEV__ = process.env.NODE_ENV === 'development' // eslint-disable-line

// Response compression.
app.use(compression({ level: 9 }))

// enable body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Enable logging
app.use(morgan('dev'))

// Don't expose any software information to hackers.
app.disable('x-powered-by')

// Prevent HTTP Parameter pollution.
app.use(hpp())

// routes
app.use('/api', apiRoutes)

if (__DEV__) {
	const webpack              = require('webpack')
	const webpackDevMiddleware = require('webpack-dev-middleware')
	const webpackHotMiddleware = require('webpack-hot-middleware')
	const devConfig            = require('./../../webpack.dev.config')

	const compiler = webpack(devConfig)
	const wdm      = webpackDevMiddleware(compiler, {
		publicPath: devConfig.output.publicPath,
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
	app.use(express.static(devConfig.output.path))
	app.get('*', (req, res, next) => {
		if (req.accepts('html')) {
			res.write(wdm.fileSystem.readFileSync(path.resolve(devConfig.output.path, 'index.html')))
			return res.end()
		}
		return next()
	})
} else {
	// In production this file gets copied into the build directory. So all the files/resources are in
	// the same directory
	app.use(express.static(path.join(__dirname, 'public')))
	app.get('*', (req, res, next) => {
		if (req.accepts('html')) {
			return res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
		}
		return next()
	})
}

// 404 Handler
app.use(notFoundMiddleware)

// Error Handler
app.use(errorHandlerMiddleware)

const server = app.listen(port, host, err => {
	if (err) {
		console.log(err)
		return
	}
	console.log(`===> 🌎  Express Server started on http://${host}:${port}`)
})

export default server
