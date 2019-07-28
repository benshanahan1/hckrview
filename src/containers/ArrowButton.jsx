import React from 'react';
import { connect } from 'react-redux';
import {
  nextPage as actionNextPage,
  previousPage as actionPreviousPage,
} from '../redux/modules/app';
import './ArrowButton.css';


function ArrowButton(props) {
  const { direction, currentPage, nextPage, previousPage } = props;
  const symbol = (direction === 'left') ? <span>&lt;</span> : <span>&gt;</span>;
  const disabled = (direction === 'left' && currentPage <= 0);
  const handleClick = () => {
    if (disabled) return null;
    if (direction === 'left') {
      previousPage();
    } else {
      nextPage();
    }
  }

  return (
    <div className="buttonContainer" onClick={handleClick}>
      <div className="buttonText">
        { symbol }
      </div>
    </div>
  );
}


function mapStateToProps(state) {
  return {
    currentPage: state.app.currentPage,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    nextPage: () => dispatch(actionNextPage()),
    previousPage: () => dispatch(actionPreviousPage()),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ArrowButton);
