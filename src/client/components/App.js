import React      from 'react'
import cssModules from 'react-css-modules'
import styles     from './App.scss'

const app = () => (
	<h4 className="blue-color" styleName="red-color">Hello World</h4>
)

export default cssModules(app, styles)
