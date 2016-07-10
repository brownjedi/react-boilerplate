/* eslint global-require: 0 */
if (__DEV__) {
	module.exports = require('./configureStore.dev').default
} else {
	module.exports = require('./configureStore.prod').default
}
