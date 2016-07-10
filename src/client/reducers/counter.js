import * as types from './../constants/actionTypes'

export default function counterReducer(state = 0, action) {
	switch (action.type) {
		case types.INCREMENT_COUNTER:
			return state + 1
		case types.DECREMENT_COUNTER:
			return state - 1
		default:
			return state
	}
}
