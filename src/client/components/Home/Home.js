import React      from 'react'
import cssModules from 'react-css-modules'
import styles     from './style.scss'

const Home = () => (
	<h4 styleName="blue-color">Home Page</h4>
)

export default cssModules(Home, styles)
