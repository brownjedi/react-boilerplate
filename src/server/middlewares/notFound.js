// catch 404 and forward it to error handler
export default (req, res, next) => {
	const err = new Error('The URL is not found')
	err.status = 404
	return next(err)
}
