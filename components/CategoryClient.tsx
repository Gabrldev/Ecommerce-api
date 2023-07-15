"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import { Heading } from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "./ui/dataTable";
import { ApiList } from "./ui/apiList";
import { CategoryColumms, CategoryColumns } from "./Columms.category";

interface CategoryClientProps {
  data: CategoryColumms[];
}

export const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();

  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage your categories for your store."
        />

        <Button
          onClick={() => {
            router.push(`/${params.storeId}/categories/new`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={CategoryColumns} data={data} searchKey="name" />
      <Heading title="API" description="Api calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoriesId" />
    </>
  );
};
