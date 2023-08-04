"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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
import { ProductsRequest, productsValidator } from "@/lib/validators/products";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes,
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

  const form = useForm<ProductsRequest>({
    resolver: zodResolver(productsValidator),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          sizeId: "",
          colorId: "",
          isArchived: false,
          isFeatured: false,
        },
  });

  const { handleSubmit, control } = form;

  const { mutate: onSubmit, isLoading: isLoadingCreate } = useMutation({
    mutationFn: async (data: ProductsRequest) => {
      const payload = {
        ...data,
      };
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${initialData.id}`,
          payload
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, payload);
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/products`);
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
        `/api/${params.storeId}/products/${params.productsId}`
      );
      return res.data;
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/products`);
      return toast({
        title: "products deleted",
        description: "products deleted sucess",
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={isLoadingCreate}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={control}
              name="name"
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
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingCreate}
                      type="number"
                      placeholder="product price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select disabled={isLoadingCreate} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select disabled={isLoadingCreate} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
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
