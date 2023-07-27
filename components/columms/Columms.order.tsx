"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColumms = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const Columns: ColumnDef<OrderColumms>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "isPaid"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
