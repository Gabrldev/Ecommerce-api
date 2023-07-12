"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import { Heading } from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";

export const BillboardClient = () => {
  const router = useRouter();

  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Billboard (0)"
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
    </>
  );
};
