
import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import SearchScreen from './SearchScreen';

export default class BookScreen extends Component {
  constructor(props) {
    super(props);
  }

  _tagsToText() {
    let tgs = [];
    let tags = this.props.book.tags
    for (let i in tags) {
      tgs.push(tags[i].name);
    }
    return (
      `标签: ${tgs.join('|')}`
    )
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          <Image
            source={{uri: this.props.book.image}}
            style={styles.detailsImage}
          />
          <View style={styles.rightPane}>
            <Text style={styles.movieTitle}>{this.props.book.title}</Text>
            <Text>{this.props.book.author}</Text>
            <View style={styles.mpaaWrapper}>
              <Text style={styles.mpaaText}>
                {this.props.book.rating.average}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
        <Text>
          {this.props.book.summary}
        </Text>
        <View style={styles.separator} />
        <Tags
          key={this.props.book.id}
          tags={this.props.book.tags}
          navigator={this.props.navigator}
        />
      </ScrollView>
    );
  }
}

class Tags extends Component {
  constructor(props) {
    super(props);
  }

  selectTag(tag) {
    this.props.navigator.push({
      name: 'tag',
      title: tag.title,
      tag: tag.name
    });
  }

  render() {
    if (!this.props.tags) {
      return null;
    }

    return (
      <View>
        {this.props.tags.map(tag =>
          <TagCell
            key={tag.name}
            onSelect={() => this.selectTag(tag)}
            tag={tag}
          />
        )}
      </View>
    );
  }
}

class TagCell extends Component {
  render() {
    let TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View>
        <TouchableElement
          key={this.props.tag.name}
          onPress={this.props.onSelect}>
          <View style={styles.mpaaWrapper}>
            <Text
              key={this.props.tag.name}
              style={styles.mpaaText}>
              {this.props.tag.name}
            </Text>
          </View>
        </TouchableElement>
      </View>
    )
  }
}


var styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  rightPane: {
    justifyContent: 'space-between',
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  rating: {
    marginTop: 10,
  },
  ratingTitle: {
    fontSize: 14,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '500',
  },
  mpaaWrapper: {
    alignSelf: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 3,
    marginVertical: 5,
  },
  mpaaText: {
    fontFamily: 'Palatino',
    fontSize: 13,
    fontWeight: '500',
    color: 'green',
  },
  mainSection: {
    flexDirection: 'row',
  },
  detailsImage: {
    width: 134,
    height: 200,
    backgroundColor: '#eaeaea',
    marginRight: 10,
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
});
