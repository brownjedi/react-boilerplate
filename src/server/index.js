/* eslint no-console: 0 */
import express    from 'express'
import bodyParser from 'body-parser'
import logger     from 'morgan'
import apiRoutes  from './routes/apiRoutes'

const app     = express()
const port    = process.env.PORT || process.env.SERVER_PORT || 3000
const host    = process.env.HOST || process.env.SERVER_HOST || 'localhost'

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use('/api', apiRoutes)

const server = app.listen(port, host, err => {
	if (err) {
		console.log(err)
		return
	}
	console.log(`===> 🌎  Express Server started on http://${host}:${port}`)
})

function gracefulShutdown() {
	console.log('Stopping Express Server')
	if (server) {
		server.close(() => process.exit(0))
	}
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown)

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)

export default server
