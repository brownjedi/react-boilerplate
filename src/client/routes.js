/* eslint import/no-unresolved: [2, { ignore: ['^promise\?global.*'] }]*/
/* eslint global-require: 0 */
import React                 from 'react'
import { Route, IndexRoute } from 'react-router'
import { lazyLoadComponent } from './utils/lazy-loading'

// Import the component normally in case you want to bundle with the starting javascript file
import App                   from './components/App'

// Lazy Load the Paths (Do this to do code-splitting so that the pages javascript
// chunk only gets loaded if the url is accessed)
import Home                  from 'promise?global!./components/Home'
import About                 from 'promise?global!./components/About'

// This is required to do for all async routes during development to ensure react-hot-reload
// works
if (__DEV__) {
	require('./components/Home')
	require('./components/About')
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
