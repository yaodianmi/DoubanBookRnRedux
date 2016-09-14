
import React, { Component } from 'react';
import {
  ActivityIndicator,
  TextInput,
  StyleSheet,
  View,
  Switch,
  Text,
} from 'react-native';

export default class SearchBar extends Component {
  render() {
    let placeholderText = "请输入搜索关键词..."
    if (this.props.tag) {
      placeholderText = `${this.props.tag}`;
    }

    return (
      <View style={styles.searchBar}>
        <TextInput
          ref="searchBar"
          autoCapitalize="none"
          autoCorrect={false}
          onChange={this.props.onSearchChange}
          placeholder={placeholderText}
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
        />
        <ActivityIndicator
          animating={this.props.isLoading}
          style={styles.spinner}
        />
        <View>
          <Switch
            onValueChange={value => this.props.onSwitchChange(value)}
            value={this.props.is8Star} />
          <Text>只显示8星以上</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 15,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  spinner: {
    width: 30,
  },
});
