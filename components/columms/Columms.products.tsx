"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActionProduct } from "../cellActions/CellActionProduct";

export type ProductsColumms = {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  color: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const ProductsColumms: ColumnDef<ProductsColumms>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        {row.original.color}
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <CellActionProduct data={row.original} />,
  },
];
