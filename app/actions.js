'use strict'

import {
	SEARCH_STARTED,
	SET_SEARCH_KEYWORD,
	SET_8_STAR,
	SEARCH_RESULT,
	SEARCH_ENDED,
	MORE_STARTED,
	MORE_SEARCH_RESULT
} from './constants/ActionTypes';


const doubanApiBookSearch = 'https://api.douban.com/v2/book/search'

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
const resultsCache = {
  dataForQuery: {},
  nextStartForQuery: {},
  totalForQuery: {},
};
const LOADING = {};


// actionCreators
export const newSearch = () => ({type: NEW_SEARCH})
export const setSearchKeyword = (filter) => ({type: SET_SEARCH_KEYWORD, filter})
export const set8Star = (value) => ({type: SET_8_STAR, value})
export const runSearch = (filter, type) => (dispatch) => searchBooks(dispatch, filter, type)
export const moreBooks = (filter, type) => (dispatch) => _moreBooks(dispatch, filter, type)


const _urlForQuery = (query, start, type='q') => {
	if (type == 'q') {
		return (
			doubanApiBookSearch + '?q=' + query + '&start=' + start + '&count=10'
		);
	} else if (type == 'tag') {
		return (
			doubanApiBookSearch + '?tag=' + query + '&start=' + start + '&count=10'
		);
	}
}

const _fetch = (dispatch, query, start, type='q') => {
	fetch(_urlForQuery(query, start, type))
		.then((response) => response.json())
		.then((responseJson) => {
			LOADING[query] = false;
			resultsCache.totalForQuery[query] = responseJson.total;
			resultsCache.dataForQuery[query] = responseJson.books;
			resultsCache.nextStartForQuery[query] = 10;

			dispatch(_searchResultReceived(responseJson.books));
		})
		.catch((error) => {
			console.error(error);
			LOADING[query] = false;
			resultsCache.dataForQuery[query] = undefined;

			dispatch(_searchFailed(err))
		});
}

const searchBooks = (dispatch, query, type='q') => {
	//this.setState({filter: query});
	dispatch(setSearchKeyword(query));

	let cachedResultsForQuery = resultsCache.dataForQuery[query];
	if (cachedResultsForQuery) {
		if (!LOADING[query]) {
			dispatch(_searchResultReceived(cachedResultsForQuery));
		} else {
			dispatch(_searchStarted(query));
		}
		return;
	}

	LOADING[query] = true;
	resultsCache.dataForQuery[query] = null;
	dispatch(_searchStarted(query));

	if (query.trim()) {
		_fetch(dispatch, query, 0, type);
	}
}

export const hasMore = (query) => {
	if (!resultsCache.dataForQuery[query]) {
		return true;
	}
	return (
		resultsCache.totalForQuery[query] !==
		resultsCache.dataForQuery[query].length
	);
}

const _fetchNext = (dispatch, query, start, type='q') => {
	fetch(_urlForQuery(query, start, type))
		.then((response) => response.json())
		.catch((error) => {
			console.error(error);
			LOADING[query] = false;
			dispatch(_searchFailed(error))
		})
		.then((responseJson) => {
			let booksForQuery = resultsCache.dataForQuery[query].slice();

			LOADING[query] = false;
			// We reached the end of the list before the expected number of results
			if (!responseJson.books) {
				resultsCache.totalForQuery[query] = booksForQuery.length;
			} else {
				for (let i in responseJson.books) {
					booksForQuery.push(responseJson.books[i]);
				}
				resultsCache.dataForQuery[query] = booksForQuery;
				resultsCache.nextStartForQuery[query] += 10;
			}

			dispatch(_moreSearchResultReceived(resultsCache.dataForQuery[query]));
		})
		.done();
}

const _moreBooks = (dispatch, query, type='q') => {
	if (LOADING[query]) {
		return;
	}

	LOADING[query] = true;
	dispatch(_moreStarted(query))

	let start = resultsCache.nextStartForQuery[query];
	_fetchNext(dispatch, query, start, type);
}


const _searchStarted = (filter) => ({type: SEARCH_STARTED, filter})
const _searchEnded = (filter) => ({type: SEARCH_ENDED, filter})
const _searchResultReceived = (data) => ({type: SEARCH_RESULT, data})
const _moreStarted = (filter) => ({type: MORE_STARTED, filter})
const _moreSearchResultReceived = (data) => ({type: MORE_SEARCH_RESULT, data})
const _searchFailed = (message) => ({type: SEARCH_FAILED, message})
