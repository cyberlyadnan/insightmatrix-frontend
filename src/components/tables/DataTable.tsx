"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Table as TanstackTable,
} from "@tanstack/react-table";

type ColumnMeta = { className?: string };

function columnMeta<TData, TValue>(column: ColumnDef<TData, TValue>): ColumnMeta | undefined {
  return (column as ColumnDef<TData, TValue> & { meta?: ColumnMeta }).meta;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Optional stable table instance hook-up for menus/toolbars */
  getTable?: (table: TanstackTable<TData>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getTable,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  getTable?.(table);

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-gray-100 bg-gray-50/80">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-4 py-3 font-black uppercase tracking-wider text-[10px] text-gray-500 ${
                    columnMeta(header.column.columnDef)?.className ?? ""
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-50">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-4 py-3 text-gray-800 ${columnMeta(cell.column.columnDef)?.className ?? ""}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
