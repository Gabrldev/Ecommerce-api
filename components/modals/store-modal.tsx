"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/Modal";
import { useForm } from "react-hook-form";
import {
  FormModalRequest,
  formModalValidator,
} from "@/lib/validators/formModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";
import { Label } from "../ui/label";
import { Button } from "../ui/Button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormModalRequest>({
    resolver: zodResolver(formModalValidator),

    defaultValues: {
      name: "",
    },
  });

  const { mutate: createStore, isLoading } = useMutation({
    mutationFn: async ({ name }: FormModalRequest) => {
      const payload = {
        name,
      };
      const { data } = await axios.post("/api/stores/create", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast({
            title: "Error connecting to server",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
        if (err.response?.status === 409) {
          return toast({
            title: "Store already exists",
            description: "Please try again with a different name.",
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Error creating store",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {

      toast({
        title: "Store created",
        description: "You can now add products and manage orders.",

      });
      window.location.assign(`/${data.id}`);
    },
  });

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage your products and orders."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <form
        onSubmit={handleSubmit((e) => {
          createStore(e);
        })}
      >
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          className="pl-6"
          size={32}
          placeholder="Store name"
          {...register("name")}
        />
        {errors.name && (
          <p className="px-1 text-xs text-red-600 mt-2">
            {errors.name.message}
          </p>
        )}
        <div className="pt-6 space-x-2 flex items-center justify-end">
          <Button variant="outline" onClick={storeModal.onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
