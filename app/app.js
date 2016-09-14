'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Navigator,
  Platform,
  TouchableOpacity
} from 'react-native';
import {
    connect
} from 'react-redux';

import SearchScreenRoot from './containers/App';
import BookScreen from './components/BookScreen';


const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (index === 0) {
    	return null
    }

    const previousRoute = navState.routeStack[index - 1]
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={styles.navBarText}>
          &laquo; {(index === 1)  ? '图书详情' : '返回'}
        </Text>
      </TouchableOpacity>
    )
  },

  RightButton(route, navigator, index, navState) {
  	return null
  },

  Title(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    )
  }
}

export default class App extends Component {
  renderScene(route, navigator){
    if(route.name == 'book_detail') {
      return <BookScreen book={route.book} navigator={navigator}/>
    } else {
      return <SearchScreenRoot navigator={navigator} tag={route.tag}/>;
    }
  }

  render(){
    return (
      <Navigator
        initialRoute={{name:'home', title:'首页', tag:'灵魂幸存者'}}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            style={styles.navBar}
            routeMapper={NavigationBarRouteMapper} />
        }
        configureScene={(route, routeStack) => Navigator.SceneConfigs.FadeAndroid}
        />
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
    height:50
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
});
