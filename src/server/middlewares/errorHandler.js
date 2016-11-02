// Error Handler

export default (err, req, res, next) => { // eslint-disable-line no-unused-vars
	res.status(err.status || 500)
	return res.send({
		errors: [err]
	})
}
