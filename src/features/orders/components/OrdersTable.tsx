import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
  type Row,
} from '@tanstack/react-table';
import type { Order } from '../types';
import { formatCurrency, formatDateTime, exportToCsv } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface OrdersTableProps {
  data: Order[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  currentSort: { column: string; direction: 'asc' | 'desc' };
}

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: '#f59e0b',
  paid: '#10b981',
  shipped: '#3b82f6',
  cancelled: '#ef4444',
  refunded: '#6b7280',
};

export default function OrdersTable({
  data,
  isLoading,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onSort,
  currentSort,
}: OrdersTableProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('orders-column-visibility');
    return stored ? JSON.parse(stored) : {};
  });

  const navigate = useNavigate();

  // Define columns
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableHiding: false,
      },
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: (info) => (
          <button
            onClick={() => navigate(`/orders/${info.getValue()}`)}
            style={{
              background: 'none',
              border: 'none',
              color: '#646cff',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {info.getValue() as string}
          </button>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
      },
      {
        accessorKey: 'customerEmail',
        header: 'Email',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as Order['status'];
          return (
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white',
                backgroundColor: STATUS_COLORS[status],
                textTransform: 'capitalize',
              }}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => {
          const row = info.row.original;
          return formatCurrency(info.getValue() as number, row.currency);
        },
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        accessorKey: 'itemsCount',
        header: 'Items',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: (info) => formatDateTime(info.getValue() as string),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === 'function' ? updater(columnVisibility) : updater;
      setColumnVisibility(newVisibility);
      localStorage.setItem('orders-column-visibility', JSON.stringify(newVisibility));
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows;

  const handleExportSelected = () => {
    const selectedOrders = selectedRows.map((row) => row.original);
    exportToCsv(
      selectedOrders,
      `orders-export-${new Date().toISOString().split('T')[0]}.csv`,
      [
        { key: 'id', label: 'Order ID' },
        { key: 'customerName', label: 'Customer' },
        { key: 'customerEmail', label: 'Email' },
        { key: 'status', label: 'Status' },
        { key: 'total', label: 'Total' },
        { key: 'currency', label: 'Currency' },
        { key: 'country', label: 'Country' },
        { key: 'itemsCount', label: 'Items' },
        { key: 'createdAt', label: 'Created' },
      ]
    );
  };

  const handleSort = (columnId: string) => {
    if (columnId === currentSort.column) {
      onSort(columnId, currentSort.direction === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(columnId, 'desc');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <LoadingSpinner size="lg" />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading orders...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '1.25rem', color: '#666' }}>No orders found</p>
        <p style={{ marginTop: '0.5rem', color: '#999' }}>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div>
          {selectedRows.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                {selectedRows.length} row(s) selected
              </span>
              <button onClick={handleExportSelected} className="secondary">
                Export to CSV
              </button>
            </div>
          )}
        </div>

        {/* Column visibility */}
        <div style={{ position: 'relative' }}>
          <details>
            <summary style={{ cursor: 'pointer', userSelect: 'none' }}>Columns</summary>
            <div
              style={{
                position: 'absolute',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 10,
                minWidth: '150px',
              }}
            >
              {table
                .getAllLeafColumns()
                .filter((col) => col.id !== 'select')
                .map((column) => (
                  <label
                    key={column.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {column.id}
                  </label>
                ))}
            </div>
          </details>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = ['createdAt', 'total', 'customerName'].includes(
                    header.column.id
                  );
                  const isSorted = currentSort.column === header.column.id;

                  return (
                    <th
                      key={header.id}
                      onClick={() => canSort && handleSort(header.column.id)}
                      style={{
                        cursor: canSort ? 'pointer' : 'default',
                        userSelect: 'none',
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort && (
                        <span style={{ marginLeft: '0.5rem' }}>
                          {isSorted ? (currentSort.direction === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#666' }}>Rows per page:</span>
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}{' '}
          orders
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => onPageChange(1)} disabled={page === 1} className="secondary">
            First
          </button>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="secondary">
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="secondary"
          >
            Next
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="secondary"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
