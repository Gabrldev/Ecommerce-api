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
import axios from "axios";
import { Label } from "../ui/label";
import { Button } from "../ui/Button";

export const StoreModal = () => {
  const storeModal = useStoreModal();

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

  const { mutate: createStore } = useMutation({
    mutationFn: async ({ name }: FormModalRequest) => {
      const payload = {
        name,
      };
      const { data } = await axios.post("/api/store", payload);
      return data;
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
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Modal>
  );
};
