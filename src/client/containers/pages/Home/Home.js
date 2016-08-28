import React, { PropTypes }   from 'react'
import cssModules             from 'react-css-modules'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import * as counterActions    from 'client/actions'
import Counter                from 'client/components/Counter'
import styles                 from './style.scss'

const Home = ({ counter, actions }) => (
	<div>
		<h4 styleName="blue-color">Home Page</h4>
		<Counter value={counter} actions={actions} />
	</div>
)

Home.propTypes = {
	counter: PropTypes.number.isRequired,
	actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		counter: state.counter
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(counterActions, dispatch)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(cssModules(Home, styles))
