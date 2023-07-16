"use client";

import { ColumnDef } from "@tanstack/react-table";

export type CategoryColumms = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const CategoryColumns: ColumnDef<CategoryColumms>[] = [
  {
    accessorKey: "label",
    header: "Name",
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  }
];
