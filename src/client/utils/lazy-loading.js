/* eslint no-unused-vars: 0  */

function handleError(err) {
	// TODO : Error Handling
	console.log('==> Error occurred loading dynamic route') // eslint-disable-line no-console
	console.log(err) // eslint-disable-line no-console
}

export function lazyLoadComponent(lazyModule) {
	return (nextState, cb) =>
		lazyModule()
			.then(module => cb(null, module.default))
			.catch(handleError)
}

export function lazyLoadComponents(lazyModules) {
	return (nextState, cb) => {
		const moduleKeys = Object.keys(lazyModules)
		const promises = moduleKeys.map(key => lazyModules[key])
		Promise.all(promises)
			.then((modules) => {
				cb(null, modules.reduce((acc, module, i) =>
					Object.assign({}, acc, {
						[moduleKeys[i]]: module.default
					}), {}))
			})
			.catch(handleError)
	}
}

export default {
	lazyLoadComponent,
	lazyLoadComponents
}
