
import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
  Text,
  Image,
  ListView,
  Platform,
} from 'react-native';
import debounce from 'debounce';
import dismissKeyboard from 'react-native-dismiss-keyboard';

import SearchBar from './SearchBar';
import BookCell from './BookCell';
import BookScreen from './BookScreen';


var DOUBAN_DATA = {
    'logo_uri': 'https://img3.doubanio.com/f/shire/8308f83ca66946299fc80efb1f10ea21f99ec2a5/pics/nav/lg_main_a11_1.png',
    'request_url': 'https://api.douban.com/v2/book/search',
};

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: {},
  nextStartForQuery: {},
  totalForQuery: {},
};
var LOADING = {};

class Logo extends Component{
  render(){
    var uri = DOUBAN_DATA['logo_uri'];
    return (
      <Image
        source={{uri: uri}}
        style={styles.logo}
      />
    );
  }
}

class NoBooks extends Component {
  render() {
    let text = '';
    if (this.props.filter) {
      text = `没有与"${this.props.filter}"相关的书籍`;
    } else if (!this.props.isLoading) {
      text = '还没有书籍';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noBooksText}>{text}</Text>
      </View>
    );
  }
}

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
      is8Star: false,
      queryNumber: 0,
    };
    this.searchBooks = debounce(this.searchBooks, 500);
    // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向会变为空
    // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
    this.searchBooks = this.searchBooks.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSwitchChange = this.onSwitchChange.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
  }

  componentWillMount() {
    if (this.props.tag) {
      this.searchBooks(this.props.tag.name, 'tag');
    }
  }

  getDataSource(books) {
    return this.state.dataSource.cloneWithRows(books);
  }

  _urlForQuery(query, start, type='q') {
    if (type == 'q') {
      return (
        DOUBAN_DATA['request_url'] + '?q=' + query + '&start=' + start + '&count=10'
      );
    } else if (type == 'tag') {
      return (
        DOUBAN_DATA['request_url'] + '?tag=' + query + '&start=' + start + '&count=10'
      );
    }
  }

  _fetch(query, start, type='q') {
    fetch(this._urlForQuery(query, start, type))
      .then((response) => response.json())
      .then((responseJson) => {
        LOADING[query] = false;
        resultsCache.totalForQuery[query] = responseJson.total;
        resultsCache.dataForQuery[query] = responseJson.books;
        resultsCache.nextStartForQuery[query] = 10;

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoading: false,
          dataSource: this.getDataSource(responseJson.books),
        });
      })
      .catch((error) => {
        console.error(error);
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = undefined;

        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      });
  }

  searchBooks(query, type='q') {
    this.setState({filter: query});

    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false
        });
      } else {
        this.setState({isLoading: true});
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: false,
    });

    if (query.trim()) {
      this._fetch(query, 0, type);
    } else {
      this.setState({
        dataSource: this.getDataSource([]),
      });
    }
  }

  onSearchChange(event) {
    let filter = event.nativeEvent.text.toLowerCase();
    this.searchBooks(filter);
  }

  onSwitchChange(value){
    this.setState({
      is8Star: value,
    });
  }

  _fetchNext(query, start, type='q') {
    fetch(this._urlForQuery(query, start, type))
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
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

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  }

  onEndReached() {
    let query = this.state.filter;

    if (!this.hasMore() || this.state.isLoadingTail) {
      // We're already fetching or have all the elements so noop
      return;
    }

    if (LOADING[query]) {
      return;
    }

    LOADING[query] = true;
    this.setState({
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: true,
    });

    let start = resultsCache.nextStartForQuery[query];
    if (this.props.tag) {
      this._fetchNext(query, start, 'tag');
    } else {
      this._fetchNext(query, start);
    }
  }

  selectBook(book) {
    if (Platform.OS === 'ios') {
      let navigation = this.props.navigator;
      this.props.navigator.push({
        title: book.title,
        component: BookScreen,
        passProps: {
          book,
          navigation
        },
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: book.title,
        name: 'book',
        book: book,
      });
    }
  }

  hasMore() {
    let query = this.state.filter;
    if (!resultsCache.dataForQuery[query]) {
      return true;
    }
    return (
      resultsCache.totalForQuery[query] !==
      resultsCache.dataForQuery[query].length
    );
  }

  renderFooter() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return <ActivityIndicator style={styles.scrollSpinner} />;
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    let style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  }

  renderRow(book, sectionID, rowID, highlightRowFunc) {
    if(this.state.is8Star && book.rating.average < 8.0){
      return false;
    } else {
      return (
        <BookCell
          key={book.id}
          onSelect={() => this.selectBook(book)}
          onHighlight={() => highlightRowFunc(sectionID, rowID)}
          onUnhighlight={() => highlightRowFunc(null, null)}
          book={book}
        />
      );
    }
  }

  render() {
    console.log(this.state);
    console.log(resultsCache);
    let content = this.state.dataSource.getRowCount() === 0 ?
      <NoBooks
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        is8Star={this.state.is8Star}
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={styles.container}>
        <Logo />
        <SearchBar
          filter={this.state.filter}
          is8Star={this.state.is8Star}
          onSearchChange={this.onSearchChange}
          onSwitchChange={this.onSwitchChange}
          isLoading={this.state.isLoading}
          onFocus={() =>
            this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
        />
        <View style={styles.separator} />
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noBooksText: {
    marginTop: 80,
    color: '#888888',
  },
  logo: {
    width: 153,
    height: 30,
    marginTop: 70,
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});
