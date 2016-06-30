import React            from 'react'
import { render }       from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App              from './components/App'
import './app.global.scss'

// Get the DOM Element that will host our React application.
const container = document.getElementById('react-root')

render(
    <AppContainer>
        <App />
    </AppContainer>,
    container
)

// The following is needed so that we can hot reload our App.
if (process.env.NODE_ENV === 'development' && module.hot) {
	// Accept changes to this file for hot reloading.
	module.hot.accept()
}
