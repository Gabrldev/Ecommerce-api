"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Billboard, Category } from "@prisma/client";
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
import { Button } from "./ui/Button";
import { CategoryRequest, CategoryValidator } from "@/lib/validators/category";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category." : "Add a new Category";
  const action = initialData ? "Save changes" : "Create";
  const mensaje = initialData ? "Category saved" : "Category created";
  const mensajeDescription = initialData
    ? "Update Category sucesss"
    : "Create Category sucesss";
  const errorMensaje = initialData
    ? "Error updating Category"
    : "Error creating Category";

  const form = useForm<CategoryRequest>({
    resolver: zodResolver(CategoryValidator),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const { handleSubmit, control } = form;

  const { mutate: onSubmit, isLoading: isLoadingCreate } = useMutation({
    mutationFn: async (data: CategoryRequest) => {
      const payload = {
        ...data,
      };
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/Categorys/${initialData.id}`,
          payload
        );
      } else {
        await axios.post(`/api/${params.storeId}/Categorys`, payload);
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/Categorys`);
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
        `/api/${params.storeId}/Categorys/${params.CategoryId}`
      );
      return res.data;
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/Categorys`);
      return toast({
        title: "Category deleted",
        description: "Category deleted sucesss",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Error",
            description: "You don't have permissions to delete this Category",
            variant: "destructive",
          });
        }
        if (error.response?.status === 400) {
          return toast({
            title: "Error",
            description:
              "You can't delete this Category because it has products",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Error",
        description: "Error deleting Category",
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
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoadingCreate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
