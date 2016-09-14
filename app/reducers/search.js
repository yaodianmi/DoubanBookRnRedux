'use strict'

import { combineReducers } from 'redux';

import {
	SET_8_STAR,
	SET_SEARCH_KEYWORD,
	SEARCH_STARTED,
	SEARCH_ENDED,
	SEARCH_RESULT,
	SEARCH_FAILED,
	MORE_STARTED,
	MORE_SEARCH_RESULT,
	NEW_SEARCH,
} from '../constants/ActionTypes';

const initialSearchState = {
	// searching
	error: '',
	filter: '',
	isLoadingTail: false,
	isLoading: false,
	is8Star: false,

	// search books
	books: [],
}

const search = (state = initialSearchState, action) => {
	switch (action.type) {
		case SET_8_STAR:
			return Object.assign({}, state, {is8Star: action.value})
		case SET_SEARCH_KEYWORD:
			return Object.assign({}, state, {filter: action.filter})
		case SEARCH_STARTED:
			return Object.assign({}, state, {isLoading: true})
		case SEARCH_ENDED:
			return Object.assign({}, state, {isLoading: false})
		case SEARCH_FAILED:
			return Object.assign({}, state, {
				error: action.message,
				isLoadingTail: false,
				isLoading: false,
				books: [],
			})
		case SEARCH_RESULT:
			return Object.assign({}, state, {
				isLoadingTail: false,
				isLoading: false,
				books: action.data,
			})
		case MORE_STARTED:
			return Object.assign({}, state, {isLoadingTail: true})
		case MORE_SEARCH_RESULT:
			return Object.assign({}, state, {
				isLoadingTail: false,
				isLoading: false,
				books: action.data,
			})
		case NEW_SEARCH:
			return initialSearchState
		default:
			return state
	}
}

export default search
