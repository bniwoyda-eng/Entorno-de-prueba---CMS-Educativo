import { useState } from 'react';
import { IPaginationParams } from '../common/interfaces';

interface UsePaginationOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
}

interface UsePaginationReturn {
  // State
  page: number;
  rowsPerPage: number;
  
  // Params for API calls
  paginationParams: IPaginationParams;
  
  // Navigation functions
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (newPage: number) => void;
  changeRowsPerPage: (newRowsPerPage: number) => void;
  
  // Reset function
  resetPagination: () => void;
}

export const usePagination = (options: UsePaginationOptions = {}): UsePaginationReturn => {
  const { initialPage = 1, initialRowsPerPage = 10 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const goToNextPage = () => {
    setPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (newPage: number) => {
    setPage(Math.max(newPage, 1));
  };

  const changeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };

  const resetPagination = () => {
    setPage(initialPage);
    setRowsPerPage(initialRowsPerPage);
  };

  return {
    page,
    rowsPerPage,
    paginationParams: {
      page,
      limit: rowsPerPage,
    },
    goToNextPage,
    goToPreviousPage,
    goToPage,
    changeRowsPerPage,
    resetPagination,
  };
}; 