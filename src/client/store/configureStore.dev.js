/* eslint global-require: 0 */
import { createStore, applyMiddleware, compose }  from 'redux'
import thunk                                      from 'redux-thunk'
import { persistState }                           from 'redux-devtools'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import reduxImmutableStateInvariant               from 'redux-immutable-state-invariant'
import DevTools                                   from 'client/containers/DevTools'
import rootReducer                                from 'client/reducers'
import { promiseMiddleware }                      from 'client/middleware'

export default function configureStore(baseHistory, inititalState) {
	const enhancer = compose(
		applyMiddleware(
			reduxImmutableStateInvariant(),
			routerMiddleware(baseHistory),
			thunk,
			promiseMiddleware),
		window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
		persistState(
			window.location.href.match(
				/[?&]debug_session=([^&#]+)\b/
			)
		)
	)
	const store = createStore(rootReducer, inititalState, enhancer)

	// Sync the History with the Store
	const history = syncHistoryWithStore(baseHistory, store)

	if (__DEV__ && module.hot) {
		module.hot.accept('client/reducers', () =>
			store.replaceReducer(require('client/reducers').default)
		)
	}

	return { store, history }
}
