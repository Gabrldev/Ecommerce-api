"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cellAction";

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
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },{
    accessorKey: "action",
    cell: ({ row }) => <CellAction data={row.original} />,
  }
];
