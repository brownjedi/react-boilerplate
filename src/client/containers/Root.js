import React, { PropTypes } from 'react'
import { Router }           from 'react-router'
import { Provider }         from 'react-redux'
import routes               from 'client/routes'
import DevTools             from 'client/containers/DevTools'

const Root = ({ history, store }) => (
	<Provider store={store}>
		<div>
			<Router history={history} routes={routes} />
			{__DEV__ && !window.devToolsExtension ? <DevTools /> : undefined}
		</div>
	</Provider>
)

Root.propTypes = {
	history: PropTypes.object.isRequired,
	store: PropTypes.object.isRequired
}

export default Root
