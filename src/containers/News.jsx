import React from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { connect } from 'react-redux';
import {
  fetchPage,
  clearItems as actionClearItems
} from '../redux/modules/app';
import Pagination from './Pagination';
import './News.css';

dayjs.extend(relativeTime);


class News extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  componentDidUpdate(prevProps) {
    const {
      currentPage,
      fetchData,
      clearItems,
      category,
    } = this.props;

    if (currentPage !== prevProps.currentPage) {
      clearItems();
      fetchData(category, currentPage);
    }
  }

  render() {
    const { items, loading, error, itemError } = this.props;

    if (loading) {
      return <p>Please wait, loading news...</p>;
    }

    if (error || itemError ) {
      return (
        <div className="error">
          <div className="title">
            Error
          </div>
          <div className="caption">
            The following error(s) occurred:
          </div>
          <div className="text">
            { error && error.toString() }
          </div>
          <div className="text">
            { itemError && itemError.toString() }
          </div>
        </div>
      );
    }

    // Sort items list by date.
    const sortedItems = _.sortBy(items, o => o.time).reverse();

    return (
      <div className="container">
        {
          sortedItems.map(item => (
            <div key={item.id} className="item">
              <div className="title">
                <a href={item.url}>
                  { item.title }
                </a>
              </div>
              <div className="score">Score: { item.score }</div>
              <div className="spacer">|</div>
              <div className="time">
                { dayjs(item.time * 1000).from(dayjs()) }
              </div>
            </div>
          ))
        }
        <Pagination />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    items: state.app.items,
    loading: state.app.loading,
    error: state.app.error,
    itemError: state.app.itemError,
    currentPage: state.app.currentPage,
    category: state.app.category,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    fetchData: (category, page) => dispatch(fetchPage(category, page)),
    clearItems: () => dispatch(actionClearItems()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(News);
