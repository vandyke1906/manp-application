import React, { useMemo, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from '../ui/table';
import { EyeIcon, PencilIcon, TrashBinIcon } from '../../icons';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import Label from '../form/Label';

const ROWS_OPTIONS = [10, 20, 50, 100].map(val => ({ value: val, label: val }));

const GenericTable = ({
  tableData = [],
  columnHeaders = [],
  onEdit,
  onDelete,
  onView,
  totalPages = 1,
  onPrevious = () => {},
  onNext = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => (
    tableData.filter(row =>
      columnHeaders.some(header =>
        row[header.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  ), [searchTerm, tableData, columnHeaders]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const { key, direction } = sortConfig;
    return [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      return direction === 'asc'
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const renderActions = (row) => {
    const editHandler = onEdit?.(row);
    const deleteHandler = onDelete?.(row);
    const viewHandler = onView;

    return (
      <div className="flex items-center justify-center gap-1">
        {viewHandler && (
          <Button
            size="sm"
            variant=""
            startIcon={<EyeIcon />}
            onClick={() => viewHandler(row)}
          />
        )}
        {editHandler && (
          <Button
            size="sm"
            variant=""
            startIcon={<PencilIcon />}
            onClick={editHandler}
          />
        )}
        {deleteHandler && (
          <Button
            size="sm"
            variant=""
            startIcon={<TrashBinIcon />}
            onClick={() => deleteHandler(row)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search + Page Size */}
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search..."
          className="w-64 px-3 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="rowsPerPage">Rows per page:</Label>
          <Select
            defaultValue={rowsPerPage}
            options={ROWS_OPTIONS}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
              <TableRow>
                {columnHeaders.map(({ key, value }, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    onClick={() => handleSort(key)}
                    className={`cursor-pointer px-5 py-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${
                      ['action', 'id'].includes(value.toLowerCase()) ? 'text-center' : 'text-start'
                    }`}
                  >
                    {value}
                    {sortConfig.key === key && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.length ? paginatedData.map((row, idx) => (
                <TableRow key={row.id || idx}>
                  {columnHeaders.map(({ key, value }, index) => (
                    <TableCell
                      key={index}
                      className={`px-4 py-3 text-gray-500 text-sm ${
                        ['action', 'id'].includes(value.toLowerCase()) ? 'text-center' : 'text-start'
                      }`}
                    >
                      {value.toLowerCase() === 'action' ? renderActions(row) : row[key] ?? 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={columnHeaders.length} className="text-center py-4 text-gray-400">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="space-x-2">
          <Button size="sm" disabled={currentPage === 1} onClick={() => {
            onPrevious(currentPage);
            setCurrentPage(p => p - 1);
          }}>Prev</Button>
          <Button size="sm" disabled={currentPage === totalPages} onClick={() => {
            onNext(currentPage);
            setCurrentPage(p => p + 1);
          }}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default GenericTable;
