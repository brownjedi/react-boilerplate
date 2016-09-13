/* eslint global-require: 0 */
import { createStore, applyMiddleware }           from 'redux'
import thunk                                      from 'redux-thunk'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import rootReducer                                from 'client/reducers'
import { promiseMiddleware }                      from 'client/middleware'


export default function configureStore(baseHistory, inititalState) {
	const enhancer = applyMiddleware(routerMiddleware(baseHistory), thunk, promiseMiddleware)
	const store = createStore(rootReducer, inititalState, enhancer)
	// Sync the History with the Store
	const history = syncHistoryWithStore(baseHistory, store)
	return { store, history }
}
