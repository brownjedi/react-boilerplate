/* eslint no-console: 0, global-require: 0 import/first: 0 */
// Import envVars
import '~/server/utils/envVars'
// Import polyfills
import '~/server/utils/polyfills'

import {
	__TEST__,
	__DEV__,
	PORT,
	FORCE_SSL
}                       from '~/server/config'

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
}                  from '~/server/middlewares'

import apiRoutes   from '~/server/routes/apiRoutes'

const app        = express()
const appRootDir = appRoot.get()
const publicPath = path.resolve(appRootDir, 'build', 'client')
const viewsPath  = path.resolve(publicPath, 'views')
let fileSystem

// Don't expose any software information to hackers.
app.disable('x-powered-by')

// Response compression.
app.use(compression({ level: 9 }))

// enable body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Prevent HTTP Parameter pollution.
app.use(hpp())

// Enable logging
if (!__TEST__) {
	// Enable logging
	app.use(morgan('dev'))
}

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

if (!module.parent) {
	// Start the server
	app.listen(PORT, (err) => {
		if (err) {
			console.log(err)
			return
		}
		console.log('===> 🌎  Express Server started')
	})
}

export default app
