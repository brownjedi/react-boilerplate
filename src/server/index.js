/* eslint no-console: 0, global-require: 0 import/first: 0 */
// Import envVars
import './utils/envVars'
// Import polyfills
import './utils/polyfills'

import path        from 'path'
import express     from 'express'
import bodyParser  from 'body-parser'
import morgan      from 'morgan'
import hpp         from 'hpp'
import compression from 'compression'
import ejs         from 'ejs'
import fs          from 'fs'
import appRoot     from 'app-root-dir'
import {
	notFoundMiddleware,
	errorHandlerMiddleware
}                  from './middlewares'

import apiRoutes   from './routes/apiRoutes'

const app        = express()
const port       = process.env.VCAP_APP_PORT || process.env.PORT || 3000
const host       = process.env.VCAP_APP_HOST || process.env.HOST || 'localhost'
const __DEV__    = process.env.NODE_ENV === 'development' // eslint-disable-line
const __PROD__   = process.env.NODE_ENV === 'production' // eslint-disable-line
const FORCE_SSL  = process.env.FORCE_SSL === 'true'
const appRootDir = appRoot.get()
const publicPath = path.resolve(appRootDir, 'build', 'public')
const viewsPath  = path.resolve(publicPath, 'views')
let fileSystem

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
	const devConfig            = require('./../../webpack.config')

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
	fileSystem = wdm.fileSystem
} else {
	// Force HTTPs if FORCE_SSL env var is set to 'true'
	if (FORCE_SSL) {
		app.enable('trust proxy')
		app.use((req, res, next) => {
			if (req.secure) {
				return next()
			}
			return res.redirect(`https://${req.headers.host}${req.url}`)
		})
	}
	fileSystem = fs
}

// Utility function to Render HTML (dev and prod uses different filesystems)
function renderHtml(template, data = {}) {
	const doc = fileSystem.readFileSync(path.resolve(viewsPath, template), 'utf8')
	return ejs.render(doc, data)
}

// Expose Public folder
app.use(express.static(publicPath))

// Index Route
app.get('*', (req, res, next) => {
	if (req.accepts('html')) {
		return res.send(renderHtml('index.ejs'))
	}
	return next()
})

// 404 Handler
app.use(notFoundMiddleware)

// Error Handler
app.use(errorHandlerMiddleware)

const server = app.listen(port, host, (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log(`===> 🌎  Express Server started on http://${host}:${port}`)
})

export default server
