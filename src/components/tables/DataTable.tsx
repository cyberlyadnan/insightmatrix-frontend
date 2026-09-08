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
    <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-xs text-slate-800">
        <thead className="bg-[#091428] text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-3 py-2 font-extrabold uppercase tracking-wider text-[10px] text-slate-100 whitespace-nowrap ${
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
        <tbody className="divide-y divide-slate-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-3 py-1.5 text-xs text-slate-800 align-middle whitespace-nowrap ${columnMeta(cell.column.columnDef)?.className ?? ""}`}
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
