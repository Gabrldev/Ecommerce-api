"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActionSize } from "./CellActionSize";

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
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({ row }) => <CellActionSize data={row.original} />,
  },
];
