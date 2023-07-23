"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Size } from "@prisma/client";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ColorRequest, colorValidator } from "@/lib/validators/color";

interface SizeFormProps {
  initialData: Size | null;
}

export const ColorForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a colors." : "Add a new color";
  const action = initialData ? "Save changes" : "Create";
  const mensaje = initialData ? "Color saved" : "Color created";
  const mensajeDescription = initialData
    ? "Update color sucesss"
    : "Create color sucesss";
  const errorMensaje = initialData
    ? "Error updating color"
    : "Error creating color";

  const form = useForm<ColorRequest>({
    resolver: zodResolver(colorValidator),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutate: onSubmit, isLoading: isLoadingCreate } = useMutation({
    mutationFn: async (data: ColorRequest) => {
      const payload = {
        ...data,
      };
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${initialData.id}`,
          payload
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, payload);
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      return toast({
        title: mensaje,
        description: mensajeDescription,
      });
    },
    onError: (error) => {
      return toast({
        title: "Error",
        description: errorMensaje,
        variant: "destructive",
      });
    },
  });

  const { mutate: onDelete, isLoading: isLoadingDelate } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      return res.data;
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      return toast({
        title: "Color deleted",
        description: "Color deleted sucesss",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Error",
            description: "You don't have permissions to delete this color",
            variant: "destructive",
          });
        }
        if (error.response?.status === 400) {
          return toast({
            title: "Error",
            description: "You can't delete this color because it has products",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Error",
        description: "Error deleting color",
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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingCreate}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                    <Input
                      disabled={isLoadingCreate}
                      placeholder="Color  value"
                      {...field}
                    />
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: field.value }}
                    />
                    </div>
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
