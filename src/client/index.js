import React                    from 'react'
import { render }               from 'react-dom'
import { AppContainer }         from 'react-hot-loader'
import { browserHistory }       from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import attachFastClick          from 'fastclick'
import configureStore           from './store/configureStore'
import RootContainer            from './containers/Root'

import 'normalize.css/normalize.css'
import './client.global.scss'

// Get the DOM Element that will host our React application.
const container = document.getElementById('react-root')
// Remove 300ms tap delay on mobile devices
attachFastClick.attach(document.body)

// Initialize the store
const store = configureStore()
// Sync the History with the Store
const history = syncHistoryWithStore(browserHistory, store)

function renderApp() {
	render(
        <AppContainer>
            <RootContainer store={store} history={history} />
        </AppContainer>,
		container
	)
}

// The following is needed so that we can hot reload our App.
if (__DEV__ && module.hot) {
	// Accept changes to this file for hot reloading.
	module.hot.accept()
	// Any changes to our routes will cause a hotload re-render
	module.hot.accept('./containers/Root', renderApp)
}

renderApp()
