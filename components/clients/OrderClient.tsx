"use client";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { DataTable } from "../ui/dataTable";
import { OrderColumms,Columns } from "../columms/Columms.order";

interface OrderClientProps {
  data: OrderColumms[]
}

export const OrderClient = ({ data }: OrderClientProps) => {

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage your Orders for your store."
        />
      </div>
      <Separator />
      <DataTable columns={Columns} data={data} searchKey="name" />
    </>
  );
};
