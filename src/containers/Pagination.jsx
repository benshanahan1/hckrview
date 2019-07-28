import React from 'react';
import { connect } from 'react-redux';
import ArrowButton from '../containers/ArrowButton';
import './Pagination.css';


function Pagination(props) {
  const { currentPage } = props;

  return (
    <div className="paginationContainer">
      <ArrowButton direction="left" />
      <div className="paginationText">
        {currentPage + 1}
      </div>
      <ArrowButton direction="right" />
    </div>
  );
}


function mapStateToProps(state) {
  return {
    currentPage: state.app.currentPage,
  };
}


export default connect(mapStateToProps)(Pagination);
