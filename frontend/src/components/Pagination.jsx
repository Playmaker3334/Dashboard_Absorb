// Pagination.jsx
import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;
  
  const { page, totalPages, prevPage, nextPage } = pagination;
  
  // Create page items
  const pageItems = [];
  
  // Previous button
  pageItems.push(
    <BSPagination.Prev 
      key="prev"
      onClick={() => prevPage && onPageChange(prevPage)}
      disabled={!prevPage}
    />
  );
  
  // Show limited page numbers with ellipsis
  const maxPagesToShow = 5;
  const halfMaxPages = Math.floor(maxPagesToShow / 2);
  
  let startPage = Math.max(1, page - halfMaxPages);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  // First page
  if (startPage > 1) {
    pageItems.push(
      <BSPagination.Item 
        key={1} 
        onClick={() => onPageChange(1)}
      >
        1
      </BSPagination.Item>
    );
    
    if (startPage > 2) {
      pageItems.push(<BSPagination.Ellipsis key="start-ellipsis" disabled />);
    }
  }
  
  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    pageItems.push(
      <BSPagination.Item 
        key={i} 
        active={i === page}
        onClick={() => i !== page && onPageChange(i)}
      >
        {i}
      </BSPagination.Item>
    );
  }
  
  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageItems.push(<BSPagination.Ellipsis key="end-ellipsis" disabled />);
    }
    
    pageItems.push(
      <BSPagination.Item 
        key={totalPages} 
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </BSPagination.Item>
    );
  }
  
  // Next button
  pageItems.push(
    <BSPagination.Next 
      key="next"
      onClick={() => nextPage && onPageChange(nextPage)}
      disabled={!nextPage}
    />
  );
  
  return (
    <div className="d-flex justify-content-center mt-4">
      <BSPagination>{pageItems}</BSPagination>
      
      {/* Eliminamos la parte de mostrar usuarios totales */}
    </div>
  );
};

export default Pagination;