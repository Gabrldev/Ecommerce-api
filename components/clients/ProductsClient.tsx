"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "../ui/dataTable";
import { ApiList } from "../ui/apiList";
import { ProductsColumms } from "../columms/Columms.products";

interface ProductsClientProps {
  data: ProductsColumms[];
}

export const ProductClient = ({ data }: ProductsClientProps) => {
  const router = useRouter();

  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage your products for your store."
        />

        <Button
          onClick={() => {
            router.push(`/${params.storeId}/products/new`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={ProductsColumms} data={data} searchKey="label" />
      <Heading title="API" description="Api calls for products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productsId" />
    </>
  );
};
