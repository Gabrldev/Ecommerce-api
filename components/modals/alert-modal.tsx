"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/Button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isLoading,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end">
        <Button disabled={isLoading} variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button isLoading={isLoading} onClick={onConfirm} variant='destructive'>Confirm</Button>
      </div>
    </Modal>
  );
};
