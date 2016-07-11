import React, { PropTypes } from 'react'
import cssModules           from 'react-css-modules'
import Header               from '../../../components/Header'
import styles               from './style.scss'

const App = ({ children }) => (
	<div>
		<Header />
		<div>
			{children}
		</div>
	</div>
)

App.propTypes = {
	children: PropTypes.node
}

export default cssModules(App, styles)
