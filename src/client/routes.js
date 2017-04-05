/* eslint global-require: 0 import/no-webpack-loader-syntax: 0 */
import React                 from 'react'
import { Route, IndexRoute } from 'react-router'
import { lazyLoadComponent } from 'client/utils/lazy-loading'

// Import the component normally in case you want to bundle with the starting javascript file
import App                   from 'client/containers/pages/App'

// Lazy Load the Paths (Do this to do code-splitting so that the pages javascript
// chunk only gets loaded if the url is accessed)
import Home                  from 'promise-loader?global!client/containers/pages/Home'
import About                 from 'promise-loader?global!client/containers/pages/About'
import NotFound              from 'promise-loader?global!client/containers/pages/NotFound'

// This is required to do for all async routes during development to ensure react-hot-reload
// works
if (__DEV__) {
	require('client/containers/pages/Home')
	require('client/containers/pages/About')
	require('client/containers/pages/NotFound')
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
	<Route>
		<Route path="/" component={App}>
			<IndexRoute getComponent={lazyLoadComponent(Home)} />
			<Route path="/about" getComponent={lazyLoadComponent(About)} />
		</Route>
		<Route path="*" getComponent={lazyLoadComponent(NotFound)} />
	</Route>
)

export default routes
