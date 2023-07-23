"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Product } from "@prisma/client";
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
import { Button } from "../ui/Button"; 
import ImageUpload from "../ui/ImageUpload";
import {
  productsRequest,
  productsValidator,
} from "@/lib/validators/products";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface ProductFormProps {
  initialData: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit products" : "Create products";
  const description = initialData ? "Edit a products." : "Add a new products";
  const action = initialData ? "Save changes" : "Create";
  const mensaje = initialData ? "products saved" : "products created";
  const mensajeDescription = initialData
    ? "Update products sucesss"
    : "Create products sucesss";
  const errorMensaje = initialData
    ? "Error updating products"
    : "Error creating products";

  const form = useForm<productsRequest>({
    resolver: zodResolver(productsValidator),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutate: onSubmit, isLoading: isLoadingCreate } = useMutation({
    mutationFn: async (data: productsRequest) => {
      const payload = {
        ...data,
      };
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/productss/${initialData.id}`,
          payload
        );
      } else {
        await axios.post(`/api/${params.storeId}/productss`, payload);
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/productss`);
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
        `/api/${params.storeId}/productss/${params.productsId}`
      );
      return res.data;
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/productss`);
      return toast({
        title: "products deleted",
        description: "products deleted sucesss",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Error",
            description: "You don't have permissions to delete this products",
            variant: "destructive",
          });
        }
        if (error.response?.status === 400) {
          return toast({
            title: "Error",
            description:
              "You can't delete this products because it has products",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Error",
        description: "Error deleting products",
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
                      placeholder="products label"
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
