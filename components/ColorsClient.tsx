"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import { Heading } from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "./ui/dataTable";
import { ApiList } from "./ui/apiList";
import { SizeColumms } from "./Columms.sizes";

interface ColorsProps {
  data: SizeColumms[];
}

export const ColorsClient = ({ data }: ColorsProps) => {
  const router = useRouter();

  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage your colors for your store."
        />

        <Button
          onClick={() => {
            router.push(`/${params.storeId}/colors/new`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={SizeColumms} data={data} searchKey="name" />
      <Heading title="API" description="Api calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};
