'use strict'

import {
    bindActionCreators
} from 'redux';
import {
    connect
} from 'react-redux';

import * as actionCreators from '../actions';
import SearchScreen from '../components/SearchScreen';


const mapStateToProps = (state) => {
  return {
    search: state.search,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)
