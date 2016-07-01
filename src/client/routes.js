/* eslint no-unused-vars: 0  */
/* eslint import/no-unresolved: [2, { ignore: ['^promise\?global.*'] }]*/
import React                 from 'react'
import { Route, IndexRoute } from 'react-router'

// Import the component normally in case you want to bundle with the starting javascript file
import App                   from './components/App'

// Lazy Load the Paths (Do this to do code-splitting so that the pages javascript chunk) only gets
// loaded if the url is accessed
import Home                  from 'promise?global!./components/Home'
import About                 from 'promise?global!./components/About'

function handleError(err) {
	// TODO : Error Handling
	console.log('==> Error occurred loading dynamic route') // eslint-disable-line no-console
	console.log(err) // eslint-disable-line no-console
}

function lazyLoadComponent(lazyModule) {
	return (nextState, cb) =>
		lazyModule()
			.then(module => cb(null, module.default))
			.catch(handleError)
}

function lazyLoadComponents(lazyModules) {
	return (nextState, cb) => {
		const moduleKeys = Object.keys(lazyModules)
		const promises = moduleKeys.map(key => lazyModules[key])
		Promise.all(promises)
			.then(modules => {
				cb(null, modules.reduce((acc, module, i) =>
					// Essentially we are doing acc[moduleKeys[i]] = module; return acc;
					// We are doing this way to aviod mutation
					// In the new ES2015 Standard, dynamic keys can be created using then following
					// syntax
					//
					//	let obj = {
					//	  [myKey]: value
					//	}
					//
					// This is similar to doing
					//
					// let temp = myKey /* Here myKey is a dynamically computed value like moduleKeys[i] */
					// let obj = {
					//	  temp: value
					// }
					//
					Object.assign({}, acc, {
						[moduleKeys[i]]: module.default
					}), {}))
			})
			.catch(handleError)
	}
}

/**
 * Our routes.
 *
 * NOTE: We load our routes asynhronously using the `getComponent` API of
 * react-router, doing so combined with the `System.import` support by webpack 2
 * or in our case using `promise-loader` allows us to get code splitting based on our routes.
 * @see https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
 * @see https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6
 */
const routes = (
	<Route path="/" component={App}>
		<IndexRoute getComponent={lazyLoadComponent(Home)} />
		<Route path="/about" getComponent={lazyLoadComponent(About)} />
	</Route>
)

export default routes
