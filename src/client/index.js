import React                      from 'react'
import { render }                 from 'react-dom'
import { AppContainer }           from 'react-hot-loader'
import { Router, browserHistory } from 'react-router'
import routes                     from './routes'
import attachFastClick            from 'fastclick'

import 'normalize.css/normalize.css'
import './client.global.scss'

// Get the DOM Element that will host our React application.
const container = document.getElementById('react-root')
// Remove 300ms tap delay on mobile devices
attachFastClick.attach(document.body)

function renderApp() {
	render(
        <AppContainer>
            <Router history={browserHistory} routes={routes} />
        </AppContainer>,
		container
	)
}

// The following is needed so that we can hot reload our App.
if (process.env.NODE_ENV === 'development' && module.hot) {
	// Accept changes to this file for hot reloading.
	module.hot.accept()
	// Any changes to our routes will cause a hotload re-render
	module.hot.accept('./routes', renderApp)
}

renderApp()
