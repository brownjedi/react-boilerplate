import React      from 'react'
import cssModules from 'react-css-modules'
import styles     from './style.scss'

const Counter = () => (
	<h3>Counter</h3>
)

export default cssModules(Counter, styles)
