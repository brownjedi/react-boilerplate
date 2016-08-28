/* eslint global-require: 0 */
import { createStore, applyMiddleware } from 'redux'
import thunk                            from 'redux-thunk'
import rootReducer                      from 'client/reducers'

const enhancer = applyMiddleware(thunk)

export default function configureStore(inititalState) {
	const store = createStore(rootReducer, inititalState, enhancer)
	return store
}
