import React from 'react';
import ReactPaginate from 'react-paginate';

export default function BannerPagination (props) {
  const {rowsPerPage, count, onChangePage, page} = props;
  const pageCount = Math.ceil(count / rowsPerPage);

  return (
    <ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onChangePage}
      breakLabel={"..."}
      breakClassName={"break-me"}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
      forcePage={page}
    />
  )
}
