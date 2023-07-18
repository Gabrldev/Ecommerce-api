"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActionBillboard } from "./CellActionBillboard";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumms = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumms>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "action",
    cell: ({ row }) => <CellActionBillboard data={row.original} />,
  },
];
