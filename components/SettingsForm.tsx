"use client";
import { Store } from "@prisma/client";
import { Heading } from "./ui/heading";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangeNameStoreRequest,
  ChangeNameStoreValidator,
} from "@/lib/validators/changeNameStore";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { AlertModal } from "./modals/alert-modal";
import { useState } from "react";
import { ApiAlert } from "./ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface Props {
  initialData: Store;
}

function SettingsForm({ initialData }: Props) {
  const { register, handleSubmit } = useForm<ChangeNameStoreRequest>({
    resolver: zodResolver(ChangeNameStoreValidator),
    defaultValues: initialData,
  });

  const params = useParams();

  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const origin = useOrigin();

  const { mutate: changeNameStore, isLoading } = useMutation({
    mutationFn: async ({ name }: ChangeNameStoreRequest) => {
      const payload = {
        name,
      };
      const { data } = await axios.patch(
        `/api/stores/${params.storeId}`,
        payload
      );
      return data;
    },

    onSuccess: () => {
      router.refresh();
      toast({
        title: "Store name changed successfully",
        description: "The store name has been changed successfully",
      });
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Unauthorized",
            description: "You are not authorized to perform this action",
            variant: "destructive",
          });
        }
        if (error.response?.status === 404) {
          return toast({
            title: "Not found",
            description: "This store does not exist",
            variant: "destructive",
          });
        }

        if (error.response?.status === 400) {
          return toast({
            title: "Bad request",
            description: "The request was invalid",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error",
        description: "An error occurred while trying to change the name",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteStore, isLoading: isLoadingDelate } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/stores/${params.storeId}`);
      return data;
    },

    onSuccess: () => {
      toast({
        title: "Store deleted successfully",
        description: "The store has been deleted successfully",
      });
      router.refresh();
      router.push("/");
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Unauthorized",
            description: "You are not authorized to perform this action",
            variant: "destructive",
          });
        }
        if (error.response?.status === 404) {
          return toast({
            title: "Not found",
            description: "This store does not exist",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error",
        description: "An error occurred while trying to delete the store",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteStore();
        }}
        isLoading={isLoadingDelate}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage your store settings" />

        <Button
          className="bg-red-500 hover:bg-red-600"
          size="xs"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      <Separator />

      <form
        onSubmit={handleSubmit((e) => changeNameStore(e))}
        className="space-y-8 w-full"
      >
        <div className="grid grid-cols-3 gap-8">
          <Label htmlFor="name">
            Name store
            <Input
              id="name"
              {...register("name")}
              placeholder="Name store"
              className="mt-2"
            />
          </Label>
        </div>
        <Button type="submit" className="col-span-2" isLoading={isLoading}>
          Save changes
        </Button>
      </form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
}
export default SettingsForm;
