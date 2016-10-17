/* eslint no-unused-vars: 0 */
import { PROMISE } from 'client/constants'

function isPromise(obj) {
	return !!obj
		&& (typeof obj === 'object' || typeof obj === 'function')
		&& typeof obj.then === 'function'
}

const promiseMiddleware = store => next => action => {
	const promiseAPI = action[PROMISE]

	if (typeof promiseAPI === 'undefined') {
		return next(action)
	}

	const { promise, types } = promiseAPI

	if (!isPromise(promise)) {
		throw new Error('PromiseMiddleware: Expected a promise.')
	}

	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error('Expected an array of three action types.')
	}

	if (!types.every(type => typeof type === 'string')) {
		throw new Error('Expected action types to be strings.')
	}

	function getRestOfActionWithoutPromise(data) {
		const finalAction = Object.assign({}, action, data)
		delete finalAction[PROMISE]
		return finalAction
	}

	const [REQUEST, SUCCESS, FAILURE] = types
	next(getRestOfActionWithoutPromise({ type: REQUEST }))
	return promise.then(
		result => {
			next(getRestOfActionWithoutPromise({
				payload: result, type: SUCCESS
			}))
		},
		error => {
			next(getRestOfActionWithoutPromise({
				payload: error, type: FAILURE
			}))
		}
	)
}

export default promiseMiddleware
