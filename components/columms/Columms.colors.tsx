"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActionColor } from "../cellActions/CellActionColor"; 

export type ColorColumms = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const ColorsColumms: ColumnDef<ColorColumms>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({ row }) => <CellActionColor data={row.original} />,
  },
];
