import { UseQueryOptions } from '@tanstack/react-query';
import { IPaginationResponse, IPaginationParams } from '../common/interfaces';
import { usePagination } from './usePagination';
import { useGenericPaginatedQuery } from './useQueries';

interface UsePaginatedQueryOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
}

interface UsePaginatedQueryReturn<T> {
  // Data
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Pagination state
  page: number;
  rowsPerPage: number;
  
  // Pagination functions
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (newPage: number) => void;
  changeRowsPerPage: (newRowsPerPage: number) => void;
  resetPagination: () => void;
  
  // Table props (ready to spread into ServerPaginatedTable)
  tableProps: {
    data: T[];
    page: number;
    rowsPerPage: number;
    totalItems: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onRowsPerPageChange: (newLimit: number) => void;
  };
}

export const usePaginatedQuery = <T>(
  queryKey: string,
  fetchFn: (params: IPaginationParams) => Promise<IPaginationResponse<T>>,
  options: UsePaginatedQueryOptions & Partial<UseQueryOptions<IPaginationResponse<T>, Error>> = {}
): UsePaginatedQueryReturn<T> => {
  const { initialPage, initialRowsPerPage, ...queryOptions } = options;
  
  const pagination = usePagination({
    initialPage,
    initialRowsPerPage,
  });

  const { data: response, isLoading, isError, error } = useGenericPaginatedQuery<T>(
    queryKey,
    fetchFn,
    pagination.paginationParams,
    queryOptions
  );

  const tableProps = {
    data: response?.data || [],
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    totalItems: response?.meta.totalItems || 0,
    onNextPage: pagination.goToNextPage,
    onPreviousPage: pagination.goToPreviousPage,
    onRowsPerPageChange: pagination.changeRowsPerPage,
  };

  return {
    data: response?.data || [],
    meta: response?.meta,
    isLoading,
    isError,
    error,
    page: pagination.page,
    rowsPerPage: pagination.rowsPerPage,
    goToNextPage: pagination.goToNextPage,
    goToPreviousPage: pagination.goToPreviousPage,
    goToPage: pagination.goToPage,
    changeRowsPerPage: pagination.changeRowsPerPage,
    resetPagination: pagination.resetPagination,
    tableProps,
  };
}; 