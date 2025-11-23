import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Tax } from "@/types/tax";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditTaxModal } from "./EditTaxModal";

const columnHelper = createColumnHelper<Tax>();

interface TaxTableProps {
  data: Tax[];
  onUpdate: (id: string, data: Partial<Tax>) => Promise<void>;
}

export const TaxTable = ({ data, onUpdate }: TaxTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);

  const columns = [
    columnHelper.accessor("name", {
      header: "Tax Name",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rate", {
      header: "Rate",
      cell: (info) => (
        <div className="font-medium text-primary">{info.getValue()}%</div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditingTax(row.original)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-table-header">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-border hover:bg-table-row-hover transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTax && (
        <EditTaxModal
          tax={editingTax}
          open={!!editingTax}
          onClose={() => setEditingTax(null)}
          onSave={onUpdate}
        />
      )}
    </>
  );
};
