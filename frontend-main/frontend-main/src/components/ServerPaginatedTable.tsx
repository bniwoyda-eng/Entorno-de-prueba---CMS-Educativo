import React from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  page: number;
  rowsPerPage: number;
  totalItems: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onRowsPerPageChange: (newLimit: number) => void;
  onRowClick?: (row: T) => void;
}

export function ServerPaginatedTable<T>({
  data,
  columns,
  page,
  rowsPerPage,
  totalItems,
  onNextPage,
  onPreviousPage,
  onRowsPerPageChange,
  onRowClick,
}: Props<T>) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="w-full">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 cursor-pointer"
              onDoubleClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 text-sm text-gray-800">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {Math.min((page - 1) * rowsPerPage + 1, totalItems)} to{" "}
          {Math.min(page * rowsPerPage, totalItems)} of {totalItems} items
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <button
              disabled={page === 1}
              onClick={onPreviousPage}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={onNextPage}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
