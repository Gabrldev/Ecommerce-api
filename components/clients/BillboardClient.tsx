"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumms, columns } from "../columms";
import { DataTable } from "../ui/dataTable";
import { ApiList } from "../ui/apiList";

interface BillboardClientProps {
  data: BillboardColumms[];
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();

  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage your billboard for your store."
        />

        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards/new`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="Api calls for Billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billbardId" />
    </>
  );
};
