/* eslint no-console: 0 */
const path                 = require('path')
const express              = require('express')
const bodyParser           = require('body-parser')
const morgan               = require('morgan')
const hpp                  = require('hpp')
const compression          = require('compression')
const webpack              = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const devConfig            = require('./webpack.dev.config')
const prodConfig           = require('./webpack.prod.config')

const app  = express()
const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const __DEV__ = process.env.NODE_ENV === 'development' // eslint-disable-line

// enable body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Enable logging
app.use(morgan('dev'))

// Don't expose any software information to hackers.
app.disable('x-powered-by')

// Prevent HTTP Parameter pollution.
app.use(hpp())

// Response compression.
app.use(compression({ level: 9 }))

if (__DEV__) {
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
	app.get('*', (req, res) => {
		if (req.accepts('html')) {
			res.write(wdm.fileSystem.readFileSync(path.resolve(devConfig.output.path, 'index.html')))
			res.end()
		}
	})
} else {
	app.use(express.static(prodConfig.output.path))
	app.get('*', (req, res) => {
		if (req.accepts('html')) {
			res.sendFile(path.resolve(prodConfig.output.path, 'index.html'))
		}
	})
}

app.listen(port, host, err => {
	if (err) return console.log(err)
	return console.log(`===> 🌎  Dev Server started on http://${host}:${port}`)
})
