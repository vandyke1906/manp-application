import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EyeIcon, PencilIcon, TrashBinIcon } from '../../icons';
import Button from '../ui/button/Button';

const GenericTable = ({tableData = {}, columnHeaders = [], onEdit, onDelete, onView }) => {

  const renderData = ({row, header}) => {
    const data = row[header.key];
    if(header.value.toLowerCase() === "action")
      return (
        <div className="flex items-center justify-center">
          {!!onView && <Button size="sm" variant="" startIcon={<EyeIcon/>} onClick={() => onView(row)} />}
          {!!onEdit && <Button size="sm" variant="" startIcon={<PencilIcon/>} onClick={() => onEdit(row)} />}
          {!!onDelete && <Button size="sm" variant="" startIcon={<TrashBinIcon/>}   onClick={() => onDelete(row)} />}
        </div>
      )
    else
      return (
        <>
          {data || "N/A"}
        </>
    )
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columnHeaders.map((header, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${["action", "id"].includes(header.value.toLowerCase()) ? "text-center" : "text-start"}`}
                >
                  {header.value}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((row) => (
              <TableRow key={row.id}>
                {columnHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    className={`px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400  ${["action", "id"].includes(header.value.toLowerCase()) ? "text-center" : "text-start"}`}
                  >
                    {renderData({ row, header })}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default GenericTable