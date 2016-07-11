import React      from 'react'
import { Link }   from 'react-router'
import cssModules from 'react-css-modules'
import styles     from './style.scss'

const Header = () => (
	<div>
		<h4 styleName="green-color">Hello World</h4>
		<div>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/about">About</Link></li>
			</ul>
		</div>
	</div>
)

export default cssModules(Header, styles)
