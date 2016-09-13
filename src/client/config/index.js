module.exports = process.env.NODE_ENV === 'development' ?
	require('./config.dev') : require('./config.prod')
