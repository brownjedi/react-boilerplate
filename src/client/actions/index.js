import * as types from 'client/constants/actionTypes'

export function incrementCounter() {
	return {
		type: types.INCREMENT_COUNTER
	}
}

export function decrementCounter() {
	return {
		type: types.DECREMENT_COUNTER
	}
}

export function incrementCounterAsync() {
	return dispatch => {
		setTimeout(() => dispatch(incrementCounter()), 1000)
	}
}

export function decrementCounterAsync() {
	return dispatch => {
		setTimeout(() => dispatch(decrementCounter()), 1000)
	}
}

export function incrementIfOdd() {
	return (dispatch, getState) => {
		const { counter } = getState()

		if (counter % 2 === 0) return
		dispatch(incrementCounter())
	}
}
