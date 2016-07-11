import React, { PropTypes } from 'react'
import cssModules           from 'react-css-modules'
import styles               from './style.scss'

const Counter = ({ value, actions }) => (
	<div>
		<h3>Counter</h3>
		<p>
			Clicked: {value} times
			{'\n'}
			<button onClick={actions.incrementCounter}>+</button>
			{' '}
			<button onClick={actions.decrementCounter}>-</button>
			{'\n'}
			<button onClick={actions.incrementCounterAsync}>+ (Async)</button>
			{' '}
			<button onClick={actions.decrementCounterAsync}>- (Async)</button>
			{'\n'}
			<button onClick={actions.incrementIfOdd}>+ (Odd)</button>
		</p>
	</div>
)

Counter.propTypes = {
	value: PropTypes.number.isRequired,
	actions: PropTypes.object.isRequired
}

export default cssModules(Counter, styles)
