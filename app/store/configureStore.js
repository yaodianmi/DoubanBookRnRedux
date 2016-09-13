'use strict'

import {
  createStore,
  applyMiddleware
}
from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import createLogger from 'redux-logger';

const logger = createLogger({
  level: 'info',
  logger: console,
  collapsed: true
});
const createStoreWithMiddleware = applyMiddleware(
  thunk, logger
)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)
  return store
}
