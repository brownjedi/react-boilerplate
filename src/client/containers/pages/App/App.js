import React, { PropTypes } from 'react'
import { Link }             from 'react-router'
import cssModules           from 'react-css-modules'
import styles               from './style.scss'

const App = ({ children }) => (
	<div>
		<h4 className="green-color">Hello World</h4>
		<div>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/about">About</Link></li>
			</ul>
		</div>
		<div>
			{children}
		</div>
	</div>
)

App.propTypes = {
	children: PropTypes.node
}

export default cssModules(App, styles)
