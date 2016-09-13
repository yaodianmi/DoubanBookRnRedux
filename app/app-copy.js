'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  NavigatorIOS,
  Navigator
} from 'react-native';
import {
    bindActionCreators
} from 'redux';
import {
    connect
} from 'react-redux';
import { SearchScreen } from './components/SearchScreen';
//import Root from './containers/App';
import * as actionCreators from './actions';


export default class App extends Component {
  render() {
    console.log(this.props.search);
    const { books, filter, isLoading, is8Star, isLoadingTail} = this.props.search;

    /*if (books.length > 0 || filter || isLoading || is8Star || isLoadingTail) {
      return this._renderReplace()
    }*/

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Book',
          component: SearchScreen,
          passProps: {
            search: this.props.search,
            actions: this.props.actions,
          },
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

/*const mapStateToProps = (state) => {
  return {
    search: state.search,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)*/
