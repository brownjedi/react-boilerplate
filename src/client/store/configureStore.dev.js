/* eslint global-require: 0 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk                                     from 'redux-thunk'
import { persistState }                          from 'redux-devtools'
import DevTools                                  from '../containers/DevTools'
import rootReducer                               from '../reducers'

const enhancer = compose(
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
	persistState(
		window.location.href.match(
			/[?&]debug_session=([^&#]+)\b/
		)
	)
)

export default function configureStore(inititalState) {
	const store = createStore(rootReducer, inititalState, enhancer)

	if (__DEV__ && module.hot) {
		module.hot.accept('../reducers', () =>
			store.replaceReducer(require('../reducers').default)
		)
	}

	return store
}
