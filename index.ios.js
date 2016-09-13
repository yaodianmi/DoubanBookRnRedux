'use strict'

/**
 * Sample React Native and Redux
 * https://github.com/yaodianmi/DoubanBookRnRedux
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './app/store/configureStore';
import App from './app/app';

const store = configureStore()

class DoubanBookRnRedux extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('DoubanBookRnRedux', () => DoubanBookRnRedux);
