"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { BillboardColumms } from "../columms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CopyIcon, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AlertModal } from "../modals/alert-modal";
import axios from "axios";
interface CelActionProps {
  data: BillboardColumms;
}
export const CellActionBillboard: React.FC<CelActionProps> = ({ data }) => {
  const router = useRouter();

  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copied",
      description: "The id was copied to the clipboard",
    });
  };

  const { mutate: onDelate, isLoading, } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast({
        title: "Billboard deleted",
        description: "The billboard was deleted successfully",
      });

      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "The billboard was not deleted",
      });
    },
  });

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onConfirm={onDelate}
        onClose={() => setIsOpen(false)}
        isLoading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <CopyIcon className="h-4 w-4 mr-2" />
            Copy id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
