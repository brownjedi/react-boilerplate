import React      from 'react'
import cssModules from 'react-css-modules'
import styles     from './style.scss'

const About = () => (
	<h4 styleName="red-color">About Page</h4>
)

export default cssModules(About, styles)
