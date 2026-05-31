'use client';

import React from 'react';
import Button from '@/components/shared/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, index?: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr className="data-table-header-row">
            {columns.map((column) => (
              <th key={column.key} className="data-table-header-cell">
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="data-table-header-cell">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index} className="data-table-row">
              {columns.map((column) => (
                <td key={column.key} className="data-table-cell">
                  {column.render
                    ? column.render(row[column.key], row, index)
                    : row[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="data-table-cell">
                  <div className="data-table-actions">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(row)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-sm)' }}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(row)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-sm)' }}
                        title="Delete"
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

