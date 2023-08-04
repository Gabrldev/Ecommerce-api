"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "../ui/button"; 
import ImageUpload from "../ui/ImageUpload";
import {
  BillboardRequest,
  BillboardValidator,
} from "@/lib/validators/billboard";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard." : "Add a new billboard";
  const action = initialData ? "Save changes" : "Create";
  const mensaje = initialData ? "Billboard saved" : "Billboard created";
  const mensajeDescription = initialData
    ? "Update billboard sucesss"
    : "Create billboard sucesss";
  const errorMensaje = initialData
    ? "Error updating billboard"
    : "Error creating billboard";

  const form = useForm<BillboardRequest>({
    resolver: zodResolver(BillboardValidator),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutate: onSubmit, isLoading: isLoadingCreate } = useMutation({
    mutationFn: async (data: BillboardRequest) => {
      const payload = {
        ...data,
      };
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${initialData.id}`,
          payload
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, payload);
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      return toast({
        title: mensaje,
        description: mensajeDescription,
      });
    },
    onError: (error) => {
      return toast({
        title: "Error",
        description: errorMensaje,
        variant: initialData ? "default" : "destructive",
      });
    },
  });

  const { mutate: onDelete, isLoading: isLoadingDelate } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      return res.data;
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      return toast({
        title: "Billboard deleted",
        description: "Billboard deleted sucesss",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Error",
            description: "You don't have permissions to delete this billboard",
            variant: "destructive",
          });
        }
        if (error.response?.status === 400) {
          return toast({
            title: "Error",
            description:
              "You can't delete this billboard because it has products",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Error",
        description: "Error deleting billboard",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoadingDelate}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            isLoading={isLoadingDelate}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="space-y-8 w-full"
        >
          <FormField
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoadingCreate}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingCreate}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button isLoading={isLoadingCreate} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
