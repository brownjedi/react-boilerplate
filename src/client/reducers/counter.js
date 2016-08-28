import * as types from 'client/constants/actionTypes'

export default function counterReducer(state = 0, action): number {
	switch (action.type) {
		case types.INCREMENT_COUNTER:
			return state + 1
		case types.DECREMENT_COUNTER:
			return state - 1
		default:
			return state
	}
}
